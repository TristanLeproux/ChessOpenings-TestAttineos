import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { openingsApi } from '@/api/openings'
import { OpeningForm } from '@/components/opening-form'
import { AnalysisPanel } from '@/components/analysis-panel'

function FormSkeleton() {
  return (
    <div className="max-w-lg space-y-5 animate-pulse">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="space-y-1">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-8 w-full rounded bg-muted" />
        </div>
      ))}
    </div>
  )
}

export default function OpeningFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEditing = id !== undefined

  const { data: opening, isLoading } = useQuery({
    queryKey: ['openings', Number(id)],
    queryFn: () => openingsApi.getOne(Number(id)),
    enabled: isEditing,
  })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Modifier une ouverture' : 'Nouvelle ouverture'}
      </h1>

      {isEditing && isLoading ? (
        <FormSkeleton />
      ) : (
        <>
          <OpeningForm initialData={isEditing ? opening : undefined} />
          {isEditing && opening && (
            <AnalysisPanel openingId={opening.id} openingName={opening.name} />
          )}
        </>
      )}
    </div>
  )
}
