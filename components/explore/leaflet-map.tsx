'use client'

import { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'

import type { SafetyLocation } from '@/lib/safety'
import { classifyScore } from '@/lib/safety'

const CHENNAI: [number, number] = [13.0827, 80.2707]

function markerColor(score: number) {
  const cls = classifyScore(score)
  if (cls === 'safe') return '#16a34a'
  if (cls === 'moderate') return '#f59e0b'
  return '#dc2626'
}

function scoreIcon(location: SafetyLocation, selected: boolean) {
  const color = markerColor(location.score)
  const size = selected ? 46 : 38

  return L.divIcon({
    className: 'saferoute-marker',
    html: `<div style="width:${size}px;height:${size}px;background:${color};border:3px solid white;border-radius:9999px;display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:12px;box-shadow:0 5px 16px rgba(15,23,42,.28);transition:all .2s ease">${location.score}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)],
  })
}


function RecenterOnTarget({ target }: { target?: { lat: number; lng: number; zoom?: number } | null }) {
  const map = useMap()

  useEffect(() => {
    if (!target) return
    map.flyTo([target.lat, target.lng], target.zoom ?? 15, {
      duration: 0.9,
    })
  }, [target, map])

  return null
}

function RecenterOnSelection({ location }: { location: SafetyLocation | null }) {
  const map = useMap()

  useEffect(() => {
    if (!location) return
    map.flyTo([location.coords.lat, location.coords.lng], Math.max(map.getZoom(), 13), {
      duration: 0.8,
    })
  }, [location, map])

  return null
}

export default function LeafletMap({
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
  const selected = locations.find((location) => location.id === selectedId) ?? null

  return (
    <MapContainer
      center={CHENNAI}
      zoom={12}
      scrollWheelZoom
      className="h-full w-full"
      zoomControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.coords.lat, location.coords.lng]}
          icon={scoreIcon(location, location.id === selectedId)}
          eventHandlers={{
            click: () => onSelect(location.id),
          }}
        >
          <Popup>
            <div className="min-w-44">
              <p className="font-semibold">{location.name}</p>
              <p className="text-xs text-slate-500">{location.area}</p>
              <p className="mt-1 text-sm">
                Safety score: <strong>{location.score}/100</strong>
              </p>
              <p className="text-xs capitalize text-slate-500">{location.type}</p>
            </div>
          </Popup>
        </Marker>
      ))}

      <RecenterOnTarget target={target} />
      <RecenterOnSelection location={selected} />
    </MapContainer>
  )
}
