'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Check, ChefHat, Clock, Home } from 'lucide-react'
import { AppLoader } from '@/components/app-loader'
import { useNow } from '@/hooks/use-now'
import { formatPrice } from '@/lib/format'
import { actions, useAppState } from '@/lib/store'
import type { Order } from '@/lib/types'

export function KitchenBoard() {
  const state = useAppState()
  const now = useNow(15_000)
  const [tableFilter, setTableFilter] = useState<number | 'all'>('all')

  const orders = useMemo(() => {
    if (!state) return []
    const active = state.orders.filter((order) => !['served', 'cancelled'].includes(order.status))
    return tableFilter === 'all' ? active : active.filter((order) => order.table === tableFilter)
  }, [state, tableFilter])

  if (!state) return <AppLoader />

  const tables = [...new Set(state.orders.filter((order) => !['served', 'cancelled'].includes(order.status)).map((order) => order.table))].sort((a, b) => a - b)

  return (
    <div className="min-h-dvh bg-secondary/40">
      <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><ChefHat className="size-5" /></span>
            <div>
              <h1 className="font-serif text-xl font-semibold">Commandes du service</h1>
              <p className="text-sm text-muted-foreground">{orders.length} commande{orders.length !== 1 ? 's' : ''} à suivre</p>
            </div>
          </div>
          <div className="ms-auto flex items-center gap-2">
            <label className="sr-only" htmlFor="table-filter">Filtrer par table</label>
            <select id="table-filter" value={tableFilter} onChange={(event) => setTableFilter(event.target.value === 'all' ? 'all' : Number(event.target.value))} className="h-10 rounded-full border border-border bg-background px-4 text-sm">
              <option value="all">Toutes les tables</option>
              {tables.map((table) => <option key={table} value={table}>Table {table}</option>)}
            </select>
            <Link href="/" className="flex size-10 items-center justify-center rounded-full bg-muted hover:bg-secondary" aria-label="Accueil"><Home className="size-4" /></Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-4 lg:p-8">
        {orders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
            <Check className="mx-auto size-8 text-success" />
            <h2 className="mt-4 font-serif text-2xl font-semibold">Tout est à jour</h2>
            <p className="mt-2 text-sm text-muted-foreground">Aucune commande en attente pour le moment.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {orders.map((order) => <OrderCard key={order.id} order={order} now={now} onPaid={() => actions.confirmPayment(order.id, order.table)} />)}
          </div>
        )}
      </main>
    </div>
  )
}

function OrderCard({ order, now, onPaid }: { order: Order; now: number; onPaid: () => void }) {
  const minutes = Math.max(0, Math.round((now - order.createdAt) / 60_000))
  return (
    <article className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div><p className="font-serif text-3xl font-semibold">Table {order.table}</p><p className="mt-1 text-sm text-muted-foreground">Commande n°{order.number}</p></div>
        <span className="flex items-center gap-1 rounded-full bg-accent/15 px-3 py-1.5 text-xs font-semibold text-accent-foreground"><Clock className="size-3.5" /> {minutes} min</span>
      </div>
      <ul className="mt-5 space-y-3 border-t border-dashed border-border pt-4">
        {order.items.map((item) => <li key={item.key} className="flex gap-3 text-sm"><span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">{item.quantity}</span><div><p className="font-medium">{item.name}</p>{item.note && <p className="text-xs italic text-muted-foreground">{item.note}</p>}</div></li>)}
      </ul>
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4"><span className="text-sm text-muted-foreground">Total à encaisser</span><span className="font-semibold">{formatPrice(order.total)}</span></div>
      <button type="button" onClick={onPaid} className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.98]"><Check className="size-4" /> Confirmer le paiement</button>
    </article>
  )
}

