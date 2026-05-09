import { useState } from 'react'

function EditTaskModalInner({ task, onClose, onSave }) {
  const [title, setTitle] = useState(() => task.title ?? '')
  const [description, setDescription] = useState(() => task.description ?? '')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const t = title.trim()
    if (!t) return
    setSaving(true)
    try {
      await onSave(task.id, { title: t, description: description.trim() })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-task-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="edit-task-title">Editar tarefa</h2>
          <button
            type="button"
            className="btn btn-icon"
            onClick={onClose}
            aria-label="Fechar"
          >
            ×
          </button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <label className="field">
            <span>Título</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </label>
          <label className="field">
            <span>Descrição</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </label>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Salvando…' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function EditTaskModal({ task, open, onClose, onSave }) {
  if (!open || !task) return null
  return (
    <EditTaskModalInner
      key={task.id}
      task={task}
      onClose={onClose}
      onSave={onSave}
    />
  )
}
