import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ChatBubbleOutline, ListAlt, Person, Phone } from '@mui/icons-material'
import { Card, CardContent, Chip, Stack, Tooltip, Typography } from '@mui/material'
import { Lead } from '../leadSlice'

interface LeadCardProps {
  lead: Lead
}

const OpportunitiesCard = ({ lead, isEmptyColumn }: LeadCardProps & { isEmptyColumn?: boolean }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lead?._id,
    data: { name: lead?.name, status: lead?.status }
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none',
    opacity: isDragging ? 0.4 : undefined,
    border: isDragging ? '1px solid #fff' : undefined
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      variant="outlined"
      sx={{
        mb: 2,
        borderRadius: 3,
        boxShadow: 0,
        transition: 'box-shadow 0.2s, transform 0.1s',
        '&:hover': { boxShadow: 6, transform: 'translateY(-4px) scale(1.02)' },
        bgcolor: '#f8fafc',
        border: '1.5px solid #e0e7ef',
        cursor: isEmptyColumn ? undefined : 'pointer',
        opacity: isEmptyColumn ? 0 : style.opacity,
        minHeight: isEmptyColumn ? 100 : undefined
      }}
    >
      {!isEmptyColumn && (
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.5}>
            <Typography fontWeight={700} sx={{ fontSize: 16, color: '#232946' }}>
              {lead?.name}
            </Typography>
            {lead?.company && (
              <Chip label={lead?.company} size="small" sx={{ bgcolor: '#e0e7ef', color: '#232946', fontWeight: 500 }} />
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
          <Stack direction="row" spacing={2} mt={1}>
            <Tooltip title="Gọi điện">
              <Phone fontSize="small" sx={{ color: '#636e72', cursor: 'pointer' }} />
            </Tooltip>
            <Tooltip title="Xem chi tiết">
              <ListAlt fontSize="small" sx={{ color: '#636e72', cursor: 'pointer' }} />
            </Tooltip>
            <Tooltip title="Nhắn tin">
              <ChatBubbleOutline fontSize="small" sx={{ color: '#636e72', cursor: 'pointer' }} />
            </Tooltip>
          </Stack>
        </CardContent>
      )}
    </Card>
  )
}

export default OpportunitiesCard
