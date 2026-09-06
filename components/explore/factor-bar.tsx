import { cn } from '@/lib/utils'
import { classifyScore, safetyStyles } from '@/lib/safety'

export function FactorBar({ label, value }: { label: string; value: number }) {
  const styles = safetyStyles[classifyScore(value)]
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-foreground">{value}</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn('h-full rounded-full transition-all duration-500', styles.bg)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}
