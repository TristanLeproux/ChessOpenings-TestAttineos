import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { openingsApi } from '@/api/openings'
import { openingsQueryKey } from '@/hooks/use-openings'
import type { OpeningFormValues } from '@/lib/validations'

export function useCreateOpening() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: OpeningFormValues) => openingsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: openingsQueryKey })
      toast.success('Ouverture créée avec succès.')
    },
    onError: () => {
      toast.error('Impossible de créer l\'ouverture.')
    },
  })
}
