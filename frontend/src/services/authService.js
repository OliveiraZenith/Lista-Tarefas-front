import { api } from './api'

function extractAuthPayload(data) {
  const raw = data?.data ?? data
  const token =
    raw?.token ??
    raw?.accessToken ??
    raw?.access_token ??
    null
  const user =
    raw?.user ??
    raw?.usuario ??
    (raw?.name || raw?.email ? raw : null)
  return { token, user }
}

export async function login({ email, password }) {
  const { data } = await api.post('/auth/login', { email, password })
  return extractAuthPayload(data)
}

export async function register({ name, email, password }) {
  const { data } = await api.post('/auth/register', { name, email, password })
  return extractAuthPayload(data)
}
