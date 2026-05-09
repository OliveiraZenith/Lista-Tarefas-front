import { Navigate, Outlet } from 'react-router-dom'
import { useApp } from '../hooks/useApp'

export default function GuestRoute() {
  const { token } = useApp()
  if (token) return <Navigate to="/tarefas" replace />
  return <Outlet />
}
