'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Building2,
  ChefHat,
  MapPin,
  Plus,
  QrCode,
  RotateCcw,
  ShoppingBag,
  Star,
  X,
  type LucideIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { AppLoader } from '@/components/app-loader'
import { actions, useAppState } from '@/lib/store'
import { cn } from '@/lib/utils'
import type { Restaurant } from '@/lib/types'

/* ─────────────────────────────────────────────── */
/*  Super Admin App (route /admin)                 */
/* ─────────────────────────────────────────────── */

export function SuperAdminApp() {
  const state = useAppState()
  const [showNewRestaurant, setShowNewRestaurant] = useState(false)

  if (!state) return <AppLoader />

  const totalOrders = state.restaurants.reduce((s, r) => s + r.scanOrders, 0) + state.orders.length
  const activeCount = state.restaurants.filter((r) => r.status === 'active').length

  return (
    <div className="min-h-dvh bg-secondary/40">
      {/* ── Header ── */}
      <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <Brand />
          <div className="flex items-center gap-2">
            <Link
              href="/serveur"
              className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <ChefHat className="size-4" /> Cuisine
            </Link>
            <button
              type="button"
              onClick={() => {
                actions.reset()
                toast.success('Données de démonstration réinitialisées')
              }}
              className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <RotateCcw className="size-4" /> Reset
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* ── Hero KPIs ── */}
        <div className="mb-10">
          <p className="text-sm font-medium text-muted-foreground">Super Administration</p>
          <h1 className="mt-1 font-serif text-3xl font-semibold lg:text-4xl">Tableau de bord</h1>
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Kpi icon={Building2} label="Restaurants" value={state.restaurants.length} />
            <Kpi icon={Star} label="Actifs" value={activeCount} accent />
            <Kpi icon={ShoppingBag} label="Commandes (QR)" value={totalOrders} />
            <Kpi icon={QrCode} label="Suspendus" value={state.restaurants.length - activeCount} muted />
          </div>
        </div>

        {/* ── Directory ── */}
        <section className="overflow-hidden rounded-3xl border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-6">
            <div>
              <h2 className="font-semibold text-lg">Tous les établissements</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">Cliquez sur un restaurant pour accéder à son tableau de bord</p>
            </div>
            <button
              type="button"
              onClick={() => setShowNewRestaurant(true)}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Plus className="size-4" /> Nouveau restaurant
            </button>
          </div>

          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {state.restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </section>
      </main>

      {/* ── New Restaurant Modal ── */}
      {showNewRestaurant && <NewRestaurantModal onClose={() => setShowNewRestaurant(false)} />}
    </div>
  )
}

/* ─────────────────────────────────────────────── */
/*  Restaurant Card                                */
/* ─────────────────────────────────────────────── */

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const initials = restaurant.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const planColors: Record<string, string> = {
    starter: 'bg-slate-100 text-slate-700',
    growth: 'bg-blue-50 text-blue-700',
    enterprise: 'bg-purple-50 text-purple-700',
  }

  return (
    <Link
      href={`/admin/restaurant/${restaurant.id}`}
      className="group flex flex-col bg-card p-6 transition-colors hover:bg-secondary/60"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        {/* Logo / initials */}
        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/10">
          {restaurant.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={restaurant.logo} alt={restaurant.name} className="size-full object-cover" />
          ) : (
            <span className="font-serif text-xl font-bold text-primary">{initials}</span>
          )}
        </div>

        <span
          className={cn(
            'rounded-full px-2.5 py-1 text-xs font-semibold',
            restaurant.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700',
          )}
        >
          {restaurant.status === 'active' ? 'Actif' : 'Suspendu'}
        </span>
      </div>

      {/* Info */}
      <div className="mt-4 flex-1">
        <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{restaurant.name}</p>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3 shrink-0" />
          {restaurant.city}
        </p>
        {restaurant.description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{restaurant.description}</p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between gap-2 border-t border-border pt-4">
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <QrCode className="size-3.5 text-primary" />
          <span className="tabular-nums">{restaurant.scanOrders}</span>
          <span className="text-xs text-muted-foreground">commandes via scan</span>
        </div>
        <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium capitalize', planColors[restaurant.plan] ?? planColors.starter)}>
          {restaurant.plan}
        </span>
      </div>
    </Link>
  )
}

/* ─────────────────────────────────────────────── */
/*  New Restaurant Modal                           */
/* ─────────────────────────────────────────────── */

function NewRestaurantModal({ onClose }: { onClose: () => void }) {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('name') ?? '').trim()
    const city = String(fd.get('city') ?? '').trim()
    const address = String(fd.get('address') ?? '').trim()
    const description = String(fd.get('description') ?? '').trim()
    const plan = String(fd.get('plan') ?? 'starter') as Restaurant['plan']

    if (!name || !city) {
      toast.error('Le nom et la ville sont obligatoires')
      return
    }

    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    actions.createRestaurant({ name, slug, city, address, description, logo: '', status: 'active', plan })
    toast.success(`Restaurant « ${name} » créé avec succès`)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6">
          <div>
            <h2 className="font-semibold text-lg">Nouveau restaurant</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">Remplissez les informations de base</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-full hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="grid gap-4 p-6 sm:grid-cols-2">
          <FormField label="Nom du restaurant *" className="sm:col-span-2">
            <input name="name" required placeholder="Ex: Dar Zitoun" className={inputCls} />
          </FormField>

          <FormField label="Ville *">
            <input name="city" required placeholder="Ex: Marrakech" className={inputCls} />
          </FormField>

          <FormField label="Formule">
            <select name="plan" className={inputCls} defaultValue="starter">
              <option value="starter">Starter</option>
              <option value="growth">Growth</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </FormField>

          <FormField label="Adresse" className="sm:col-span-2">
            <input name="address" placeholder="Ex: 12 Rue Hassan II, Médina" className={inputCls} />
          </FormField>

          <FormField label="Description" className="sm:col-span-2">
            <textarea
              name="description"
              rows={3}
              placeholder="Décrivez votre restaurant en quelques mots..."
              className={`${inputCls} h-auto py-2.5`}
            />
          </FormField>

          <div className="flex justify-end gap-2 sm:col-span-2">
            <button type="button" onClick={onClose} className="h-11 rounded-full px-5 text-sm font-medium hover:bg-muted">
              Annuler
            </button>
            <button
              type="submit"
              className="h-11 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground"
            >
              Créer le restaurant
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────── */
/*  Shared primitives                              */
/* ─────────────────────────────────────────────── */

const inputCls =
  'h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15'

function FormField({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  )
}

function Kpi({
  icon: Icon,
  label,
  value,
  accent,
  muted,
}: {
  icon: LucideIcon
  label: string
  value: number
  accent?: boolean
  muted?: boolean
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground lg:text-sm">{label}</span>
        <span
          className={cn(
            'flex size-8 items-center justify-center rounded-lg',
            accent ? 'bg-emerald-500/10 text-emerald-600' : muted ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary',
          )}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <p
        className={cn(
          'mt-3 font-serif text-2xl font-semibold tabular-nums lg:text-3xl',
          accent && 'text-emerald-600',
          muted && 'text-muted-foreground',
        )}
      >
        {value}
      </p>
    </div>
  )
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary font-serif text-lg font-bold text-primary-foreground">
        Z
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-serif font-semibold">Dar Zitoun</span>
        <span className="text-xs text-muted-foreground">Super Administration</span>
      </span>
    </Link>
  )
}
