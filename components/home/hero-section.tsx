import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin, Navigation, ShieldCheck, Star } from 'lucide-react'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { SearchField } from '@/components/search-field'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-accent/40 to-background">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24 lg:px-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm">
            <ShieldCheck className="size-3.5 text-primary" />
            Trusted by 40,000+ travellers
          </span>

          <h1 className="mt-5 text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Travel Smarter.{' '}
            <span className="text-primary">Travel Safer.</span>
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Check safety scores for areas, hotels, and routes before you travel. SafeRoute
            combines community reviews, public information, and safety-related factors so you
            always know what to expect.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/explore"
              className={cn(buttonVariants({ variant: 'default' }), 'h-12 gap-2 px-6 text-base')}
            >
              Explore Safe Areas
              <ArrowRight className="size-4.5" />
            </Link>
            <Link
              href="/explore"
              className={cn(buttonVariants({ variant: 'outline' }), 'h-12 gap-2 px-6 text-base')}
            >
              <Navigation className="size-4.5" />
              Check a Route
            </Link>
          </div>

          <div className="mt-10 max-w-xl">
            <SearchField />
          </div>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
            <Image
              src="/hero-map.png"
              alt="Interactive city safety map with route and location markers"
              width={720}
              height={720}
              priority
              className="h-auto w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/5 to-transparent" />
          </div>

          <div className="absolute -left-3 top-8 flex items-center gap-2.5 rounded-2xl border border-border bg-card/95 p-3 shadow-xl backdrop-blur sm:left-6">
            <span className="flex size-9 items-center justify-center rounded-xl bg-safe-soft text-safe">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">Area safety score</p>
              <p className="font-display text-base font-bold text-foreground">92 · Safe</p>
            </div>
          </div>

          <div className="absolute -right-3 bottom-8 flex items-center gap-2.5 rounded-2xl border border-border bg-card/95 p-3 shadow-xl backdrop-blur sm:right-6">
            <span className="flex size-9 items-center justify-center rounded-xl bg-accent text-primary">
              <MapPin className="size-5" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">Safer route found</p>
              <p className="flex items-center gap-1 font-display text-base font-bold text-foreground">
                <Star className="size-3.5 fill-moderate text-moderate" /> 4.7 rated path
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
