'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Building2, ChefHat, LayoutDashboard, MapPin, QrCode, ReceiptText, RotateCcw, ShoppingBag, Users, UtensilsCrossed, type LucideIcon } from 'lucide-react'
import { toast } from 'sonner'
import { AppLoader } from '@/components/app-loader'
import { actions, useAppState } from '@/lib/store'
import { cn } from '@/lib/utils'
import { AdminDashboard } from './admin-dashboard'
import { AdminMenu } from './admin-menu'
import { AdminOrders } from './admin-orders'
import { AdminStaff } from './admin-staff'
import { AdminTables } from './admin-tables'

type Tab = 'restaurants' | 'dashboard' | 'orders' | 'menu' | 'tables' | 'staff'

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'restaurants', label: 'Restaurants', icon: Building2 },
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'orders', label: 'Commandes', icon: ReceiptText },
  { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
  { id: 'tables', label: 'Tables & QR', icon: QrCode },
  { id: 'staff', label: 'Équipe', icon: Users },
]

export function AdminApp() {
  const state = useAppState()
  const [tab, setTab] = useState<Tab>('restaurants')
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null)
  if (!state) return <AppLoader />

  const selectedRestaurant = state.restaurants.find((restaurant) => restaurant.id === selectedRestaurantId)
  const current = TABS.find((t) => t.id === tab)!

  return (
    <div className="flex min-h-dvh bg-secondary/40">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-e border-border bg-card p-4 lg:flex">
        <Brand />
        <nav aria-label="Administration" className="mt-8 flex flex-col gap-1">
          {TABS.map((t) => (
            <NavButton key={t.id} tab={t} active={tab === t.id} onClick={() => setTab(t.id)} />
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-1">
          <Link href="/serveur" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
            <ChefHat className="size-4" /> Écran cuisine
          </Link>
          <button
            type="button"
            onClick={() => {
              actions.reset()
              toast.success('Données de démonstration réinitialisées')
            }}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <RotateCcw className="size-4" /> Réinitialiser la démo
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <Brand />
            <Link href="/serveur" className="flex size-10 items-center justify-center rounded-full bg-muted" aria-label="Écran cuisine">
              <ChefHat className="size-4" />
            </Link>
          </div>
          <nav aria-label="Administration" className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-2">
            {TABS.map((t) => (
              <NavButton key={t.id} tab={t} active={tab === t.id} onClick={() => setTab(t.id)} compact />
            ))}
          </nav>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 p-4 lg:p-8">
          <h1 className="mb-6 font-serif text-2xl font-semibold lg:text-3xl">{current.label}</h1>
          {tab === 'restaurants' && (
            selectedRestaurant ? (
              <RestaurantWorkspace
                state={state}
                restaurant={selectedRestaurant}
                onBack={() => setSelectedRestaurantId(null)}
                onOpenMenu={() => setTab('menu')}
              />
            ) : (
              <RestaurantDirectory state={state} onSelect={(id) => setSelectedRestaurantId(id)} />
            )
          )}
          {tab === 'dashboard' && <AdminDashboard state={state} />}
          {tab === 'orders' && <AdminOrders state={state} />}
          {tab === 'menu' && <AdminMenu dishes={state.dishes} />}
          {tab === 'tables' && <AdminTables state={state} />}
          {tab === 'staff' && <AdminStaff staff={state.staff} />}
        </main>
      </div>
    </div>
  )
}

function RestaurantDirectory({ state, onSelect }: { state: NonNullable<ReturnType<typeof useAppState>>; onSelect: (id: string) => void }) {
  const totalOrders = state.orders.length
  const activeRestaurants = state.restaurants.filter((restaurant) => restaurant.status === 'active').length
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <DirectoryKpi label="Restaurants" value={state.restaurants.length} />
        <DirectoryKpi label="Actifs" value={activeRestaurants} />
        <DirectoryKpi label="Suspendus" value={state.restaurants.length - activeRestaurants} />
        <DirectoryKpi label="Commandes globales" value={totalOrders} />
      </div>
      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div><h2 className="font-semibold">Tous les établissements</h2><p className="text-sm text-muted-foreground">Données isolées par restaurant</p></div>
          <button type="button" onClick={() => toast.info('Création de restaurant bientôt disponible')} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Créer un restaurant</button>
        </div>
        <div className="divide-y divide-border">
          {state.restaurants.map((restaurant) => {
            const tableCount = restaurant.id === state.activeRestaurantId ? state.tables.length : restaurant.id === 'cafe-atlas' ? 12 : 30
            return <div key={restaurant.id} className="flex flex-wrap items-center gap-4 p-5">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Building2 className="size-5" /></div>
              <div className="min-w-40 flex-1"><p className="font-semibold">{restaurant.name}</p><p className="text-sm text-muted-foreground">{restaurant.city} · {restaurant.plan}</p></div>
              <span className="text-sm text-muted-foreground">{tableCount} tables</span>
              <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', restaurant.status === 'active' ? 'bg-emerald-500/10 text-emerald-700' : 'bg-amber-500/10 text-amber-700')}>{restaurant.status === 'active' ? 'Actif' : 'Suspendu'}</span>
              <button type="button" onClick={() => onSelect(restaurant.id)} className="rounded-xl border border-border px-3 py-2 text-sm font-medium hover:bg-muted">Ouvrir</button>
            </div>
          })}
        </div>
      </section>
    </div>
  )
}

function RestaurantWorkspace({
  state,
  restaurant,
  onBack,
  onOpenMenu,
}: {
  state: NonNullable<ReturnType<typeof useAppState>>
  restaurant: NonNullable<ReturnType<typeof useAppState>>['restaurants'][number]
  onBack: () => void
  onOpenMenu: () => void
}) {
  const restaurantOrders = restaurant.id === state.activeRestaurantId ? state.orders : []
  const menuCount = restaurant.id === state.activeRestaurantId ? state.dishes.length : 0
  const totalRevenue = restaurantOrders.reduce((sum, order) => sum + order.total, 0)

  return (
    <div className="flex flex-col gap-6">
      <button type="button" onClick={onBack} className="flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Retour aux restaurants
      </button>
      <section className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="bg-primary p-6 text-primary-foreground lg:p-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-background/15 font-serif text-3xl font-semibold">{restaurant.name.slice(0, 1)}</div>
              <div>
                <p className="text-sm font-medium text-primary-foreground/70">Établissement</p>
                <h2 className="font-serif text-3xl font-semibold">{restaurant.name}</h2>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-primary-foreground/75"><MapPin className="size-3.5" />{restaurant.city}, Maroc</p>
              </div>
            </div>
            <span className="rounded-full bg-background/15 px-3 py-1.5 text-xs font-semibold">{restaurant.status === 'active' ? 'Actif' : 'Suspendu'}</span>
          </div>
          <p className="mt-7 max-w-2xl text-sm leading-6 text-primary-foreground/80">Pilotez le menu, les commandes et l&apos;activité de {restaurant.name} depuis cet espace.</p>
        </div>
        <div className="grid grid-cols-2 divide-x divide-border lg:grid-cols-4">
          <WorkspaceStat label="Commandes via QR" value={restaurantOrders.length} icon={ShoppingBag} />
          <WorkspaceStat label="Chiffre d&apos;affaires" value={`${totalRevenue} MAD`} icon={ReceiptText} />
          <WorkspaceStat label="Plats au menu" value={menuCount} icon={UtensilsCrossed} />
          <WorkspaceStat label="Tables" value={restaurant.id === state.activeRestaurantId ? state.tables.length : 0} icon={QrCode} />
        </div>
      </section>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between gap-3"><div><h3 className="font-semibold">Informations du restaurant</h3><p className="mt-1 text-sm text-muted-foreground">Identité et emplacement</p></div><Building2 className="size-5 text-primary" /></div>
          <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2"><div><dt className="text-muted-foreground">Nom</dt><dd className="mt-1 font-medium">{restaurant.name}</dd></div><div><dt className="text-muted-foreground">Ville</dt><dd className="mt-1 font-medium">{restaurant.city}</dd></div><div><dt className="text-muted-foreground">Formule</dt><dd className="mt-1 font-medium capitalize">{restaurant.plan}</dd></div><div><dt className="text-muted-foreground">Slug</dt><dd className="mt-1 font-medium">/{restaurant.slug}</dd></div></dl>
        </section>
        <section className="rounded-2xl border border-border bg-card p-5"><div className="flex items-center justify-between gap-3"><div><h3 className="font-semibold">Gestion du menu</h3><p className="mt-1 text-sm text-muted-foreground">Ajoutez, modifiez ou désactivez les plats de cet établissement.</p></div><UtensilsCrossed className="size-5 text-primary" /></div><button type="button" onClick={onOpenMenu} className="mt-6 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">Ouvrir la gestion du menu</button></section>
      </div>
    </div>
  )
}

function WorkspaceStat({ label, value, icon: Icon }: { label: string; value: string | number; icon: LucideIcon }) {
  return <div className="p-4 lg:p-5"><div className="flex items-center justify-between gap-2"><span className="text-xs text-muted-foreground">{label}</span><Icon className="size-4 text-primary" /></div><p className="mt-2 font-serif text-2xl font-semibold">{value}</p></div>
}

function DirectoryKpi({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl border border-border bg-card p-4"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 font-serif text-3xl font-semibold">{value}</p></div>
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary font-serif text-lg font-bold text-primary-foreground">
        Z
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-serif font-semibold">Dar Zitoun</span>
        <span className="text-xs text-muted-foreground">Administration</span>
      </span>
    </Link>
  )
}

function NavButton({
  tab,
  active,
  onClick,
  compact,
}: {
  tab: (typeof TABS)[number]
  active: boolean
  onClick: () => void
  compact?: boolean
}) {
  const Icon = tab.icon
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex shrink-0 items-center gap-3 rounded-xl text-sm font-medium transition-colors',
        compact ? 'px-3 py-2' : 'px-3 py-2.5',
        active ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      <Icon className="size-4" />
      {tab.label}
    </button>
  )
}
