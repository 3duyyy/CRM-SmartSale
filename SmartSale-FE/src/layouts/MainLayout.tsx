import Sidebar from '@/components/SideBar'
import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Outlet />
      </Box>
    </Box>
  )
}

export default MainLayout
