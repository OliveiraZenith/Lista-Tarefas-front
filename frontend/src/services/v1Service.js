import { api } from './api'

export async function fetchV1Info() {
  const { data } = await api.get('/v1')
  return data?.data ?? data
}