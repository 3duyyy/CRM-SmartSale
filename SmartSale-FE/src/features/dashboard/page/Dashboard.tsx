import { Dispatch, RootState } from '@/redux/store'
import { MenuBook, Search } from '@mui/icons-material'
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme
} from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDashBoardStats, setSearchUser } from '../dashboardSlice'
import CardDashboard from '../components/CardDashboard'

const Dashboard = () => {
  const theme = useTheme()
  const dispatch = useDispatch<Dispatch>()
  const { totalLeads, totalFollowUps, closeRate, userStats, searchUser } = useSelector(
    (state: RootState) => state.dashboards
  )

  useEffect(() => {
    dispatch(getDashBoardStats({ search: searchUser }))
  }, [dispatch, searchUser])

  return (
    <Box sx={{ px: 4, py: 3, bgcolor: '#f6f8fa', minHeight: '100vh', maxHeight: '100vh' }}>
      <Typography
        variant="h4"
        fontWeight={700}
        mb={5}
        sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 36, color: theme.palette.primary.main }}
      >
        <MenuBook sx={{ fontSize: 35, mx: 1, mb: 0.6 }} />
        Dashboard
      </Typography>
      <Grid container spacing={4} mb={8}>
        <CardDashboard title="Tổng số Lead" value={totalLeads} />
        <CardDashboard title="Tỉ lệ thành công" value={closeRate} />
        <CardDashboard title="Số Follow-up thành công" value={totalFollowUps} />
      </Grid>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            mb={2}
            ml={1}
            sx={{ fontSize: 25, color: theme.palette.primary.light }}
          >
            Hiệu suất theo người phụ trách
          </Typography>
          <TextField
            id="find-lead-input"
            label="Tìm kiếm"
            placeholder="Nhập vào tên nhân viên..."
            variant="outlined"
            size="small"
            sx={{
              minWidth: 280,
              bgcolor: '#f9fafb',
              boxShadow: 2,
              borderRadius: 3,
              border: '1.5px solid #e0e7ef',
              '& .MuiInputBase-root': {
                borderRadius: 3,
                px: 1.5,
                py: 0.5,
                bgcolor: '#f9fafb'
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none'
              },
              '&:hover': {
                boxShadow: 4,
                bgcolor: '#f1f3f6'
              },
              '& .MuiInputLabel-root': {
                fontWeight: 600,
                color: theme.palette.primary.main
              }
            }}
            slotProps={{ input: { startAdornment: <Search sx={{ mr: 1, color: theme.palette.primary.main }} /> } }}
            value={searchUser}
            onChange={(e) => dispatch(setSearchUser(e.target.value))}
          />
        </Box>
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2, maxHeight: '350px' }}>
          <Table>
            <TableHead sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <TableRow sx={{ bgcolor: theme.palette.primary.light }}>
                <TableCell sx={{ fontWeight: 700, color: 'white' }}>Tên</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'white' }}>Lead đang xử lý</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'white' }} align="center">
                  Lead đã chốt
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'white' }} align="right">
                  Lead đã hủy
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userStats.map((user) => (
                <TableRow key={user.name}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell sx={{ pl: 7 }}>{user.processing}</TableCell>
                  <TableCell align="center">{user.closed}</TableCell>
                  <TableCell align="right">{user.cancelled}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}

export default Dashboard
