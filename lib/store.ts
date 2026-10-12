'use client'

import { useSyncExternalStore } from 'react'
import { createSeedState } from './seed'
import type { AppState, CartItem, Dish, OrderStatus, PaymentMethod, Staff, TableInfo } from './types'

// Front-end only: state lives in localStorage and syncs across tabs via the
// `storage` event, so the client, kitchen and admin screens stay in sync.
const STORAGE_KEY = 'dar-zitoun-state-v1'

let state: AppState | null = null
const listeners = new Set<() => void>()

function parseState(raw: string | null): AppState {
  const fallback = createSeedState()
  if (!raw) return fallback
  try {
    const parsed = JSON.parse(raw) as Partial<AppState> | null
    if (!parsed || typeof parsed !== 'object') return fallback

    // Keep older browser sessions compatible when the state shape evolves.
    return {
      ...fallback,
      ...parsed,
      restaurants: Array.isArray(parsed.restaurants) ? parsed.restaurants : fallback.restaurants,
      dishes: Array.isArray(parsed.dishes) ? parsed.dishes : fallback.dishes,
      orders: Array.isArray(parsed.orders) ? parsed.orders : fallback.orders,
      tables: Array.isArray(parsed.tables) ? parsed.tables : fallback.tables,
      staff: Array.isArray(parsed.staff) ? parsed.staff : fallback.staff,
      billRequests: Array.isArray(parsed.billRequests) ? parsed.billRequests : fallback.billRequests,
    }
  } catch {
    return fallback
  }
}

function load(): AppState {
  if (state) return state
  try {
    state = parseState(localStorage.getItem(STORAGE_KEY))
  } catch {
    state = createSeedState()
  }
  return state
}

function emit() {
  listeners.forEach((l) => l())
}

function setState(updater: (s: AppState) => AppState) {
  state = updater(load())
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
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
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export function useAppState(): AppState | null {
  return useSyncExternalStore(subscribe, load, () => null)
}

const uid = () => Math.random().toString(36).slice(2, 10)

export const actions = {
  placeOrder(table: number, items: CartItem[], payment: PaymentMethod) {
    const current = load()
    const number = current.nextOrderNumber
    const id = uid()
    const now = Date.now()
    setState((s) => ({
      ...s,
      nextOrderNumber: s.nextOrderNumber + 1,
      orders: [
        ...s.orders,
        {
          id,
          number,
          table,
          items,
          payment,
          total: items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
          status: 'pending',
          createdAt: now,
          updatedAt: now,
        },
      ],
    }))
    return { id, number }
  },
  setOrderStatus(id: string, status: OrderStatus) {
    setState((s) => ({
      ...s,
      orders: s.orders.map((o) => (o.id === id ? { ...o, status, updatedAt: Date.now() } : o)),
    }))
  },
  rateOrder(id: string, rating: number, comment: string) {
    setState((s) => ({
      ...s,
      orders: s.orders.map((o) => (o.id === id ? { ...o, rating, comment } : o)),
    }))
  },
  requestBill(table: number) {
    setState((s) => {
      if (s.billRequests.some((b) => b.table === table && !b.resolved)) return s
      return { ...s, billRequests: [...s.billRequests, { id: uid(), table, createdAt: Date.now(), resolved: false }] }
    })
  },
  resolveBill(id: string) {
    setState((s) => ({
      ...s,
      billRequests: s.billRequests.map((b) => (b.id === id ? { ...b, resolved: true } : b)),
    }))
  },
  confirmPayment(id: string, table: number) {
    setState((s) => ({
      ...s,
      orders: s.orders.map((o) => (o.id === id ? { ...o, status: 'served', updatedAt: Date.now() } : o)),
      billRequests: s.billRequests.map((b) => (b.table === table && !b.resolved ? { ...b, resolved: true } : b)),
    }))
  },
  upsertDish(dish: Dish) {
    setState((s) => {
      const exists = s.dishes.some((d) => d.id === dish.id)
      return {
        ...s,
        dishes: exists ? s.dishes.map((d) => (d.id === dish.id ? dish : d)) : [...s.dishes, dish],
      }
    })
  },
  toggleDish(id: string) {
    setState((s) => ({
      ...s,
      dishes: s.dishes.map((d) => (d.id === id ? { ...d, available: !d.available } : d)),
    }))
  },
  deleteDish(id: string) {
    setState((s) => ({ ...s, dishes: s.dishes.filter((d) => d.id !== id) }))
  },
  addTable(table: Omit<TableInfo, 'number'>) {
    setState((s) => {
      const number = Math.max(0, ...s.tables.map((t) => t.number)) + 1
      return { ...s, tables: [...s.tables, { ...table, number }] }
    })
  },
  removeTable(number: number) {
    setState((s) => ({ ...s, tables: s.tables.filter((t) => t.number !== number) }))
  },
  addStaff(member: Omit<Staff, 'id'>) {
    setState((s) => ({ ...s, staff: [...s.staff, { ...member, id: uid() }] }))
  },
  toggleStaff(id: string) {
    setState((s) => ({ ...s, staff: s.staff.map((m) => (m.id === id ? { ...m, active: !m.active } : m)) }))
  },
  removeStaff(id: string) {
    setState((s) => ({ ...s, staff: s.staff.filter((m) => m.id !== id) }))
  },
  reset() {
    setState(() => createSeedState())
  },
  createRestaurant(data: Omit<import('./types').Restaurant, 'id' | 'createdAt' | 'scanOrders'>) {
    setState((s) => ({
      ...s,
      restaurants: [...s.restaurants, { ...data, id: uid(), createdAt: Date.now(), scanOrders: 0 }],
    }))
  },
  updateRestaurant(id: string, data: Partial<Omit<import('./types').Restaurant, 'id' | 'createdAt'>>) {
    setState((s) => ({
      ...s,
      restaurants: s.restaurants.map((r) => (r.id === id ? { ...r, ...data } : r)),
    }))
  },
  newId: uid,
}

export const ACTIVE_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready']
