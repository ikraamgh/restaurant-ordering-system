'use client'

import { Banknote, ReceiptText, Star, Timer, type LucideIcon } from 'lucide-react'
import { StatusBadge } from '@/components/status-badge'
import { formatPrice, isToday, timeAgo } from '@/lib/format'
import { ACTIVE_STATUSES } from '@/lib/store'
import type { AppState } from '@/lib/types'

export function AdminDashboard({ state }: { state: AppState }) {
  const today = state.orders.filter((o) => isToday(o.createdAt) && o.status !== 'cancelled')
  const revenue = today.reduce((s, o) => s + o.total, 0)
  const avgTicket = today.length ? Math.round(revenue / today.length) : 0
  const rated = state.orders.filter((o) => o.rating)
  const avgRating = rated.length ? rated.reduce((s, o) => s + (o.rating ?? 0), 0) / rated.length : 0
  const active = state.orders.filter((o) => ACTIVE_STATUSES.includes(o.status))

  const dishCounts = new Map<string, { name: string; qty: number; revenue: number }>()
  for (const o of today)
    for (const i of o.items) {
      const prev = dishCounts.get(i.dishId) ?? { name: i.name, qty: 0, revenue: 0 }
      dishCounts.set(i.dishId, { name: i.name, qty: prev.qty + i.quantity, revenue: prev.revenue + i.quantity * i.unitPrice })
    }
  const top = [...dishCounts.values()].sort((a, b) => b.qty - a.qty).slice(0, 5)
  const maxQty = Math.max(1, ...top.map((t) => t.qty))

  const hours = Array.from({ length: 16 }, (_, i) => i + 8)
  const byHour = hours.map((h) => ({
    h,
    total: today.filter((o) => new Date(o.createdAt).getHours() === h).reduce((s, o) => s + o.total, 0),
  }))
  const maxHour = Math.max(1, ...byHour.map((b) => b.total))

  const recent = [...state.orders].sort((a, b) => b.createdAt - a.createdAt).slice(0, 6)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <Kpi icon={Banknote} label="Chiffre d'affaires du jour" value={formatPrice(revenue)} />
        <Kpi icon={ReceiptText} label="Commandes du jour" value={String(today.length)} hint={`${active.length} en cours`} />
        <Kpi icon={Timer} label="Ticket moyen" value={formatPrice(avgTicket)} />
        <Kpi icon={Star} label="Satisfaction" value={avgRating ? `${avgRating.toFixed(1)} / 5` : '—'} hint={`${rated.length} avis`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <section className="rounded-2xl border border-border bg-card p-5 lg:col-span-3" aria-labelledby="by-hour">
          <h2 id="by-hour" className="font-semibold">
            Ventes par heure
          </h2>
          <p className="text-sm text-muted-foreground">{"Aujourd'hui, en dirhams"}</p>
          <div className="mt-6 flex h-48 items-end gap-1.5" role="img" aria-label="Histogramme des ventes par heure">
            {byHour.map((b) => (
              <div key={b.h} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                <div
                  className="w-full rounded-t-md bg-primary/85 transition-all hover:bg-primary"
                  style={{ height: `${(b.total / maxHour) * 100}%`, minHeight: b.total ? 4 : 2, opacity: b.total ? 1 : 0.15 }}
                  title={`${b.h}h : ${formatPrice(b.total)}`}
                />
                <span className="text-[10px] text-muted-foreground tabular-nums">{b.h}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 lg:col-span-2" aria-labelledby="top-dishes">
          <h2 id="top-dishes" className="font-semibold">
            Plats les plus vendus
          </h2>
          <p className="text-sm text-muted-foreground">{"Aujourd'hui"}</p>
          <ol className="mt-5 flex flex-col gap-4">
            {top.map((t, i) => (
              <li key={t.name} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate">
                    <span className="me-2 text-muted-foreground tabular-nums">{i + 1}.</span>
                    {t.name}
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums">{t.qty}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${(t.qty / maxQty) * 100}%` }} />
                </div>
              </li>
            ))}
            {top.length === 0 && <li className="text-sm text-muted-foreground">Aucune vente aujourd&apos;hui.</li>}
          </ol>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-card" aria-labelledby="recent">
        <h2 id="recent" className="p-5 pb-3 font-semibold">
          Dernières commandes
        </h2>
        <ul className="divide-y divide-border">
          {recent.map((o) => (
            <li key={o.id} className="flex items-center gap-4 px-5 py-3 text-sm">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted font-semibold">T{o.table}</span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">n°{o.number}</p>
                <p className="truncate text-xs text-muted-foreground">{o.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}</p>
              </div>
              <span className="hidden text-xs text-muted-foreground sm:inline">{timeAgo(o.createdAt)}</span>
              <StatusBadge status={o.status} className="hidden md:inline-flex" />
              <span className="w-20 text-end font-semibold tabular-nums">{formatPrice(o.total)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function Kpi({ icon: Icon, label, value, hint }: { icon: LucideIcon; label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground lg:text-sm">{label}</span>
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 font-serif text-2xl font-semibold tabular-nums lg:text-3xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
