import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchV1Info } from '../services/v1Service'

export default function V1Page() {
  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const data = await fetchV1Info()
        if (active) setInfo(data)
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message ?? err.message ?? 'Erro ao carregar a rota v1.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    load()

    return () => {
      active = false
    }
  }, [])

  return (
    <section className="card v1-page">
      <header className="dashboard-header">
        <h1>Rota v1</h1>
        <p className="dashboard-sub">Página simples consumindo o backend.</p>
      </header>

      {loading ? <p className="muted">Carregando…</p> : null}

      {error ? (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      ) : null}

      {info ? (
        <div className="v1-result">
          <p>
            <strong>Mensagem:</strong> {info.message ?? info.mensagem ?? 'Resposta recebida.'}
          </p>
          {info.chamada_em ? (
            <p>
              <strong>Chamada em:</strong> {info.chamada_em}
            </p>
          ) : null}
        </div>
      ) : null}

      <Link to="/tarefas" className="btn btn-ghost v1-back-link">
        Voltar para a home
      </Link>
    </section>
  )
}