import { useEffect, useMemo, useState } from 'react'
import EditTaskModal from '../components/EditTaskModal'
import TaskCard from '../components/TaskCard'
import { useApp } from '../hooks/useApp'

export default function Dashboard() {
  const {
    tasks,
    filter,
    setFilter,
    loading,
    error,
    clearError,
    loadTasks,
    addTask,
    saveTask,
    removeTask,
    toggleComplete,
  } = useApp()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const filtered = useMemo(() => {
    if (filter === 'completed') return tasks.filter((t) => t.completed)
    if (filter === 'pending') return tasks.filter((t) => !t.completed)
    return tasks
  }, [tasks, filter])

  async function handleCreate(e) {
    e.preventDefault()
    clearError()
    const t = title.trim()
    if (!t) return
    const ok = await addTask({ title: t, description: description.trim() })
    if (ok) {
      setTitle('')
      setDescription('')
    }
  }

  function handleComplete(task) {
    clearError()
    toggleComplete(task.id, true)
  }

  async function handleDelete(task) {
    clearError()
    if (window.confirm(`Excluir “${task.title}”?`)) {
      await removeTask(task.id)
    }
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Tarefas</h1>
        <p className="dashboard-sub">Organize o que precisa ser feito.</p>
      </header>

      <form className="task-create card" onSubmit={handleCreate}>
        <h2 className="sr-only">Nova tarefa</h2>
        <div className="task-create-grid">
          <label className="field">
            <span>Título</span>
            <input
              type="text"
              placeholder="O que você precisa fazer?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label className="field field-grow">
            <span>Descrição (opcional)</span>
            <input
              type="text"
              placeholder="Detalhes…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <div className="task-create-submit">
            <button type="submit" className="btn btn-primary">
              Adicionar
            </button>
          </div>
        </div>
      </form>

      {error ? (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      ) : null}

      <div className="filter-bar">
        <span className="filter-label">Filtro:</span>
        <div className="filter-buttons">
          <button
            type="button"
            className={filter === 'all' ? 'btn btn-filter active' : 'btn btn-filter'}
            onClick={() => setFilter('all')}
          >
            Todas
          </button>
          <button
            type="button"
            className={
              filter === 'completed' ? 'btn btn-filter active' : 'btn btn-filter'
            }
            onClick={() => setFilter('completed')}
          >
            Concluídas
          </button>
          <button
            type="button"
            className={
              filter === 'pending' ? 'btn btn-filter active' : 'btn btn-filter'
            }
            onClick={() => setFilter('pending')}
          >
            Pendentes
          </button>
        </div>
      </div>

      {loading && tasks.length === 0 ? (
        <p className="muted">Carregando…</p>
      ) : null}

      {!loading && filtered.length === 0 ? (
        <p className="empty-state">
          {tasks.length === 0
            ? 'Nenhuma tarefa ainda. Crie a primeira acima.'
            : 'Nenhuma tarefa neste filtro.'}
        </p>
      ) : (
        <ul className="task-list">
          {filtered.map((task) => (
            <li key={task.id}>
              <TaskCard
                task={task}
                onComplete={handleComplete}
                onEdit={setEditing}
                onDelete={handleDelete}
              />
            </li>
          ))}
        </ul>
      )}

      <EditTaskModal
        task={editing}
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        onSave={saveTask}
      />
    </div>
  )
}
