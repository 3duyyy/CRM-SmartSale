/** FORM CRUD LEAD */
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, DialogContent, DialogActions, TextField, MenuItem, Dialog, DialogTitle } from '@mui/material'
import { useEffect } from 'react'
import { leadSchema, leadUpdateSchema } from '../schema'
import { User } from '@/features/users/userSlice'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

type Mode = 'create' | 'update' | 'view'

interface FormLeadBaseProps {
  mode: Mode
  open: boolean
  onClose: () => void
  onSubmit?: (data: any) => void
  defaultValues?: any
  users: User[]
  columns: { status: string; label: string; color: string }[]
}

const getSchema = (mode: Mode) => (mode === 'create' ? leadSchema : leadUpdateSchema)

const FormLeadBase = ({ mode, open, onClose, onSubmit, defaultValues, users, columns }: FormLeadBaseProps) => {
  const schema = getSchema(mode)
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

  const user = useSelector((state: RootState) => state.auth.userData)
  const isAdmin = user?.roles?.name === 'ADMIN'

  useEffect(() => {
    if (open) {
      reset(defaultValues)
    }
  }, [open, defaultValues, reset])

  const handleSubmitForm = async (data: any) => {
    if (onSubmit) {
      await onSubmit(data)
    }
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle textAlign="center" fontSize={30} color="primary" fontWeight="bold">
        {mode === 'update' ? 'Cập nhật Lead' : mode === 'create' ? 'Thêm mới Lead' : 'Xem chi tiết Lead'}
      </DialogTitle>
      <form onSubmit={onSubmit ? handleSubmit(handleSubmitForm) : undefined}>
        <DialogContent sx={{ mt: -3 }}>
          <TextField
            label="Tên"
            fullWidth
            margin="normal"
            disabled={mode === 'view'}
            {...register('name')}
            error={!!errors.name}
            helperText={typeof errors.name?.message === 'string' ? errors.name?.message : undefined}
          />
          <TextField
            label="Công ty"
            fullWidth
            margin="normal"
            disabled={mode === 'view'}
            {...register('company')}
            error={!!errors.company}
            helperText={typeof errors.company?.message === 'string' ? errors.company?.message : undefined}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            disabled={mode === 'view'}
            {...register('email')}
            error={!!errors.email}
            helperText={typeof errors.email?.message === 'string' ? errors.email?.message : undefined}
          />
          <TextField
            label="Số điện thoại"
            fullWidth
            margin="normal"
            disabled={mode === 'view'}
            {...register('phone')}
            error={!!errors.phone}
            helperText={typeof errors.phone?.message === 'string' ? errors.phone?.message : undefined}
          />
          <TextField
            label="Trạng thái"
            select
            fullWidth
            margin="normal"
            disabled={mode === 'view'}
            {...register('status')}
            error={!!errors.status}
            helperText={typeof errors.status?.message === 'string' ? errors.status?.message : undefined}
            value={watch('status') || ''}
          >
            {columns.map((column) => (
              <MenuItem key={column.status} value={column.status}>
                {column.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Giá trị ($)"
            type="number"
            fullWidth
            margin="normal"
            disabled={mode === 'view'}
            {...register('value', { valueAsNumber: true })}
            error={!!errors.value}
            helperText={
              typeof errors.value?.message === 'string'
                ? errors.value?.message === 'Invalid input: expected number, received NaN'
                  ? 'Giá trị khách hàng mang lại không được để trống!'
                  : errors.value?.message
                : undefined
            }
          />
          <TextField
            label="Ghi chú"
            fullWidth
            margin="normal"
            multiline
            minRows={2}
            disabled={mode === 'view'}
            {...register('note')}
            error={!!errors.note}
            helperText={typeof errors.note?.message === 'string' ? errors.note?.message : undefined}
          />
          <TextField
            label="Người phụ trách"
            select
            fullWidth
            margin="normal"
            disabled={mode === 'view' || !isAdmin}
            {...register('assignedTo')}
            error={!!errors.assignedTo}
            helperText={typeof errors.assignedTo?.message === 'string' ? errors.assignedTo?.message : undefined}
            value={watch('assignedTo') || ''}
            slotProps={{
              select: {
                MenuProps: {
                  anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'left'
                  },
                  transformOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left'
                  }
                }
              }
            }}
          >
            {users.map((user: User) => (
              <MenuItem key={user._id} value={user._id}>
                {user.name} ({user.email})
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Huỷ
          </Button>
          {mode !== 'view' && (
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default FormLeadBase
