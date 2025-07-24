import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
  const userData = useSelector((state: RootState) => state.auth.userData)

  if (!userData || !['ADMIN', 'STAFF'].includes(userData?.roles?.name)) {
    return <Navigate to="/auth/login" replace={true} />
  }

  return <Outlet />
}

export default ProtectedRoute
