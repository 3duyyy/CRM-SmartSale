import { axiosInstance } from '@/api/axiosInstance'
import { Role } from '@/types/globalTypes'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface User {
  _id: string
  name: string
  email: string
  password: string
  roles: Role
}

export interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
  isPagination: boolean
}

export interface GetAllUsers {
  data: User[]
  pagination: Pagination
}

export interface InitialState {
  data: User[]
  loading: boolean
  searchUser: string
  roleFilter: string
  pagination: Pagination
  reload: boolean
}

const initialState: InitialState = {
  data: [],
  loading: false,
  searchUser: '',
  roleFilter: '',
  pagination: {
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0,
    isPagination: true
  },
  reload: false
}

export const getAllUsers = createAsyncThunk<
  GetAllUsers,
  { searchUser?: string; role?: string; page?: number; limit?: number; isPagination?: boolean }
>('/users/getAll', async (params = {}) => {
  const res = await axiosInstance.get('/users', { params })
  return res.data
})

export const updateUserById = createAsyncThunk<User, { _id: string; payload: Partial<User> }>(
  '/users/update',
  async ({ _id, payload }) => {
    const res = await axiosInstance.put(`/users/${_id}`, payload)
    return res.data
  }
)

export const createNewUser = createAsyncThunk<User, Partial<User>>('/users/create', async (payload) => {
  const res = await axiosInstance.post('/users', payload)
  return res.data
})

export const deleteUserById = createAsyncThunk<string, string>('/users/delete', async (id) => {
  const res = await axiosInstance.delete(`/users/${id}`)
  return res.data
})

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSearchUser: (state, action) => {
      state.searchUser = action.payload
    },
    setRoleFilter: (state, action) => {
      state.roleFilter = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Get All
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.pagination = action.payload.pagination
        state.reload = false
      })
      // Update
      .addCase(updateUserById.fulfilled, (state, action) => {
        const updatedData = action.payload
        const indexUpdate = state.data.findIndex((user) => user._id === updatedData._id)
        if (indexUpdate !== -1) state.data[indexUpdate] = updatedData
      })
      // Create
      .addCase(createNewUser.fulfilled, (state, action) => {
        state.data.push(action.payload)
      })
      // Delete
      .addCase(deleteUserById.fulfilled, (state) => {
        state.reload = true
      })
  }
})

export const { setSearchUser, setRoleFilter } = userSlice.actions
export const userReducer = userSlice.reducer
