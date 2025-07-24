import { axiosInstance } from './axiosInstance'

export const refreshTokenAPI = async () => {
  const res = await axiosInstance.post('/auth/refresh-token')
  return res.data
}

export const getMe = async () => {
  const res = await axiosInstance.get('/auth/me')
  return res.data
}
