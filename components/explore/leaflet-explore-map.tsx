'use client'

import { useEffect, useMemo } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, ZoomControl, useMap } from 'react-leaflet'
import { Locate } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  classifyScore,
  locationTypeLabel,
  safetyStyles,
  type SafetyLocation,
} from '@/lib/safety'
import { Button } from '@/components/ui/button'

import 'leaflet/dist/leaflet.css'

export const CHENNAI_CENTER: [number, number] = [13.0827, 80.2707]
const INITIAL_ZOOM = 13

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function safetyMarkerIcon(loc: SafetyLocation, selected: boolean) {
  const cls = classifyScore(loc.score)
  const styles = safetyStyles[cls]
  const label = selected
    ? `${loc.score} · ${escapeHtml(loc.name)}`
    : String(loc.score)

  return L.divIcon({
    className: 'saferoute-marker',
    iconSize: selected ? [168, 36] : [32, 32],
    iconAnchor: selected ? [84, 18] : [16, 16],
    popupAnchor: [0, selected ? -14 : -12],
    html: `
      <span class="relative flex items-center justify-center">
        ${
          selected
            ? `<span class="absolute inset-0 -z-10 animate-ping rounded-full opacity-60 ${styles.dot}"></span>`
            : ''
        }
        <span class="flex items-center justify-center gap-1 rounded-full border-2 border-white font-bold text-white shadow-lg ${styles.bg} ${
          selected ? 'px-2.5 py-1.5 text-xs' : 'size-8 text-xs'
        }">${label}</span>
      </span>
    `,
  })
}

function MapResize() {
  const map = useMap()

  useEffect(() => {
    const container = map.getContainer()
    const resize = () => map.invalidateSize()
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(container)
    window.addEventListener('orientationchange', resize)
    return () => {
      observer.disconnect()
      window.removeEventListener('orientationchange', resize)
    }
  }, [map])

  return null
}

function RecenterControl() {
  const map = useMap()

  return (
    <div className="absolute bottom-[84px] right-[10px] z-[1000]">
      <Button
        variant="secondary"
        size="icon"
        className="size-9 bg-card shadow-md"
        aria-label="Recenter on Chennai"
        onClick={() => map.setView(CHENNAI_CENTER, INITIAL_ZOOM)}
      >
        <Locate className="size-4" />
      </Button>
    </div>
  )
}

export function LeafletExploreMap({
  locations,
  selectedId,
  onSelect,
}: {
  locations: SafetyLocation[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const icons = useMemo(() => {
    const next = new Map<string, L.DivIcon>()
    for (const loc of locations) {
      next.set(loc.id, safetyMarkerIcon(loc, loc.id === selectedId))
    }
    return next
  }, [locations, selectedId])

  return (
    <div className="relative size-full overflow-hidden rounded-2xl border border-border">
      <MapContainer
        center={CHENNAI_CENTER}
        zoom={INITIAL_ZOOM}
        minZoom={4}
        maxZoom={19}
        zoomControl={false}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        <MapResize />
        <RecenterControl />

        {locations.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.coords.lat, loc.coords.lng]}
            icon={icons.get(loc.id)}
            zIndexOffset={loc.id === selectedId ? 1000 : 0}
            eventHandlers={{
              click: () => onSelect(loc.id),
            }}
          >
            <Popup>
              <p className="font-display text-sm font-bold text-foreground">{loc.name}</p>
              <p className="text-xs text-muted-foreground">{locationTypeLabel[loc.type]}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <span className="pointer-events-none absolute left-4 top-4 z-[500] rounded-lg bg-card/90 px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
        Chennai · OpenStreetMap
      </span>

      <div className="pointer-events-none absolute bottom-4 left-4 z-[500] flex flex-wrap gap-3 rounded-xl bg-card/90 px-3 py-2 text-xs shadow-sm backdrop-blur">
        {(['safe', 'moderate', 'caution'] as const).map((c) => (
          <span key={c} className="flex items-center gap-1.5 font-medium text-foreground">
            <span className={cn('size-2.5 rounded-full', safetyStyles[c].dot)} />
            {c === 'safe' ? 'Safer' : c === 'moderate' ? 'Moderate' : 'Caution'}
          </span>
        ))}
      </div>
    </div>
  )
}

export default LeafletExploreMap
