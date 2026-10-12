'use client'

import { useState } from 'react'
import { StatusBadge } from '@/components/status-badge'
import { formatPrice } from '@/lib/format'
import { STATUS_LABELS } from '@/lib/seed'
import { actions } from '@/lib/store'
import type { AppState, OrderStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const FILTERS: (OrderStatus | 'all')[] = ['all', 'pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled']

export function AdminOrders({ state }: { state: AppState }) {
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')
  const orders = [...state.orders]
    .filter((o) => filter === 'all' || o.status === filter)
    .sort((a, b) => b.createdAt - a.createdAt)

  return (
    <div className="flex flex-col gap-4">
      <div className="no-scrollbar flex gap-2 overflow-x-auto" role="group" aria-label="Filtrer par statut">
        {FILTERS.map((f) => {
          const count = f === 'all' ? state.orders.length : state.orders.filter((o) => o.status === f).length
          return (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                filter === f ? 'border-foreground bg-foreground text-background' : 'border-border bg-card hover:border-foreground/30',
              )}
            >
              {f === 'all' ? 'Toutes' : STATUS_LABELS[f]}
              <span className="text-xs opacity-70 tabular-nums">{count}</span>
            </button>
          )
        })}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-border text-start text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 text-start font-medium">Commande</th>
              <th className="px-5 py-3 text-start font-medium">Table</th>
              <th className="px-5 py-3 text-start font-medium">Articles</th>
              <th className="px-5 py-3 text-start font-medium">Heure</th>
              <th className="px-5 py-3 text-start font-medium">Statut</th>
              <th className="px-5 py-3 text-end font-medium">Total</th>
              <th className="px-5 py-3 text-end font-medium">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-muted/40">
                <td className="px-5 py-3 font-semibold">n°{o.number}</td>
                <td className="px-5 py-3">T{o.table}</td>
                <td className="max-w-64 truncate px-5 py-3 text-muted-foreground">
                  {o.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
                </td>
                <td className="px-5 py-3 tabular-nums text-muted-foreground">
                  {new Date(o.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={o.status} />
                </td>
                <td className="px-5 py-3 text-end font-semibold tabular-nums">{formatPrice(o.total)}</td>
                <td className="px-5 py-3 text-end">
                  <label className="sr-only" htmlFor={`status-${o.id}`}>
                    Changer le statut de la commande {o.number}
                  </label>
                  <select
                    id={`status-${o.id}`}
                    value={o.status}
                    onChange={(e) => actions.setOrderStatus(o.id, e.target.value as OrderStatus)}
                    className="h-8 rounded-lg border border-border bg-background px-2 text-xs"
                  >
                    {FILTERS.filter((f) => f !== 'all').map((f) => (
                      <option key={f} value={f}>
                        {STATUS_LABELS[f as OrderStatus]}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                  Aucune commande.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
