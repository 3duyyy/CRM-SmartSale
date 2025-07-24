import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { axiosInstance } from '@/api/axiosInstance'

interface AuthState {
  userData: any
  loading: boolean
}

const initialState: AuthState = {
  userData: null,
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

export const logoutApi = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('/auth/logout')
    return res.data
  } catch (err) {
    return rejectWithValue(err || 'Đăng xuất thất bại!')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginApi.fulfilled, (state, action) => {
        const { userData } = action.payload
        state.loading = false
        state.userData = userData
      })
      // Register
      .addCase(registerApi.fulfilled, (state) => {
        state.loading = false
      })
      // Logout
      .addCase(logoutApi.fulfilled, (state) => {
        state.loading = false
        state.userData = null
        localStorage.clear()
      })
  }
})

export const { setUserData } = authSlice.actions

export const authReducer = authSlice.reducer
