'use client'

import { useState } from 'react'
import { Check, ChefHat, Clock, HandPlatter, ReceiptText, Star } from 'lucide-react'
import { BottomSheet } from '@/components/bottom-sheet'
import { StatusBadge } from '@/components/status-badge'
import { formatPrice, timeAgo } from '@/lib/format'
import { actions } from '@/lib/store'
import type { Order, OrderStatus } from '@/lib/types'
import { cn } from '@/lib/utils'
import type { DICT } from './i18n'

type T = (typeof DICT)['fr']

const STEPS: { status: OrderStatus; label: string; icon: typeof Clock }[] = [
  { status: 'pending', label: 'Re├ºue', icon: Clock },
  { status: 'preparing', label: 'En cuisine', icon: ChefHat },
  { status: 'ready', label: 'Pr├¬te', icon: HandPlatter },
  { status: 'served', label: 'Servie', icon: Check },
]
const STEP_INDEX: Record<OrderStatus, number> = { pending: 0, confirmed: 0.5, preparing: 1, ready: 2, served: 3, cancelled: -1 }

type Props = {
  open: boolean
  onClose: () => void
  orders: Order[]
  t: T
  dir: 'ltr' | 'rtl'
  billPending: boolean
  onRequestBill: () => void
}

export function OrdersSheet({ open, onClose, orders, t, dir, billPending, onRequestBill }: Props) {
  const total = orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={t.myOrders}
      dir={dir}
      footer={
        orders.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">{t.total}</span>
              <span className="text-lg font-semibold tabular-nums">{formatPrice(total)}</span>
            </div>
            <button
              type="button"
              onClick={onRequestBill}
              disabled={billPending}
              className="ms-auto flex h-12 items-center gap-2 rounded-full bg-foreground px-5 font-semibold text-background transition-transform active:scale-[0.98] disabled:bg-success disabled:text-success-foreground"
            >
              {billPending ? <Check className="size-4" /> : <ReceiptText className="size-4" />}
              {billPending ? t.billRequested : t.requestBill}
            </button>
          </div>
        )
      }
    >
      {orders.length === 0 ? (
        <p className="px-5 py-14 text-center text-muted-foreground">Aucune commande pour le moment.</p>
      ) : (
        <ul className="flex flex-col gap-4 px-5 pb-5">
          {orders.map((o) => (
            <li key={o.id} className="rounded-2xl border border-border p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">Commande n┬░{o.number}</p>
                  <p className="text-xs text-muted-foreground">{timeAgo(o.createdAt)}</p>
                </div>
                <StatusBadge status={o.status} />
              </div>

              {o.status !== 'cancelled' && <Progress status={o.status} />}

              <ul className="mt-3 flex flex-col gap-1 text-sm">
                {o.items.map((i) => (
                  <li key={i.key} className="flex justify-between gap-2">
                    <span className="text-muted-foreground">
                      {i.quantity} ├ù {i.name}
                    </span>
                    <span className="tabular-nums">{formatPrice(i.quantity * i.unitPrice)}</span>
                  </li>
                ))}
              </ul>

              {o.status === 'served' && <Rating order={o} t={t} />}
            </li>
          ))}
        </ul>
      )}
    </BottomSheet>
  )
}

function Progress({ status }: { status: OrderStatus }) {
  const current = STEP_INDEX[status]
  return (
    <ol className="mt-4 grid grid-cols-4 gap-1" aria-label="Progression">
      {STEPS.map((s, i) => {
        const done = current >= i
        const Icon = s.icon
        return (
          <li key={s.status} className="flex flex-col items-center gap-1.5">
            <div className="flex w-full items-center">
              <span className={cn('h-0.5 flex-1', i === 0 ? 'bg-transparent' : done ? 'bg-primary' : 'bg-border')} />
              <span
                className={cn(
                  'flex size-8 items-center justify-center rounded-full transition-colors',
                  done ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                  Math.floor(current) === i && status !== 'served' && 'ring-4 ring-primary/20',
                )}
              >
                <Icon className="size-3.5" />
              </span>
              <span
                className={cn('h-0.5 flex-1', i === STEPS.length - 1 ? 'bg-transparent' : current > i ? 'bg-primary' : 'bg-border')}
              />
            </div>
            <span className={cn('text-[11px]', done ? 'font-medium text-foreground' : 'text-muted-foreground')}>{s.label}</span>
          </li>
        )
      })}
    </ol>
  )
}

function Rating({ order, t }: { order: Order; t: T }) {
  const [value, setValue] = useState(0)
  const [comment, setComment] = useState('')

  if (order.rating) {
    return (
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-muted p-3 text-sm">
        <span className="flex text-accent">
          {Array.from({ length: order.rating }).map((_, i) => (
            <Star key={i} className="size-4 fill-current" />
          ))}
        </span>
        <span className="text-muted-foreground">{t.thanks}</span>
      </div>
    )
  }

  return (
    <div className="mt-3 rounded-xl bg-muted p-3">
      <p className="text-sm font-medium">{t.rate}</p>
      <div className="mt-2 flex gap-1" role="radiogroup" aria-label="Note">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} / 5`}
            onClick={() => setValue(n)}
            className="p-0.5"
          >
            <Star className={cn('size-6 transition-colors', n <= value ? 'fill-accent text-accent' : 'text-muted-foreground/50')} />
          </button>
        ))}
      </div>
      {value > 0 && (
        <div className="mt-2 flex gap-2">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={200}
            placeholder="Un commentaire ?"
            className="h-10 min-w-0 flex-1 rounded-full border border-border bg-card px-4 text-sm outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={() => actions.rateOrder(order.id, value, comment.trim())}
            className="h-10 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            {t.send}
          </button>
        </div>
      )}
    </div>
  )
}
