'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Clock, RotateCcw, ShoppingBag, Utensils } from 'lucide-react'
import { toast } from 'sonner'
import { AppLoader } from '@/components/app-loader'
import { actions, useAppState } from '@/lib/store'
import { formatPrice, timeAgo } from '@/lib/format'
import type { Order } from '@/lib/types'

export function ResponsableApp({ restaurantSlug }: { restaurantSlug: string }) {
  const state = useAppState()
  const [confirming, setConfirming] = useState<string | null>(null)

  if (!state) return <AppLoader />

  const restaurant = state.restaurants.find((r) => r.slug === restaurantSlug)

  if (!restaurant) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-8 text-center">
        <Utensils className="size-12 text-muted-foreground" />
        <p className="font-semibold text-lg">Restaurant introuvable</p>
        <Link href="/admin" className="text-sm text-primary underline">
          Retour à l&apos;administration
        </Link>
      </div>
    )
  }

  const activeOrders = state.orders
    .filter((o) => o.restaurantId === restaurant.id && o.status === 'active')
    .sort((a, b) => a.createdAt - b.createdAt)

  const handleConfirm = async (order: Order) => {
    setConfirming(order.id)
    await new Promise((r) => setTimeout(r, 300)) // micro-feedback
    actions.confirmPayment(order.id)
    toast.success(`Commande n°${order.number} payée ✓`)
    setConfirming(null)
  }

  return (
    <div className="min-h-dvh bg-secondary/40">
      {/* ── Header ── */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary font-serif text-lg font-bold text-primary-foreground">
              {restaurant.name.slice(0, 1)}
            </div>
            <div>
              <p className="font-semibold leading-tight">{restaurant.name}</p>
              <p className="text-xs text-muted-foreground">Espace Responsable</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live orders count */}
            {activeOrders.length > 0 && (
              <span className="flex size-8 animate-pulse items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-700">
                {activeOrders.length}
              </span>
            )}
            <button
              type="button"
              onClick={() => { actions.reset(); toast.success('Données réinitialisées') }}
              className="flex size-9 items-center justify-center rounded-full hover:bg-muted text-muted-foreground"
              aria-label="Réinitialiser"
            >
              <RotateCcw className="size-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="mx-auto max-w-2xl px-4 py-6">
        {activeOrders.length === 0 ? (
          /* Empty state */
          <div className="mt-20 flex flex-col items-center gap-4 text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="size-10 text-emerald-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-xl font-semibold">Aucune commande active</h2>
            <p className="text-sm text-muted-foreground">
              Les nouvelles commandes apparaîtront ici automatiquement.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm font-medium text-muted-foreground">
              {activeOrders.length} commande{activeOrders.length > 1 ? 's' : ''} en attente
            </p>

            {activeOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isConfirming={confirming === order.id}
                onConfirm={() => handleConfirm(order)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

/* ── Order Card ─────────────────────────────────────────────── */

function OrderCard({
  order,
  isConfirming,
  onConfirm,
}: {
  order: Order
  isConfirming: boolean
  onConfirm: () => void
}) {
  const elapsed = Math.floor((Date.now() - order.createdAt) / 60_000)
  const isUrgent = elapsed >= 15

  return (
    <div
      className={`overflow-hidden rounded-3xl border bg-card shadow-sm ${
        isUrgent ? 'border-orange-300' : 'border-border'
      }`}
    >
      {/* Card header */}
      <div
        className={`flex items-center justify-between px-5 py-4 ${
          isUrgent ? 'bg-orange-50' : 'bg-secondary/50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-foreground text-background">
            <span className="font-serif text-lg font-bold">T{order.tableNumber}</span>
          </div>
          <div>
            <p className="font-semibold">
              Commande n°{order.number}
            </p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3" />
              <span className={isUrgent ? 'font-semibold text-orange-600' : ''}>
                {elapsed < 1 ? "À l'instant" : `il y a ${elapsed} min`}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isUrgent && (
            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">
              ⏰ Urgent
            </span>
          )}
          <ShoppingBag className="size-5 text-muted-foreground" />
        </div>
      </div>

      {/* Items */}
      <ul className="divide-y divide-border px-5">
        {order.items.map((item) => (
          <li key={item.key} className="flex items-center justify-between gap-3 py-3 text-sm">
            <span>
              <span className="me-2 inline-flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {item.quantity}
              </span>
              <span className="font-medium">{item.name}</span>
            </span>
            <span className="shrink-0 tabular-nums text-muted-foreground">
              {formatPrice(item.unitPrice * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="border-t border-border px-5 py-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total à payer</span>
          <span className="font-serif text-2xl font-semibold tabular-nums text-primary">
            {formatPrice(order.total)}
          </span>
        </div>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isConfirming}
          className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.98] ${
            isConfirming
              ? 'bg-emerald-400'
              : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          <CheckCircle2 className="size-5" />
          {isConfirming ? 'Confirmation…' : 'Confirmer le paiement'}
        </button>
      </div>
    </div>
  )
}
