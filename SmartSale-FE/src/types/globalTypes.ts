// Lead
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
// Role
export interface Role {
  _id: string
  name: string
  description: string
  permissions: {
    _id: string
    name: string
    description: string
  }[]
}
