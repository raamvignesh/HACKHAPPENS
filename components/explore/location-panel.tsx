'use client'

import {
  Bookmark,
  Building2,
  CircleAlert,
  Database,
  Flag,
  Hospital,
  MoonStar,
  Navigation,
  ShieldCheck,
  Star,
  Sun,
  Users,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { classifyScore, safetyLabel, safetyStyles, type SafetyLocation } from '@/lib/safety'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScoreRing } from '@/components/score-ring'
import { SafetyBadge } from '@/components/safety-badge'
import { FactorBar } from '@/components/explore/factor-bar'
import { communityReviews } from '@/lib/mock-data'

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/40 p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </div>
      <p className="mt-1 font-display text-base font-bold text-foreground">{value}</p>
    </div>
  )
}

function distanceText(value: number) {
  return value < 0 ? 'No data' : `${value} km`
}

export function LocationPanel({ location }: { location: SafetyLocation }) {
  const cls = classifyScore(location.score)
  const styles = safetyStyles[cls]
  const hasLiveReviews = location.reviews > 0
  const reviews = hasLiveReviews ? communityReviews.slice(0, 3) : []
  const confidence = location.confidence ?? 'medium'

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start gap-4 border-b border-border p-5">
        <ScoreRing score={location.score} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Building2 className="size-3.5" />
            {location.area}
          </div>
          <h2 className="mt-0.5 truncate font-display text-xl font-extrabold text-foreground">{location.name}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <SafetyBadge score={location.score} />
            <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {confidence} confidence
            </span>
            {hasLiveReviews ? (
              <>
                <span className="flex items-center gap-1 text-sm font-medium text-foreground">
                  <Star className="size-4 fill-moderate text-moderate" />
                  {location.rating.toFixed(1)}
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="size-3.5" />
                  {location.reviews.toLocaleString()} reviews
                </span>
              </>
            ) : (
              <span className="text-xs text-muted-foreground">Community data coming next</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-5">
        {location.scoreNote && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
            <div className="flex gap-2">
              <CircleAlert className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-foreground">Safety Score Beta</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{location.scoreNote}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Stat icon={Sun} label="Day context" value={`${location.daySafety}/100`} />
          <Stat icon={MoonStar} label="Night context" value={`${location.nightSafety}/100`} />
          <Stat icon={ShieldCheck} label="Nearby police" value={distanceText(location.policeDistanceKm)} />
          <Stat icon={Hospital} label="Nearby hospital" value={distanceText(location.hospitalDistanceKm)} />
        </div>

        {location.dataSummary && (
          <div className="flex items-start gap-2 rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
            <Database className="mt-0.5 size-4 shrink-0" />
            <span>{location.dataSummary}</span>
          </div>
        )}

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-foreground">Why this score?</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Classified as <span className={cn('font-semibold', styles.text)}>{safetyLabel(location.score)}</span>. Every factor is shown so the score is explainable rather than a black box.
          </p>
          <div className="mt-4 space-y-4">
            {location.factors.map((factor) => (
              <div key={factor.label}>
                <FactorBar label={factor.label} value={factor.value} />
                {factor.detail && <p className="mt-1 text-[11px] text-muted-foreground">{factor.detail}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <Button className="gap-1.5"><Navigation className="size-4" />Get Safer Route</Button>
          <Button variant="outline" className="gap-1.5">View Details</Button>
          <Button variant="outline" className="gap-1.5"><Bookmark className="size-4" />Save Place</Button>
          <Button variant="ghost" className="gap-1.5 text-caution hover:text-caution"><Flag className="size-4" />Report Issue</Button>
        </div>

        <Separator />

        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-foreground">Community evidence</h3>
            {hasLiveReviews && <button className="text-xs font-semibold text-primary hover:underline">See all</button>}
          </div>
          {reviews.length ? (
            <div className="mt-3 space-y-3">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-xl border border-border bg-card p-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-primary">{review.initials}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">{review.author}</p>
                      <p className="text-xs text-muted-foreground">{review.timeAgo}</p>
                    </div>
                    <span className="flex items-center gap-0.5 text-xs font-semibold text-foreground"><Star className="size-3.5 fill-moderate text-moderate" />{review.rating}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{review.body}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-3 rounded-xl border border-dashed border-border p-4 text-center">
              <Users className="mx-auto size-5 text-muted-foreground" />
              <p className="mt-2 text-sm font-semibold text-foreground">No live reviews yet</p>
              <p className="mt-1 text-xs text-muted-foreground">Supabase reviews and community reports are the next layer we’ll connect.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
