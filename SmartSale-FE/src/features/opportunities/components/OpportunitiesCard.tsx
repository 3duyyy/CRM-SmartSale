import ConfirmDialog from '@/components/ConfirmDialog'
import { Dispatch } from '@/redux/store'
import { Lead } from '@/types/globalTypes'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Delete, FormatListBulleted, ListAlt, Mail, Person } from '@mui/icons-material'
import { Card, CardContent, Chip, Stack, Tooltip, Typography } from '@mui/material'
import { MouseEvent, useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteLeadById, sendMailToLead } from '../leadSlice'
import { toast } from 'react-toastify'

interface LeadCardProps {
  lead: Lead
  onUpdate?: (lead: Lead) => void
  onView?: (lead: Lead) => void
  isEmptyColumn?: boolean
}

const OpportunitiesCard = ({ lead, isEmptyColumn, onUpdate, onView }: LeadCardProps) => {
  const [openConfirm, setOpenConfirm] = useState(false)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lead?._id,
    data: { name: lead?.name, status: lead?.status }
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none',
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #fff' : undefined
  }

  const handleOpenDeleteDialog = (e: MouseEvent) => {
    e.stopPropagation()
    setOpenConfirm(true)
  }

  const handleCloseDeleteDialog = () => {
    setOpenConfirm(false)
  }

  const dispatch = useDispatch<Dispatch>()
  const handleDelete = async () => {
    await dispatch(deleteLeadById(lead._id)).unwrap()
    setOpenConfirm(false)
    toast.success('Xóa Lead thành công!')
  }

  const handleSendEmail = async (lead: Lead) => {
    await dispatch(
      sendMailToLead({
        email: lead.email,
        name: lead.name,
        company: lead.company,
        status: lead.status,
        value: lead.value
      })
    ).unwrap()
  }

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        variant="outlined"
        sx={{
          mb: 2,
          borderRadius: 4,
          boxShadow: 0,
          transition: 'box-shadow 0.2s, transform 0.1s',
          '&:hover': { boxShadow: 6, transform: 'translateY(-4px) scale(1.02)' },
          bgcolor: '#f8fafc',
          border: '1.5px solid #e0e7ef',
          cursor: isEmptyColumn ? undefined : 'pointer',
          opacity: isEmptyColumn ? 0 : style.opacity,
          minHeight: isEmptyColumn ? 100 : undefined,
          p: isEmptyColumn ? 0 : 1.2
        }}
      >
        {!isEmptyColumn && (
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.5}>
              <Typography fontWeight={700} sx={{ fontSize: 16, color: '#232946' }}>
                {lead?.name}
              </Typography>
              {lead?.company && (
                <Chip
                  label={lead?.company}
                  size="small"
                  sx={{ bgcolor: '#e0e7ef', color: '#232946', fontWeight: 500 }}
                />
              )}
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <Person fontSize="small" sx={{ color: '#6c63ff' }} />
              <Typography variant="caption" sx={{ color: '#6c63ff', fontWeight: 500 }}>
                {lead?.assignedTo?.name}
              </Typography>
            </Stack>
            <Typography fontWeight={700} sx={{ color: '#00b894', fontSize: 15, mb: 1 }}>
              ${lead?.value?.toLocaleString()}
            </Typography>
            <Stack direction="row" spacing={1.5} mt={1}>
              <Tooltip title="Gửi mail">
                <Mail
                  fontSize="small"
                  onClick={() => handleSendEmail(lead)}
                  sx={{
                    color: '#636e72',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#00b894' }
                  }}
                />
              </Tooltip>
              <Tooltip title="Xem chi tiết">
                <ListAlt
                  fontSize="small"
                  onClick={() => onView(lead)}
                  sx={{
                    color: '#636e72',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#6c63ff' }
                  }}
                />
              </Tooltip>
              <Tooltip title="Chỉnh sửa">
                <FormatListBulleted
                  fontSize="small"
                  onClick={() => onUpdate(lead)}
                  sx={{
                    color: '#636e72',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#0984e3' }
                  }}
                />
              </Tooltip>
              <Tooltip title="Xóa">
                <Delete
                  fontSize="small"
                  onClick={handleOpenDeleteDialog}
                  sx={{
                    color: '#636e72',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#d63031' }
                  }}
                />
              </Tooltip>
            </Stack>
          </CardContent>
        )}
      </Card>
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDelete}
        title="Xóa Lead"
        content={`Bạn có chắc chắn muốn xóa khách hàng "${lead?.name}" không?`}
      />
    </>
  )
}

export default OpportunitiesCard
