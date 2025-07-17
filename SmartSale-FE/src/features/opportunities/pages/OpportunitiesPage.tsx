import { Add, Search, SupportAgent } from '@mui/icons-material'
import { Box, Button, MenuItem, Stack, TextField, Typography, useTheme } from '@mui/material'
import OpportunitiesColumn from '../components/OpportunitiesColumn'
import { COLUMNS } from '../constant'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch, RootState } from '@/redux/store'
import { useEffect, useState } from 'react'
import { filterLeads, getAllLeads, Lead, setSearch, updateLeadById } from '../leadSlice'
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

const OpportunitiesPage = () => {
  // Xử lý dragoverlay
  const [activeLead, setActiveLead] = useState<Lead | null>(null)
  // Xử lý UI cho tạm thời trong lúc API đang call
  const [localLeads, setLocalLeads] = useState<Lead[]>([])
  // Fix lỗi handleDragOver gán status làm handleDragEnd bị hiểu là kéo thả trong 1 column
  const [draggedLeadStatus, setDraggedLeadStatus] = useState<string | null>(null)

  const theme = useTheme()

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10
    }
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5
    }
  })
  const sensors = useSensors(mouseSensor, touchSensor)

  const dispatch = useDispatch<Dispatch>()
  const { all, search, statusFilter, assigneeFilter } = useSelector((state: RootState) => state.leads)

  useEffect(() => {
    setLocalLeads(all)
  }, [all])

  // Filter theo state để UI cập nhật ngay lập tức
  const filteredLocalLeads: Lead[] = filterLeads(localLeads, search, statusFilter, assigneeFilter)

  useEffect(() => {
    dispatch(getAllLeads())
  }, [dispatch])

  const handleDragStart = (e: DragStartEvent) => {
    const foundLead = all.find((lead) => lead._id === e.active.id)
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
      const targetColumnLeads = localLeads
        .filter((lead) => lead.status === overLeadStatus && lead._id !== activeLead._id)
        .sort((a, b) => a.order - b.order)

      const overIndex = targetColumnLeads.findIndex((lead) => lead._id === overLead._id)

      // Chèn card đang kéo vào đúng vị trí (status vẫn là cũ)
      const newTargetLeads = [
        ...targetColumnLeads.slice(0, overIndex),
        { ...activeLead },
        ...targetColumnLeads.slice(overIndex)
      ]
      // Cập nhật order cho column đích
      const updatedTargetLeads = newTargetLeads.map((lead, idx) => ({
        ...lead,
        order: idx
      }))

      // Loại bỏ card đã kéo thả ra khỏi column cũ và cập nhật order cho column cũ
      const oldColumnLeads = localLeads
        .filter((lead) => lead.status === activeLeadStatus && lead._id !== activeLead._id)
        .sort((a, b) => a.order - b.order)
        .map((lead, index) => ({ ...lead, order: index }))

      // Các Column khác giữ nguyên
      const otherColumns = localLeads.filter(
        (lead) => lead.status !== activeLeadStatus && lead.status !== overLeadStatus
      )

      setLocalLeads([...updatedTargetLeads, ...oldColumnLeads, ...otherColumns])
    }
  }

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (!over || active.id === over.id) {
      setDraggedLeadStatus(null)
      dispatch(
        updateLeadById({
          _id: active.id as string,
          payload: { order: active.data.current.sortable.index, status: active.data.current.status }
        })
      )
      toast.success('Kéo thả Lead thành công!')
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
      const sameStatusLeads = localLeads
        .filter((lead) => lead.status === activeLeadStatus)
        .sort((a, b) => a.order - b.order)

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
      toast.success('Kéo thả Lead thành công!')
    }
    // Kéo thả card giữa các column
    else {
      console.log('first')
      // Lọc những phần tử cùng status với phần tử bị drag vào
      const targetColumnLeads = localLeads
        .filter((lead) => lead.status === overLeadStatus && lead._id !== activeLead._id)
        .sort((a, b) => a.order - b.order)

      const overIndex = targetColumnLeads.findIndex((lead) => lead._id === overLead._id)

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
          if (lead.status === activeLeadStatus && lead._id !== activeLead._id) {
            return {
              ...lead,
              order: lead.order > activeLead.order ? lead.order - 1 : lead.order
            }
          }
          return lead
        })
      )

      // Update tất cả các lead trong column target (cần update status vì bao gồm cả lead drag)
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

      toast.success('Kéo thả Lead thành công!')
    }
    setActiveLead(null)
  }

  return (
    <Box sx={{ p: 1, bgcolor: '#F4F6F8', minHeight: '100vh', maxHeight: '100vh' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'white',
          px: 3,
          pt: 1.5,
          pb: 4,
          boxShadow: 4,
          borderRadius: 5
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
          <Typography
            variant="h1"
            fontWeight={700}
            sx={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: '40px' }}
          >
            <SupportAgent sx={{ fontSize: 40 }} /> Opportunities
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
            <Search sx={{ fontSize: '30px', color: theme.palette.primary.main }} />
            <TextField
              id="find-lead-input"
              label="Tìm kiếm cơ hội kinh doanh"
              placeholder="Nhập vào tên khách hàng/công ty cần tìm..."
              variant="standard"
              sx={{ width: '350px' }}
              value={search}
              onChange={(e) => dispatch(setSearch(e.target.value))}
            />
          </Box>
        </Box>
        <Button sx={{ display: 'flex', alignItems: 'center', fontSize: '16px', px: 3, py: 1.2 }} variant="contained">
          <Add />
          Thêm mới
        </Button>
      </Box>
      {/* Filter */}
      <Stack direction="row" spacing={2} mt={2} mb={4} px={3}>
        <TextField
          size="small"
          select
          label="Tất cả trạng thái"
          sx={{ minWidth: 180, bgcolor: '#fff', boxShadow: 4, borderRadius: 2 }}
        >
          <MenuItem value="">Lead mới</MenuItem>
        </TextField>
        <TextField
          size="small"
          select
          label="Tất cả người phụ trách"
          sx={{ minWidth: 220, bgcolor: '#fff', boxShadow: 4, borderRadius: 2 }}
        >
          <MenuItem value="">Tất cả người phụ trách</MenuItem>
        </TextField>
        <TextField size="small" type="date" sx={{ minWidth: 160, bgcolor: '#fff', boxShadow: 4, borderRadius: 2 }} />
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
            gap: 3,
            px: 3,
            overflowY: 'hidden',
            overflowX: 'auto',
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': { height: 8 },
            '&::-webkit-scrollbar-thumb': { bgcolor: '#d1d5db', borderRadius: 4 }
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
          <DragOverlay>{activeLead ? <OpportunitiesCard lead={activeLead} /> : null}</DragOverlay>
        </Box>
      </DndContext>
    </Box>
  )
}
export default OpportunitiesPage
