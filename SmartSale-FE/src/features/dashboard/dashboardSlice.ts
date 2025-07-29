import { axiosInstance } from '@/api/axiosInstance'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface UserStat {
  _id: string
  name: string
  processing: number
  closed: number
  cancelled: number
}

interface InitialState {
  totalLeads: number
  totalFollowUps: number
  userStats: UserStat[]
  closeRate: number
  searchUser: string
}

const initialState: InitialState = {
  totalLeads: 0,
  totalFollowUps: 0,
  userStats: [],
  closeRate: 0,
  searchUser: ''
}

export const getDashBoardStats = createAsyncThunk(
  '/dashboards/getDashBoardStats',
  async (params: { search?: string }) => {
    const res = await axiosInstance.get('/dashboards', { params })
    return res.data
  }
)

const dashboardSlice = createSlice({
  name: 'dashboards',
  initialState: initialState,
  reducers: {
    setSearchUser: (state, action) => {
      state.searchUser = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getDashBoardStats.fulfilled, (state, action) => {
      state.totalLeads = action.payload.totalLeads
      state.totalFollowUps = action.payload.totalFollowUps
      state.userStats = action.payload.userStats
      state.closeRate = action.payload.closeRate
    })
  }
})

export const { setSearchUser } = dashboardSlice.actions
export const dashboardReducer = dashboardSlice.reducer
