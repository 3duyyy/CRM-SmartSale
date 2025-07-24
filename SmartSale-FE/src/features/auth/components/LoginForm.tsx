import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { loginSchema } from '../schema'
import { useDispatch } from 'react-redux'
import { Dispatch } from '@/redux/store'
import { Button, TextField, useTheme } from '@mui/material'
import { toast } from 'react-toastify'
import { loginApi } from '../authSlice'
import { useNavigate } from 'react-router-dom'

type LoginFormData = z.infer<typeof loginSchema>

const LoginForm = () => {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  const theme = useTheme()
  const dispatch = useDispatch<Dispatch>()
  const navigate = useNavigate()

  const onSubmit = async (data: LoginFormData) => {
    try {
      await toast.promise(
        dispatch(
          loginApi({
            email: data.email,
            password: data.password
          })
        ).unwrap(),
        {
          pending: 'Đang đăng nhập...',
          success: 'Đăng nhập thành công, chào mừng bạn trở lại!'
        }
      )
      navigate('/')
    } catch (error) {
      toast.error(error?.message)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-lg shadow-lg py-8 px-11 border border-gray-100 rounded-2xl flex flex-col gap-6 bg-white"
    >
      <div className="text-center mb-5">
        <h1 style={{ color: theme.palette.primary.main }} className="text-[2.5vw] font-semibold">
          Đăng nhập
        </h1>
        <p className="text-gray-500 text-md mt-1">
          Đăng nhập để bắt đầu một ngày làm việc hiệu quả cùng hệ thống quản lý thông minh!
        </p>
      </div>

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

      <Button
        variant="contained"
        type="submit"
        fullWidth
        disabled={isSubmitting}
        className="rounded-full py-3! text-white bg-[#3f51b5] hover:bg-[#303f9f] normal-case text-lg!"
      >
        Đăng nhập
      </Button>

      <div className="text-center text-md text-gray-500">
        Bạn chưa có tài khoản?
        <a href="/auth/register" style={{ color: theme.palette.primary.main }} className="ml-1 hover:underline">
          Tạo tài khoản
        </a>
      </div>
    </form>
  )
}

export default LoginForm
