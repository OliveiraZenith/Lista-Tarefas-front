import { useCallback, useEffect, useMemo, useState } from 'react'
import { AppContext } from './appContext'
import { setAuthToken } from '../services/api'
import * as authService from '../services/authService'
import * as taskService from '../services/taskService'

const TOKEN_KEY = 'lista_tarefas_token'
const USER_KEY = 'lista_tarefas_user'

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState([])
  const [user, setUser] = useState(() => readStoredUser())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [token, setTokenState] = useState(() => localStorage.getItem(TOKEN_KEY))

  useEffect(() => {
    setAuthToken(token)
  }, [token])

  const setToken = useCallback((value) => {
    setTokenState(value)
    if (value) localStorage.setItem(TOKEN_KEY, value)
    else localStorage.removeItem(TOKEN_KEY)
  }, [])

  const persistUser = useCallback((nextUser) => {
    setUser(nextUser)
    if (nextUser) localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    else localStorage.removeItem(USER_KEY)
  }, [])

  const clearError = useCallback(() => setError(null), [])

  const login = useCallback(
    async (credentials) => {
      setLoading(true)
      setError(null)
      try {
        const { token: nextToken, user: nextUser } =
          await authService.login(credentials)
        if (!nextToken) {
          setError('Resposta de login sem token. Verifique o backend.')
          return false
        }
        setToken(nextToken)
        persistUser(nextUser ?? { email: credentials.email })
        return true
      } catch (e) {
        const msg =
          e.response?.data?.message ?? e.message ?? 'Falha ao entrar.'
        setError(typeof msg === 'string' ? msg : 'Falha ao entrar.')
        return false
      } finally {
        setLoading(false)
      }
    },
    [persistUser, setToken],
  )

  const register = useCallback(async (payload) => {
    setLoading(true)
    setError(null)
    try {
      const { token: nextToken, user: nextUser } =
        await authService.register(payload)
      if (nextToken) {
        setToken(nextToken)
        persistUser(nextUser ?? { name: payload.name, email: payload.email })
        return 'authenticated'
      }
      return 'ok'
    } catch (e) {
      const msg =
        e.response?.data?.message ?? e.message ?? 'Falha no cadastro.'
      setError(typeof msg === 'string' ? msg : 'Falha no cadastro.')
      return 'error'
    } finally {
      setLoading(false)
    }
  }, [persistUser, setToken])

  const logout = useCallback(() => {
    setToken(null)
    persistUser(null)
    setTasks([])
    setFilter('all')
    setError(null)
  }, [persistUser, setToken])

  const loadTasks = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const list = await taskService.fetchTasks()
      setTasks(list)
    } catch (e) {
      const msg =
        e.response?.data?.message ?? e.message ?? 'Não foi possível carregar tarefas.'
      setError(typeof msg === 'string' ? msg : 'Erro ao carregar tarefas.')
    } finally {
      setLoading(false)
    }
  }, [token])

  const addTask = useCallback(async (input) => {
    setError(null)
    try {
      const created = await taskService.createTask(input)
      setTasks((prev) => [created, ...prev])
      return true
    } catch (e) {
      const msg =
        e.response?.data?.message ?? e.message ?? 'Não foi possível criar a tarefa.'
      setError(typeof msg === 'string' ? msg : 'Erro ao criar tarefa.')
      return false
    }
  }, [])

  const saveTask = useCallback(async (id, payload) => {
    setError(null)
    try {
      const updated = await taskService.updateTask(id, payload)
      setTasks((prev) =>
        prev.map((t) => (String(t.id) === String(id) ? updated : t)),
      )
      return true
    } catch (e) {
      const msg =
        e.response?.data?.message ?? e.message ?? 'Não foi possível salvar.'
      setError(typeof msg === 'string' ? msg : 'Erro ao salvar tarefa.')
      return false
    }
  }, [])

  const removeTask = useCallback(async (id) => {
    setError(null)
    try {
      await taskService.deleteTask(id)
      setTasks((prev) => prev.filter((t) => String(t.id) !== String(id)))
      return true
    } catch (e) {
      const msg =
        e.response?.data?.message ?? e.message ?? 'Não foi possível excluir.'
      setError(typeof msg === 'string' ? msg : 'Erro ao excluir.')
      return false
    }
  }, [])

  const toggleComplete = useCallback(
    async (id, completed) => {
      await saveTask(id, { completed })
    },
    [saveTask],
  )

  const value = useMemo(
    () => ({
      tasks,
      user,
      loading,
      error,
      filter,
      token,
      setFilter,
      clearError,
      login,
      register,
      logout,
      loadTasks,
      addTask,
      saveTask,
      removeTask,
      toggleComplete,
    }),
    [
      tasks,
      user,
      loading,
      error,
      filter,
      token,
      clearError,
      login,
      register,
      logout,
      loadTasks,
      addTask,
      saveTask,
      removeTask,
      toggleComplete,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
