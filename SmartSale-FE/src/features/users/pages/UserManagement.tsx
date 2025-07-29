import {
  Box,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
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
import { Add, Delete, Edit, LockReset, Search, SupportAgent } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  createNewUser,
  deleteUserById,
  getAllUsers,
  setRoleFilter,
  setSearchUser,
  updateUserById,
  User
} from '../userSlice'
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
  const { data, pagination, searchUser, roleFilter, reload } = useSelector((state: RootState) => state.users)
  const roleList = useSelector((state: RootState) => state.roles.roles)

  const theme = useTheme()

  useEffect(() => {
    dispatch(getAllUsers({ searchUser, role: roleFilter, isPagination: true }))
  }, [dispatch, reload, searchUser, roleFilter])

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
    await dispatch(deleteUserById(selectedUser._id)).unwrap()
    toast.success('Xoá người dùng thành công!')
    setOpenConfirm(false)
  }

  const handleResetPassword = async (data: any) => {
    const payload = { password: data.password }
    await dispatch(updateUserById({ _id: selectedUser._id, payload })).unwrap()
    toast.success('Đổi mật khẩu thành công!')
    setOpenResetForm(false)
  }

  return (
    <Box sx={{ px: 4, py: 3, bgcolor: '#f6f8fa', minHeight: '100vh', maxHeight: '100vh' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h5" fontWeight="bold" fontSize={36} color={theme.palette.primary.dark}>
            Quản lý người dùng
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
              <TextField
                id="find-lead-input"
                label="Tìm kiếm"
                placeholder="Nhập vào tên người dùng..."
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
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: theme.palette.primary.main }} />
                      </InputAdornment>
                    )
                  }
                }}
                value={searchUser}
                onChange={(e) => dispatch(setSearchUser(e.target.value))}
              />
            </Box>
            <TextField
              size="small"
              select
              label="Vai trò"
              sx={{
                minWidth: 180,
                bgcolor: '#f9fafb',
                boxShadow: 2,
                borderRadius: 3,
                ml: 1,
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
                },
                '& .MuiSelect-icon': {
                  color: theme.palette.primary.main
                }
              }}
              slotProps={{
                input: {
                  startAdornment: <SupportAgent sx={{ color: theme.palette.primary.main, mr: 1 }} fontSize="small" />
                }
              }}
              value={roleFilter}
              onChange={(e) => dispatch(setRoleFilter(e.target.value))}
            >
              <MenuItem value="">Tất cả trạng thái</MenuItem>
              {roleList.map((role) => (
                <MenuItem key={role._id} value={role._id}>
                  {role.name}
                </MenuItem>
              ))}
            </TextField>
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
          {data?.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.roles?.name}</TableCell>
              <TableCell align="right">
                <Tooltip title="Đặt lại mật khẩu">
                  <IconButton color="warning" onClick={() => handleOpenReset(user)}>
                    <LockReset fontSize="small" sx={{ fontSize: 22 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Chỉnh sửa">
                  <IconButton color="primary" onClick={() => handleOpenUpdate(user)}>
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Xoá">
                  <IconButton color="error" onClick={() => handleDeleteUser(user)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pagination?.totalPages > 1 && (
        <Stack direction="row" justifyContent="center" mt={2}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={(_, value) => {
              dispatch(getAllUsers({ searchUser, role: roleFilter, page: value, isPagination: true }))
            }}
            color="primary"
            shape="rounded"
          />
        </Stack>
      )}

      {/* Form Create + Update */}
      <FormUserBase
        // Thêm key để ép component remount, tránh react hook form tự dùng lại defaultValues
        key={formMode === 'update' ? selectedUser?._id : 'create'}
        mode={formMode}
        open={openForm}
        onClose={() => setOpenForm(false)}
        defaultValues={{ ...selectedUser, roles: selectedUser?.roles?._id }}
        onSubmit={async (data) => {
          if (formMode === 'create') {
            await dispatch(createNewUser(data)).unwrap()
            toast.success('Tạo người dùng thành công!')
          } else {
            await dispatch(updateUserById({ _id: selectedUser._id, payload: data })).unwrap()
            toast.success('Cập nhật người dùng thành công!')
          }
          dispatch(getAllUsers({}))
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
