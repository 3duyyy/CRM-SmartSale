import { combineReducers, configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { authReducer } from '@/features/auth/authSlice'
import { persistReducer } from 'redux-persist'
import { leadReducer } from '@/features/opportunities/leadSlice'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'] // chỉ lưu slice 'auth'
}

const rootReducer = combineReducers({
  auth: authReducer,
  leads: leadReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,

  // fix khi implement redux-persist
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>
export type Dispatch = typeof store.dispatch
