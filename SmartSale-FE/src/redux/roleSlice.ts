import { axiosInstance } from '@/api/axiosInstance'
import { Role } from '@/types/globalTypes'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface InitialState {
  roles: Role[]
  loading: boolean
}

const initialState: InitialState = {
  roles: [],
  loading: false
}

export const getAllRoles = createAsyncThunk<Role[]>('/roles/getAll', async () => {
  const res = await axiosInstance.get('/roles')
  return res.data
})

const roleSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllRoles.fulfilled, (state, action) => {
      state.roles = action.payload
    })
  }
})

export const roleReducer = roleSlice.reducer
