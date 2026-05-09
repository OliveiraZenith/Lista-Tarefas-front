import { Link } from 'react-router-dom'
import { useApp } from '../hooks/useApp'

export default function Navbar() {
  const { user, logout } = useApp()
  const displayName = user?.name ?? user?.nome ?? user?.email ?? 'Usuário'

  return (
    <header className="navbar">
      <Link to="/tarefas" className="navbar-brand">
        Lista de tarefas
      </Link>
      <div className="navbar-actions">
        <span className="navbar-user" title={user?.email}>
          {displayName}
        </span>
        <button type="button" className="btn btn-ghost" onClick={logout}>
          Sair
        </button>
      </div>
    </header>
  )
}
