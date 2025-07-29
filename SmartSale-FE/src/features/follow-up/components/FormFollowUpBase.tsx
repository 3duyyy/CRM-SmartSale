import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { followUpCreateSchema, followUpUpdateSchema } from '../schema'
import { STATUS_OPTIONS, TYPE_OPTIONS } from '../constant'

export type FollowUpFormMode = 'create' | 'update'

interface FormFollowUpProps {
  open: boolean
  onClose: () => void
  onSubmit?: (data: any) => void
  defaultValues?: any
  leadsList: { _id: string; name: string }[]
  mode: FollowUpFormMode
}

const FormFollowUpBase = ({ open, onClose, onSubmit, defaultValues, leadsList, mode }: FormFollowUpProps) => {
  const schema = mode === 'create' ? followUpCreateSchema : followUpUpdateSchema

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues
  })

  useEffect(() => {
    if (open) reset(defaultValues)
  }, [open, defaultValues, reset])

  const handleFormSubmit = async (data: any) => {
    if (onSubmit) await onSubmit(data)
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle textAlign="center" fontSize={28} fontWeight={700} color="primary">
        {mode === 'update' ? 'Cập nhật Follow-up' : 'Tạo mới Follow-up'}
      </DialogTitle>
      <form onSubmit={onSubmit ? handleSubmit(handleFormSubmit) : undefined}>
        <DialogContent>
          <TextField
            label="Khách hàng"
            select
            fullWidth
            margin="normal"
            disabled={mode !== 'create'}
            {...register('lead')}
            error={!!errors.lead}
            helperText={errors.lead?.message?.toString()}
            value={watch('lead') || ''}
          >
            {leadsList.map((lead) => (
              <MenuItem key={lead._id} value={lead._id}>
                {lead.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Loại"
            select
            fullWidth
            margin="normal"
            {...register('type')}
            error={!!errors.type}
            helperText={errors.type?.message?.toString()}
            value={watch('type')}
          >
            {TYPE_OPTIONS.map((opt, index) => (
              <MenuItem key={index} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Nội dung"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            {...register('content')}
            error={!!errors.content}
            helperText={errors.content?.message?.toString()}
          />

          <TextField
            label="Ngày follow-up tiếp theo"
            type="date"
            fullWidth
            margin="normal"
            {...register('nextFollowUpDate')}
            slotProps={{ inputLabel: { shrink: true } }}
            error={!!errors.nextFollowUpDate}
            helperText={errors.nextFollowUpDate?.message?.toString()}
            value={watch('nextFollowUpDate')}
          />

          <TextField
            label="Trạng thái"
            select
            fullWidth
            margin="normal"
            {...register('status')}
            error={!!errors.status}
            helperText={errors.status?.message?.toString()}
            value={watch('status')}
          >
            {STATUS_OPTIONS.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Huỷ</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default FormFollowUpBase
