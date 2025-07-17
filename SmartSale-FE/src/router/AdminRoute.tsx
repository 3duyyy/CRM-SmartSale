import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const AdminRoute = () => {
  const accessToken = useSelector((state: RootState) => state.auth.userData)
  const userData = useSelector((state: RootState) => state.auth.userData)

  if (!accessToken || !userData || userData?.role?.name !== 'ADMIN') {
    return <Navigate to="/" replace={true} />
  }
  return <Outlet />
}

export default AdminRoute
