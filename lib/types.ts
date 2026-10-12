/* ═══════════════════════════════════════════════
   Types — Hybride : Client ancien + Super Admin nouveau
   ═══════════════════════════════════════════════ */

/* ── Client (ancien format complet) ─────────────── */

export type Moment = 'breakfast' | 'lunch' | 'dinner' | 'drinks' | 'desserts'

export type DishTag = 'vegetarian' | 'spicy' | 'meat' | 'fish' | 'dessert'

export type Extra = { id: string; label: string; price: number }

export type Dish = {
  id: string
  name: string
  moments: Moment[]
  category: string
  price: number
  description: string
  ingredients: string[]
  allergens: string[]
  spiceLevel: 0 | 1 | 2 | 3
  portion: string
  image: string
  tags: DishTag[]
  removable: string[]
  extras: Extra[]
  available: boolean
  popular?: boolean
  /** Optionnels – utilisés par le Super Admin */
  restaurantId?: string
  categoryId?: string
}

export type SpicePreference = 'normal' | 'mild' | 'hot'

export type CartItem = {
  key: string
  dishId: string
  name: string
  unitPrice: number
  quantity: number
  removed: string[]
  extras: Extra[]
  spice: SpicePreference
  note: string
}

/** Statuts du cycle de vie d'une commande (espace client + serveur) */
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'served'
  | 'cancelled'
  | 'paid'   // ← ajouté pour que le Super Admin puisse filtrer les commandes payées

export type PaymentMethod = 'counter' | 'table'

export type Order = {
  id: string
  number: number
  table: number
  items: CartItem[]
  total: number
  status: OrderStatus
  payment: PaymentMethod
  createdAt: number
  updatedAt: number
  rating?: number
  comment?: string
  /** Optionnel – utilisé par le Super Admin pour filtrer par restaurant */
  restaurantId?: string
}

export type BillRequest = {
  id: string
  table: number
  createdAt: number
  resolved: boolean
}

export type TableInfo = {
  id?: string           // optionnel – utilisé par le Super Admin
  number: number
  seats: number
  zone: string
  /** Optionnel – utilisé par le Super Admin pour filtrer par restaurant */
  restaurantId?: string
}

export type Staff = {
  id: string
  name: string
  role: 'admin' | 'serveur' | 'cuisine'
  active: boolean
}

/* ── Restaurants (enrichi avec nouveaux champs Super Admin) ── */

export type Restaurant = {
  id: string
  name: string
  slug: string
  city: string
  address: string
  description: string
  logo: string
  status: 'active' | 'suspended'
  plan: 'starter' | 'growth' | 'enterprise'
  createdAt: number
  scanOrders: number
  /** Langues activées pour le menu client (ex: ['fr', 'en', 'ar']) */
  languages: string[]
}

/* ── Catégories (Super Admin seulement) ─────────── */

export type MLText = Record<string, string>

export type Category = {
  id: string
  restaurantId: string
  name: MLText
  order: number
}

/* ── État global ─────────────────────────────────── */

export type AppState = {
  restaurants: Restaurant[]
  activeRestaurantId: string
  dishes: Dish[]
  tables: TableInfo[]
  orders: Order[]
  billRequests: BillRequest[]
  staff: Staff[]
  nextOrderNumber: number
  /** Catégories gérées par le Super Admin */
  categories: Category[]
}
