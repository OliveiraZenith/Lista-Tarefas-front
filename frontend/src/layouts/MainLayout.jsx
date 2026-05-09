import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../styles/layout.css'

export default function MainLayout() {
  return (
    <div className="layout-root">
      <Navbar />
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  )
}
