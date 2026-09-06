import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { popularDestinations } from '@/lib/mock-data'
import { DestinationCard } from '@/components/destination-card'

export function PopularDestinationsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-balance font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Popular destinations
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Safety scores from thousands of community reviews across the most-searched cities.
          </p>
        </div>
        <Link
          href="/explore"
          className={cn(buttonVariants({ variant: 'outline' }), 'h-10 gap-2 self-start px-4')}
        >
          View all on map
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {popularDestinations.map((location) => (
          <DestinationCard key={location.id} location={location} />
        ))}
      </div>
    </section>
  )
}
