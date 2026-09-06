import { MapPinned, Route, Search } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Search a destination',
    description: 'Enter any city, hotel, landmark, or area to instantly pull its safety profile.',
  },
  {
    icon: MapPinned,
    title: 'Check safety information',
    description: 'Review day and night scores, lighting, crowd activity, and community reports.',
  },
  {
    icon: Route,
    title: 'Choose a safer route',
    description: 'Compare paths and pick the one with the highest safety score to your stay.',
  },
]

export function HowItWorksSection() {
  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            How SafeRoute works
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Three simple steps between you and a more confident trip.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="relative rounded-2xl bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <step.icon className="size-6" />
                </span>
                <span className="font-display text-5xl font-extrabold text-muted-foreground/15">
                  {index + 1}
                </span>
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
