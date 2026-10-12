import { STATUS_LABELS } from '@/lib/seed'
import type { OrderStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const STYLES: Record<OrderStatus, string> = {
  pending: 'bg-accent/30 text-foreground ring-accent',
  confirmed: 'bg-secondary text-secondary-foreground ring-border',
  preparing: 'bg-primary/10 text-primary ring-primary/30',
  ready: 'bg-success/15 text-success ring-success/30',
  served: 'bg-muted text-muted-foreground ring-border',
  cancelled: 'bg-destructive/10 text-destructive ring-destructive/30',
}

export function StatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
        STYLES[status],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  )
}
