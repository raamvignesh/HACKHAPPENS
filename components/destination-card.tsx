import Image from 'next/image'
import { MapPin, Star, Users } from 'lucide-react'

import type { SafetyLocation } from '@/lib/safety'
import { SafetyBadge } from '@/components/safety-badge'

export function DestinationCard({ location }: { location: SafetyLocation }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={location.image ?? '/hero-map.png'}
          alt={`${location.name} cityscape`}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute right-3 top-3">
          <SafetyBadge score={location.score} showScore className="bg-card/95 shadow-sm" />
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="size-3.5" />
          {location.area}
        </div>
        <h3 className="mt-1 font-display text-lg font-bold text-foreground">
          {location.name}
        </h3>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 font-medium text-foreground">
            <Star className="size-4 fill-moderate text-moderate" />
            {location.rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Users className="size-3.5" />
            {location.reviews.toLocaleString()} reviews
          </span>
        </div>
      </div>
    </article>
  )
}
