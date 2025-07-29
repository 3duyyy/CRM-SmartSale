import { createBrowserRouter, Navigate } from 'react-router-dom'
import ProtectedRoute from '@/router/ProtectedRoute'
import NotFound from '@/pages/NotFound'
import AuthPage from '@/features/auth/pages/AuthPage'
import MainLayout from '@/layouts/MainLayout'
import PublicRoute from './PublicRoute'
import Dashboard from '@/features/dashboard/page/Dashboard'
import OpportunitiesPage from '@/features/opportunities/pages/OpportunitiesPage'
import AdminRoute from './AdminRoute'
import UserManagement from '@/features/users/pages/UserManagement'
import FollowUpPage from '@/features/follow-up/pages/FollowUpPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '',
            element: <Navigate to="/dashboards" replace={true} />
          },
          {
            path: 'dashboards',
            element: <Dashboard />
          },
          {
            path: 'opportunities',
            element: <OpportunitiesPage />
          },
          {
            path: 'follow-ups',
            element: <FollowUpPage />
          },
          {
            element: <AdminRoute />,
            children: [
              {
                path: 'users',
                element: <UserManagement />
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/auth',
    element: <PublicRoute />,
    children: [
      {
        path: ':type',
        element: <AuthPage />
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />
  },
  {
    path: '/404',
    element: <NotFound />
  }
])
