// src/components/Sidebar.tsx
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AssignmentIcon from '@mui/icons-material/Assignment'
import RepeatIcon from '@mui/icons-material/Repeat'
import PeopleIcon from '@mui/icons-material/People'
import SettingsIcon from '@mui/icons-material/Settings'
import { NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AccountCircle, Logout } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch, RootState } from '@/redux/store'
import { logoutApi, setUserData } from '@/features/auth/authSlice'
import { toast } from 'react-toastify'
import FormUserBase from '../features/users/components/FormUserBase'
import { updateUserById } from '@/features/users/userSlice'
import { getAllRoles } from '@/redux/roleSlice'

const menuItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboards' },
  { label: 'Opportunities', icon: <AssignmentIcon />, path: '/opportunities' },
  { label: 'Follow-up', icon: <RepeatIcon />, path: '/follow-ups' },
  { label: 'Người dùng', icon: <PeopleIcon />, path: '/users' },
  { label: 'Tài khoản', icon: <SettingsIcon />, isCheckAccount: true }
]

const Sidebar = () => {
  const location = useLocation()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isOpenProfileForm, setIsOpenProfileForm] = useState(false)

  const user = useSelector((state: RootState) => state.auth.userData)
  const isAdmin = user?.roles?.name === 'ADMIN'

  const dispatch = useDispatch<Dispatch>()
  useEffect(() => {
    dispatch(getAllRoles())
  }, [dispatch])

  const userData = useSelector((state: RootState) => state.auth.userData)
  const roleList = useSelector((state: RootState) => state.roles.roles)

  const handleLogout = async () => {
    await dispatch(logoutApi())
    handleClose()
    toast.success('Đăng xuất thành công!')
  }

  const handleAccountClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSubmitForm = async (data) => {
    const res = await dispatch(
      updateUserById({
        _id: userData._id,
        payload: data
      })
    ).unwrap()

    // Xử lý cập nhật userData sau khi update
    dispatch(setUserData({ ...userData, ...res }))
    toast.success('Cập nhật tài khoản thành công!')
  }

  return (
    <Box
      sx={{
        width: 250,
        minHeight: '100vh',
        maxHeight: '100vh',
        bgcolor: '#37474F',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        py: 3,
        boxShadow: 8,
        flexShrink: 0
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            textAlign: 'center',
            mb: 4,
            letterSpacing: 1,
            fontSize: '30px',
            color: 'white'
          }}
        >
          SmartSale
        </Typography>
        <List>
          {menuItems
            // Khi label khác Người dùng thì render, khi là Người dùng thì render khi isAdmin
            .filter((item) => item.label !== 'Người dùng' || isAdmin)
            .map((item) =>
              item.isCheckAccount ? (
                <ListItemButton
                  key={item.label}
                  onClick={handleAccountClick}
                  sx={{
                    mb: 1,
                    borderRadius: 2
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 35 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              ) : (
                <ListItemButton
                  key={item.label}
                  component={NavLink}
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    '&.MuiButtonBase-root': {
                      '&.Mui-selected': {
                        bgcolor: '#eebbc3',
                        color: '#232946',
                        '& .MuiListItemText-primary': {
                          fontWeight: 'bold',
                          fontSize: '1.1rem'
                        },
                        '& .MuiListItemIcon-root': { color: '#232946' }
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 35 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              )
            )}
        </List>
        {/* Menu của Account */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          slotProps={{ paper: { sx: { minWidth: 200 } } }}
        >
          <MenuItem sx={{ fontSize: '18px' }}>
            Hi,<span className="ml-1 font-bold">{userData?.name}</span>!
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              setIsOpenProfileForm(true)
              handleClose()
            }}
          >
            <AccountCircle sx={{ mr: 1 }} /> My account
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Logout sx={{ mr: 1 }} /> Logout
          </MenuItem>
        </Menu>
      </Box>
      <FormUserBase
        mode="update"
        open={isOpenProfileForm}
        onClose={() => setIsOpenProfileForm(false)}
        onSubmit={handleSubmitForm}
        defaultValues={{ ...userData, roles: userData?.roles?._id || '' }}
        rolesList={roleList}
      />
      <Box sx={{ textAlign: 'center', color: '#b8c1ec', fontSize: 13, pb: 1, pr: 2, opacity: 0.8 }}>
        © {new Date().getFullYear()} SmartSale
      </Box>
    </Box>
  )
}

export default Sidebar
