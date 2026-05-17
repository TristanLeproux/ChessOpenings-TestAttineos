import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { openingSchema, openingDefaults, type OpeningFormValues } from '@/lib/validations'
import { useCreateOpening } from '@/hooks/use-create-opening'
import { useUpdateOpening } from '@/hooks/use-update-opening'
import type { Opening } from '@/types/opening'

interface OpeningFormProps {
  initialData?: Opening
}

export function OpeningForm({ initialData }: OpeningFormProps) {
  const navigate = useNavigate()
  const isEditing = initialData !== undefined

  const createMutation = useCreateOpening()
  const updateMutation = useUpdateOpening(initialData?.id ?? 0)
  const mutation = isEditing ? updateMutation : createMutation

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OpeningFormValues>({
    resolver: zodResolver(openingSchema),
    defaultValues: openingDefaults,
  })

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        color: initialData.color,
        ecoCode: initialData.ecoCode,
        masteryLevel: initialData.masteryLevel,
        lastStudiedAt: initialData.lastStudiedAt,
        notes: initialData.notes,
      })
    }
  }, [initialData, reset])

  const onSubmit = (data: OpeningFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => navigate('/openings'),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-5" noValidate>
      <div className="space-y-1">
        <Label htmlFor="name">Nom</Label>
        <Input id="name" {...register('name')} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label>Couleur</Label>
        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir une couleur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="white">Blancs</SelectItem>
                <SelectItem value="black">Noirs</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.color && (
          <p className="text-sm text-destructive">{errors.color.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="ecoCode">Code ECO</Label>
        <Input
          id="ecoCode"
          {...register('ecoCode', { setValueAs: (v: string) => String(v).toUpperCase() })}
          maxLength={3}
          placeholder="ex: D45"
          className="uppercase"
        />
        {errors.ecoCode && (
          <p className="text-sm text-destructive">{errors.ecoCode.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label>Niveau de maîtrise</Label>
        <Controller
          name="masteryLevel"
          control={control}
          render={({ field }) => (
            <Select
              value={String(field.value)}
              onValueChange={(v) => field.onChange(Number(v))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir un niveau" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} / 5
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.masteryLevel && (
          <p className="text-sm text-destructive">{errors.masteryLevel.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="lastStudiedAt">
          Dernière étude{' '}
          <span className="text-muted-foreground text-xs">(optionnel)</span>
        </Label>
        <Input id="lastStudiedAt" type="date" {...register('lastStudiedAt')} />
        {errors.lastStudiedAt && (
          <p className="text-sm text-destructive">{errors.lastStudiedAt.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="notes">
          Notes{' '}
          <span className="text-muted-foreground text-xs">(optionnel)</span>
        </Label>
        <Textarea id="notes" rows={4} {...register('notes')} />
        {errors.notes && (
          <p className="text-sm text-destructive">{errors.notes.message}</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending
            ? 'Enregistrement…'
            : isEditing
              ? 'Mettre à jour'
              : 'Créer'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/openings')}
        >
          Annuler
        </Button>
      </div>
    </form>
  )
}
