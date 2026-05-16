import axios from 'axios'
import type { Opening, OpeningInput } from '@/types/opening'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export const openingsApi = {
  getAll: () =>
    api.get<Opening[]>('/api/openings').then((r) => r.data),

  getOne: (id: number) =>
    api.get<Opening>(`/api/openings/${id}`).then((r) => r.data),

  create: (data: OpeningInput) =>
    api.post<Opening>('/api/openings', data).then((r) => r.data),

  update: (id: number, data: OpeningInput) =>
    api.put<Opening>(`/api/openings/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/api/openings/${id}`),
}
