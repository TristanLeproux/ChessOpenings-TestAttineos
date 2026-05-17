export type Color = 'white' | 'black'

export interface Opening {
  id: number
  name: string
  color: Color
  ecoCode: string
  masteryLevel: number
  lastStudiedAt: string | null
  notes: string | null
  createdAt: string
}
