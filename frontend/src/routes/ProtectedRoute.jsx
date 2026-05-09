import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../hooks/useApp'

export default function ProtectedRoute() {
  const { token } = useApp()
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
