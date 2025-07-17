import { store } from '@/redux/store'
import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_HOST_URL}/api`,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState()
    const token = state.auth?.accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    return Promise.reject(error)
  }
)
