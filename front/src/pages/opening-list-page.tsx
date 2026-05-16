import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useOpenings } from '@/hooks/use-openings'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Opening } from '@/types/opening'

const COLOR_LABEL: Record<string, string> = {
  white: 'Blancs',
  black: 'Noirs',
}

function MasteryDots({ level }: { level: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`Niveau ${level} sur 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`inline-block size-2 rounded-full ${i < level ? 'bg-primary' : 'bg-muted'}`}
        />
      ))}
    </span>
  )
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b">
      {Array.from({ length: 5 }, (_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded bg-muted" />
        </td>
      ))}
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <div className="h-7 w-14 rounded bg-muted" />
          <div className="h-7 w-16 rounded bg-muted" />
        </div>
      </td>
    </tr>
  )
}

function EmptyState() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <p className="text-4xl">♟</p>
      <p className="text-lg font-medium">Aucune ouverture enregistrée</p>
      <p className="text-sm text-muted-foreground">
        Commencez par ajouter une ouverture à votre répertoire.
      </p>
      <Button onClick={() => navigate('/openings/new')}>
        Ajouter votre première ouverture
      </Button>
    </div>
  )
}

function OpeningRow({ opening, onDeleteClick }: {
  opening: Opening
  onDeleteClick: (opening: Opening) => void
}) {
  const navigate = useNavigate()

  return (
    <tr className="border-b hover:bg-muted/40 transition-colors">
      <td className="px-4 py-3 font-medium">{opening.name}</td>
      <td className="px-4 py-3">
        <Badge variant="outline">{opening.ecoCode}</Badge>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        {COLOR_LABEL[opening.color]}
      </td>
      <td className="px-4 py-3">
        <MasteryDots level={opening.masteryLevel} />
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        {opening.lastStudiedAt ?? '—'}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/openings/${opening.id}/edit`)}
            aria-label={`Modifier ${opening.name}`}
          >
            Modifier
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDeleteClick(opening)}
            aria-label={`Supprimer ${opening.name}`}
          >
            Supprimer
          </Button>
        </div>
      </td>
    </tr>
  )
}

export default function OpeningListPage() {
  const { data: openings, isLoading, isError } = useOpenings()
  const navigate = useNavigate()

  if (isError) {
    toast.error('Impossible de charger les ouvertures.')
  }

  const handleDeleteClick = (opening: Opening) => {
    // La modale de confirmation sera branchée à l'étape 8.
    toast.info(`Suppression de "${opening.name}" — disponible à l'étape 8.`)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Mes ouvertures</h1>
        <Button size="sm" onClick={() => navigate('/openings/new')}>
          + Nouvelle ouverture
        </Button>
      </div>

      {isLoading && (
        <table className="w-full text-sm">
          <thead>
            <TableHead />
          </thead>
          <tbody>
            {Array.from({ length: 4 }, (_, i) => <SkeletonRow key={i} />)}
          </tbody>
        </table>
      )}

      {!isLoading && openings?.length === 0 && <EmptyState />}

      {!isLoading && openings && openings.length > 0 && (
        <table className="w-full text-sm">
          <thead>
            <TableHead />
          </thead>
          <tbody>
            {openings.map((opening) => (
              <OpeningRow
                key={opening.id}
                opening={opening}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

function TableHead() {
  return (
    <tr className="border-b text-left text-muted-foreground">
      <th className="px-4 py-2 font-medium">Nom</th>
      <th className="px-4 py-2 font-medium">ECO</th>
      <th className="px-4 py-2 font-medium">Couleur</th>
      <th className="px-4 py-2 font-medium">Maîtrise</th>
      <th className="px-4 py-2 font-medium">Dernière étude</th>
      <th className="px-4 py-2 font-medium">Actions</th>
    </tr>
  )
}
