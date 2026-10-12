'use client'

import { useSyncExternalStore } from 'react'
import { createSeedState } from './seed'
import type { AppState, CartItem, Category, Dish, Order, Restaurant, TableInfo } from './types'

/* ══════════════════════════════════════════════════════════
   Store — Resto QR (front-end only, localStorage + storage event)
   ══════════════════════════════════════════════════════════ */

const STORAGE_KEY = 'restoqr-state-v1'

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
      restaurants: Array.isArray(parsed.restaurants) ? parsed.restaurants : fallback.restaurants,
      categories:  Array.isArray(parsed.categories)  ? parsed.categories  : fallback.categories,
      dishes:      Array.isArray(parsed.dishes)      ? parsed.dishes      : fallback.dishes,
      tables:      Array.isArray(parsed.tables)      ? parsed.tables      : fallback.tables,
      orders:      Array.isArray(parsed.orders)      ? parsed.orders      : fallback.orders,
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

const uid = () => Math.random().toString(36).slice(2, 10)

/* ════════════════════════════════════════════════
   ACTIONS
   ════════════════════════════════════════════════ */

export const actions = {

  /* ── Commandes client ──────────────────────── */

  placeOrder(restaurantId: string, tableNumber: number, lang: string, items: CartItem[]) {
    const current = load()
    const id = uid()
    const number = current.nextOrderNumber
    const now = Date.now()
    setState((s) => ({
      ...s,
      nextOrderNumber: s.nextOrderNumber + 1,
      orders: [
        ...s.orders,
        {
          id, number, restaurantId, tableNumber, lang, items,
          total: items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
          status: 'active',
          createdAt: now,
        },
      ],
    }))
    return { id, number }
  },

  /* ── Responsable : confirmer paiement ──────── */

  confirmPayment(orderId: string) {
    setState((s) => ({
      ...s,
      orders: s.orders.map((o) =>
        o.id === orderId ? { ...o, status: 'paid', paidAt: Date.now() } : o,
      ),
    }))
  },

  /* ── Super Admin : Restaurants ─────────────── */

  createRestaurant(data: Omit<Restaurant, 'id' | 'createdAt'>) {
    setState((s) => ({
      ...s,
      restaurants: [...s.restaurants, { ...data, id: uid(), createdAt: Date.now() }],
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
      dishes:      s.dishes.filter((d) => d.restaurantId !== id),
      tables:      s.tables.filter((t) => t.restaurantId !== id),
      orders:      s.orders.filter((o) => o.restaurantId !== id),
    }))
  },

  /* ── Super Admin : Tables ──────────────────── */

  addTable(data: Omit<TableInfo, 'id' | 'number'>) {
    setState((s) => {
      const existing = s.tables.filter((t) => t.restaurantId === data.restaurantId)
      const number = Math.max(0, ...existing.map((t) => t.number)) + 1
      return { ...s, tables: [...s.tables, { ...data, id: uid(), number }] }
    })
  },

  updateTable(id: string, data: Partial<Omit<TableInfo, 'id' | 'restaurantId'>>) {
    setState((s) => ({ ...s, tables: s.tables.map((t) => (t.id === id ? { ...t, ...data } : t)) }))
  },

  deleteTable(id: string) {
    setState((s) => ({ ...s, tables: s.tables.filter((t) => t.id !== id) }))
  },

  /* ── Super Admin : Catégories ──────────────── */

  createCategory(data: Omit<Category, 'id'>) {
    setState((s) => ({ ...s, categories: [...s.categories, { ...data, id: uid() }] }))
  },

  updateCategory(id: string, data: Partial<Omit<Category, 'id' | 'restaurantId'>>) {
    setState((s) => ({ ...s, categories: s.categories.map((c) => (c.id === id ? { ...c, ...data } : c)) }))
  },

  deleteCategory(id: string) {
    setState((s) => ({
      ...s,
      categories: s.categories.filter((c) => c.id !== id),
      dishes: s.dishes.filter((d) => d.categoryId !== id),
    }))
  },

  /* ── Super Admin : Plats ───────────────────── */

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

  /* ── Reset démo ────────────────────────────── */

  reset() { setState(() => createSeedState()) },

  newId: uid,
}
