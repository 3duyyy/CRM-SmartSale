import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)
  const userData = useSelector((state: RootState) => state.auth.userData)

  if (!accessToken || !userData || !['ADMIN', 'USER'].includes(userData?.roles?.name)) {
    return <Navigate to="/auth/login" replace={true} />
  }

  return <Outlet />
}

export default ProtectedRoute
