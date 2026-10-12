/* ═══════════════════════════════════════════════
   RESTO QR — Types centraux
   ═══════════════════════════════════════════════ */

/** Texte multilingue : { fr: '...', en: '...', ar: '...' } */
export type MLText = Record<string, string>

export type Language = {
  code: string
  name: string
  flag: string       // emoji drapeau
  dir: 'ltr' | 'rtl'
}

export const LANGUAGES: Language[] = [
  { code: 'fr', name: 'Français',  flag: '🇫🇷', dir: 'ltr' },
  { code: 'en', name: 'English',   flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar', name: 'العربية',   flag: '🇲🇦', dir: 'rtl' },
]

/* ── Restaurants ─────────────────────────────── */

export type Restaurant = {
  id: string
  name: string
  slug: string
  city: string
  address: string
  description: string
  logo: string
  status: 'active' | 'suspended'
  languages: string[]   // codes langue activés pour ce resto
  createdAt: number
}

/* ── Menu ────────────────────────────────────── */

export type Category = {
  id: string
  restaurantId: string
  name: MLText
  order: number
}

export type Dish = {
  id: string
  restaurantId: string
  categoryId: string
  name: MLText
  description: MLText
  price: number
  image: string
  available: boolean
  popular?: boolean
}

/* ── Tables ──────────────────────────────────── */

export type TableInfo = {
  id: string
  restaurantId: string
  number: number
  seats: number
  zone: string
}

/* ── Commandes ───────────────────────────────── */

export type CartItem = {
  key: string
  dishId: string
  name: string        // nom dans la langue du client
  unitPrice: number
  quantity: number
}

export type OrderStatus = 'active' | 'paid'

export type Order = {
  id: string
  number: number
  restaurantId: string
  tableNumber: number
  lang: string
  items: CartItem[]
  total: number
  status: OrderStatus
  createdAt: number
  paidAt?: number
}

/* ── État global ─────────────────────────────── */

export type AppState = {
  restaurants: Restaurant[]
  categories: Category[]
  dishes: Dish[]
  tables: TableInfo[]
  orders: Order[]
  nextOrderNumber: number
}
