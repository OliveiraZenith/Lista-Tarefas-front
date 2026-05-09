import { api } from './api'

function normalizeTask(raw) {
  if (!raw || typeof raw !== 'object') return raw
  const completed =
    raw.completed ??
    raw.concluida ??
    raw.done ??
    (raw.status === 'completed' || raw.status === 'concluida' || raw.status === 'done')
  return {
    id: raw.id ?? raw._id,
    title: raw.title ?? raw.titulo ?? '',
    description: raw.description ?? raw.descricao ?? '',
    completed: Boolean(completed),
  }
}

export async function fetchTasks() {
  const { data } = await api.get('/tasks')
  const list = Array.isArray(data) ? data : data?.tasks ?? data?.data ?? []
  return list.map(normalizeTask)
}

export async function createTask({ title, description }) {
  const { data } = await api.post('/tasks', { title, description })
  const task = data?.task ?? data?.data ?? data
  return normalizeTask(task)
}

export async function updateTask(id, payload) {
  const body = { ...payload }
  const { data } = await api.patch(`/tasks/${id}`, body)
  const task = data?.task ?? data?.data ?? data
  return normalizeTask(task)
}

export async function deleteTask(id) {
  await api.delete(`/tasks/${id}`)
}
