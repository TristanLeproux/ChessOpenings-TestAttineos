import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { openingsApi } from '@/api/openings'

export function useAnalyzeOpening() {
  return useMutation({
    mutationFn: (id: number) => openingsApi.analyze(id),
    onError: () => {
      toast.error('Impossible de contacter l\'API d\'analyse.')
    },
  })
}
