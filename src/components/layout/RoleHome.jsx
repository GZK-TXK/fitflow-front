import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

const DashboardPage = lazy(() => import('../../pages/DashboardPage.jsx'))

export default function RoleHome() {
  const { user } = useAuth()

  if (user?.role === 'CLIENT') {
    return <Navigate to="/portal" replace />
  }

  return <DashboardPage />
}