import { Search } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function SearchField({
  placeholder = 'Search a city, hotel, landmark or area',
  className,
  buttonLabel = 'Search',
}: {
  placeholder?: string
  className?: string
  buttonLabel?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm',
        className,
      )}
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          aria-label={placeholder}
          className="h-11 border-0 bg-transparent pl-10 text-base shadow-none focus-visible:ring-0"
        />
      </div>
      <Button className="h-11 shrink-0 rounded-xl px-5 text-sm">{buttonLabel}</Button>
    </div>
  )
}
