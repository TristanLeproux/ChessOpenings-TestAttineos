import { useQuery } from '@tanstack/react-query'
import { openingsApi } from '@/api/openings'

export const openingsQueryKey = ['openings'] as const

export function useOpenings() {
  return useQuery({
    queryKey: openingsQueryKey,
    queryFn: openingsApi.getAll,
    staleTime: 10_000,
  })
}
