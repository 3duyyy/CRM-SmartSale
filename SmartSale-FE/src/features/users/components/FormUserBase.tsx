import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, DialogContent, DialogActions, TextField, MenuItem, Dialog, DialogTitle } from '@mui/material'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { userCreateSchema, userUpdateSchema } from '@/features/users/schema'
import { Role } from '@/types/globalTypes'

type Mode = 'create' | 'update' | 'view'

interface FormUserBaseProps {
  mode: Mode
  open: boolean
  onClose: () => void
  onSubmit?: (data: any) => void
  defaultValues?: any
  rolesList: Role[]
}

const FormUserBase = ({ mode, open, onClose, onSubmit, defaultValues, rolesList }: FormUserBaseProps) => {
  const schema = mode === 'create' ? userCreateSchema : userUpdateSchema

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
    const payload = { ...data }
    delete payload.confirmPassword

    if (onSubmit) {
      await onSubmit(payload)
    }
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle textAlign="center" fontSize={29} color="primary" fontWeight="bold">
        {mode === 'update' ? 'Cập nhật tài khoản' : mode === 'create' ? 'Thêm mới tài khoản' : 'Xem tài khoản'}
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
            label="Email"
            fullWidth
            margin="normal"
            disabled={mode === 'view'}
            {...register('email')}
            error={!!errors.email}
            helperText={typeof errors.email?.message === 'string' ? errors.email?.message : undefined}
          />
          {mode !== 'view' && mode !== 'update' && (
            <>
              <TextField
                label="Mật khẩu"
                type="password"
                fullWidth
                margin="normal"
                {...register('password')}
                error={!!errors.password}
                helperText={typeof errors.password?.message === 'string' ? errors.password?.message : undefined}
              />
              <TextField
                label="Xác nhận mật khẩu"
                type="password"
                fullWidth
                margin="normal"
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={
                  typeof errors.confirmPassword?.message === 'string' ? errors.confirmPassword?.message : undefined
                }
              />
            </>
          )}
          <TextField
            label="Vai trò"
            select
            fullWidth
            margin="normal"
            disabled={mode === 'view' || !isAdmin}
            {...register('roles')}
            error={!!errors.roles}
            helperText={typeof errors.roles?.message === 'string' ? errors.roles?.message : undefined}
            value={watch('roles') || ''}
          >
            {/* value phải nhận field BE mong muốn và thực hiện kiểm tra trước khi truyền vào để render ra name */}
            {rolesList.map((role) => (
              <MenuItem key={role._id} value={role._id}>
                {role.name}
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

export default FormUserBase
