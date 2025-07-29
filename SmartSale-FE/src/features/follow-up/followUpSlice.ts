import { axiosInstance } from '@/api/axiosInstance'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface FollowUp {
  _id: string
  lead: {
    _id: string
    name: string
    email?: string
  }
  user: {
    _id: string
    name: string
    email?: string
  }
  type: 'CALL' | 'MESSAGE'
  content: string
  nextFollowUpDate?: string
  status: 'Chưa xử lý' | 'Đã hoàn thành' | 'Thất bại'
  createdAt: string
  updatedAt: string
}

export interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
  isPagination: boolean
}

export interface GetAllFollowUps {
  data: FollowUp[]
  pagination: Pagination
}

export interface InitialState {
  data: FollowUp[]
  loading: boolean
  searchTerm: string
  statusFilter: string
  pagination: Pagination
  reload: boolean
}

const initialState: InitialState = {
  data: [],
  loading: false,
  searchTerm: '',
  statusFilter: '',
  pagination: {
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0,
    isPagination: true
  },
  reload: false
}

export const getAllFollowUps = createAsyncThunk<
  GetAllFollowUps,
  { search?: string; status?: string; page?: number; limit?: number; isPagination?: boolean }
>('/follow-ups/getAll', async (params = {}) => {
  const res = await axiosInstance.get('/follow-ups', { params })
  return res.data
})

export const updateFollowUpById = createAsyncThunk<FollowUp, { _id: string; payload: Partial<FollowUp> }>(
  '/follow-ups/update',
  async ({ _id, payload }) => {
    const res = await axiosInstance.put(`/follow-ups/${_id}`, payload)
    return res.data
  }
)

export const createNewFollowUp = createAsyncThunk<FollowUp, Partial<FollowUp>>(
  '/follow-ups/create',
  async (payload) => {
    const res = await axiosInstance.post('/follow-ups', payload)
    return res.data
  }
)

export const deleteFollowUpById = createAsyncThunk<string, string>('/follow-ups/delete', async (id) => {
  const res = await axiosInstance.delete(`/follow-ups/${id}`)
  return res.data
})

const followUpSlice = createSlice({
  name: 'followUps',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload
    },
    setReload: (state, action) => {
      state.reload = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Get All
      .addCase(getAllFollowUps.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.pagination = action.payload.pagination
        state.reload = false
        state.loading = false
      })
      // Update
      .addCase(updateFollowUpById.fulfilled, (state, action) => {
        const index = state.data.findIndex((f) => f._id === action.payload._id)
        if (index !== -1) {
          state.data[index] = action.payload
        }
      })
      // Create
      .addCase(createNewFollowUp.fulfilled, (state, action) => {
        state.data.push(action.payload)
      })
      // Delete
      .addCase(deleteFollowUpById.fulfilled, (state) => {
        state.reload = true
      })
  }
})

export const { setSearchTerm, setStatusFilter, setReload } = followUpSlice.actions
export const followUpReducer = followUpSlice.reducer
