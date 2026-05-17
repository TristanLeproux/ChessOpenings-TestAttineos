import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { openingsApi } from '@/api/openings'
import { openingsQueryKey } from '@/hooks/use-openings'

export function useDeleteOpening() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => openingsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: openingsQueryKey })
      toast.success('Ouverture supprimée.')
    },
    onError: () => {
      toast.error('Impossible de supprimer l\'ouverture.')
    },
  })
}
