import { logoutApi } from '@/features/auth/authSlice'
import axios from 'axios'
import { toast } from 'react-toastify'
import { refreshTokenAPI } from '.'

let axiosReduxStore
export const injectStore = (mainStore) => {
  axiosReduxStore = mainStore
}

export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_HOST_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

// Xử lý or update request trước khi request gửi lên server
axiosInstance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Tạo 1 Promise để khi nhận status 401 sẽ lưu vào và retry lại sau khi call API refreshToken
let refreshTokenPromise = null

// Xử lý response trả về từ server
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    const message = error?.response?.data?.message
    console.log('error: ', error)

    if (error?.response.status === 401 && message === 'Access token expired!' && !originalRequest._retry) {
      // Là field tự custom để đánh dấu request đã được retry
      originalRequest._retry = true

      // Nếu chưa có request refreshToken nào đang gọi thì call API
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then(() => {
            return true
          })
          .catch(() => {
            axiosReduxStore.dispatch(logoutApi())
            toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!')
            window.location.href = '/auth/login'
          })
          .finally(() => {
            // Luôn set về null
            refreshTokenPromise = null
          })
        return refreshTokenPromise.then(() => {
          // Retry lại request cũ
          return axiosInstance(originalRequest)
        })
      }
    }

    if (error?.response.status === 401 && (message === 'Refresh Token expired!' || message === 'Unauthorized!')) {
      await axiosReduxStore.dispatch(logoutApi())
      toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!')
      window.location.href = '/auth/login'
      return Promise.reject(error)
    }

    // Set default message
    let errorMessage = error?.message
    if (message) {
      errorMessage = message
    }
    toast.error(errorMessage)
    return Promise.reject(error)
  }
)
