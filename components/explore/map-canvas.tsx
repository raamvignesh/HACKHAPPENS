'use client'

import dynamic from 'next/dynamic'

import type { SafetyLocation } from '@/lib/safety'

const LeafletMap = dynamic(() => import('@/components/explore/leaflet-map'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted text-sm text-muted-foreground">
      Loading map…
    </div>
  ),
})

export function MapCanvas({
  locations,
  selectedId,
  onSelect,
  target,
}: {
  locations: SafetyLocation[]
  selectedId: string | null
  onSelect: (id: string) => void
  target?: { lat: number; lng: number; zoom?: number } | null
}) {
  return (
    <div className="relative size-full overflow-hidden rounded-2xl border border-border bg-muted">
      <LeafletMap locations={locations} selectedId={selectedId} onSelect={onSelect} target={target} />

      <div className="pointer-events-none absolute left-4 top-4 z-[500] rounded-lg bg-card/95 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
        Live map · OpenStreetMap
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 z-[500] flex flex-wrap gap-3 rounded-xl bg-card/95 px-3 py-2 text-xs shadow-sm backdrop-blur">
        <span className="flex items-center gap-1.5 font-medium text-foreground">
          <span className="size-2.5 rounded-full bg-safe" /> Safer
        </span>
        <span className="flex items-center gap-1.5 font-medium text-foreground">
          <span className="size-2.5 rounded-full bg-moderate" /> Moderate
        </span>
        <span className="flex items-center gap-1.5 font-medium text-foreground">
          <span className="size-2.5 rounded-full bg-caution" /> Caution
        </span>
      </div>
    </div>
  )
}
