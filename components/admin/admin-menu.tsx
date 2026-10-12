'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatPrice } from '@/lib/format'
import { MOMENTS } from '@/lib/seed'
import { actions } from '@/lib/store'
import type { Dish, Moment } from '@/lib/types'
import { cn } from '@/lib/utils'
import { DishForm } from './dish-form'

export function AdminMenu({ dishes }: { dishes: Dish[] }) {
  const [moment, setMoment] = useState<Moment | 'all'>('all')
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<Dish | 'new' | null>(null)

  const list = dishes.filter(
    (d) => (moment === 'all' || d.moments.includes(moment)) && d.name.toLowerCase().includes(query.trim().toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Rechercher</span>
          <Search className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un plat..."
            className="h-11 w-full rounded-full border border-border bg-card ps-10 pe-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
          />
        </label>
        <button
          type="button"
          onClick={() => setEditing('new')}
          className="flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="size-4" /> Ajouter un plat
        </button>
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto" role="group" aria-label="Filtrer par moment">
        {[{ id: 'all' as const, label: 'Tous' }, ...MOMENTS].map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={moment === m.id}
            onClick={() => setMoment(m.id)}
            className={cn(
              'shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
              moment === m.id ? 'border-foreground bg-foreground text-background' : 'border-border bg-card hover:border-foreground/30',
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((d) => (
          <li key={d.id} className="flex gap-3 rounded-2xl border border-border bg-card p-3">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
              <Image src={d.image || '/placeholder.svg'} alt="" fill sizes="80px" className={cn('object-cover', !d.available && 'grayscale')} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="truncate font-semibold">{d.name}</p>
              <p className="text-xs text-muted-foreground">{d.category}</p>
              <p className="mt-1 text-sm font-semibold tabular-nums">{formatPrice(d.price)}</p>
              <div className="mt-auto flex items-center gap-1 pt-1">
                <label className="flex cursor-pointer items-center gap-2 text-xs">
                  <span className="relative inline-flex">
                    <input
                      type="checkbox"
                      checked={d.available}
                      onChange={() => actions.toggleDish(d.id)}
                      className="peer sr-only"
                    />
                    <span className="h-5 w-9 rounded-full bg-muted ring-1 ring-border transition-colors peer-checked:bg-success peer-focus-visible:ring-2 peer-focus-visible:ring-ring" />
                    <span className="absolute start-0.5 top-0.5 size-4 rounded-full bg-card shadow transition-transform peer-checked:translate-x-4 rtl:peer-checked:-translate-x-4" />
                  </span>
                  <span className={d.available ? 'text-success' : 'text-muted-foreground'}>{d.available ? 'Disponible' : 'Épuisé'}</span>
                </label>
                <button
                  type="button"
                  onClick={() => setEditing(d)}
                  className="ms-auto flex size-8 items-center justify-center rounded-full hover:bg-muted"
                  aria-label={`Modifier ${d.name}`}
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!confirm(`Supprimer « ${d.name} » ?`)) return
                    actions.deleteDish(d.id)
                    toast.success('Plat supprimé')
                  }}
                  className="flex size-8 items-center justify-center rounded-full text-destructive hover:bg-destructive/10"
                  aria-label={`Supprimer ${d.name}`}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <DishForm dish={editing} onClose={() => setEditing(null)} />
    </div>
  )
}
