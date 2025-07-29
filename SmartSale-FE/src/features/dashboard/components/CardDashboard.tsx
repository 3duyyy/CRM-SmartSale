import { Card, CardContent, Grid, Typography } from '@mui/material'

const CardDashboard = ({ title = '', value }) => {
  return (
    <Grid size={{ xs: 12, md: 4 }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3, pl: 2 }}>
        <CardContent>
          <Typography color="text.secondary" fontWeight={600} mb={1}>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={800} sx={{ color: '#232946' }}>
            {value}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default CardDashboard
