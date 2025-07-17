import { axiosInstance } from '@/api/axiosInstance'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface Lead {
  _id: string
  name: string
  company: string | null
  email: string
  phone: string
  status: string
  value: number
  note: string
  assignedTo: {
    _id: string
    name: string
    email: string
  }
  createdBy: string
  order: number
}

interface InitialState {
  all: Lead[]
  filtered: Lead[]
  search: string
  statusFilter: string
  assigneeFilter: string
}

export const getAllLeads = createAsyncThunk<Lead[]>('/leads', async () => {
  const res = await axiosInstance.get('/leads')
  return res.data?.data
})

// update lead (status để kéo thả giữa các column)
export const updateLeadById = createAsyncThunk<Lead, { _id: string; payload: Partial<Lead> }>(
  `/lead/update`,
  async ({ _id, payload }) => {
    const res = await axiosInstance.put(`/leads/${_id}`, payload)
    console.log(res)
    return res.data?.data
  }
)

const initialState: InitialState = {
  all: [],
  filtered: [],
  search: '',
  statusFilter: '',
  assigneeFilter: ''
}

const leadSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload
    },
    setAssigneeFilter: (state, action) => {
      state.assigneeFilter = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllLeads.fulfilled, (state, action) => {
        state.all = action.payload
      })
      .addCase(updateLeadById.fulfilled, (state, action) => {
        const updated = action.payload
        const index = state.all.findIndex((lead) => lead._id === updated._id)
        if (index !== -1) state.all[index] = updated
      })
  }
})

export const filterLeads = (leads: Lead[], search: string, status: string, assignee: string) => {
  return leads.filter(
    (lead) =>
      (search === '' ||
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.company.toLowerCase().includes(search.toLowerCase())) &&
      (status === '' || lead.status === status) &&
      (assignee === '' || lead.assignedTo.name === assignee)
  )
}

export const { setSearch, setStatusFilter, setAssigneeFilter } = leadSlice.actions
export const leadReducer = leadSlice.reducer
