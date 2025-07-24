import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, IconButton } from '@mui/material'
import { Close } from '@mui/icons-material'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  content: React.ReactNode
}

const ConfirmDialog = ({ open, onClose, onConfirm, title, content }: ConfirmDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: 3
        }
      }}
    >
      <DialogTitle id="confirm-dialog-title" sx={{ m: 0, p: 2, fontWeight: 700, fontSize: 28 }}>
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">{content}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: '0 16px 12px' }}>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
