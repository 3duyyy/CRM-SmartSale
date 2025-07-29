import z from 'zod'
import { registerSchema } from '../schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button, TextField, useTheme } from '@mui/material'
import { useDispatch } from 'react-redux'
import { Dispatch } from '@/redux/store'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { registerApi } from '../authSlice'

type RegisterFormData = z.infer<typeof registerSchema>

const RegisterForm = () => {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) })

  const theme = useTheme()
  const dispatch = useDispatch<Dispatch>()
  const navigate = useNavigate()

  const onSubmit = async (data: RegisterFormData) => {
    await toast.promise(
      dispatch(
        registerApi({
          name: data.name,
          email: data.email,
          password: data.password
        })
      ).unwrap(),
      {
        pending: 'Đang đăng ký...',
        success: 'Đăng ký thành công!'
      }
    )
    navigate('/auth/login')
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-lg shadow-lg py-8 px-11 border border-gray-100 rounded-2xl flex flex-col gap-6 bg-white"
    >
      <div className="text-center mb-2">
        <h1 style={{ color: theme.palette.primary.main }} className="text-[2.2vw] font-semibold">
          Tạo tài khoản
        </h1>
        <p className="text-gray-500 text-md">Bắt đầu hành trình quản lý khách hàng hiệu quả</p>
      </div>

      <TextField
        label="Họ tên"
        fullWidth
        variant="outlined"
        autoFocus
        {...register('name')}
        error={!!errors.name}
        helperText={errors.name?.message}
      />

      <TextField
        label="Email"
        fullWidth
        variant="outlined"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        label="Mật khẩu"
        fullWidth
        type="password"
        variant="outlined"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <TextField
        label="Xác nhận mật khẩu"
        fullWidth
        type="password"
        variant="outlined"
        {...register('confirmPassword')}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />

      <Button
        variant="contained"
        type="submit"
        fullWidth
        disabled={isSubmitting}
        className="rounded-full py-3! text-white bg-[#3f51b5] hover:bg-[#303f9f] normal-case"
      >
        Đăng ký
      </Button>

      <div className="text-center text-md text-gray-500">
        Đã có tài khoản?
        <a href="/auth/login" style={{ color: theme.palette.primary.main }} className="ml-1 hover:underline">
          Đăng nhập
        </a>
      </div>
    </form>
  )
}

export default RegisterForm
