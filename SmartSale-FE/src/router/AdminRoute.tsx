import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const AdminRoute = () => {
  const userData = useSelector((state: RootState) => state.auth.userData)

  if (!userData || userData?.roles?.name?.toLowerCase() !== 'admin') {
    return <Navigate to="/404" replace={true} />
  }
  return <Outlet />
}

export default AdminRoute
