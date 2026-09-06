import { cn } from '@/lib/utils'
import { classifyScore, safetyLabel, safetyStyles } from '@/lib/safety'

export function SafetyBadge({
  score,
  className,
  showScore = false,
}: {
  score: number
  className?: string
  showScore?: boolean
}) {
  const cls = classifyScore(score)
  const styles = safetyStyles[cls]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        styles.softBg,
        styles.softText,
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', styles.dot)} aria-hidden />
      {showScore ? `${score} · ` : null}
      {safetyLabel(score)}
    </span>
  )
}
