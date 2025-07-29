import { axiosInstance } from '@/api/axiosInstance'
import { Lead } from '@/types/globalTypes'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

interface InitialState {
  all: Lead[]
  reload: boolean
  search: string
  statusFilter: string
  assigneeFilter: string
}

export const getAllLeads = createAsyncThunk<Lead[], { search?: string; status?: string; assignedTo?: string }>(
  '/leads',
  async (params = {}) => {
    const res = await axiosInstance.get('/leads', { params })
    return res.data?.data
  }
)

// update lead (status để kéo thả giữa các column)
export const updateLeadById = createAsyncThunk<
  Lead,
  { _id: string; payload: Omit<Partial<Lead>, 'assignedTo'> & { assignedTo?: string } }
>(`/lead/update`, async ({ _id, payload }) => {
  const res = await axiosInstance.put(`/leads/${_id}`, payload)
  return res.data?.data
})

// Omit là type dùng để tạo ra một kiểu mới từ một kiểu đã có, nhưng loại bỏ đi một hoặc nhiều thuộc tính chỉ định
export const createNewLead = createAsyncThunk<
  Lead,
  Omit<Lead, '_id' | 'order' | 'assignedTo' | 'createdBy'> & { assignedTo: string }
>('/leads/create', async (payload) => {
  const res = await axiosInstance.post('/leads', payload)
  return res.data
})

export const deleteLeadById = createAsyncThunk<string, string>('/leads/delete', async (id) => {
  const res = await axiosInstance.delete(`/leads/${id}`)
  return res.data
})

export const sendMailToLead = createAsyncThunk<
  { success: boolean; message: string },
  Pick<Lead, 'email' | 'name' | 'company' | 'value' | 'status'>
>('/leads/sendMail', async (payload) => {
  const res = await axiosInstance.post('/leads/send-email', payload)
  return res.data
})

export const dragLead = createAsyncThunk<
  { message: string },
  {
    leadId: string
    source: { status: string; order: number }
    destination: { status: string; order: number }
  }
>('/leads/drag', async (payload) => {
  const res = await axiosInstance.put('/leads/drag', payload)
  return res.data
})

const initialState: InitialState = {
  all: [],
  reload: false,
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
    },
    updateLocalLeadsAfterDrag: (state, action) => {
      state.all = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Get All
      .addCase(getAllLeads.fulfilled, (state, action) => {
        state.all = action.payload
        state.reload = false
      })
      // Update
      .addCase(updateLeadById.fulfilled, (state, action) => {
        const updatedData = action.payload
        const indexUpdate = state.all.findIndex((lead) => lead._id === updatedData._id)
        if (indexUpdate !== -1) state.all[indexUpdate] = updatedData
      })
      // Create
      .addCase(createNewLead.fulfilled, (state, action) => {
        state.all.push(action.payload)
      })
      // Delete
      .addCase(deleteLeadById.fulfilled, (state) => {
        state.reload = true
      })
      // Send Email
      .addCase(sendMailToLead.fulfilled, (state, action) => {
        toast.success(action.payload.message)
      })
      .addCase(dragLead.fulfilled, (state, action) => {
        toast.success(action.payload.message || 'Kéo thả thành công')
        state.reload = true
      })
  }
})

export const filterLeads = (leads: Lead[], search: string, status: string, assignee: string) => {
  return leads.filter(
    (lead) =>
      search === '' ||
      (lead.name.toLowerCase().includes(search.toLowerCase()) &&
        (status === '' || lead.status === status) &&
        (assignee === '' || lead.assignedTo.name === assignee))
  )
}

export const { setSearch, setStatusFilter, setAssigneeFilter } = leadSlice.actions
export const leadReducer = leadSlice.reducer
