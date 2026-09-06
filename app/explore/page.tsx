'use client'

import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  Building2,
  Flag,
  Gauge,
  Hospital,
  Landmark,
  Loader2,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import type { SafetyLocation } from '@/lib/safety'
import { mapLocations } from '@/lib/mock-data'
import {
  asNearbyDisplayLocation,
  buildContextSafetyLocation,
  type NearbyPlace,
  type SearchResult,
} from '@/lib/live-places'
import { Input } from '@/components/ui/input'
import { SiteHeader } from '@/components/site-header'
import { MapCanvas } from '@/components/explore/map-canvas'
import { LocationPanel } from '@/components/explore/location-panel'

type FilterKey = SafetyLocation['type'] | 'score'

const filters: { key: FilterKey; label: string; icon: React.ElementType }[] = [
  { key: 'score', label: 'Safety Score', icon: Gauge },
  { key: 'hotel', label: 'Hotels', icon: Building2 },
  { key: 'landmark', label: 'Tourist Places', icon: Landmark },
  { key: 'hospital', label: 'Hospitals', icon: Hospital },
  { key: 'police', label: 'Police Stations', icon: ShieldCheck },
  { key: 'report', label: 'Community Reports', icon: Flag },
]

export default function ExplorePage() {
  const [active, setActive] = useState<Set<FilterKey>>(new Set())
  const [highScoreOnly, setHighScoreOnly] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>('marina-district')
  const [locations, setLocations] = useState<SafetyLocation[]>(mapLocations)
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [mapTarget, setMapTarget] = useState<{ lat: number; lng: number; zoom?: number } | null>(null)

  function toggle(key: FilterKey) {
    if (key === 'score') {
      setHighScoreOnly((v) => !v)
      return
    }
    setActive((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  async function searchPlaces(event: FormEvent) {
    event.preventDefault()
    const trimmed = query.trim()
    if (trimmed.length < 2) return

    setLoading(true)
    setMessage('')
    setSearchResults([])
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Search failed')
      const results = (data.results || []) as SearchResult[]
      setSearchResults(results)
      if (results.length === 0) setMessage('No matching places found. Try a broader search.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  async function chooseSearchResult(result: SearchResult) {
    // Move the map immediately to the exact searched coordinates.
    setMapTarget({ lat: result.lat, lng: result.lng, zoom: 15 })
    setLoading(true)
    setMessage(`Finding useful places near ${result.name}…`)
    setSearchResults([])

    try {
      const nearbyResponse = await fetch(
        `/api/nearby?lat=${result.lat}&lng=${result.lng}&radius=4000`,
      )
      const nearbyData = await nearbyResponse.json()
      const nearby = nearbyResponse.ok ? ((nearbyData.places || []) as NearbyPlace[]) : []

      const center = buildContextSafetyLocation(result, nearby)
      const nearbyLocations = nearby.map((place) =>
        asNearbyDisplayLocation(place, result.displayName),
      )

      setLocations([center, ...nearbyLocations])
      setSelectedId(center.id)
      setActive(new Set())
      setHighScoreOnly(false)
      setMessage(
        nearbyLocations.length
          ? `Showing ${nearbyLocations.length} real OpenStreetMap places near ${result.name}.`
          : `Moved to ${result.name}. No nearby POIs were returned right now.`,
      )
    } catch {
      const center = buildContextSafetyLocation(result, [])
      setLocations([center])
      setSelectedId(center.id)
      setMessage(`Moved to ${result.name}. Nearby-place lookup is temporarily unavailable.`)
    } finally {
      setLoading(false)
    }
  }

  const visibleLocations = useMemo(() => {
    return locations.filter((loc) => {
      const typeMatch =
        active.size === 0 ||
        active.has(loc.type) ||
        (active.has('landmark') && loc.type === 'city')
      const scoreMatch = !highScoreOnly || loc.score >= 80
      return typeMatch && scoreMatch
    })
  }, [locations, active, highScoreOnly])

  const selected =
    visibleLocations.find((l) => l.id === selectedId) ?? visibleLocations[0] ?? null

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <SiteHeader />

      <div className="border-b border-border bg-card">
        <div className="flex flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="relative">
            <form onSubmit={searchPlaces} className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search a city, hotel, landmark or area"
                  aria-label="Search a city, hotel, landmark or area"
                  className="h-11 rounded-xl pl-10 pr-24"
                />
                <button
                  type="submit"
                  disabled={loading || query.trim().length < 2}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-50"
                >
                  {loading ? <Loader2 className="size-4 animate-spin" /> : 'Search'}
                </button>
              </div>
              <span className="hidden items-center gap-1.5 rounded-xl border border-border px-3 py-2.5 text-sm font-medium text-muted-foreground sm:flex">
                <SlidersHorizontal className="size-4" />
                Filters
              </span>
            </form>

            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-[48px] z-[2000] max-h-80 overflow-y-auto rounded-xl border border-border bg-card p-1.5 shadow-xl sm:right-28">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => chooseSearchResult(result)}
                    className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-muted"
                  >
                    <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-foreground">{result.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">{result.displayName}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {message && <p className="text-xs text-muted-foreground">{message}</p>}

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const on = filter.key === 'score' ? highScoreOnly : active.has(filter.key)
              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => toggle(filter.key)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                    on
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
                  )}
                  aria-pressed={on}
                >
                  <filter.icon className="size-4" />
                  {filter.key === 'score' ? 'Safe only (80+)' : filter.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        <div className="relative min-h-[45vh] flex-1 p-3 lg:min-h-0">
          <MapCanvas
            locations={visibleLocations}
            selectedId={selected?.id ?? null}
            onSelect={setSelectedId}
            target={mapTarget}
          />
        </div>

        <aside className="w-full shrink-0 overflow-hidden border-t border-border bg-card lg:w-[400px] lg:border-l lg:border-t-0">
          {selected ? (
            <LocationPanel location={selected} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
              <MapPin className="size-8 text-muted-foreground" />
              <p className="font-display text-lg font-bold text-foreground">No places match</p>
              <p className="text-sm text-muted-foreground">Try removing a filter to see more locations on the map.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
