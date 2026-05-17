import { z } from 'zod'

export const openingSchema = z.object({
  name: z.string().min(2, 'Le nom doit faire au moins 2 caractères').max(120),
  color: z.enum(['white', 'black'], { error: 'Couleur invalide' }),
  ecoCode: z
    .string()
    .regex(/^[A-E][0-9]{2}$/, 'Format ECO invalide (ex: A00, D45)'),
  masteryLevel: z.number().int().min(1).max(5),
  lastStudiedAt: z
    .union([z.literal(''), z.string().date(), z.null()])
    .transform((v) => (v === '' ? null : v)),
  notes: z
    .union([z.literal(''), z.string().max(2000), z.null()])
    .transform((v) => (v === '' ? null : v)),
})

export type OpeningFormValues = z.infer<typeof openingSchema>

export const openingDefaults: OpeningFormValues = {
  name: '',
  color: 'white',
  ecoCode: '',
  masteryLevel: 1,
  lastStudiedAt: null,
  notes: null,
}
