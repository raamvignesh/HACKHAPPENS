import type { SafetyLocation, ScoreConfidence } from './safety'

export type SearchResult = {
  id: string
  name: string
  displayName: string
  lat: number
  lng: number
  kind: string
}

export type NearbyPlace = {
  id: string
  name: string
  type: 'hotel' | 'landmark' | 'hospital' | 'police'
  lat: number
  lng: number
  address?: string
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)))
}

function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (v: number) => (v * Math.PI) / 180
  const R = 6371
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

function proximityScore(km: number | null, idealKm: number, maxKm: number) {
  if (km === null) return 30
  if (km <= idealKm) return 100
  if (km >= maxKm) return 20
  const span = maxKm - idealKm
  return clamp(100 - ((km - idealKm) / span) * 80)
}

function nearestDistance(center: SearchResult, places: NearbyPlace[], type: NearbyPlace['type']) {
  const candidates = places.filter((p) => p.type === type)
  if (!candidates.length) return null
  return Math.min(...candidates.map((p) => distanceKm(center, p)))
}

export function buildContextSafetyLocation(
  center: SearchResult,
  nearby: NearbyPlace[],
): SafetyLocation {
  const policeKm = nearestDistance(center, nearby, 'police')
  const hospitalKm = nearestDistance(center, nearby, 'hospital')

  const within15 = nearby.filter((p) => distanceKm(center, p) <= 1.5)
  const within3 = nearby.filter((p) => distanceKm(center, p) <= 3)
  const activityCount = within15.filter((p) => p.type === 'hotel' || p.type === 'landmark').length
  const supportCount = within3.filter((p) => p.type === 'hospital' || p.type === 'police').length

  const police = proximityScore(policeKm, 0.8, 5)
  const hospital = proximityScore(hospitalKm, 1, 6)
  const publicActivity = clamp(35 + activityCount * 6)
  const supportCoverage = clamp(35 + supportCount * 10)

  // Community evidence is intentionally neutral until Supabase reviews/reports are connected.
  const communityEvidence = 50

  // Weighted contextual score. This is NOT a crime-risk prediction.
  const score = clamp(
    police * 0.25 +
      hospital * 0.20 +
      publicActivity * 0.20 +
      supportCoverage * 0.20 +
      communityEvidence * 0.15,
  )

  const returnedTypes = new Set(nearby.map((p) => p.type)).size
  let confidence: ScoreConfidence = 'low'
  if (nearby.length >= 12 && returnedTypes >= 3) confidence = 'medium'
  if (nearby.length >= 30 && returnedTypes === 4) confidence = 'high'

  const daySafety = clamp(score + 7)
  // Night score is conservative until real lighting/community data exists.
  const nightSafety = clamp(score - 10)

  return {
    id: `search-${center.id}`,
    name: center.name,
    area: center.displayName,
    type: 'landmark',
    score,
    rating: 0,
    reviews: 0,
    daySafety,
    nightSafety,
    lighting: 50,
    crowd: publicActivity,
    policeDistanceKm: policeKm === null ? -1 : Number(policeKm.toFixed(1)),
    hospitalDistanceKm: hospitalKm === null ? -1 : Number(hospitalKm.toFixed(1)),
    coords: { lat: center.lat, lng: center.lng },
    confidence,
    scoreNote: 'Beta contextual score — not a crime prediction. It currently uses nearby emergency/support access and public-place activity from OpenStreetMap. Community reports and lighting data will be connected next.',
    dataSummary: `${nearby.length} nearby mapped places · ${supportCount} support places within 3 km · ${activityCount} active/public places within 1.5 km`,
    factors: [
      { label: 'Police access', value: police, detail: policeKm === null ? 'No mapped station returned nearby' : `${policeKm.toFixed(1)} km to nearest mapped station` },
      { label: 'Hospital access', value: hospital, detail: hospitalKm === null ? 'No mapped hospital returned nearby' : `${hospitalKm.toFixed(1)} km to nearest mapped hospital` },
      { label: 'Public activity proxy', value: publicActivity, detail: `${activityCount} hotels/attractions within 1.5 km` },
      { label: 'Support-place coverage', value: supportCoverage, detail: `${supportCount} police/hospital places within 3 km` },
      { label: 'Community evidence', value: communityEvidence, detail: 'Neutral until live reviews/reports are connected' },
    ],
  }
}

export function asNearbyDisplayLocation(
  place: NearbyPlace,
  areaFallback: string,
): SafetyLocation {
  const base = place.type === 'police' || place.type === 'hospital' ? 72 : 64
  return {
    id: place.id,
    name: place.name,
    area: place.address || areaFallback,
    type: place.type,
    score: base,
    rating: 0,
    reviews: 0,
    daySafety: base + 5,
    nightSafety: base - 8,
    lighting: 50,
    crowd: 50,
    policeDistanceKm: place.type === 'police' ? 0 : -1,
    hospitalDistanceKm: place.type === 'hospital' ? 0 : -1,
    coords: { lat: place.lat, lng: place.lng },
    confidence: 'low',
    scoreNote: 'Nearby-place marker. Select the searched area marker for the contextual score.',
    dataSummary: 'OpenStreetMap place marker',
    factors: [
      { label: 'Data availability', value: 50, detail: 'This marker is shown for navigation/context, not a verified safety rating.' },
    ],
  }
}
