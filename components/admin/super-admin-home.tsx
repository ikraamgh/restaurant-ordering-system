'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Building2,
  Check,
  ChevronRight,
  CreditCard,
  LayoutDashboard,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  ShoppingBag,
  Store,
  TrendingUp,
  UtensilsCrossed,
} from 'lucide-react'
import { toast } from 'sonner'
import { AppLoader } from '@/components/app-loader'
import { BottomSheet } from '@/components/bottom-sheet'
import { actions, useAppState } from '@/lib/store'
import { cn } from '@/lib/utils'
import type { Restaurant } from '@/lib/types'

const AVAILABLE_LANGS = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇲🇦' },
]

export function SuperAdminHome() {
  const state = useAppState()
  const [activeSection, setActiveSection] = useState<'dashboard' | 'restaurants'>('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all')
  const [showNewModal, setShowNewModal] = useState(false)

  // New Restaurant Form State
  const [formName, setFormName] = useState('')
  const [formCity, setFormCity] = useState('')
  const [formAddress, setFormAddress] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formLanguages, setFormLanguages] = useState<string[]>(['fr', 'en', 'ar'])
  const [formStatus, setFormStatus] = useState<'active' | 'suspended'>('active')

  const resetForm = () => {
    setFormName('')
    setFormCity('')
    setFormAddress('')
    setFormDescription('')
    setFormLanguages(['fr', 'en', 'ar'])
    setFormStatus('active')
  }

  // Analytics
  const stats = useMemo(() => {
    if (!state) return null

    const totalRestaurants = state.restaurants.length
    const activeRestaurants = state.restaurants.filter((r) => r.status === 'active').length
    const suspendedRestaurants = state.restaurants.filter((r) => r.status === 'suspended').length

    const totalOrders = state.orders.length
    const paidOrders = state.orders.filter((o) => o.status === 'paid')
    const globalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0)

    // Breakdown per restaurant
    const restaurantBreakdown = state.restaurants.map((r) => {
      const restOrders = state.orders.filter((o) => o.restaurantId === r.id)
      const restPaidOrders = restOrders.filter((o) => o.status === 'paid')
      const revenue = restPaidOrders.reduce((sum, o) => sum + (o.total || 0), 0)
      return {
        restaurant: r,
        orderCount: restOrders.length,
        paidCount: restPaidOrders.length,
        revenue,
        percentage: globalRevenue > 0 ? (revenue / globalRevenue) * 100 : 0,
      }
    }).sort((a, b) => b.revenue - a.revenue)

    return {
      totalRestaurants,
      activeRestaurants,
      suspendedRestaurants,
      totalOrders,
      paidOrdersCount: paidOrders.length,
      globalRevenue,
      restaurantBreakdown,
    }
  }, [state])

  if (!state || !stats) {
    return <AppLoader />
  }

  const filteredRestaurants = state.restaurants.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreateRestaurant = (e: React.FormEvent) => {
    e.preventDefault()
    const name = formName.trim()
    const city = formCity.trim()

    if (!name || !city) {
      toast.error('Le nom et la ville sont obligatoires')
      return
    }

    if (formLanguages.length === 0) {
      toast.error('Veuillez sélectionner au moins une langue')
      return
    }

    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `resto-${Date.now().toString(36)}`

    actions.createRestaurant({
      name,
      slug,
      city,
      address: formAddress.trim(),
      description: formDescription.trim(),
      logo: '',
      status: formStatus,
      languages: formLanguages,
    })

    toast.success(`Le restaurant « ${name} » a été créé avec succès`)
    resetForm()
    setShowNewModal(false)
  }

  const toggleLanguageCheckbox = (code: string) => {
    setFormLanguages((prev) =>
      prev.includes(code)
        ? prev.length > 1
          ? prev.filter((c) => c !== code)
          : prev
        : [...prev, code],
    )
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground antialiased">
      {/* ── Left Sidebar (Desktop) ── */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card/60 backdrop-blur lg:flex">
        {/* Brand */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <UtensilsCrossed className="size-5" />
          </div>
          <div>
            <span className="font-serif text-lg font-bold tracking-tight text-foreground">Resto QR</span>
            <span className="ms-1.5 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
              SUPER ADMIN
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 space-y-1.5 p-4">
          <button
            type="button"
            onClick={() => setActiveSection('dashboard')}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
              activeSection === 'dashboard'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <LayoutDashboard className="size-4 shrink-0" />
            Tableau de bord
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('restaurants')}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
              activeSection === 'restaurants'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <Store className="size-4 shrink-0" />
            Restaurants
            <span className="ms-auto rounded-full bg-secondary px-2 py-0.5 text-xs text-foreground font-semibold">
              {state.restaurants.length}
            </span>
          </button>
        </nav>

        {/* Footer actions */}
        <div className="border-t border-border p-4 space-y-2">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Voulez-vous réinitialiser toutes les données de démonstration ?')) {
                actions.reset()
                toast.success('Données démo réinitialisées')
              }
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
          >
            <RefreshCw className="size-3.5" />
            Réinitialiser les données
          </button>

          <div className="text-center text-[11px] text-muted-foreground/70">
            Plateforme Resto QR v2.0
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Mobile / Tablet Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card/90 px-4 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <UtensilsCrossed className="size-4" />
            </div>
            <span className="font-serif font-bold text-base">Resto QR</span>
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">ADMIN</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                actions.reset()
                toast.success('Données réinitialisées')
              }}
              title="Reset Démo"
              className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <RefreshCw className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
            >
              <Plus className="size-3.5" />
              Nouveau
            </button>
          </div>
        </header>

        {/* Mobile Navigation Tabs */}
        <div className="flex border-b border-border bg-card px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setActiveSection('dashboard')}
            className={cn(
              'flex-1 border-b-2 py-3 text-center text-xs font-medium transition-colors',
              activeSection === 'dashboard'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-muted-foreground',
            )}
          >
            Tableau de bord
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('restaurants')}
            className={cn(
              'flex-1 border-b-2 py-3 text-center text-xs font-medium transition-colors',
              activeSection === 'restaurants'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-muted-foreground',
            )}
          >
            Restaurants ({state.restaurants.length})
          </button>
        </div>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Top Title Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Super Administration
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Supervision globale des restaurants, des commandes et du chiffre d'affaires
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowNewModal(true)}
              className="hidden sm:inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 cursor-pointer"
            >
              <Plus className="size-4" />
              Nouveau restaurant
            </button>
          </div>

          {/* ════════ SECTION 1: STATISTICS DASHBOARD ════════ */}
          <section id="dashboard" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                <TrendingUp className="size-5 text-primary" />
                Indicateurs clés de performance
              </h2>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card 1: Restaurants */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-xs transition hover:border-border/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Restaurants
                  </span>
                  <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                    <Building2 className="size-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="font-serif text-3xl font-bold text-foreground">
                    {stats.totalRestaurants}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-600">
                    {stats.activeRestaurants} actifs
                  </span>
                  {stats.suspendedRestaurants > 0 && (
                    <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 font-medium text-amber-600">
                      {stats.suspendedRestaurants} suspendu{stats.suspendedRestaurants > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>

              {/* Card 2: Total Orders */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-xs transition hover:border-border/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Total Commandes
                  </span>
                  <div className="rounded-xl bg-sky-500/10 p-2.5 text-sky-600">
                    <ShoppingBag className="size-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="font-serif text-3xl font-bold text-foreground">
                    {stats.totalOrders}
                  </span>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  Toutes périodes confondues ({stats.paidOrdersCount} réglées)
                </div>
              </div>

              {/* Card 3: Global Revenue */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-xs transition hover:border-border/80 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Chiffre d'affaires global
                  </span>
                  <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600">
                    <CreditCard className="size-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="font-serif text-3xl font-bold text-foreground">
                    {stats.globalRevenue.toLocaleString('fr-FR')} <span className="text-xl font-sans text-primary">DH</span>
                  </span>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  Somme totale des commandes payées
                </div>
              </div>
            </div>

            {/* Revenue per restaurant breakdown */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
                <div>
                  <h3 className="font-semibold text-base text-foreground">
                    Répartition du chiffre d'affaires par restaurant
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Comparatif des volumes de ventes encaissées
                  </p>
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  Total : {stats.globalRevenue.toLocaleString('fr-FR')} DH
                </span>
              </div>

              <div className="mt-5 divide-y divide-border/60">
                {stats.restaurantBreakdown.map((item) => (
                  <div key={item.restaurant.id} className="py-3.5 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted font-bold text-foreground text-xs">
                          {item.restaurant.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/restaurants/${item.restaurant.id}`}
                            className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate block"
                          >
                            {item.restaurant.name}
                          </Link>
                          <span className="text-xs text-muted-foreground">
                            {item.restaurant.city} • {item.paidCount} commande{item.paidCount > 1 ? 's' : ''} payée{item.paidCount > 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-serif font-bold text-sm text-foreground">
                          {item.revenue.toLocaleString('fr-FR')} DH
                        </span>
                        <div className="text-[11px] font-medium text-muted-foreground">
                          {item.percentage.toFixed(1)}% du total
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${Math.max(item.percentage, 3)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ════════ SECTION 2: RESTAURANT DIRECTORY ════════ */}
          <section id="restaurants" className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <Store className="size-5 text-primary" />
                  Répertoire des restaurants
                </h2>
                <p className="text-xs text-muted-foreground">
                  Gestion des établissements, de leurs tables, menus et accès
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative min-w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher par nom, ville..."
                    className="w-full rounded-xl border border-border bg-card py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="flex rounded-xl border border-border bg-card p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setStatusFilter('all')}
                    className={cn(
                      'rounded-lg px-2.5 py-1.5 font-medium transition',
                      statusFilter === 'all' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    Tous
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('active')}
                    className={cn(
                      'rounded-lg px-2.5 py-1.5 font-medium transition',
                      statusFilter === 'active' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    Actifs
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('suspended')}
                    className={cn(
                      'rounded-lg px-2.5 py-1.5 font-medium transition',
                      statusFilter === 'suspended' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    Suspendus
                  </button>
                </div>
              </div>
            </div>

            {/* Restaurants Cards Grid */}
            {filteredRestaurants.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center">
                <Store className="size-10 text-muted-foreground/60" />
                <h4 className="mt-3 text-sm font-semibold text-foreground">Aucun restaurant trouvé</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Ajustez vos filtres ou créez un nouvel établissement.
                </p>
                <button
                  type="button"
                  onClick={() => setShowNewModal(true)}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                >
                  <Plus className="size-3.5" />
                  Nouveau restaurant
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredRestaurants.map((restaurant) => {
                  const restOrders = state.orders.filter((o) => o.restaurantId === restaurant.id)
                  const restPaidOrders = restOrders.filter((o) => o.status === 'paid')
                  const revenue = restPaidOrders.reduce((sum, o) => sum + (o.total || 0), 0)

                  return (
                    <div
                      key={restaurant.id}
                      className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/50 hover:shadow-md"
                    >
                      {/* Top Row: Name + Status */}
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-serif font-bold text-primary text-base">
                              {restaurant.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                                {restaurant.name}
                              </h3>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                <MapPin className="size-3.5 shrink-0" />
                                <span>{restaurant.city}</span>
                              </div>
                            </div>
                          </div>

                          <span
                            className={cn(
                              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                              restaurant.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : 'bg-amber-500/10 text-amber-600',
                            )}
                          >
                            {restaurant.status === 'active' ? 'Actif' : 'Suspendu'}
                          </span>
                        </div>

                        {/* Description & Address */}
                        {restaurant.description && (
                          <p className="mt-3 text-xs text-muted-foreground line-clamp-2">
                            {restaurant.description}
                          </p>
                        )}

                        {/* Languages supported */}
                        <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                          {restaurant.languages?.map((lang) => {
                            const l = AVAILABLE_LANGS.find((al) => al.code === lang)
                            return (
                              <span
                                key={lang}
                                className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-foreground"
                              >
                                <span>{l?.flag || '🌐'}</span>
                                <span className="uppercase">{lang}</span>
                              </span>
                            )
                          })}
                        </div>
                      </div>

                      {/* Bottom Info & Action */}
                      <div className="mt-5 border-t border-border pt-4">
                        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                          <div className="rounded-xl bg-secondary/50 p-2.5">
                            <span className="text-[11px] text-muted-foreground block">Commandes</span>
                            <span className="font-semibold text-sm text-foreground">
                              {restOrders.length}
                            </span>
                          </div>
                          <div className="rounded-xl bg-secondary/50 p-2.5">
                            <span className="text-[11px] text-muted-foreground block">Chiffre d'affaires</span>
                            <span className="font-semibold text-sm text-foreground">
                              {revenue.toLocaleString('fr-FR')} DH
                            </span>
                          </div>
                        </div>

                        <Link
                          href={`/admin/restaurants/${restaurant.id}`}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs transition hover:opacity-90"
                        >
                          Ouvrir
                          <ChevronRight className="size-4" />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* ── Modal: Nouveau Restaurant ── */}
      <BottomSheet
        open={showNewModal}
        onClose={() => {
          resetForm()
          setShowNewModal(false)
        }}
        title="Nouveau restaurant"
      >
        <form onSubmit={handleCreateRestaurant} className="space-y-4 p-5">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Nom de l'établissement *
            </label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Ex: Dar Zitoun, Café Atlas..."
              className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Ville *
              </label>
              <input
                type="text"
                required
                value={formCity}
                onChange={(e) => setFormCity(e.target.value)}
                placeholder="Ex: Marrakech, Casablanca..."
                className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Statut
              </label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as 'active' | 'suspended')}
                className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="active">Actif</option>
                <option value="suspended">Suspendu</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Adresse complète
            </label>
            <input
              type="text"
              value={formAddress}
              onChange={(e) => setFormAddress(e.target.value)}
              placeholder="Ex: 12 Derb Dabachi, Médina"
              className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Courte description de l'établissement et de sa cuisine..."
              className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">
              Langues activées pour le menu
            </label>
            <div className="grid grid-cols-3 gap-2">
              {AVAILABLE_LANGS.map((lang) => {
                const isSelected = formLanguages.includes(lang.code)
                return (
                  <button
                    type="button"
                    key={lang.code}
                    onClick={() => toggleLanguageCheckbox(lang.code)}
                    className={cn(
                      'flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-medium transition cursor-pointer',
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary font-semibold'
                        : 'border-border bg-card text-muted-foreground hover:bg-muted',
                    )}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                    {isSelected && <Check className="size-3.5 text-primary" />}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => {
                resetForm()
                setShowNewModal(false)
              }}
              className="rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 cursor-pointer"
            >
              Créer le restaurant
            </button>
          </div>
        </form>
      </BottomSheet>
    </div>
  )
}
