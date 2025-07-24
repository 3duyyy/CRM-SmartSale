import { MenuBook } from '@mui/icons-material'
import {
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'

const stats = [
  { label: 'Tổng số lead tháng này', value: 128 },
  { label: 'Tỷ lệ chốt thành công', value: '26%', color: '#16a34a' },
  { label: 'Số follow-up đã hoàn thành', value: 87 }
]

const performance = [
  { name: 'Mai', processing: 32, closed: 12 },
  { name: 'Tuấn', processing: 25, closed: 9 },
  { name: 'Phương', processing: 18, closed: 6 }
]

const Dashboard = () => {
  return (
    <Box sx={{ px: 4, py: 3, bgcolor: '#f6f8fa', minHeight: '100vh', maxHeight: '100vh' }}>
      <Typography
        variant="h4"
        fontWeight={700}
        mb={5}
        sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 38 }}
      >
        <MenuBook sx={{ fontSize: 35, mx: 1, mb: 0.6 }} />
        Dashboard tổng quan
      </Typography>
      <Grid container spacing={4} mb={8}>
        {stats &&
          stats.map((item) => (
            <Grid size={{ xs: 12, md: 4 }} key={item.label}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, pl: 2 }}>
                <CardContent>
                  <Typography color="text.secondary" fontWeight={600} mb={1}>
                    {item.label}
                  </Typography>
                  <Typography variant="h4" fontWeight={800} sx={{ color: item.color || '#232946' }}>
                    {item.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
      <Box>
        <Typography variant="h5" fontWeight={700} mb={2} ml={1}>
          Hiệu suất theo người phụ trách
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#eebbc3' }}>
                <TableCell sx={{ fontWeight: 700 }}>Tên</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Lead đang xử lý</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Lead đã chốt</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {performance.map((row) => (
                <TableRow key={row.name}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.processing}</TableCell>
                  <TableCell>{row.closed}</TableCell>
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
