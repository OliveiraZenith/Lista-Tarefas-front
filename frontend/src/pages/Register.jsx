import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp'

export default function Register() {
  const { register, loading, error, clearError } = useApp()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [localError, setLocalError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    clearError()
    setLocalError(null)
    if (password !== confirm) {
      setLocalError('As senhas não conferem.')
      return
    }
    const result = await register({
      name: name.trim(),
      email: email.trim(),
      password,
    })
    if (result === 'authenticated') {
      navigate('/tarefas', { replace: true })
      return
    }
    if (result === 'ok') {
      navigate('/login', { replace: true })
      return
    }
  }

  const showError = localError || error

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Cadastro</h1>
        <p className="auth-lead">Crie sua conta para começar.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {showError ? (
            <div className="alert alert-error" role="alert">
              {showError}
            </div>
          ) : null}

          <label className="field">
            <span>Nome</span>
            <input
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>E-mail</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Senha</span>
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </label>

          <label className="field">
            <span>Confirmar senha</span>
            <input
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Cadastrando…' : 'Cadastrar'}
          </button>
        </form>

        <p className="auth-footer">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  )
}
