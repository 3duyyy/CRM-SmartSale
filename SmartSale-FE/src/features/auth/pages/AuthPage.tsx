import { Navigate, useParams } from 'react-router-dom'
import LoginForm from '@/features/auth/components/LoginForm'
import RegisterForm from '@/features/auth/components/RegisterForm'
import { Box } from '@mui/material'

const AuthPage = () => {
  const { type } = useParams()

  if (type !== 'login' && type !== 'register') {
    return <Navigate to="/404" replace={true} />
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: "url('/imgs/background-login-regis.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      {type === 'login' && <LoginForm />}
      {type === 'register' && <RegisterForm />}
    </Box>
  )
}

export default AuthPage
