import { Add, Search, SupportAgent } from '@mui/icons-material'
import { Box, MenuItem, Stack, TextField, Tooltip, Typography, useTheme } from '@mui/material'
import OpportunitiesColumn from '../components/OpportunitiesColumn'
import { COLUMNS } from '../constant'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch, RootState } from '@/redux/store'
import { useEffect, useMemo, useState } from 'react'
import {
  createNewLead,
  filterLeads,
  getAllLeads,
  setAssigneeFilter,
  setSearch,
  setStatusFilter,
  updateLeadById
} from '../leadSlice'
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
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
  // Xử lý dragoverlay
  const [activeLead, setActiveLead] = useState<Lead | null>(null)
  // Xử lý UI cho tạm thời trong lúc API đang call
  const [localLeads, setLocalLeads] = useState<Lead[]>([])
  // Fix lỗi handleDragOver gán status làm handleDragEnd bị hiểu là kéo thả trong 1 column
  const [draggedLeadStatus, setDraggedLeadStatus] = useState<string | null>(null)
  // Open form add lead
  const [isCreate, setIsCreate] = useState(false)

  const { users } = useSelector((state: RootState) => state.users)
  const user = useSelector((state: RootState) => state.auth.userData)
  const isAdmin = user?.roles?.name === 'ADMIN'

  const theme = useTheme()

  const dispatch = useDispatch<Dispatch>()
  const { all, search, statusFilter, assigneeFilter, reload } = useSelector((state: RootState) => state.leads)

  useEffect(() => {
    setLocalLeads(all)
  }, [all])

  // Filter theo state để UI cập nhật ngay lập tức
  const filteredLocalLeads: Lead[] = filterLeads(localLeads, search, statusFilter, assigneeFilter)

  useEffect(() => {
    const selectedUser = users.find((user) => user.name === assigneeFilter)
    const assignedTo = selectedUser ? selectedUser._id : ''

    dispatch(getAllLeads({ search, status: statusFilter, assignedTo }))
  }, [dispatch, reload, search, statusFilter, assigneeFilter, users])

  useEffect(() => {
    dispatch(getAllUsers())
  }, [dispatch])

  // Debounce tránh call API quá nhiều khi search
  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        dispatch(setSearch(value))
      }, 500),
    [dispatch]
  )

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel()
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
    } catch (err: any) {
      toast.error(err?.message || 'Tạo lead thất bại!')
    }
  }

  // ==================Drag & Drop====================
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 15
    }
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 8
    }
  })
  const sensors = useSensors(mouseSensor, touchSensor)

  const handleDragStart = (e: DragStartEvent) => {
    const foundLead = localLeads.find((lead) => lead._id === e.active.id)
    if (foundLead) {
      setActiveLead(foundLead)
      setDraggedLeadStatus(foundLead.status)
    }
  }

  // Tương tự handleDragEnd nhưng chỉ xử lý khi kéo thả giữa các Column
  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e

    // Kéo vào column rỗng (over là card ảo)
    if (typeof over.id === 'string' && over.id.startsWith('hide-card-')) {
      const overLeadStatus = over.id.replace('hide-card-', '')
      const activeLead = localLeads.find((lead) => lead._id === active.id)
      if (!activeLead) return

      // Đổi status tạm thời cho card đang kéo, order = 0
      setLocalLeads((prev) =>
        prev.map((lead) => (lead._id === active.id ? { ...lead, status: overLeadStatus, order: 0 } : lead))
      )
      return
    }

    if (!over || active.id === over.id) return

    // Lấy thông tin lead đang kéo và lead đang hover
    const activeLead = localLeads.find((lead) => lead._id === active.id)
    const overLead = localLeads.find((lead) => lead._id === over.id)
    if (!activeLead || !overLead) return

    const activeLeadStatus = activeLead.status
    const overLeadStatus = overLead.status

    // Nếu khác column thì mới xử lý
    if (activeLeadStatus !== overLeadStatus) {
      // Lấy danh sách các lead trong column đích
      const targetColumnLeads = localLeads.filter(
        (lead) => lead.status === overLeadStatus && lead._id !== activeLead._id
      )

      const overIndex = targetColumnLeads.findIndex((lead) => lead._id === overLead._id)

      // Cập nhật order cho column đích
      const newTargetLeads = [
        ...targetColumnLeads.slice(0, overIndex),
        { ...activeLead, status: overLeadStatus },
        ...targetColumnLeads.slice(overIndex)
      ].map((lead, idx) => ({
        ...lead,
        order: idx
      }))

      // Loại bỏ card đã kéo thả ra khỏi column cũ và cập nhật order cho column cũ
      const oldColumnLeads = localLeads
        .filter((lead) => lead.status === activeLeadStatus && lead._id !== activeLead._id)
        .map((lead, index) => ({ ...lead, order: index }))

      // Các Column khác giữ nguyên
      const otherColumns = localLeads.filter(
        (lead) => lead.status !== activeLeadStatus && lead.status !== overLeadStatus
      )

      setLocalLeads([...newTargetLeads, ...oldColumnLeads, ...otherColumns])
    }
  }

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (!over) {
      setDraggedLeadStatus(null)
      return
    }

    // Xử lý overCard là card ảo (cho column rỗng)
    if (typeof over.id === 'string' && over.id.startsWith('hide-card-')) {
      const overLeadStatus = over.id.replace('hide-card-', '')
      const activeLead = localLeads.find((lead) => lead._id === active.id)

      const targetColumnLeads = localLeads.filter((lead) => lead.status === overLeadStatus)

      if (targetColumnLeads.length === 0 && activeLead) {
        dispatch(updateLeadById({ _id: activeLead._id, payload: { status: overLeadStatus, order: 0 } }))
        toast.success('Kéo thả Lead thành công!')
        setDraggedLeadStatus(null)
        return
      }
    }

    const activeLead = localLeads.find((lead) => lead._id === active.id)
    const overLead = localLeads.find((lead) => lead._id === over.id)

    if (!activeLead || !overLead) {
      setDraggedLeadStatus(null)
      return
    }

    const activeLeadStatus = draggedLeadStatus || activeLead.status
    const overLeadStatus = overLead.status

    // Kéo thả trong 1 column
    if (activeLeadStatus === overLeadStatus) {
      // Lọc những phần tử cùng status và không phải phần tử đang drag
      const sameStatusLeads = localLeads.filter((lead) => lead.status === activeLeadStatus)
      // .sort((a, b) => a.order - b.order)

      const activeIndex = sameStatusLeads.findIndex((lead) => lead._id === activeLead._id)
      const overIndex = sameStatusLeads.findIndex((lead) => lead._id === overLead._id)

      const newOrderLeads = arrayMove(sameStatusLeads, activeIndex, overIndex)

      setLocalLeads((prev) => {
        return prev.map((lead) => {
          if (lead.status !== activeLeadStatus) return lead
          const foundLead = newOrderLeads.find((l) => l._id === lead._id)
          return foundLead ? { ...lead, order: newOrderLeads.indexOf(foundLead) } : lead
        })
      })

      newOrderLeads.forEach((lead, index) => {
        if (lead.order !== index) {
          dispatch(
            updateLeadById({
              _id: lead._id,
              payload: { order: index }
            })
          )
        }
      })
    }
    // Kéo thả card giữa các column (đang bug - fix sau: fix call nhiều API)
    else {
      // Lọc những phần tử cùng status với phần tử bị drag vào
      const targetColumnLeads = localLeads.filter(
        (lead) => lead.status === overLeadStatus && lead._id !== activeLead._id
      )
      // .sort((a, b) => a.order - b.order)

      const overIndex = localLeads.findIndex((lead) => lead._id === overLead._id)

      // Chèn active card vào đúng index của column
      const newTargetLeads = [
        ...targetColumnLeads.slice(0, overIndex),
        { ...activeLead, status: overLeadStatus },
        ...targetColumnLeads.slice(overIndex)
      ]

      // Cập nhật lại index của column vừa được card kéo vào
      const updatedOrderList = newTargetLeads.map((lead, index) => ({
        ...lead,
        order: index
      }))

      setLocalLeads((prevLead) =>
        prevLead.map((lead) => {
          const updatedLead = updatedOrderList.find((leadUpdated) => leadUpdated._id === lead._id)
          // Cập nhật status và order cho lead vừa được kéo
          if (updatedLead) return { ...lead, status: updatedLead.status, order: updatedLead.order }
          // Xử lý giảm order đi 1 cho các lead có order lớn hơn lead vừa được kéo thả đi
          // if (lead.status === activeLeadStatus && lead._id !== activeLead._id) {
          //   return {
          //     ...lead,
          //     order: lead.order > activeLead.order ? lead.order - 1 : lead.order
          //   }
          // }
          return lead
        })
      )

      // Update tất cả các lead trong column target (cần update status vì bao gồm cả lead drag):
      //       case:
      // - lấy được 2 cột thay đổi
      // - đánh index (order) cho cột.
      // - đầu api order và stastus cho thằng được kéo
      updatedOrderList.forEach((lead) => {
        dispatch(updateLeadById({ _id: lead._id, payload: { order: lead.order, status: lead.status } }))
      })

      // Update order cho lead trong column cũ
      localLeads
        .filter((lead) => lead.status === activeLeadStatus && lead._id !== activeLead._id)
        .forEach((lead) => {
          if (lead.order > activeLead.order) {
            dispatch(updateLeadById({ _id: lead._id, payload: { order: lead.order - 1 } }))
          }
        })
    }
    setActiveLead(null)
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
            fontWeight={800}
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
              onChange={(e) => dispatch(setSearch(e.target.value))}
            />
          </Box>
        </Box>
        <Box>
          <Tooltip title={!isAdmin ? 'Bạn không có quyền thực hiện chức năng này!' : ''} disableHoverListener={isAdmin}>
            {/* Phải có thẻ span vì Button khi role là STAFF bị disabled rồi nên ko thể chạy các event */}
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
            users={users}
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
          label="Tất cả trạng thái"
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
              color: '#636e72'
            },
            '& .MuiSelect-icon': {
              color: '#6c63ff'
            }
          }}
          InputProps={{
            startAdornment: <SupportAgent sx={{ color: '#6c63ff', mr: 1 }} fontSize="small" />
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
          label="Tất cả người phụ trách"
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
              color: '#636e72'
            },
            '& .MuiSelect-icon': {
              color: '#00b894'
            }
          }}
          InputProps={{
            startAdornment: <SupportAgent sx={{ color: '#00b894', mr: 1 }} fontSize="small" />
          }}
          value={assigneeFilter}
          onChange={(e) => dispatch(setAssigneeFilter(e.target.value))}
        >
          <MenuItem value="">Tất cả người phụ trách</MenuItem>
          {users.map((user) => (
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
            height: { xs: 'auto', md: 'calc(100vh - 240px)' } // Đảm bảo các column full height vùng hiển thị
          }}
        >
          {COLUMNS.map((data) => (
            <OpportunitiesColumn
              key={data.status}
              title={data.label}
              color={data.color}
              status={data.status}
              leads={filteredLocalLeads
                .filter((lead) => lead?.status === data.status)
                .sort((a, b) => a.order - b.order)}
            />
          ))}
          <DragOverlay
            sx={{
              transform: 'translate3d(0, 0, 0)', // Sử dụng GPU acceleration
              willChange: 'transform',
              pointerEvents: 'none'
            }}
          >
            {activeLead ? <OpportunitiesCard lead={activeLead} /> : null}
          </DragOverlay>
        </Box>
      </DndContext>
    </Box>
  )
}
export default OpportunitiesPage
