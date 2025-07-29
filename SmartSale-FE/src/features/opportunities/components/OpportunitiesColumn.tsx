import { Box, Typography, Chip, Stack } from '@mui/material'
import OpportunitiesCard from './OpportunitiesCard'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Lead } from '@/types/globalTypes'
import { useState } from 'react'
import FormLeadBase from './FormLeadBase'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch, RootState } from '@/redux/store'
import { updateLeadById } from '../leadSlice'
import { toast } from 'react-toastify'
import { COLUMNS } from '../constant'

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
  // Xử lý LeadUpdateForm
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isUpdate, setIsUpdate] = useState(false)
  const [isView, setIsView] = useState(false)

  const dispatch = useDispatch<Dispatch>()
  const { data } = useSelector((state: RootState) => state.users)

  const handleOpenViewForm = (lead: Lead) => {
    setSelectedLead(lead)
    setIsView(true)
  }

  const handleCloseViewForm = () => {
    setSelectedLead(null)
    setIsView(false)
  }

  const handleOpenUpdateForm = (lead: Lead) => {
    setSelectedLead(lead)
    setIsUpdate(true)
  }

  const handleCloseUpdateForm = () => {
    setSelectedLead(null)
    setIsUpdate(false)
  }

  const handleUpdateLead = async (data) => {
    await dispatch(
      updateLeadById({
        _id: selectedLead._id,
        payload: {
          ...data,
          company: data.company || null,
          note: data.note || '',
          assignedTo: data.assignedTo
        }
      })
    ).unwrap()
    toast.success('Cập nhật lead thành công!')
  }

  const totalAmount = leads.reduce((sum, lead) => sum + (lead.value || 0), 0)

  return (
    <Box
      sx={{
        minHeight: 0,
        height: '85%',
        minWidth: { xs: '260px', md: '18vw' },
        maxWidth: { xs: '98vw', md: '22vw' },
        bgcolor: '#fff',
        boxShadow: 4,
        mb: 4,
        borderRadius: 4,
        borderTop: `5px solid ${color}`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header column */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          py: 2,
          borderBottom: '2px solid rgba(0, 0, 0, 0.07)',
          bgcolor: '#f8fafc'
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
          <Chip label={title} size="small" sx={{ bgcolor: color, color: '#fff', fontWeight: 700, fontSize: 15 }} />
        </Stack>
        <Typography variant="body2" color="#636e72" fontWeight={500}>
          {leads.length} leads -{' '}
          <span style={{ color: '#00b894', fontWeight: 700 }}>${totalAmount.toLocaleString()}</span>
        </Typography>
      </Box>
      {/* Content */}
      <SortableContext
        items={leads.length === 0 ? [`hide-card-${status}`] : leads.map((lead) => lead._id)}
        strategy={verticalListSortingStrategy}
      >
        <Box
          sx={{
            p: 2,
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': { width: 6 },
            '&::-webkit-scrollbar-thumb': { bgcolor: '#e0e7ef', borderRadius: 3 }
          }}
        >
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
            leads.map((lead) => (
              <OpportunitiesCard
                key={lead?._id}
                lead={lead}
                isEmptyColumn={false}
                onUpdate={handleOpenUpdateForm}
                onView={handleOpenViewForm}
              />
            ))
          )}
        </Box>
      </SortableContext>
      {selectedLead && (
        <FormLeadBase
          mode="update"
          open={isUpdate}
          onClose={handleCloseUpdateForm}
          onSubmit={handleUpdateLead}
          defaultValues={{
            ...selectedLead,
            assignedTo:
              typeof selectedLead?.assignedTo === 'object'
                ? selectedLead.assignedTo._id
                : selectedLead?.assignedTo || ''
          }}
          users={data}
          columns={COLUMNS}
        />
      )}
      {selectedLead && (
        <FormLeadBase
          mode="view"
          open={isView}
          onClose={handleCloseViewForm}
          defaultValues={{
            ...selectedLead,
            assignedTo:
              typeof selectedLead?.assignedTo === 'object'
                ? selectedLead.assignedTo._id
                : selectedLead?.assignedTo || ''
          }}
          users={data}
          columns={COLUMNS}
        />
      )}
    </Box>
  )
}

export default OpportunitiesColumn
