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

export interface InitialState {
  users: User[]
  loading: boolean
  reload: boolean
}

const initialState: InitialState = {
  users: [],
  loading: false,
  reload: false
}

export const getAllUsers = createAsyncThunk<User[]>('/users/getAll', async () => {
  const res = await axiosInstance.get('/users')
  return res.data?.data
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get All
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload
        state.reload = false
      })
      // Update
      .addCase(updateUserById.fulfilled, (state, action) => {
        const updatedData = action.payload
        const indexUpdate = state.users.findIndex((user) => user._id === updatedData._id)
        if (indexUpdate !== -1) state.users[indexUpdate] = updatedData
      })
      // Create
      .addCase(createNewUser.fulfilled, (state, action) => {
        state.users.push(action.payload)
      })
      // Delete
      .addCase(deleteUserById.fulfilled, (state) => {
        state.reload = true
      })
  }
})

export const userReducer = userSlice.reducer
