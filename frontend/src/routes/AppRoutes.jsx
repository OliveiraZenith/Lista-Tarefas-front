import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import Register from '../pages/Register'
import GuestRoute from './GuestRoute'
import ProtectedRoute from './ProtectedRoute'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/tarefas" element={<Dashboard />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/tarefas" replace />} />
      <Route path="*" element={<Navigate to="/tarefas" replace />} />
    </Routes>
  )
}
