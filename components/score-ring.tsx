import { cn } from '@/lib/utils'
import { classifyScore, safetyStyles } from '@/lib/safety'

export function ScoreRing({
  score,
  size = 72,
  strokeWidth = 7,
  className,
}: {
  score: number
  size?: number
  strokeWidth?: number
  className?: string
}) {
  const cls = classifyScore(score)
  const styles = safetyStyles[cls]
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const dash = (Math.min(Math.max(score, 0), 100) / 100) * circumference

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-border"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          className={cn(styles.text)}
          stroke="currentColor"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-lg font-bold leading-none text-foreground">
          {score}
        </span>
        <span className="text-[10px] font-medium text-muted-foreground">/ 100</span>
      </div>
    </div>
  )
}
