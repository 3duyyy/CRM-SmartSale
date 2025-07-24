import { Button, useTheme } from '@mui/material'

const ButtonCus = ({ sxAdditional, icon, content, ...props }) => {
  const theme = useTheme()

  return (
    <Button
      sx={{
        display: 'flex',
        alignItems: 'center',
        borderRadius: 3,
        boxShadow: 3,
        bgcolor: theme.palette.primary.main,
        color: '#fff',
        mt: { xs: 2, md: 0 },
        '&:hover': { bgcolor: theme.palette.primary.dark },
        ...sxAdditional
      }}
      {...props}
    >
      {icon}
      {content}
    </Button>
  )
}

export default ButtonCus
