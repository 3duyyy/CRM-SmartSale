// src/features/followUps/pages/FollowUpPage.tsx
import {
  Box,
  Chip,
  IconButton,
  MenuItem,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme
} from '@mui/material'
import { Add, Delete, Edit, Search, SupportAgent } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import ButtonCus from '@/components/ButtonCus'
import { useDispatch, useSelector } from 'react-redux'
import {
  createNewFollowUp,
  deleteFollowUpById,
  FollowUp,
  getAllFollowUps,
  setSearchTerm,
  setStatusFilter,
  updateFollowUpById
} from '../followUpSlice'
import { Dispatch, RootState } from '@/redux/store'
import FormFollowUpBase from '../components/FormFollowUpBase'
import { toast } from 'react-toastify'
import { getAllLeads } from '@/features/opportunities/leadSlice'
import { STATUS_OPTIONS } from '../constant'
import ConfirmDialog from '@/components/ConfirmDialog'
import dayjs from 'dayjs'

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Chưa xử lý':
      return 'warning'
    case 'Đã hoàn thành':
      return 'success'
    case 'Thất bại':
      return 'error'
    default:
      return 'default'
  }
}

const FollowUpPage = () => {
  const [openForm, setOpenForm] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [selectedData, setSelectedData] = useState<FollowUp>(null)

  const theme = useTheme()

  const dispatch = useDispatch<Dispatch>()
  const { data, pagination, reload, searchTerm, statusFilter } = useSelector((state: RootState) => state.followUps)
  const leadList = useSelector((state: RootState) => state.leads.all)

  useEffect(() => {
    dispatch(
      getAllFollowUps({
        search: searchTerm,
        status: statusFilter,
        isPagination: true
      })
    )
  }, [dispatch, searchTerm, statusFilter, reload])
  useEffect(() => {
    dispatch(getAllLeads({}))
  }, [dispatch])

  const handleOpenCreate = () => {
    setMode('create')
    setSelectedData(null)
    setOpenForm(true)
  }

  const handleOpenUpdate = (data: any) => {
    setMode('update')
    setSelectedData(data)
    setOpenForm(true)
  }

  const handleOpenConfirm = (data: any) => {
    setOpenConfirm(true)
    setSelectedData(data)
  }

  const handleConfirmDelete = async () => {
    await dispatch(deleteFollowUpById(selectedData._id)).unwrap()
    toast.success('Xoá người dùng thành công!')
    setOpenConfirm(false)
  }

  return (
    <Stack spacing={2} sx={{ px: 4, py: 3, bgcolor: '#f6f8fa', minHeight: '100vh', maxHeight: '100vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3 }}>
          <Typography variant="h5" fontWeight="bold" fontSize={36} color={theme.palette.primary.dark}>
            Quản lý Follow-up
          </Typography>

          <Box>
            <TextField
              id="find-lead-input"
              label="Tìm kiếm"
              placeholder="Nhập vào tên khách hàng..."
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
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            />
            <TextField
              size="small"
              select
              label="Trạng thái"
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
              value={statusFilter}
              onChange={(e) => dispatch(setStatusFilter(e.target.value))}
            >
              <MenuItem value="">Tất cả trạng thái</MenuItem>
              {STATUS_OPTIONS.map((s, index) => (
                <MenuItem key={index} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>
        <ButtonCus
          sxAdditional={{ px: 3, py: 1.5, fontSize: '16px' }}
          content="Thêm mới"
          icon={<Add sx={{ mr: 1 }} />}
          onClick={handleOpenCreate}
        />
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Khách hàng</TableCell>
            <TableCell>Người phụ trách</TableCell>
            <TableCell>Loại</TableCell>
            <TableCell>Nội dung</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Ngày hẹn tiếp</TableCell>
            <TableCell align="right">Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((f) => (
            <TableRow key={f._id}>
              <TableCell>{f?.lead?.name}</TableCell>
              <TableCell>{f?.user?.name}</TableCell>
              <TableCell>{f.type}</TableCell>
              <TableCell>{f.content}</TableCell>
              <TableCell>
                <Chip label={f.status} color={getStatusColor(f.status)} />
              </TableCell>
              <TableCell>{f.nextFollowUpDate ? dayjs(f.nextFollowUpDate).format('YYYY-MM-DD') : 'Không'}</TableCell>
              <TableCell align="right">
                <IconButton color="primary" onClick={() => handleOpenUpdate(f)}>
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={() => handleOpenConfirm(f)}>
                  <Delete />
                </IconButton>
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
              dispatch(getAllFollowUps({ search: searchTerm, status: statusFilter, page: value, isPagination: true }))
            }}
            color="primary"
            shape="rounded"
          />
        </Stack>
      )}

      <FormFollowUpBase
        key={mode === 'update' ? selectedData._id : 'create'}
        mode={mode}
        open={openForm}
        onClose={() => setOpenForm(false)}
        leadsList={leadList}
        defaultValues={{
          ...selectedData,
          lead: selectedData?.lead?._id,
          nextFollowUpDate: selectedData?.nextFollowUpDate
            ? dayjs(selectedData.nextFollowUpDate).format('YYYY-MM-DD')
            : ''
        }}
        onSubmit={async (data) => {
          if (mode === 'create') {
            await dispatch(createNewFollowUp(data)).unwrap()
            toast.success('Tạo người dùng thành công!')
          } else {
            await dispatch(updateFollowUpById({ _id: selectedData._id, payload: data })).unwrap()
            toast.success('Cập nhật người dùng thành công!')
          }
          dispatch(getAllFollowUps({}))
          setOpenConfirm(false)
        }}
      />

      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Xoá Follow-up"
        content={`Bạn có chắc muốn xoá Follow-up này không?`}
      />
    </Stack>
  )
}

export default FollowUpPage
