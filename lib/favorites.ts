'use client'

import { useSyncExternalStore } from 'react'

const KEY = 'dar-zitoun-favorites'
const EMPTY: string[] = []
let cache: string[] | null = null
const listeners = new Set<() => void>()

function read() {
  if (cache) return cache
  try {
    cache = JSON.parse(localStorage.getItem(KEY) ?? '[]') as string[]
  } catch {
    cache = []
  }
  return cache
}

export function useFavorites() {
  const favorites = useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    read,
    () => EMPTY,
  )
  const toggle = (id: string) => {
    const current = read()
    cache = current.includes(id) ? current.filter((f) => f !== id) : [...current, id]
    localStorage.setItem(KEY, JSON.stringify(cache))
    listeners.forEach((l) => l())
  }
  return { favorites, toggle }
}
