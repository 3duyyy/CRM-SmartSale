import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const PublicRoute = () => {
  const { accessToken, userData } = useSelector((state: RootState) => state.auth)

  if (accessToken && userData) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default PublicRoute
