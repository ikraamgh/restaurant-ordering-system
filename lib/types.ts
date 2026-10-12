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

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'cancelled'

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
}

export type BillRequest = {
  id: string
  table: number
  createdAt: number
  resolved: boolean
}

export type TableInfo = { number: number; seats: number; zone: string }

export type Staff = { id: string; name: string; role: 'admin' | 'serveur' | 'cuisine'; active: boolean }

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
}

export type AppState = {
  restaurants: Restaurant[]
  activeRestaurantId: string
  dishes: Dish[]
  tables: TableInfo[]
  orders: Order[]
  billRequests: BillRequest[]
  staff: Staff[]
  nextOrderNumber: number
}
