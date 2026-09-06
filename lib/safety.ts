export type SafetyClass = 'safe' | 'moderate' | 'caution'
export type ScoreConfidence = 'low' | 'medium' | 'high'

export type ScoreFactor = {
  label: string
  value: number
  detail?: string
}

export type SafetyLocation = {
  id: string
  name: string
  area: string
  type: 'city' | 'hotel' | 'landmark' | 'hospital' | 'police' | 'report'
  score: number
  rating: number
  reviews: number
  daySafety: number
  nightSafety: number
  lighting: number
  crowd: number
  policeDistanceKm: number
  hospitalDistanceKm: number
  factors: ScoreFactor[]
  coords: { lat: number; lng: number }
  image?: string
  confidence?: ScoreConfidence
  scoreNote?: string
  dataSummary?: string
}

export function classifyScore(score: number): SafetyClass {
  if (score >= 80) return 'safe'
  if (score >= 50) return 'moderate'
  return 'caution'
}

export function safetyLabel(score: number): string {
  const cls = classifyScore(score)
  return cls === 'safe' ? 'Safer context' : cls === 'moderate' ? 'Mixed context' : 'Use caution'
}

export const safetyStyles: Record<
  SafetyClass,
  { text: string; bg: string; softBg: string; softText: string; dot: string; ring: string }
> = {
  safe: {
    text: 'text-safe',
    bg: 'bg-safe',
    softBg: 'bg-safe-soft',
    softText: 'text-safe',
    dot: 'bg-safe',
    ring: 'ring-safe/30',
  },
  moderate: {
    text: 'text-moderate-foreground',
    bg: 'bg-moderate',
    softBg: 'bg-moderate-soft',
    softText: 'text-moderate-foreground',
    dot: 'bg-moderate',
    ring: 'ring-moderate/30',
  },
  caution: {
    text: 'text-caution',
    bg: 'bg-caution',
    softBg: 'bg-caution-soft',
    softText: 'text-caution',
    dot: 'bg-caution',
    ring: 'ring-caution/30',
  },
}
