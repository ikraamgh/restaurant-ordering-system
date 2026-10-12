'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  ExternalLink,
  Flame,
  Info,
  MapPin,
  Pencil,
  Plus,
  Printer,
  QrCode,
  ShoppingBag,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Users,
  Utensils,
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { toast } from 'sonner'
import { AppLoader } from '@/components/app-loader'
import { BottomSheet } from '@/components/bottom-sheet'
import { t } from '@/lib/seed'
import { actions, useAppState } from '@/lib/store'
import { cn } from '@/lib/utils'
import type { Category, Dish, MLText, Restaurant, TableInfo } from '@/lib/types'

const AVAILABLE_LANGS = [
  { code: 'fr', label: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'en', label: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar', label: 'العربية', flag: '🇲🇦', dir: 'rtl' },
]

const DISH_IMAGES = [
  '/dishes/burger.png',
  '/dishes/cafe.png',
  '/dishes/cheesecake.png',
  '/dishes/couscous.png',
  '/dishes/ftour-marocain.png',
  '/dishes/jus-orange.png',
  '/dishes/msemen.png',
  '/dishes/omelette.png',
  '/dishes/pancakes.png',
  '/dishes/pates.png',
  '/dishes/pizza.png',
  '/dishes/poisson.png',
  '/dishes/salade.png',
  '/dishes/tajine-poulet.png',
  '/dishes/the-menthe.png',
]

type Props = {
  restaurantId: string
}

export function RestaurantDetail({ restaurantId }: Props) {
  const state = useAppState()
  const [activeTab, setActiveTab] = useState<'info' | 'tables' | 'menu'>('info')

  // Edit Restaurant modal
  const [showEditRestoModal, setShowEditRestoModal] = useState(false)
  const [editName, setEditName] = useState('')
  const [editCity, setEditCity] = useState('')
  const [editAddress, setEditAddress] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editStatus, setEditStatus] = useState<'active' | 'suspended'>('active')
  const [editLanguages, setEditLanguages] = useState<string[]>(['fr', 'en', 'ar'])

  // Tables state
  const [showAddTableModal, setShowAddTableModal] = useState(false)
  const [newTableZone, setNewTableZone] = useState('Salle')
  const [newTableSeats, setNewTableSeats] = useState(4)
  const [selectedQrTable, setSelectedQrTable] = useState<TableInfo | null>(null)

  // Categories state
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [catNameFr, setCatNameFr] = useState('')
  const [catNameEn, setCatNameEn] = useState('')
  const [catNameAr, setCatNameAr] = useState('')

  // Dishes state
  const [showDishModal, setShowDishModal] = useState(false)
  const [editingDish, setEditingDish] = useState<Dish | null>(null)
  const [dishTab, setDishTab] = useState<'info' | 'translations'>('info')
  const [dishCategoryId, setDishCategoryId] = useState('')
  const [dishPrice, setDishPrice] = useState<number>(50)
  const [dishImage, setDishImage] = useState<string>(DISH_IMAGES[0])
  const [dishAvailable, setDishAvailable] = useState<boolean>(true)
  const [dishPopular, setDishPopular] = useState<boolean>(false)
  const [dishName, setDishName] = useState<MLText>({ fr: '', en: '', ar: '' })
  const [dishDesc, setDishDesc] = useState<MLText>({ fr: '', en: '', ar: '' })

  const restaurant = useMemo(() => {
    return state?.restaurants.find((r) => r.id === restaurantId)
  }, [state, restaurantId])

  const restaurantOrders = useMemo(() => {
    return state?.orders.filter((o) => o.restaurantId === restaurantId) ?? []
  }, [state, restaurantId])

  const restaurantTables = useMemo(() => {
    return state?.tables.filter((t) => t.restaurantId === restaurantId) ?? []
  }, [state, restaurantId])

  const restaurantCategories = useMemo(() => {
    return (state?.categories.filter((c) => c.restaurantId === restaurantId) ?? []).sort(
      (a, b) => a.order - b.order,
    )
  }, [state, restaurantId])

  const restaurantDishes = useMemo(() => {
    return state?.dishes.filter((d) => d.restaurantId === restaurantId) ?? []
  }, [state, restaurantId])

  // Stats
  const stats = useMemo(() => {
    const totalOrders = restaurantOrders.length
    const paidOrders = restaurantOrders.filter((o) => o.status === 'paid')
    const revenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0)
    const activeOrders = restaurantOrders.filter((o) => o.status === 'active')
    const avgBasket = paidOrders.length > 0 ? revenue / paidOrders.length : 0

    return {
      totalOrders,
      paidCount: paidOrders.length,
      activeCount: activeOrders.length,
      revenue,
      avgBasket,
    }
  }, [restaurantOrders])

  if (!state) {
    return <AppLoader />
  }

  if (!restaurant) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <Building2 className="size-12 text-muted-foreground/60" />
        <h2 className="mt-4 font-serif text-2xl font-bold">Restaurant introuvable</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          L'identifiant « {restaurantId} » ne correspond à aucun restaurant enregistré.
        </p>
        <Link
          href="/admin"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90"
        >
          <ArrowLeft className="size-4" />
          Retour au Super Admin
        </Link>
      </div>
    )
  }

  // Pre-fill Edit Modal
  const openEditRestaurant = () => {
    setEditName(restaurant.name)
    setEditCity(restaurant.city)
    setEditAddress(restaurant.address || '')
    setEditDescription(restaurant.description || '')
    setEditStatus(restaurant.status)
    setEditLanguages(restaurant.languages || ['fr', 'en', 'ar'])
    setShowEditRestoModal(true)
  }

  const handleUpdateRestaurant = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editName.trim() || !editCity.trim()) {
      toast.error('Le nom et la ville sont obligatoires')
      return
    }
    if (editLanguages.length === 0) {
      toast.error('Sélectionnez au moins une langue')
      return
    }

    actions.updateRestaurant(restaurant.id, {
      name: editName.trim(),
      city: editCity.trim(),
      address: editAddress.trim(),
      description: editDescription.trim(),
      status: editStatus,
      languages: editLanguages,
    })

    toast.success('Informations du restaurant mises à jour')
    setShowEditRestoModal(false)
  }

  // Table Handlers
  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTableZone.trim()) {
      toast.error('La zone est obligatoire')
      return
    }
    actions.addTable({
      restaurantId: restaurant.id,
      zone: newTableZone.trim(),
      seats: Number(newTableSeats) || 2,
    })
    toast.success('Table ajoutée avec succès')
    setShowAddTableModal(false)
    setNewTableZone('Salle')
    setNewTableSeats(4)
  }

  const handleDeleteTable = (table: TableInfo) => {
    if (window.confirm(`Confirmer la suppression de la Table #${table.number} (${table.zone}) ?`)) {
      actions.deleteTable(table.id)
      toast.success(`Table #${table.number} supprimée`)
    }
  }

  // Category Handlers
  const openNewCategory = () => {
    setEditingCategory(null)
    setCatNameFr('')
    setCatNameEn('')
    setCatNameAr('')
    setShowCategoryModal(true)
  }

  const openEditCategory = (cat: Category) => {
    setEditingCategory(cat)
    setCatNameFr(cat.name?.fr || '')
    setCatNameEn(cat.name?.en || '')
    setCatNameAr(cat.name?.ar || '')
    setShowCategoryModal(true)
  }

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault()
    const fr = catNameFr.trim()
    if (!fr) {
      toast.error('Le nom français de la catégorie est obligatoire')
      return
    }

    const nameObj: MLText = {
      fr,
      ...(catNameEn.trim() ? { en: catNameEn.trim() } : {}),
      ...(catNameAr.trim() ? { ar: catNameAr.trim() } : {}),
    }

    if (editingCategory) {
      actions.updateCategory(editingCategory.id, { name: nameObj })
      toast.success('Catégorie mise à jour')
    } else {
      const nextOrder = restaurantCategories.length + 1
      actions.createCategory({
        restaurantId: restaurant.id,
        name: nameObj,
        order: nextOrder,
      })
      toast.success('Catégorie ajoutée')
    }

    setShowCategoryModal(false)
  }

  const handleDeleteCategory = (cat: Category) => {
    const dishesCount = restaurantDishes.filter((d) => d.categoryId === cat.id).length
    const promptMsg = dishesCount > 0
      ? `Supprimer la catégorie « ${t(cat.name, 'fr')} » et ses ${dishesCount} plat(s) associés ?`
      : `Supprimer la catégorie « ${t(cat.name, 'fr')} » ?`

    if (window.confirm(promptMsg)) {
      actions.deleteCategory(cat.id)
      toast.success('Catégorie supprimée')
    }
  }

  // Dish Handlers
  const openNewDish = (defaultCatId?: string) => {
    setEditingDish(null)
    setDishTab('info')
    setDishCategoryId(defaultCatId || restaurantCategories[0]?.id || '')
    setDishPrice(50)
    setDishImage(DISH_IMAGES[0])
    setDishAvailable(true)
    setDishPopular(false)
    setDishName({ fr: '', en: '', ar: '' })
    setDishDesc({ fr: '', en: '', ar: '' })
    setShowDishModal(true)
  }

  const openEditDish = (dish: Dish) => {
    setEditingDish(dish)
    setDishTab('info')
    setDishCategoryId(dish.categoryId)
    setDishPrice(dish.price)
    setDishImage(dish.image || DISH_IMAGES[0])
    setDishAvailable(dish.available)
    setDishPopular(!!dish.popular)
    setDishName({
      fr: dish.name?.fr || '',
      en: dish.name?.en || '',
      ar: dish.name?.ar || '',
    })
    setDishDesc({
      fr: dish.description?.fr || '',
      en: dish.description?.en || '',
      ar: dish.description?.ar || '',
    })
    setShowDishModal(true)
  }

  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault()
    if (!dishName.fr.trim()) {
      toast.error('Le nom français du plat est obligatoire')
      return
    }
    if (!dishCategoryId) {
      toast.error('Veuillez sélectionner une catégorie')
      return
    }

    const cleanedName: MLText = {
      fr: dishName.fr.trim(),
      ...(dishName.en.trim() ? { en: dishName.en.trim() } : {}),
      ...(dishName.ar.trim() ? { ar: dishName.ar.trim() } : {}),
    }

    const cleanedDesc: MLText = {
      fr: dishDesc.fr.trim(),
      ...(dishDesc.en.trim() ? { en: dishDesc.en.trim() } : {}),
      ...(dishDesc.ar.trim() ? { ar: dishDesc.ar.trim() } : {}),
    }

    const dishPayload: Dish = {
      id: editingDish ? editingDish.id : actions.newId(),
      restaurantId: restaurant.id,
      categoryId: dishCategoryId,
      name: cleanedName,
      description: cleanedDesc,
      price: Number(dishPrice) || 0,
      image: dishImage,
      available: dishAvailable,
      popular: dishPopular,
    }

    actions.upsertDish(dishPayload)
    toast.success(editingDish ? 'Plat mis à jour' : 'Plat créé avec succès')
    setShowDishModal(false)
  }

  const handleDeleteDish = (dish: Dish) => {
    if (window.confirm(`Supprimer le plat « ${t(dish.name, 'fr')} » ?`)) {
      actions.deleteDish(dish.id)
      toast.success('Plat supprimé')
    }
  }

  const getOrigin = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin
    }
    return ''
  }

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* ── Top Header Navigation ── */}
      <header className="sticky top-0 z-20 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 py-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/admin"
              className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
              title="Retour aux restaurants"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg sm:text-xl font-bold truncate">
                  {restaurant.name}
                </h1>
                <span
                  className={cn(
                    'hidden sm:inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold',
                    restaurant.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : 'bg-amber-500/10 text-amber-600',
                  )}
                >
                  {restaurant.status === 'active' ? 'Actif' : 'Suspendu'}
                </span>
              </div>
              <p className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                <MapPin className="size-3 shrink-0" />
                {restaurant.city} {restaurant.address ? `• ${restaurant.address}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={openEditRestaurant}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
            >
              <Pencil className="size-3.5" />
              <span className="hidden sm:inline">Modifier</span>
            </button>
            <Link
              href={`/table/${restaurant.slug}/1`}
              target="_blank"
              className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:opacity-90 transition"
            >
              <ExternalLink className="size-3.5" />
              <span className="hidden sm:inline">Aperçu Client</span>
            </Link>
          </div>
        </div>

        {/* ── Tabs bar ── */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex border-t border-border/60">
            <button
              type="button"
              onClick={() => setActiveTab('info')}
              className={cn(
                'flex items-center gap-2 border-b-2 py-3 px-4 text-xs sm:text-sm font-semibold transition cursor-pointer',
                activeTab === 'info'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              <Info className="size-4" />
              Informations
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tables')}
              className={cn(
                'flex items-center gap-2 border-b-2 py-3 px-4 text-xs sm:text-sm font-semibold transition cursor-pointer',
                activeTab === 'tables'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              <QrCode className="size-4" />
              Tables & QR ({restaurantTables.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('menu')}
              className={cn(
                'flex items-center gap-2 border-b-2 py-3 px-4 text-xs sm:text-sm font-semibold transition cursor-pointer',
                activeTab === 'menu'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              <Utensils className="size-4" />
              Menu ({restaurantDishes.length} plats)
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Tab Contents ── */}
      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        {/* ════════ TAB 1: INFORMATIONS ════════ */}
        {activeTab === 'info' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-semibold uppercase tracking-wider">Commandes totales</span>
                  <ShoppingBag className="size-4 text-primary" />
                </div>
                <div className="mt-3 font-serif text-3xl font-bold text-foreground">
                  {stats.totalOrders}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {stats.activeCount} en cours • {stats.paidCount} réglées
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-semibold uppercase tracking-wider">Commandes payées</span>
                  <CheckCircle2 className="size-4 text-emerald-500" />
                </div>
                <div className="mt-3 font-serif text-3xl font-bold text-foreground">
                  {stats.paidCount}
                </div>
                <div className="mt-2 text-xs text-emerald-600 font-medium">
                  Taux : {stats.totalOrders > 0 ? Math.round((stats.paidCount / stats.totalOrders) * 100) : 0}%
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-semibold uppercase tracking-wider">Chiffre d'affaires</span>
                  <CreditCard className="size-4 text-amber-500" />
                </div>
                <div className="mt-3 font-serif text-3xl font-bold text-foreground">
                  {stats.revenue.toLocaleString('fr-FR')} <span className="text-lg font-sans text-primary">DH</span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Panier moyen : {Math.round(stats.avgBasket)} DH
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-semibold uppercase tracking-wider">Configuration</span>
                  <Building2 className="size-4 text-sky-500" />
                </div>
                <div className="mt-3 font-serif text-3xl font-bold text-foreground">
                  {restaurantTables.length} <span className="text-lg font-sans font-normal text-muted-foreground">tables</span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {restaurantCategories.length} catégories • {restaurantDishes.length} plats
                </div>
              </div>
            </div>

            {/* Restaurant Profile Card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                <div>
                  <h2 className="font-serif text-xl font-bold text-foreground">
                    Fiche de l'établissement
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Informations publiques et paramètres régionaux
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openEditRestaurant}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:opacity-90"
                >
                  <Pencil className="size-3.5" />
                  Modifier la fiche
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground block">Nom commercial</span>
                    <span className="text-base font-semibold text-foreground">{restaurant.name}</span>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-muted-foreground block">Identifiant URL (Slug)</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded-md text-foreground font-mono">
                      /table/{restaurant.slug}/[numéro]
                    </code>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-muted-foreground block">Ville & Emplacement</span>
                    <span className="text-sm text-foreground flex items-center gap-1.5 mt-0.5">
                      <MapPin className="size-4 text-primary" />
                      {restaurant.city} {restaurant.address ? `— ${restaurant.address}` : ''}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-muted-foreground block">Statut d'exploitation</span>
                    <span
                      className={cn(
                        'mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                        restaurant.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : 'bg-amber-500/10 text-amber-600',
                      )}
                    >
                      {restaurant.status === 'active' ? '● En service' : '● Suspendu'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground block">Description</span>
                    <p className="text-sm text-foreground mt-0.5 whitespace-pre-wrap">
                      {restaurant.description || 'Aucune description renseignée.'}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-muted-foreground block">Langues supportées</span>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {restaurant.languages?.map((code) => {
                        const l = AVAILABLE_LANGS.find((item) => item.code === code)
                        return (
                          <div
                            key={code}
                            className="flex items-center gap-1.5 rounded-xl border border-border bg-secondary/50 px-3 py-1.5 text-xs font-medium text-foreground"
                          >
                            <span>{l?.flag || '🌐'}</span>
                            <span>{l?.label || code}</span>
                            <span className="uppercase text-[10px] text-muted-foreground font-mono">({code})</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-muted-foreground block">Date d'enregistrement</span>
                    <span className="text-xs text-foreground flex items-center gap-1.5 mt-0.5">
                      <Calendar className="size-3.5 text-muted-foreground" />
                      {new Date(restaurant.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <h3 className="font-semibold text-base text-foreground mb-4">
                Dernières commandes enregistrées
              </h3>
              {restaurantOrders.length === 0 ? (
                <p className="text-xs text-muted-foreground">Aucune commande pour le moment.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground">
                        <th className="pb-3 font-semibold">N°</th>
                        <th className="pb-3 font-semibold">Table</th>
                        <th className="pb-3 font-semibold">Articles</th>
                        <th className="pb-3 font-semibold">Total</th>
                        <th className="pb-3 font-semibold">Statut</th>
                        <th className="pb-3 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {restaurantOrders.slice(-5).reverse().map((order) => (
                        <tr key={order.id} className="hover:bg-muted/30">
                          <td className="py-3 font-mono font-bold">#{order.number}</td>
                          <td className="py-3">Table {order.tableNumber}</td>
                          <td className="py-3 text-muted-foreground">
                            {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                          </td>
                          <td className="py-3 font-serif font-bold text-foreground">
                            {order.total} DH
                          </td>
                          <td className="py-3">
                            <span
                              className={cn(
                                'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold',
                                order.status === 'paid'
                                  ? 'bg-emerald-500/10 text-emerald-600'
                                  : 'bg-amber-500/10 text-amber-600',
                              )}
                            >
                              {order.status === 'paid' ? 'Payée' : 'En cours'}
                            </span>
                          </td>
                          <td className="py-3 text-muted-foreground">
                            {new Date(order.createdAt).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════ TAB 2: TABLES & QR ════════ */}
        {activeTab === 'tables' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-foreground">
                  Gestion des Tables et QR Codes
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Chaque table dispose d'un QR code unique menant directement au menu de commande
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddTableModal(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs hover:opacity-90"
              >
                <Plus className="size-4" />
                Ajouter une table
              </button>
            </div>

            {/* Tables Grid */}
            {restaurantTables.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center">
                <QrCode className="size-10 text-muted-foreground/60" />
                <h3 className="mt-3 font-semibold text-foreground text-sm">Aucune table configurée</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Commencez par ajouter les tables de votre restaurant.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddTableModal(true)}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                >
                  <Plus className="size-3.5" />
                  Ajouter une table
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {restaurantTables.map((table) => {
                  const tableUrl = `/table/${restaurant.slug}/${table.number}`

                  return (
                    <div
                      key={table.id}
                      className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-4 shadow-xs transition hover:border-primary/50"
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 font-bold font-mono text-primary text-sm">
                              #{table.number}
                            </div>
                            <div>
                              <span className="font-semibold text-sm text-foreground block">
                                Table {table.number}
                              </span>
                              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                <Users className="size-3" />
                                {table.seats} places
                              </span>
                            </div>
                          </div>

                          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-foreground">
                            {table.zone}
                          </span>
                        </div>

                        {/* QR Code thumbnail */}
                        <div className="mt-4 flex flex-col items-center justify-center rounded-xl bg-muted/40 p-3 border border-border/50">
                          <QRCodeSVG
                            value={`${getOrigin()}${tableUrl}`}
                            size={100}
                            level="M"
                            className="rounded-lg bg-card p-1.5 shadow-2xs"
                          />
                          <span className="mt-2 text-[10px] text-muted-foreground font-mono truncate max-w-full">
                            {tableUrl}
                          </span>
                        </div>
                      </div>

                      {/* Card buttons */}
                      <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
                        <button
                          type="button"
                          onClick={() => setSelectedQrTable(table)}
                          className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-secondary px-3 py-2 text-xs font-semibold text-foreground hover:bg-primary hover:text-primary-foreground transition cursor-pointer"
                        >
                          <QrCode className="size-3.5" />
                          Aperçu QR
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTable(table)}
                          className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition cursor-pointer"
                          title="Supprimer la table"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ════════ TAB 3: MENU ════════ */}
        {activeTab === 'menu' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Top actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-foreground">
                  Gestion de la Carte & du Menu
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Organisez les catégories, configurez les prix et les traductions multilingues
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={openNewCategory}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted shadow-xs transition cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  Nouvelle catégorie
                </button>
                <button
                  type="button"
                  onClick={() => openNewDish()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:opacity-90 transition cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  Nouveau plat
                </button>
              </div>
            </div>

            {/* Categories & Dishes list */}
            {restaurantCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center">
                <Utensils className="size-10 text-muted-foreground/60" />
                <h3 className="mt-3 font-semibold text-foreground text-sm">Le menu est vide</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Créez une première catégorie pour commencer à ajouter vos plats.
                </p>
                <button
                  type="button"
                  onClick={openNewCategory}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                >
                  <Plus className="size-3.5" />
                  Créer une catégorie
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {restaurantCategories.map((category) => {
                  const catDishes = restaurantDishes.filter((d) => d.categoryId === category.id)

                  return (
                    <div
                      key={category.id}
                      className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs"
                    >
                      {/* Category Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 bg-secondary/40 px-5 py-4 border-b border-border">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                            {category.order}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-serif font-bold text-base text-foreground">
                                {t(category.name, 'fr')}
                              </h3>
                              <span className="rounded-full bg-card px-2 py-0.5 text-xs text-muted-foreground border border-border">
                                {catDishes.length} plat{catDishes.length > 1 ? 's' : ''}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                              {category.name?.en && <span>EN: {category.name.en}</span>}
                              {category.name?.ar && (
                                <span dir="rtl" className="font-sans">
                                  AR: {category.name.ar}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openNewDish(category.id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-card border border-border px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition"
                          >
                            <Plus className="size-3.5" />
                            Ajouter un plat
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditCategory(category)}
                            className="flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition"
                            title="Modifier la catégorie"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(category)}
                            className="flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                            title="Supprimer la catégorie"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Dishes in this Category */}
                      {catDishes.length === 0 ? (
                        <div className="p-6 text-center text-xs text-muted-foreground">
                          Aucun plat dans cette catégorie.{' '}
                          <button
                            type="button"
                            onClick={() => openNewDish(category.id)}
                            className="text-primary font-semibold hover:underline"
                          >
                            Ajouter un plat
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:gap-px md:bg-border p-px">
                          {catDishes.map((dish) => (
                            <div
                              key={dish.id}
                              className={cn(
                                'flex flex-col justify-between bg-card p-4 transition-colors',
                                !dish.available && 'opacity-60 bg-muted/20',
                              )}
                            >
                              <div className="flex gap-3">
                                {/* Dish Image */}
                                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                                  {dish.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={dish.image}
                                      alt={t(dish.name, 'fr')}
                                      className="size-full object-cover"
                                    />
                                  ) : (
                                    <div className="flex size-full items-center justify-center text-muted-foreground">
                                      <Utensils className="size-5" />
                                    </div>
                                  )}
                                  {dish.popular && (
                                    <span
                                      className="absolute top-1 left-1 rounded bg-amber-500 p-0.5 text-[9px] text-white"
                                      title="Plat Populaire"
                                    >
                                      <Flame className="size-3" />
                                    </span>
                                  )}
                                </div>

                                {/* Dish Details */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <h4 className="font-semibold text-sm text-foreground truncate">
                                      {t(dish.name, 'fr')}
                                    </h4>
                                    <span className="font-serif font-bold text-sm text-foreground shrink-0">
                                      {dish.price} DH
                                    </span>
                                  </div>

                                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                                    {t(dish.description, 'fr') || 'Sans description.'}
                                  </p>

                                  {/* Translations badge */}
                                  <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                                    <span className={cn('px-1 rounded', dish.name?.fr ? 'bg-secondary' : 'opacity-30')}>FR</span>
                                    <span className={cn('px-1 rounded', dish.name?.en ? 'bg-secondary' : 'opacity-30')}>EN</span>
                                    <span className={cn('px-1 rounded', dish.name?.ar ? 'bg-secondary' : 'opacity-30')}>AR</span>
                                  </div>
                                </div>
                              </div>

                              {/* Dish action footer */}
                              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
                                <button
                                  type="button"
                                  onClick={() => {
                                    actions.toggleDish(dish.id)
                                    toast.success(
                                      `Plat « ${t(dish.name, 'fr')} » ${
                                        dish.available ? 'désactivé' : 'activé'
                                      }`,
                                    )
                                  }}
                                  className={cn(
                                    'inline-flex items-center gap-1.5 font-medium transition cursor-pointer',
                                    dish.available
                                  ? 'text-emerald-600 hover:text-emerald-700'
                                      : 'text-muted-foreground hover:text-foreground',
                                  )}
                                >
                                  {dish.available ? (
                                    <ToggleRight className="size-5 text-emerald-500" />
                                  ) : (
                                    <ToggleLeft className="size-5" />
                                  )}
                                  <span>{dish.available ? 'Disponible' : 'Épuisé'}</span>
                                </button>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => openEditDish(dish)}
                                    className="flex size-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
                                    title="Modifier le plat"
                                  >
                                    <Pencil className="size-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteDish(dish)}
                                    className="flex size-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition cursor-pointer"
                                    title="Supprimer le plat"
                                  >
                                    <Trash2 className="size-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ════════ MODAL: EDIT RESTAURANT ════════ */}
      <BottomSheet
        open={showEditRestoModal}
        onClose={() => setShowEditRestoModal(false)}
        title="Modifier le restaurant"
      >
        <form onSubmit={handleUpdateRestaurant} className="space-y-4 p-5">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Nom de l'établissement *
            </label>
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
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
                value={editCity}
                onChange={(e) => setEditCity(e.target.value)}
                className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Statut
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as 'active' | 'suspended')}
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
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
              className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">
              Langues activées
            </label>
            <div className="grid grid-cols-3 gap-2">
              {AVAILABLE_LANGS.map((lang) => {
                const isSelected = editLanguages.includes(lang.code)
                return (
                  <button
                    type="button"
                    key={lang.code}
                    onClick={() => {
                      setEditLanguages((prev) =>
                        prev.includes(lang.code)
                          ? prev.length > 1
                            ? prev.filter((c) => c !== lang.code)
                            : prev
                          : [...prev, lang.code],
                      )
                    }}
                    className={cn(
                      'flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-medium transition cursor-pointer',
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
              onClick={() => setShowEditRestoModal(false)}
              className="rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 cursor-pointer"
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </BottomSheet>

      {/* ════════ MODAL: AJOUTER TABLE ════════ */}
      <BottomSheet
        open={showAddTableModal}
        onClose={() => setShowAddTableModal(false)}
        title="Ajouter une table"
      >
        <form onSubmit={handleAddTable} className="space-y-4 p-5">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Zone de la table *
            </label>
            <input
              type="text"
              required
              value={newTableZone}
              onChange={(e) => setNewTableZone(e.target.value)}
              placeholder="Ex: Salle, Terrasse, Patio, Étage..."
              className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
            {/* Quick Suggestions */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {['Salle', 'Terrasse', 'Patio', 'Étage', 'Bar', 'Salon VIP'].map((zone) => (
                <button
                  type="button"
                  key={zone}
                  onClick={() => setNewTableZone(zone)}
                  className="rounded-md border border-border bg-muted/60 px-2 py-0.5 text-[11px] text-muted-foreground hover:text-foreground"
                >
                  {zone}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Nombre de couverts (places) *
            </label>
            <input
              type="number"
              min={1}
              max={50}
              required
              value={newTableSeats}
              onChange={(e) => setNewTableSeats(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="rounded-xl bg-secondary/50 p-3 text-xs text-muted-foreground">
            Le numéro de la table sera attribué automatiquement par ordre croissant.
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setShowAddTableModal(false)}
              className="rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 cursor-pointer"
            >
              Créer la table
            </button>
          </div>
        </form>
      </BottomSheet>

      {/* ════════ MODAL: QR CODE PREVIEW ════════ */}
      <BottomSheet
        open={!!selectedQrTable}
        onClose={() => setSelectedQrTable(null)}
        title={selectedQrTable ? `Table #${selectedQrTable.number} — QR Code` : 'QR Code'}
      >
        {selectedQrTable && (
          <div className="flex flex-col items-center p-6 text-center">
            <div className="rounded-2xl border-2 border-border bg-white p-4 shadow-md">
              <QRCodeSVG
                value={`${getOrigin()}/table/${restaurant.slug}/${selectedQrTable.number}`}
                size={220}
                level="H"
                includeMargin
              />
            </div>

            <div className="mt-4">
              <h3 className="font-serif text-lg font-bold text-foreground">
                {restaurant.name} — Table {selectedQrTable.number}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Zone : {selectedQrTable.zone} • {selectedQrTable.seats} places
              </p>
            </div>

            <div className="mt-4 flex w-full max-w-sm items-center rounded-xl border border-border bg-muted/60 p-1.5 text-xs">
              <span className="flex-1 truncate px-2 font-mono text-[11px] text-muted-foreground">
                /table/{restaurant.slug}/{selectedQrTable.number}
              </span>
              <button
                type="button"
                onClick={() => {
                  const url = `${getOrigin()}/table/${restaurant.slug}/${selectedQrTable.number}`
                  navigator.clipboard.writeText(url)
                  toast.success('Lien copié dans le presse-papier')
                }}
                className="flex items-center gap-1 rounded-lg bg-card border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition"
              >
                <Copy className="size-3" />
                Copier
              </button>
            </div>

            <div className="mt-6 flex w-full max-w-sm items-center gap-2">
              <Link
                href={`/table/${restaurant.slug}/${selectedQrTable.number}`}
                target="_blank"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90"
              >
                <ExternalLink className="size-3.5" />
                Tester le lien client
              </Link>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted"
              >
                <Printer className="size-3.5" />
                Imprimer
              </button>
            </div>
          </div>
        )}
      </BottomSheet>

      {/* ════════ MODAL: CATEGORY (ADD / EDIT) ════════ */}
      <BottomSheet
        open={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        title={editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
      >
        <form onSubmit={handleSaveCategory} className="space-y-4 p-5">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Nom en Français (FR) *
            </label>
            <input
              type="text"
              required
              value={catNameFr}
              onChange={(e) => setCatNameFr(e.target.value)}
              placeholder="Ex: Entrées, Tajines, Desserts..."
              className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Nom en Anglais (EN)
            </label>
            <input
              type="text"
              value={catNameEn}
              onChange={(e) => setCatNameEn(e.target.value)}
              placeholder="Ex: Starters, Tagines, Desserts..."
              className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Nom en Arabe (AR)
            </label>
            <input
              type="text"
              dir="rtl"
              value={catNameAr}
              onChange={(e) => setCatNameAr(e.target.value)}
              placeholder="Ex: مقبلات، طواجن، حلويات..."
              className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none font-sans"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setShowCategoryModal(false)}
              className="rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 cursor-pointer"
            >
              {editingCategory ? 'Mettre à jour' : 'Créer la catégorie'}
            </button>
          </div>
        </form>
      </BottomSheet>

      {/* ════════ MODAL: DISH (ADD / EDIT) ════════ */}
      <BottomSheet
        open={showDishModal}
        onClose={() => setShowDishModal(false)}
        title={editingDish ? 'Modifier le plat' : 'Nouveau plat'}
        className="sm:max-w-xl"
      >
        <form onSubmit={handleSaveDish} className="p-5 space-y-5">
          {/* Internal Tabs for Dish Modal */}
          <div className="flex rounded-xl bg-secondary p-1 text-xs">
            <button
              type="button"
              onClick={() => setDishTab('info')}
              className={cn(
                'flex-1 rounded-lg py-2 font-medium transition cursor-pointer',
                dishTab === 'info'
                  ? 'bg-card text-foreground font-semibold shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Informations & Image
            </button>
            <button
              type="button"
              onClick={() => setDishTab('translations')}
              className={cn(
                'flex-1 rounded-lg py-2 font-medium transition cursor-pointer',
                dishTab === 'translations'
                  ? 'bg-card text-foreground font-semibold shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Traductions (FR / EN / AR)
            </button>
          </div>

          {dishTab === 'info' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Catégorie *
                  </label>
                  <select
                    required
                    value={dishCategoryId}
                    onChange={(e) => setDishCategoryId(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    {restaurantCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {t(c.name, 'fr')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Prix (DH) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    required
                    value={dishPrice}
                    onChange={(e) => setDishPrice(Number(e.target.value) || 0)}
                    className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Nom du plat (Français) *
                </label>
                <input
                  type="text"
                  required
                  value={dishName.fr}
                  onChange={(e) => setDishName((prev) => ({ ...prev, fr: e.target.value }))}
                  placeholder="Ex: Tajine poulet citron"
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Description courte (Français)
                </label>
                <textarea
                  rows={2}
                  value={dishDesc.fr}
                  onChange={(e) => setDishDesc((prev) => ({ ...prev, fr: e.target.value }))}
                  placeholder="Description des ingrédients et de la préparation..."
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <label className="flex items-center gap-2 rounded-xl border border-border bg-card p-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dishAvailable}
                    onChange={(e) => setDishAvailable(e.target.checked)}
                    className="size-4 rounded text-primary focus:ring-primary"
                  />
                  <span className="text-xs font-medium text-foreground">Disponible à la commande</span>
                </label>

                <label className="flex items-center gap-2 rounded-xl border border-border bg-card p-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dishPopular}
                    onChange={(e) => setDishPopular(e.target.checked)}
                    className="size-4 rounded text-primary focus:ring-primary"
                  />
                  <span className="text-xs font-medium text-foreground">Plat Populaire 🔥</span>
                </label>
              </div>

              {/* Visual Image Selector */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">
                  Illustration du plat ({DISH_IMAGES.length} visuels disponibles)
                </label>
                <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1 border border-border rounded-xl">
                  {DISH_IMAGES.map((img) => (
                    <button
                      type="button"
                      key={img}
                      onClick={() => setDishImage(img)}
                      className={cn(
                        'relative aspect-square overflow-hidden rounded-lg border-2 transition',
                        dishImage === img
                          ? 'border-primary ring-2 ring-primary/30'
                          : 'border-transparent hover:border-border',
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="Dish visual" className="size-full object-cover" />
                      {dishImage === img && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <Check className="size-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Translations Tab */
            <div className="space-y-4">
              <div className="rounded-xl bg-secondary/50 p-3 text-xs text-muted-foreground">
                Gérez ici les noms et descriptions multilingues pour les clients étrangers ou arabophones.
              </div>

              {/* French */}
              <div className="rounded-xl border border-border p-3 space-y-2">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  🇫🇷 Français (Langue par défaut)
                </span>
                <input
                  type="text"
                  required
                  value={dishName.fr}
                  onChange={(e) => setDishName((prev) => ({ ...prev, fr: e.target.value }))}
                  placeholder="Nom en français"
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
                <textarea
                  rows={2}
                  value={dishDesc.fr}
                  onChange={(e) => setDishDesc((prev) => ({ ...prev, fr: e.target.value }))}
                  placeholder="Description en français"
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              {/* English */}
              <div className="rounded-xl border border-border p-3 space-y-2">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  🇬🇧 English
                </span>
                <input
                  type="text"
                  value={dishName.en}
                  onChange={(e) => setDishName((prev) => ({ ...prev, en: e.target.value }))}
                  placeholder="Dish name in English"
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
                <textarea
                  rows={2}
                  value={dishDesc.en}
                  onChange={(e) => setDishDesc((prev) => ({ ...prev, en: e.target.value }))}
                  placeholder="Dish description in English"
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              {/* Arabic */}
              <div className="rounded-xl border border-border p-3 space-y-2">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  🇲🇦 العربية
                </span>
                <input
                  type="text"
                  dir="rtl"
                  value={dishName.ar}
                  onChange={(e) => setDishName((prev) => ({ ...prev, ar: e.target.value }))}
                  placeholder="اسم الطبق بالعربية"
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none font-sans"
                />
                <textarea
                  rows={2}
                  dir="rtl"
                  value={dishDesc.ar}
                  onChange={(e) => setDishDesc((prev) => ({ ...prev, ar: e.target.value }))}
                  placeholder="وصف الطبق بالعربية"
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none font-sans"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setShowDishModal(false)}
              className="rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 cursor-pointer"
            >
              {editingDish ? 'Mettre à jour le plat' : 'Ajouter le plat'}
            </button>
          </div>
        </form>
      </BottomSheet>
    </div>
  )
}
