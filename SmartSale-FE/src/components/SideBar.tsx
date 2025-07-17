// src/components/Sidebar.tsx
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AssignmentIcon from '@mui/icons-material/Assignment'
import RepeatIcon from '@mui/icons-material/Repeat'
import PeopleIcon from '@mui/icons-material/People'
import SettingsIcon from '@mui/icons-material/Settings'
import { NavLink, useLocation } from 'react-router-dom'

const menuItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboards' },
  { label: 'Opportunities', icon: <AssignmentIcon />, path: '/opportunities' },
  { label: 'Follow-up', icon: <RepeatIcon />, path: '/follow-up' },
  { label: 'Người dùng', icon: <PeopleIcon />, path: '/users' },
  { label: 'Cài đặt', icon: <SettingsIcon />, path: '/settings' }
]

const Sidebar = () => {
  const location = useLocation()

  return (
    <Box
      sx={{
        width: 300,
        minHeight: '100vh',
        maxHeight: '100vh',
        bgcolor: '#232946',
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
            fontSize: '36px',
            color: 'white'
          }}
        >
          SmartSale
        </Typography>
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.label}
              // Chỉ định render ra kiểu component khác. VD: a, Link, NavLink
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
          ))}
        </List>
      </Box>
      <Box sx={{ textAlign: 'center', color: '#b8c1ec', fontSize: 13, pb: 1, pr: 2, opacity: 0.8 }}>
        © {new Date().getFullYear()} SmartSale
      </Box>
    </Box>
  )
}

export default Sidebar
