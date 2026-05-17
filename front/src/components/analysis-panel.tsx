import { Button } from '@/components/ui/button'
import { useAnalyzeOpening } from '@/hooks/use-analyze-opening'

interface AnalysisPanelProps {
  openingId: number
  openingName: string
}

export function AnalysisPanel({ openingId, openingName }: AnalysisPanelProps) {
  const mutation = useAnalyzeOpening()

  return (
    <div className="mt-10 border-t pt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Analyse IA</h2>
          <p className="text-sm text-muted-foreground">
            Analyse de <span className="font-medium text-foreground">{openingName}</span> par Claude
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => mutation.mutate(openingId)}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Analyse en cours…' : mutation.data ? 'Relancer' : 'Analyser'}
        </Button>
      </div>

      {mutation.isPending && (
        <div className="space-y-2 animate-pulse">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-4 rounded bg-muted" style={{ width: `${85 - i * 10}%` }} />
          ))}
        </div>
      )}

      {mutation.data && !mutation.isPending && (
        <>
          <div className="rounded-lg border bg-muted/30 p-4 text-sm leading-relaxed whitespace-pre-wrap">
            {mutation.data.analysis}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Analyse générée par IA sur la base du nom et du code ECO — à recouper avec une source fiable pour les variantes précises.
          </p>
        </>
      )}
    </div>
  )
}
