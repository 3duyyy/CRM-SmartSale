// OpportunitiesPage.tsx
import { Add, Search, SupportAgent } from '@mui/icons-material'
import { Box, MenuItem, Stack, TextField, Tooltip, Typography, useTheme } from '@mui/material'
import OpportunitiesColumn from '../components/OpportunitiesColumn'
import { COLUMNS } from '../constant'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch, RootState } from '@/redux/store'
import { useEffect, useMemo, useState, useRef } from 'react'
import {
  createNewLead,
  filterLeads,
  getAllLeads,
  setAssigneeFilter,
  setSearch,
  setStatusFilter,
  dragLead // Chỉ cần dragLead thunk
} from '../leadSlice'
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core'
// import { arrayMove } from '@dnd-kit/sortable'
import { toast } from 'react-toastify'
import OpportunitiesCard from '../components/OpportunitiesCard'
import ButtonCus from '@/components/ButtonCus'
import { Lead } from '@/types/globalTypes'
import FormLeadBase from '../components/FormLeadBase'
import { leadSchema } from '../schema'
import z from 'zod'
import { getAllUsers } from '@/features/users/userSlice'
import debounce from 'lodash.debounce'

type LeadFormType = z.infer<typeof leadSchema>

const OpportunitiesPage = () => {
  // State cho DragOverlay (lead đang được kéo)
  const [activeLead, setActiveLead] = useState<Lead | null>(null)
  // localLeads là trạng thái UI cục bộ, dùng để hiển thị optimistic update
  const [localLeads, setLocalLeads] = useState<Lead[]>([])
  // Mở/đóng form thêm lead
  const [isCreate, setIsCreate] = useState(false)

  // Dùng useRef để lưu trạng thái leads ban đầu khi bắt đầu kéo, phục vụ rollback nếu API lỗi
  const initialLeadsState = useRef<Lead[]>([])

  const { data: usersData } = useSelector((state: RootState) => state.users)
  const user = useSelector((state: RootState) => state.auth.userData)
  const isAdmin = user?.roles?.name === 'ADMIN'

  const theme = useTheme()
  const dispatch = useDispatch<Dispatch>()
  const { all, search, statusFilter, assigneeFilter, reload } = useSelector((state: RootState) => state.leads)

  // Đồng bộ localLeads với Redux 'all' mỗi khi 'all' thay đổi
  // Điều này cũng sẽ hoạt động như một cơ chế "rollback" khi `reload` được kích hoạt
  useEffect(() => {
    setLocalLeads(all)
    initialLeadsState.current = all // Cập nhật trạng thái khởi tạo cho rollback
  }, [all])

  // Lọc leads để hiển thị trên UI
  const filteredLocalLeads: Lead[] = useMemo(() => {
    return filterLeads(localLeads, search, statusFilter, assigneeFilter)
  }, [localLeads, search, statusFilter, assigneeFilter])

  // Effect để gọi API getAllLeads mỗi khi các filter hoặc cờ reload thay đổi
  useEffect(() => {
    const selectedUser = usersData.find((user) => user.name === assigneeFilter)
    const assignedTo = selectedUser ? selectedUser._id : ''

    dispatch(getAllLeads({ search, status: statusFilter, assignedTo }))
  }, [dispatch, reload, search, statusFilter, assigneeFilter, usersData])

  // Lấy danh sách users
  useEffect(() => {
    dispatch(getAllUsers({ isPagination: false }))
  }, [dispatch])

  // Debounce cho input search để tránh gọi API quá nhiều
  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        dispatch(setSearch(value))
      }, 500),
    [dispatch]
  )

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel() // Hủy bỏ debounce khi component unmount
    }
  }, [debouncedSetSearch])

  // ==============FORM CREATE=================
  const handleCreateLead = async (data: LeadFormType) => {
    try {
      await dispatch(
        createNewLead({
          ...data,
          status: data.status || 'moi',
          company: data.company || null,
          note: data.note || '',
          assignedTo: data.assignedTo
        })
      ).unwrap()
      toast.success('Tạo lead thành công!')
      setIsCreate(false) // Đóng form sau khi tạo thành công
    } catch (error) {
      console.error('Failed to create lead:', error)
      toast.error('Tạo lead thất bại!')
    }
  }

  // ==================Drag & Drop====================
  // Cấu hình Sensors cho Dnd-kit
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 15 // Kéo chuột 15px mới kích hoạt
    }
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300, // Giữ 300ms trên thiết bị cảm ứng
      tolerance: 8
    }
  })
  const sensors = useSensors(mouseSensor, touchSensor)

  // Xử lý khi bắt đầu kéo một item
  const handleDragStart = (e: DragStartEvent) => {
    const foundLead = localLeads.find((lead) => lead._id === e.active.id)
    if (foundLead) {
      setActiveLead(foundLead)
      initialLeadsState.current = [...localLeads] // Lưu trạng thái hiện tại của localLeads để rollback
    }
  }

  // Xử lý khi item đang được kéo di chuyển qua một vị trí khác
  // Mục đích chính: Cập nhật hiển thị DragOverlay cho mượt mà (nếu cần thay đổi cột)
  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e

    if (!over || active.id === over.id) return

    const activeLeadItem = localLeads.find((lead) => lead._id === active.id)
    if (!activeLeadItem) return

    let targetStatus: string

    // Trường hợp kéo vào column rỗng (over là card ảo)
    if (typeof over.id === 'string' && over.id.startsWith('hide-card-')) {
      targetStatus = over.id.replace('hide-card-', '')
    } else {
      // Trường hợp kéo vào một lead khác
      const overLeadItem = localLeads.find((lead) => lead._id === over.id)
      if (!overLeadItem) return
      targetStatus = overLeadItem.status
    }

    // Cập nhật tạm thời status của activeLead cho DragOverlay hiển thị đúng
    if (activeLeadItem.status !== targetStatus) {
      setActiveLead((prevActive) => (prevActive ? { ...prevActive, status: targetStatus } : null))
    }
    // **Lưu ý:** KHÔNG CẬP NHẬT `localLeads` ở đây. Việc này sẽ gây giật lag.
    // Mọi thay đổi thứ tự và trạng thái chính thức sẽ được xử lý ở `handleDragEnd`.
  }

  // Xử lý khi người dùng kết thúc thao tác kéo thả
  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e

    setActiveLead(null) // Reset activeLead để ẩn DragOverlay

    // Nếu không có đích đến hoặc kéo về cùng vị trí cũ, không làm gì cả
    if (!over || active.id === over.id) {
      // Có thể rollback UI về trạng thái ban đầu nếu người dùng thả ra ngoài không có đích
      setLocalLeads(initialLeadsState.current)
      return
    }

    const draggedLead = localLeads.find((lead) => lead._id === active.id)
    if (!draggedLead) {
      // Rollback nếu không tìm thấy lead đang kéo
      setLocalLeads(initialLeadsState.current)
      return
    }

    const sourceStatus = draggedLead.status // Trạng thái ban đầu của lead
    const sourceOrder = draggedLead.order // Thứ tự ban đầu của lead

    let destinationStatus: string
    let destinationOrder: number

    // Trường hợp kéo vào column rỗng (over là card ảo)
    if (typeof over.id === 'string' && over.id.startsWith('hide-card-')) {
      destinationStatus = over.id.replace('hide-card-', '')
      destinationOrder = 0 // Luôn là vị trí đầu tiên trong cột rỗng
    } else {
      // Trường hợp kéo vào một lead khác
      const overLead = localLeads.find((lead) => lead._id === over.id)
      if (!overLead) {
        setLocalLeads(initialLeadsState.current) // Rollback nếu overLead không tồn tại
        return
      }
      destinationStatus = overLead.status

      // Lấy tất cả leads trong cột đích (trừ lead đang kéo nếu nó đã ở đó)
      const leadsInDestinationColumn = localLeads
        .filter((lead) => lead.status === destinationStatus && lead._id !== draggedLead._id)
        .sort((a, b) => a.order - b.order) // Đảm bảo sắp xếp đúng trước khi tìm index

      // Tìm index của overLead trong danh sách đã lọc
      const overIndex = leadsInDestinationColumn.findIndex((l) => l._id === overLead._id)
      destinationOrder = overIndex !== -1 ? overIndex : leadsInDestinationColumn.length // Nếu không tìm thấy, thêm cuối
    }

    // Tạo một bản sao mới của localLeads để thực hiện optimistic update
    const newLocalLeads = [...localLeads]

    // 1. Xóa lead đang kéo khỏi vị trí cũ của nó
    const currentSourceColumnLeads = newLocalLeads
      .filter((l) => l.status === sourceStatus && l._id !== draggedLead._id)
      .sort((a, b) => a.order - b.order)

    // 2. Chèn lead đang kéo vào vị trí mới trong cột đích
    // Tạo một đối tượng lead mới với status và order đã cập nhật
    const updatedDraggedLead = { ...draggedLead, status: destinationStatus, order: destinationOrder }

    // Lấy leads trong cột đích sau khi đã loại bỏ lead đang kéo (nếu nó ở đó ban đầu)
    const currentDestinationColumnLeads = newLocalLeads
      .filter((l) => l.status === destinationStatus && l._id !== draggedLead._id)
      .sort((a, b) => a.order - b.order)

    currentDestinationColumnLeads.splice(destinationOrder, 0, updatedDraggedLead)

    // Cập nhật lại order cho các lead trong cột nguồn cũ
    const finalSourceColumnLeads = currentSourceColumnLeads.map((l, idx) => ({ ...l, order: idx }))

    // Cập nhật lại order cho các lead trong cột đích mới
    const finalDestinationColumnLeads = currentDestinationColumnLeads.map((l, idx) => ({ ...l, order: idx }))

    // 3. Hợp nhất lại các cột
    const otherColumnsLeads = newLocalLeads.filter((l) => l.status !== sourceStatus && l.status !== destinationStatus)

    const mergedLeads = [...finalSourceColumnLeads, ...finalDestinationColumnLeads, ...otherColumnsLeads]

    // Cập nhật UI ngay lập tức (optimistic update)
    setLocalLeads(mergedLeads)

    // Gọi API dragLead với payload chuẩn xác
    try {
      await dispatch(
        dragLead({
          leadId: draggedLead._id,
          source: { status: sourceStatus, order: sourceOrder },
          destination: { status: destinationStatus, order: destinationOrder }
        })
      ).unwrap()
      // Nếu thành công, Redux reload sẽ tự động cập nhật lại `all` và `localLeads`
    } catch (error) {
      console.error('Drag Lead API failed:', error)
      // Rollback UI nếu API thất bại: khôi phục trạng thái ban đầu của localLeads
      setLocalLeads(initialLeadsState.current)
    }
  }

  return (
    <Box sx={{ p: { xs: 0.5, md: 3 }, bgcolor: '#F4F6F8', minHeight: '100vh', maxHeight: '100vh' }}>
      {/* Header (chưa tách) */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          bgcolor: 'white',
          px: { xs: 2, md: 5 },
          pt: { xs: 2, md: 3 },
          pb: { xs: 3, md: 4 },
          boxShadow: 6,
          borderRadius: 5,
          mb: 3,
          gap: { xs: 2, md: 0 }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography
            variant="h1"
            fontWeight="bold"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              fontSize: { xs: '25px', md: '35px' },
              color: theme.palette.primary.main
            }}
          >
            <SupportAgent sx={{ fontSize: { xs: 28, md: 35 } }} /> Opportunities
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, mt: 1 }}>
            <Search sx={{ fontSize: '28px', color: theme.palette.primary.main }} />
            <TextField
              id="find-lead-input"
              label="Tìm kiếm cơ hội kinh doanh"
              placeholder="Nhập vào tên khách hàng/công ty cần tìm..."
              variant="standard"
              sx={{ width: { xs: '200px', sm: '300px', md: '350px' } }}
              value={search}
              onChange={(e) => debouncedSetSearch(e.target.value)}
            />
          </Box>
        </Box>
        <Box>
          <Tooltip title={!isAdmin ? 'Bạn không có quyền thực hiện chức năng này!' : ''} disableHoverListener={isAdmin}>
            <span>
              <ButtonCus
                sxAdditional={{ px: 4, py: 1.5, fontSize: '16px' }}
                icon={<Add sx={{ mr: 1 }} />}
                content={'Thêm mới'}
                variant="contained"
                disabled={!isAdmin}
                onClick={() => setIsCreate(true)}
              />
            </span>
          </Tooltip>
          <FormLeadBase
            mode="create"
            open={isCreate}
            onClose={() => setIsCreate(false)}
            onSubmit={handleCreateLead}
            users={usersData}
            columns={COLUMNS}
            defaultValues={{ status: 'moi' }}
          />
        </Box>
      </Box>
      {/* Filter (Chưa tách) */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        mt={1}
        mb={4}
        px={{ xs: 0, md: 3 }}
        alignItems="center"
        justifyContent="flex-start"
        sx={{
          width: '100%',
          bgcolor: 'transparent',
          flexWrap: 'wrap',
          gap: { xs: 1, sm: 2 }
        }}
      >
        <TextField
          size="small"
          select
          label="Trạng thái"
          sx={{
            minWidth: 180,
            bgcolor: '#f9fafb',
            boxShadow: 2,
            borderRadius: 3,
            border: '1.5px solid #e0e7ef',
            '& .MuiInputBase-root': {
              borderRadius: 3,
              px: 1.5,
              py: 0.5,
              bgcolor: '#f9fafb'
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none'
            },
            '&:hover': {
              boxShadow: 4,
              bgcolor: '#f1f3f6'
            },
            '& .MuiInputLabel-root': {
              fontWeight: 600,
              color: theme.palette.primary.main
            },
            '& .MuiSelect-icon': {
              color: theme.palette.primary.main
            }
          }}
          InputProps={{
            startAdornment: <SupportAgent sx={{ color: theme.palette.primary.main, mr: 1 }} fontSize="small" />
          }}
          value={statusFilter}
          onChange={(e) => dispatch(setStatusFilter(e.target.value))}
        >
          <MenuItem value="">Tất cả trạng thái</MenuItem>
          {COLUMNS.map((col) => (
            <MenuItem key={col.status} value={col.status}>
              {col.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          size="small"
          select
          label="Người phụ trách"
          sx={{
            minWidth: 220,
            bgcolor: '#f9fafb',
            boxShadow: 2,
            borderRadius: 3,
            border: '1.5px solid #e0e7ef',
            '& .MuiInputBase-root': {
              borderRadius: 3,
              px: 1.5,
              py: 0.5,
              bgcolor: '#f9fafb'
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none'
            },
            '&:hover': {
              boxShadow: 4,
              bgcolor: '#f1f3f6'
            },
            '& .MuiInputLabel-root': {
              fontWeight: 600,
              color: theme.palette.primary.main
            },
            '& .MuiSelect-icon': {
              color: theme.palette.primary.main
            }
          }}
          InputProps={{
            startAdornment: <SupportAgent sx={{ color: theme.palette.primary.main, mr: 1 }} fontSize="small" />
          }}
          value={assigneeFilter}
          onChange={(e) => dispatch(setAssigneeFilter(e.target.value))}
        >
          <MenuItem value="">Tất cả người phụ trách</MenuItem>
          {usersData.map((user) => (
            <MenuItem key={user._id} value={user.name}>
              {user.name}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      {/* Columns */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            minHeight: 0,
            alignItems: 'flex-start',
            gap: { xs: 1, sm: 2, md: 3 },
            px: { xs: 0, md: 3 },
            overflowY: 'hidden',
            overflowX: 'auto',
            height: { xs: 'auto', md: 'calc(100vh - 240px)' }
          }}
        >
          {COLUMNS.map((data) => (
            <OpportunitiesColumn
              key={data.status}
              title={data.label}
              color={data.color}
              status={data.status}
              // Truyền leads đã được lọc và sắp xếp
              leads={filteredLocalLeads
                .filter((lead) => lead?.status === data.status)
                .sort((a, b) => a.order - b.order)}
            />
          ))}
          <DragOverlay>{activeLead ? <OpportunitiesCard lead={activeLead} /> : null}</DragOverlay>
        </Box>
      </DndContext>
    </Box>
  )
}
export default OpportunitiesPage
