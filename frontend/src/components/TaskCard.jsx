export default function TaskCard({
  task,
  onComplete,
  onEdit,
  onDelete,
}) {
  const statusLabel = task.completed ? 'Concluída' : 'Pendente'
  const statusClass = task.completed ? 'tag tag-done' : 'tag tag-pending'

  return (
    <article className={`task-card ${task.completed ? 'task-card--done' : ''}`}>
      <div className="task-card-body">
        <h3 className="task-card-title">{task.title}</h3>
        {task.description ? (
          <p className="task-card-desc">{task.description}</p>
        ) : null}
        <span className={statusClass}>{statusLabel}</span>
      </div>
      <div className="task-card-actions">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => onComplete(task)}
          disabled={task.completed}
        >
          Concluir
        </button>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => onEdit(task)}
        >
          Editar
        </button>
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(task)}
        >
          Excluir
        </button>
      </div>
    </article>
  )
}
