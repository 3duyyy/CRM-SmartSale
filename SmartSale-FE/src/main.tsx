import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/router/router'
import { ToastContainer } from 'react-toastify'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { injectStore } from './api/axiosInstance'

const persistor = persistStore(store)
// Sử dụng dữ liệu từ redux store trong file axios
injectStore(store)

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        draggable
        pauseOnHover
        theme="light"
      />
    </PersistGate>
  </Provider>
)
