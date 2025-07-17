import { Box, Typography } from '@mui/material'
import OpportunitiesCard from './OpportunitiesCard'
import { Lead } from '../leadSlice'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

const OpportunitiesColumn = ({
  title,
  color,
  status,
  leads
}: {
  title: string
  color: string
  status: string
  leads: Lead[]
}) => {
  const totalAmount = leads.reduce((sum, lead) => sum + (lead.value || 0), 0)

  return (
    <Box
      sx={{
        height: '500px',
        minWidth: '18vw',
        bgcolor: '#fff',
        boxShadow: 6,
        mb: 4,
        borderRadius: 3,
        borderTop: `5px solid ${color}`,
        overflow: 'hidden'
      }}
    >
      {/* Header column */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pr: 2,
          py: 2,
          borderBottom: '2px solid rgba(0, 0, 0, 0.1)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: '15px', height: '15px', bgcolor: `${color}`, mb: 0.3, borderRadius: '999px' }} />
          <Typography variant="h3" fontWeight={700} fontSize={20}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body1" mt={0.5} color="#bdc3c7" fontSize={15}>
          {leads.length} Leads - ${totalAmount.toLocaleString()}
        </Typography>
      </Box>
      {/* Content */}
      <SortableContext
        items={leads.length === 0 ? [`hide-card-${status}`] : leads.map((lead) => lead._id)}
        strategy={verticalListSortingStrategy}
      >
        <Box sx={{ p: 2, height: '80%', overflowY: 'scroll' }}>
          {leads.length === 0 ? (
            <OpportunitiesCard
              lead={{
                _id: `hide-card-${status}`,
                name: '',
                email: '',
                company: '',
                phone: '',
                assignedTo: { _id: '', email: '', name: '' },
                value: 0,
                status,
                note: '',
                createdBy: '',
                order: 0
              }}
              isEmptyColumn={true}
            />
          ) : (
            leads.map((lead) => <OpportunitiesCard key={lead?._id} lead={lead} isEmptyColumn={false} />)
          )}
        </Box>
      </SortableContext>
    </Box>
  )
}

export default OpportunitiesColumn
