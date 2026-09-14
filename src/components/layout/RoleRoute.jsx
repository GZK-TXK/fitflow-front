import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

export default function RoleRoute({ allow = [] }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!allow.includes(user?.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}