import { ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react'

import { cn } from '@/lib/utils'

const tiers = [
  {
    label: 'Safe',
    range: '80 to 100',
    description: 'Well-lit, active areas with quick access to help and strong community ratings.',
    icon: ShieldCheck,
    accent: 'text-safe',
    softBg: 'bg-safe-soft',
    bar: 'bg-safe',
  },
  {
    label: 'Moderate',
    range: '50 to 79',
    description: 'Generally fine with some caution advised, especially after dark or when quiet.',
    icon: ShieldQuestion,
    accent: 'text-moderate-foreground',
    softBg: 'bg-moderate-soft',
    bar: 'bg-moderate',
  },
  {
    label: 'Caution',
    range: 'Below 50',
    description: 'Limited lighting or activity and slower emergency access. Plan an alternative.',
    icon: ShieldAlert,
    accent: 'text-caution',
    softBg: 'bg-caution-soft',
    bar: 'bg-caution',
  },
]

export function SafetyLegendSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Understand every safety score
        </h2>
        <p className="mt-3 text-pretty text-muted-foreground">
          Each place is scored out of 100 across multiple factors, then grouped into three clear
          bands so you can decide at a glance.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.label}
            className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <span className={cn('absolute inset-x-0 top-0 h-1', tier.bar)} />
            <div
              className={cn(
                'flex size-12 items-center justify-center rounded-2xl',
                tier.softBg,
                tier.accent,
              )}
            >
              <tier.icon className="size-6" />
            </div>
            <div className="mt-5 flex items-baseline justify-between">
              <h3 className="font-display text-xl font-bold text-foreground">{tier.label}</h3>
              <span className={cn('text-sm font-bold', tier.accent)}>{tier.range}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {tier.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
