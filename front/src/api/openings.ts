import axios from 'axios'
import type { Opening } from '@/types/opening'
import type { OpeningFormValues } from '@/lib/validations'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export const openingsApi = {
  getAll: () =>
    api.get<Opening[]>('/api/openings').then((r) => r.data),

  getOne: (id: number) =>
    api.get<Opening>(`/api/openings/${id}`).then((r) => r.data),

  create: (data: OpeningFormValues) =>
    api.post<Opening>('/api/openings', data).then((r) => r.data),

  update: (id: number, data: OpeningFormValues) =>
    api.put<Opening>(`/api/openings/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/api/openings/${id}`),

  analyze: (id: number) =>
    api.post<{ analysis: string }>(`/api/openings/${id}/analyze`).then((r) => r.data),
}
