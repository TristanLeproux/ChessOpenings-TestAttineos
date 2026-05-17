import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { openingsApi } from '@/api/openings'
import { openingsQueryKey } from '@/hooks/use-openings'
import type { OpeningFormValues } from '@/lib/validations'

export function useUpdateOpening(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: OpeningFormValues) => openingsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: openingsQueryKey })
      toast.success('Ouverture mise à jour.')
    },
    onError: () => {
      toast.error('Impossible de mettre à jour l\'ouverture.')
    },
  })
}
