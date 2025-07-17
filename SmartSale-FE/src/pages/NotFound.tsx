import { Box, Typography, Button, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { motion, useAnimation } from 'framer-motion'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
import { useEffect } from 'react'
import { KeyboardReturn } from '@mui/icons-material'

const MotionBox = motion(Box)

const NotFound = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const iconControls = useAnimation()

  // Lắc đầu icon khi xuất hiện
  useEffect(() => {
    iconControls.start({
      rotate: [0, -15, 15, -10, 10, -5, 5, 0],
      transition: { duration: 1.2, ease: 'easeInOut' }
    })
  }, [iconControls])

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      position="relative"
      sx={{
        overflow: 'hidden',
        background: `linear-gradient(120deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`
      }}
    >
      {/* Background animation */}
      <motion.div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: theme.palette.primary.main,
          opacity: 0.08,
          top: '-200px',
          left: '-200px',
          zIndex: 0
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: theme.palette.secondary.main,
          opacity: 0.1,
          bottom: '-100px',
          right: '-100px',
          zIndex: 0
        }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Nội dung chính */}
      <MotionBox
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        px={4}
        py={8}
        zIndex={1}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        bgcolor="rgba(255,255,255,0.85)"
        borderRadius={4}
        boxShadow={4}
      >
        <motion.div animate={iconControls}>
          <SentimentVeryDissatisfiedIcon sx={{ fontSize: 120, color: theme.palette.error.main, mb: 2 }} />
        </motion.div>
        <Typography variant="h1" fontWeight="bold" color="primary" gutterBottom sx={{ letterSpacing: 10 }}>
          404
        </Typography>
        <Typography variant="h5" color="text.secondary" mb={3}>
          Ôi không! Trang bạn tìm kiếm không tồn tại.
        </Typography>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 120 }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/dashboards')}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 4,
              py: 1,
              fontSize: 18,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1
            }}
          >
            <KeyboardReturn sx={{ mt: 0.2 }} />
            Quay lại
          </Button>
        </motion.div>
      </MotionBox>
    </Box>
  )
}

export default NotFound
