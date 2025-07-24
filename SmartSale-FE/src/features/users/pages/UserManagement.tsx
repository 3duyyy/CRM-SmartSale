import {
  Box,
  Button,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material'
import { Add, Delete, Edit, Search } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createNewUser, deleteUserById, getAllUsers, updateUserById, User } from '../userSlice'
import { Dispatch, RootState } from '@/redux/store'
import ConfirmDialog from '@/components/ConfirmDialog'
import { toast } from 'react-toastify'
import FormUserBase from '@/features/users/components/FormUserBase'
import ButtonCus from '@/components/ButtonCus'
import FormResetPassword from '../components/FormResetPassword'

const UserManagement = () => {
  const [openForm, setOpenForm] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [openResetForm, setOpenResetForm] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'update'>('create')
  const [selectedUser, setSelectedUser] = useState<User>(null)

  const dispatch = useDispatch<Dispatch>()
  const { users } = useSelector((state: RootState) => state.users)
  const roleList = useSelector((state: RootState) => state.roles.roles)
  const reload = useSelector((state: RootState) => state.users.reload)

  const theme = useTheme()

  useEffect(() => {
    dispatch(getAllUsers())
  }, [dispatch, reload])

  const handleOpenCreate = () => {
    setFormMode('create')
    setSelectedUser(null)
    setOpenForm(true)
  }

  const handleOpenUpdate = (user: any) => {
    setFormMode('update')
    setSelectedUser(user)
    setOpenForm(true)
  }

  const handleOpenReset = (user) => {
    setOpenResetForm(true)
    setSelectedUser(user)
  }

  const handleDeleteUser = (user: any) => {
    setSelectedUser(user)
    setOpenConfirm(true)
  }

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteUserById(selectedUser._id)).unwrap()
      toast.success('Xoá người dùng thành công!')
      setOpenConfirm(false)
    } catch (error) {
      toast.error(error?.message || 'Xoá người dùng thất bại!')
    }
  }

  const handleResetPassword = async (data: any) => {
    try {
      const payload = { password: data.password }
      await dispatch(updateUserById({ _id: selectedUser._id, payload })).unwrap()
      toast.success('Đổi mật khẩu thành công!')
      setOpenResetForm(false)
    } catch (error) {
      toast.error(error?.message || 'Đổi mật khẩu thất bại!')
    }
  }

  return (
    <Box sx={{ px: 4, py: 3, bgcolor: '#f6f8fa', minHeight: '100vh', maxHeight: '100vh' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h5" fontWeight="bold" fontSize={36} color={theme.palette.primary.main}>
            Quản lý người dùng
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, mt: 1 }}>
            <Search sx={{ fontSize: '28px', color: theme.palette.primary.main }} />
            <TextField
              id="find-lead-input"
              label="Tìm kiếm cơ hội kinh doanh"
              placeholder="Nhập vào tên khách hàng/công ty cần tìm..."
              variant="standard"
              sx={{ width: { xs: '200px', sm: '300px', md: '350px' } }}
              // value={}
              // onChange={}
            />
          </Box>
        </Box>
        <ButtonCus
          sxAdditional={{ px: 3, py: 1.5, fontSize: '16px' }}
          icon={<Add sx={{ mr: 1 }} />}
          content={'Thêm mới'}
          variant="contained"
          onClick={handleOpenCreate}
        />
      </Stack>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Tên</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Vai trò</TableCell>
            <TableCell align="right">Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.roles?.name}</TableCell>
              <TableCell align="right">
                <Button
                  sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    bgcolor: theme.palette.primary.main,
                    color: '#fff',
                    px: 2,
                    py: 0.8,
                    mt: { xs: 2, md: 0 },
                    '&:hover': { bgcolor: theme.palette.primary.dark }
                  }}
                  onClick={() => handleOpenReset(user)}
                >
                  Đặt lại mật khẩu
                </Button>
                <Tooltip title="Chỉnh sửa">
                  <IconButton onClick={() => handleOpenUpdate(user)}>
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Xoá">
                  <IconButton onClick={() => handleDeleteUser(user)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Form Create + Update */}
      <FormUserBase
        // Thêm key để ép component remount, tránh react hook form tự dùng lại defaultValues
        key={formMode === 'update' ? selectedUser?._id : 'create'}
        mode={formMode}
        open={openForm}
        onClose={() => setOpenForm(false)}
        defaultValues={selectedUser}
        onSubmit={async (data) => {
          try {
            if (formMode === 'create') {
              await dispatch(createNewUser(data)).unwrap()
              toast.success('Tạo người dùng thành công!')
            } else {
              await dispatch(updateUserById({ _id: selectedUser._id, payload: data })).unwrap()
              toast.success('Cập nhật người dùng thành công!')
            }
            dispatch(getAllUsers())
          } catch (error) {
            toast.error(error?.message || 'Lỗi thao tác!')
          }
        }}
        rolesList={roleList}
      />

      {/* Form Reset Password */}
      <FormResetPassword
        open={openResetForm}
        onClose={() => setOpenResetForm(false)}
        onSubmit={(data) => handleResetPassword(data)}
      />

      {/* Dialog xác nhận xoá */}
      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Xoá người dùng"
        content={`Bạn có chắc muốn xoá người dùng "${selectedUser?.name}" không?`}
      />
    </Box>
  )
}

export default UserManagement
