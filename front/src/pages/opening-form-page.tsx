import { useParams } from 'react-router-dom'

export default function OpeningFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEditing = id !== undefined

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Modifier une ouverture' : 'Nouvelle ouverture'}
      </h1>
      <p className="text-muted-foreground">Le formulaire arrivera à l'étape 7.</p>
    </div>
  )
}
