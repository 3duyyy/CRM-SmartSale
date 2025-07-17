import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { axiosInstance } from '@/api/axiosInstance'

interface AuthState {
  userData: any
  accessToken: string | null
  refreshToken: string | null
  loading: boolean
}

const initialState: AuthState = {
  userData: null,
  accessToken: null,
  refreshToken: null,
  loading: false
}

export const loginApi = createAsyncThunk(
  'auth/login',
  async (
    payload: {
      email: string
      password: string
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.post('/auth/login', payload)
      return res.data.userResult
    } catch (err) {
      return rejectWithValue(err || 'Đăng nhập thất bại!')
    }
  }
)

export const registerApi = createAsyncThunk(
  'auth/register',
  async (
    payload: {
      name: string
      email: string
      password: string
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.post('/auth/register', payload)
      return res.data
    } catch (err) {
      return rejectWithValue(err || 'Đăng ký thất bại!')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.userData = null
      state.accessToken = null
      state.refreshToken = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginApi.pending, (state) => {
        state.loading = true
        state.userData = null
      })
      .addCase(loginApi.fulfilled, (state, action) => {
        const { accessToken, refreshToken, userData } = action.payload
        state.loading = false
        state.userData = userData
        state.accessToken = accessToken
        state.refreshToken = refreshToken
      })
      // Register
      .addCase(registerApi.pending, (state) => {
        state.loading = true
        state.userData = null
      })
      .addCase(registerApi.fulfilled, (state, action) => {
        state.loading = false
        state.userData = action.payload.userData
      })
  }
})

export const { logout } = authSlice.actions
export const authReducer = authSlice.reducer
