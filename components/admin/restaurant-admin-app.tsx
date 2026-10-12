'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Building2,
  ChefHat,
  MapPin,
  Pencil,
  Plus,
  QrCode,
  ReceiptText,
  RotateCcw,
  Save,
  Search,
  ShoppingBag,
  Trash2,
  UtensilsCrossed,
  X,
  type LucideIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { AppLoader } from '@/components/app-loader'
import { BottomSheet } from '@/components/bottom-sheet'
import { actions, useAppState } from '@/lib/store'
import { MOMENTS, TAG_LABELS } from '@/lib/seed'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'
import { DishForm } from './dish-form'
import type { Dish, DishTag, Moment, Restaurant } from '@/lib/types'

type RestaurantTab = 'info' | 'menu'

/* ─────────────────────────────────────────────── */
/*  Restaurant Admin App  (route /admin/restaurant/[id])  */
/* ─────────────────────────────────────────────── */

export function RestaurantAdminApp({ restaurantId }: { restaurantId: string }) {
  const state = useAppState()
  const [tab, setTab] = useState<RestaurantTab>('info')

  if (!state) return <AppLoader />

  const restaurant = state.restaurants.find((r) => r.id === restaurantId)
  if (!restaurant) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-8">
        <Building2 className="size-12 text-muted-foreground" />
        <p className="font-semibold text-lg">Restaurant introuvable</p>
        <Link href="/admin" className="text-sm text-primary underline">
          Retour au tableau de bord
        </Link>
      </div>
    )
  }

  const restaurantOrders = restaurant.id === state.activeRestaurantId ? state.orders : []
  const menuCount = restaurant.id === state.activeRestaurantId ? state.dishes.length : 0

  const initials = restaurant.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="min-h-dvh bg-secondary/40">
      {/* ── Header ── */}
      <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Retour
          </Link>
          <span className="text-muted-foreground/40">|</span>
          <span className="font-semibold text-sm truncate">{restaurant.name}</span>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/serveur"
              className="hidden items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground sm:flex"
            >
              <ChefHat className="size-4" /> Cuisine
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Banner ── */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:py-10">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Logo */}
              <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-background/15 lg:size-20">
                {restaurant.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={restaurant.logo} alt={restaurant.name} className="size-full object-cover" />
                ) : (
                  <span className="font-serif text-3xl font-bold">{initials}</span>
                )}
              </div>
              <div>
                <p className="text-xs font-medium text-primary-foreground/60">Établissement</p>
                <h1 className="font-serif text-3xl font-semibold lg:text-4xl">{restaurant.name}</h1>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-primary-foreground/75">
                  <MapPin className="size-3.5" />
                  {restaurant.address || restaurant.city + ', Maroc'}
                </p>
              </div>
            </div>
            <span
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-semibold',
                restaurant.status === 'active' ? 'bg-emerald-400/20 text-emerald-100' : 'bg-amber-400/20 text-amber-100',
              )}
            >
              {restaurant.status === 'active' ? '● Actif' : '○ Suspendu'}
            </span>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <HeroStat label="Commandes via scan" value={restaurant.scanOrders + restaurantOrders.length} icon={ShoppingBag} />
            <HeroStat label="Plats au menu" value={menuCount} icon={UtensilsCrossed} />
            <HeroStat label="Formule" value={restaurant.plan} icon={ReceiptText} />
            <HeroStat label="Tables" value={restaurant.id === state.activeRestaurantId ? state.tables.length : 0} icon={QrCode} />
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6">
          <nav className="flex gap-1">
            {([
              { id: 'info' as const, label: 'Informations', icon: Building2 },
              { id: 'menu' as const, label: 'Menus', icon: UtensilsCrossed },
            ] as { id: RestaurantTab; label: string; icon: LucideIcon }[]).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  'flex items-center gap-2 border-b-2 px-4 py-3.5 text-sm font-medium transition-colors',
                  tab === t.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
              >
                <t.icon className="size-4" />
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {tab === 'info' && <RestaurantInfoTab restaurant={restaurant} />}
        {tab === 'menu' && <RestaurantMenuTab dishes={restaurant.id === state.activeRestaurantId ? state.dishes : []} />}
      </main>
    </div>
  )
}

/* ─────────────────────────────────────────────── */
/*  Info Tab                                       */
/* ─────────────────────────────────────────────── */

function RestaurantInfoTab({ restaurant }: { restaurant: Restaurant }) {
  const [editing, setEditing] = useState(false)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Identity card */}
      <section className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="font-semibold">Identité du restaurant</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">Nom, logo et description</p>
          </div>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <Pencil className="size-3.5" /> Modifier
          </button>
        </div>
        <div className="p-6">
          {/* Logo preview */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted">
              {restaurant.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={restaurant.logo} alt="" className="size-full object-cover" />
              ) : (
                <span className="font-serif text-2xl font-bold text-muted-foreground">
                  {restaurant.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="font-semibold text-lg">{restaurant.name}</p>
              <p className="text-sm text-muted-foreground capitalize">{restaurant.plan} · {restaurant.status === 'active' ? 'Actif' : 'Suspendu'}</p>
            </div>
          </div>

          <dl className="grid gap-4 text-sm">
            <InfoRow label="Description" value={restaurant.description || '—'} />
            <InfoRow label="Slug URL" value={`/${restaurant.slug}`} mono />
          </dl>
        </div>
      </section>

      {/* Location card */}
      <section className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="font-semibold">Localisation</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">Ville et adresse</p>
          </div>
          <MapPin className="size-5 text-primary" />
        </div>
        <div className="p-6">
          <dl className="grid gap-4 text-sm">
            <InfoRow label="Ville" value={restaurant.city} />
            <InfoRow label="Adresse complète" value={restaurant.address || '—'} />
          </dl>

          {/* Map placeholder */}
          <div className="mt-6 flex h-36 items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">
            <MapPin className="me-2 size-4" />
            {restaurant.city}, Maroc
          </div>
        </div>
      </section>

      {/* Scan orders stats */}
      <section className="rounded-2xl border border-border bg-card overflow-hidden lg:col-span-2">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="font-semibold">Commandes via scan QR</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">Total des commandes passées par les clients via l'application</p>
          </div>
          <QrCode className="size-5 text-primary" />
        </div>
        <div className="grid grid-cols-2 divide-x divide-border lg:grid-cols-4">
          <StatBox label="Total scan" value={restaurant.scanOrders} />
          <StatBox label="Ce mois" value={Math.round(restaurant.scanOrders * 0.18)} />
          <StatBox label="Cette semaine" value={Math.round(restaurant.scanOrders * 0.05)} />
          <StatBox label="Aujourd'hui" value={Math.round(restaurant.scanOrders * 0.008)} />
        </div>
      </section>

      {/* Edit Modal */}
      {editing && <EditRestaurantModal restaurant={restaurant} onClose={() => setEditing(false)} />}
    </div>
  )
}

/* ─────────────────────────────────────────────── */
/*  Edit Restaurant Modal                          */
/* ─────────────────────────────────────────────── */

function EditRestaurantModal({ restaurant, onClose }: { restaurant: Restaurant; onClose: () => void }) {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    actions.updateRestaurant(restaurant.id, {
      name: String(fd.get('name') ?? '').trim() || restaurant.name,
      city: String(fd.get('city') ?? '').trim() || restaurant.city,
      address: String(fd.get('address') ?? '').trim(),
      description: String(fd.get('description') ?? '').trim(),
      status: fd.get('status') as Restaurant['status'],
      plan: fd.get('plan') as Restaurant['plan'],
    })
    toast.success('Informations mises à jour')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-6">
          <h2 className="font-semibold text-lg">Modifier le restaurant</h2>
          <button type="button" onClick={onClose} className="flex size-9 items-center justify-center rounded-full hover:bg-muted">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="grid gap-4 p-6 sm:grid-cols-2">
          <FormField label="Nom" className="sm:col-span-2">
            <input name="name" defaultValue={restaurant.name} className={inputCls} />
          </FormField>
          <FormField label="Ville">
            <input name="city" defaultValue={restaurant.city} className={inputCls} />
          </FormField>
          <FormField label="Formule">
            <select name="plan" defaultValue={restaurant.plan} className={inputCls}>
              <option value="starter">Starter</option>
              <option value="growth">Growth</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </FormField>
          <FormField label="Statut">
            <select name="status" defaultValue={restaurant.status} className={inputCls}>
              <option value="active">Actif</option>
              <option value="suspended">Suspendu</option>
            </select>
          </FormField>
          <FormField label="Adresse">
            <input name="address" defaultValue={restaurant.address} className={inputCls} />
          </FormField>
          <FormField label="Description" className="sm:col-span-2">
            <textarea name="description" rows={3} defaultValue={restaurant.description} className={`${inputCls} h-auto py-2.5`} />
          </FormField>

          <div className="flex justify-end gap-2 sm:col-span-2">
            <button type="button" onClick={onClose} className="h-11 rounded-full px-5 text-sm font-medium hover:bg-muted">
              Annuler
            </button>
            <button type="submit" className="flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground">
              <Save className="size-4" /> Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────── */
/*  Menu Tab (full CRUD)                           */
/* ─────────────────────────────────────────────── */

function RestaurantMenuTab({ dishes }: { dishes: Dish[] }) {
  const [moment, setMoment] = useState<Moment | 'all'>('all')
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<Dish | 'new' | null>(null)

  const list = dishes.filter(
    (d) => (moment === 'all' || d.moments.includes(moment)) && d.name.toLowerCase().includes(query.trim().toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Rechercher</span>
          <Search className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un plat..."
            className="h-11 w-full rounded-full border border-border bg-card ps-10 pe-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
          />
        </label>
        <button
          type="button"
          onClick={() => setEditing('new')}
          className="flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="size-4" /> Ajouter un plat
        </button>
      </div>

      {/* Moment filter */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto" role="group" aria-label="Filtrer par moment">
        {[{ id: 'all' as const, label: 'Tous' }, ...MOMENTS].map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={moment === m.id}
            onClick={() => setMoment(m.id)}
            className={cn(
              'shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
              moment === m.id
                ? 'border-foreground bg-foreground text-background'
                : 'border-border bg-card hover:border-foreground/30',
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-sm text-muted-foreground">
        {list.length} plat{list.length !== 1 ? 's' : ''}
        {query && <span> pour « {query} »</span>}
      </p>

      {/* Grid */}
      {list.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((d) => (
            <MenuDishCard key={d.id} dish={d} onEdit={() => setEditing(d)} />
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16 text-center">
          <UtensilsCrossed className="size-10 text-muted-foreground/40" />
          <p className="mt-3 font-medium">Aucun plat trouvé</p>
          <p className="mt-1 text-sm text-muted-foreground">Ajoutez votre premier plat pour commencer</p>
          <button
            type="button"
            onClick={() => setEditing('new')}
            className="mt-5 flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="size-4" /> Ajouter un plat
          </button>
        </div>
      )}

      <DishForm dish={editing} onClose={() => setEditing(null)} />
    </div>
  )
}

/* ─────────────────────────────────────────────── */
/*  Dish Card                                      */
/* ─────────────────────────────────────────────── */

function MenuDishCard({ dish, onEdit }: { dish: Dish; onEdit: () => void }) {
  return (
    <li className="flex gap-3 rounded-2xl border border-border bg-card p-3">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
        <Image src={dish.image || '/placeholder.svg'} alt="" fill sizes="80px" className={cn('object-cover', !dish.available && 'grayscale')} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="truncate font-semibold">{dish.name}</p>
        <p className="text-xs text-muted-foreground">{dish.category}</p>
        <p className="mt-1 text-sm font-semibold tabular-nums">{formatPrice(dish.price)}</p>
        <div className="mt-auto flex items-center gap-1 pt-1">
          <label className="flex cursor-pointer items-center gap-2 text-xs">
            <span className="relative inline-flex">
              <input
                type="checkbox"
                checked={dish.available}
                onChange={() => actions.toggleDish(dish.id)}
                className="peer sr-only"
              />
              <span className="h-5 w-9 rounded-full bg-muted ring-1 ring-border transition-colors peer-checked:bg-emerald-500 peer-focus-visible:ring-2 peer-focus-visible:ring-ring" />
              <span className="absolute start-0.5 top-0.5 size-4 rounded-full bg-card shadow transition-transform peer-checked:translate-x-4 rtl:peer-checked:-translate-x-4" />
            </span>
            <span className={dish.available ? 'text-emerald-600' : 'text-muted-foreground'}>
              {dish.available ? 'Disponible' : 'Épuisé'}
            </span>
          </label>
          <button
            type="button"
            onClick={onEdit}
            className="ms-auto flex size-8 items-center justify-center rounded-full hover:bg-muted"
            aria-label={`Modifier ${dish.name}`}
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (!confirm(`Supprimer « ${dish.name} » ?`)) return
              actions.deleteDish(dish.id)
              toast.success('Plat supprimé')
            }}
            className="flex size-8 items-center justify-center rounded-full text-destructive hover:bg-destructive/10"
            aria-label={`Supprimer ${dish.name}`}
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>
    </li>
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

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="grid gap-1">
      <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</dt>
      <dd className={cn('font-medium', mono && 'font-mono text-xs')}>{value}</dd>
    </div>
  )
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 font-serif text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  )
}

function HeroStat({ label, value, icon: Icon }: { label: string; value: string | number; icon: LucideIcon }) {
  return (
    <div className="rounded-xl bg-background/10 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-primary-foreground/70">{label}</span>
        <Icon className="size-4 text-primary-foreground/60" />
      </div>
      <p className="mt-2 font-serif text-xl font-semibold capitalize">{value}</p>
    </div>
  )
}
