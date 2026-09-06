import { Hospital, Phone, ShieldCheck, Siren } from 'lucide-react'

import { emergencyContacts } from '@/lib/mock-data'

const icons = {
  police: ShieldCheck,
  hospital: Hospital,
  assist: Siren,
} as const

export function EmergencySection() {
  return (
    <section className="border-t border-border bg-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-background/10 px-3 py-1 text-xs font-semibold text-background">
            <Phone className="size-3.5" />
            Always one tap away
          </span>
          <h2 className="max-w-2xl text-balance font-display text-3xl font-extrabold tracking-tight text-background sm:text-4xl">
            Emergency information wherever you are
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {emergencyContacts.map((contact) => {
            const Icon = icons[contact.id as keyof typeof icons]
            return (
              <div
                key={contact.id}
                className="flex items-start gap-4 rounded-2xl border border-background/10 bg-background/5 p-6 backdrop-blur transition-colors hover:bg-background/10"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm text-background/70">{contact.label}</p>
                  <p className="mt-0.5 font-display text-2xl font-extrabold text-background">
                    {contact.value}
                  </p>
                  <p className="mt-1 text-sm text-background/60">{contact.detail}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
