'use client'

import { useSyncExternalStore } from 'react'
import { createSeedState } from './seed'
import type { AppState, CartItem, Category, Dish, Order, OrderStatus, PaymentMethod, Restaurant } from './types'

/* ══════════════════════════════════════════════════════
   Store — Resto QR (front-end only, localStorage)
   ══════════════════════════════════════════════════════ */

const STORAGE_KEY = 'dar-zitoun-state-v1'

let state: AppState | null = null
const listeners = new Set<() => void>()

function parseState(raw: string | null): AppState {
  const fallback = createSeedState()
  if (!raw) return fallback
  try {
    const parsed = JSON.parse(raw) as Partial<AppState> | null
    if (!parsed || typeof parsed !== 'object') return fallback
    return {
      ...fallback,
      ...parsed,
      restaurants:  Array.isArray(parsed.restaurants)  ? parsed.restaurants  : fallback.restaurants,
      dishes:       Array.isArray(parsed.dishes)        ? parsed.dishes        : fallback.dishes,
      tables:       Array.isArray(parsed.tables)        ? parsed.tables        : fallback.tables,
      orders:       Array.isArray(parsed.orders)        ? parsed.orders        : fallback.orders,
      billRequests: Array.isArray(parsed.billRequests)  ? parsed.billRequests  : fallback.billRequests,
      staff:        Array.isArray(parsed.staff)         ? parsed.staff         : fallback.staff,
      categories:   Array.isArray(parsed.categories)    ? parsed.categories    : fallback.categories,
    }
  } catch {
    return fallback
  }
}

function load(): AppState {
  if (state) return state
  try { state = parseState(localStorage.getItem(STORAGE_KEY)) } catch { state = createSeedState() }
  return state
}

function emit() { listeners.forEach((l) => l()) }

function setState(updater: (s: AppState) => AppState) {
  state = updater(load())
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
  emit()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return
    state = parseState(e.newValue)
    emit()
  }
  window.addEventListener('storage', onStorage)
  return () => { listeners.delete(listener); window.removeEventListener('storage', onStorage) }
}

export function useAppState(): AppState | null {
  return useSyncExternalStore(subscribe, load, () => null)
}

export const ACTIVE_STATUSES: import('./types').OrderStatus[] = [
  'pending', 'confirmed', 'preparing', 'ready',
]

const uid = () => Math.random().toString(36).slice(2, 10)

/* ════════════════════════════════════════════════
   ACTIONS
   ════════════════════════════════════════════════ */

export const actions = {

  /* ── Commandes client (ancien format) ─────────── */

  placeOrder(table: number, items: CartItem[], payment: PaymentMethod) {
    setState((s) => {
      const number = s.nextOrderNumber
      const now = Date.now()
      const order: Order = {
        id: uid(), number, table, items,
        total: items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
        status: 'pending', payment,
        createdAt: now, updatedAt: now,
        restaurantId: s.activeRestaurantId,
      }
      return { ...s, nextOrderNumber: s.nextOrderNumber + 1, orders: [...s.orders, order] }
    })
  },

  updateOrderStatus(orderId: string, status: OrderStatus) {
    setState((s) => ({
      ...s,
      orders: s.orders.map((o) =>
        o.id === orderId ? { ...o, status, updatedAt: Date.now() } : o,
      ),
    }))
  },

  rateOrder(orderId: string, rating: number, comment?: string) {
    setState((s) => ({
      ...s,
      orders: s.orders.map((o) =>
        o.id === orderId ? { ...o, rating, comment, updatedAt: Date.now() } : o,
      ),
    }))
  },

  requestBill(table: number) {
    setState((s) => ({
      ...s,
      billRequests: [
        ...s.billRequests.filter((b) => b.table !== table),
        { id: uid(), table, createdAt: Date.now(), resolved: false },
      ],
    }))
  },

  resolveBillRequest(id: string) {
    setState((s) => ({
      ...s,
      billRequests: s.billRequests.map((b) => (b.id === id ? { ...b, resolved: true } : b)),
    }))
  },

  /* ── Plats (admin) ─────────────────────────────── */

  upsertDish(dish: Dish) {
    setState((s) => {
      const exists = s.dishes.some((d) => d.id === dish.id)
      return { ...s, dishes: exists ? s.dishes.map((d) => (d.id === dish.id ? dish : d)) : [...s.dishes, dish] }
    })
  },

  toggleDish(id: string) {
    setState((s) => ({ ...s, dishes: s.dishes.map((d) => (d.id === id ? { ...d, available: !d.available } : d)) }))
  },

  deleteDish(id: string) {
    setState((s) => ({ ...s, dishes: s.dishes.filter((d) => d.id !== id) }))
  },

  /* ── Restaurants (Super Admin) ─────────────────── */

  createRestaurant(data: Omit<Restaurant, 'id' | 'createdAt' | 'scanOrders'>) {
    setState((s) => ({
      ...s,
      restaurants: [...s.restaurants, { ...data, id: uid(), createdAt: Date.now(), scanOrders: 0 }],
    }))
  },

  updateRestaurant(id: string, data: Partial<Omit<Restaurant, 'id' | 'createdAt'>>) {
    setState((s) => ({
      ...s,
      restaurants: s.restaurants.map((r) => (r.id === id ? { ...r, ...data } : r)),
    }))
  },

  deleteRestaurant(id: string) {
    setState((s) => ({
      ...s,
      restaurants: s.restaurants.filter((r) => r.id !== id),
      categories:  s.categories.filter((c) => c.restaurantId !== id),
    }))
  },

  /* ── Tables (Super Admin) ──────────────────────── */

  addTable(data: Omit<import('./types').TableInfo, 'id' | 'number'>) {
    setState((s) => {
      const existing = s.tables.filter((t) => t.restaurantId === data.restaurantId)
      const number = Math.max(0, ...existing.map((t) => t.number)) + 1
      return { ...s, tables: [...s.tables, { ...data, id: uid(), number }] }
    })
  },

  deleteTable(id: string) {
    setState((s) => ({ ...s, tables: s.tables.filter((t) => t.id !== id) }))
  },

  /* ── Catégories (Super Admin) ──────────────────── */

  createCategory(data: Omit<Category, 'id'>) {
    setState((s) => ({ ...s, categories: [...s.categories, { ...data, id: uid() }] }))
  },

  updateCategory(id: string, data: Partial<Omit<Category, 'id' | 'restaurantId'>>) {
    setState((s) => ({ ...s, categories: s.categories.map((c) => (c.id === id ? { ...c, ...data } : c)) }))
  },

  deleteCategory(id: string) {
    setState((s) => ({ ...s, categories: s.categories.filter((c) => c.id !== id) }))
  },

  /* ── Reset démo ─────────────────────────────────── */

  reset() { setState(() => createSeedState()) },

  newId: uid,
}
