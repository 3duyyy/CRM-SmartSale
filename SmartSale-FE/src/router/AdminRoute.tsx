import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const AdminRoute = () => {
  const accessToken = useSelector((state: RootState) => state.auth.userData)
  const userData = useSelector((state: RootState) => state.auth.userData)
  console.log(userData)

  if (!accessToken || !userData || userData?.roles?.name?.toLowerCase() !== 'admin') {
    return <Navigate to="/404" replace={true} />
  }
  return <Outlet />
}

export default AdminRoute
