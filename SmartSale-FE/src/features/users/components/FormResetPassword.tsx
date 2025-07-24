// src/components/FormResetPassword.tsx
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordSchema } from '../schema'

interface FormResetPasswordProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: { password: string }) => void
}

const FormResetPassword = ({ open, onClose, onSubmit }: FormResetPasswordProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(resetPasswordSchema)
  })

  const handleSubmitForm = async (data: any) => {
    await onSubmit(data)
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle textAlign="center" fontSize={29} color="primary" fontWeight="bold">
        Đặt lại mật khẩu
      </DialogTitle>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <DialogContent sx={{ mt: -3 }}>
          <TextField
            label="Mật khẩu mới"
            type="password"
            fullWidth
            margin="normal"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message as string}
          />
          <TextField
            label="Xác nhận mật khẩu"
            type="password"
            fullWidth
            margin="normal"
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message as string}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Huỷ
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Xác nhận
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default FormResetPassword
