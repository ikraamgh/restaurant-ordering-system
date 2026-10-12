'use client'

import { useMemo, useState } from 'react'
import { ArrowLeft, Heart, ReceiptText, Search } from 'lucide-react'
import { useFavorites } from '@/lib/favorites'
import { MOMENTS } from '@/lib/seed'
import type { CartItem, Dish, DishTag, Moment } from '@/lib/types'
import { cn } from '@/lib/utils'
import { DishCard } from './dish-card'
import { DICT, type Lang } from './i18n'
import { LangSwitch } from './lang-switch'

const TAGS: DishTag[] = ['vegetarian', 'spicy', 'meat', 'fish', 'dessert']

type Props = {
  table: number
  lang: Lang
  onLangChange: (l: Lang) => void
  moment: Moment
  onMomentChange: (m: Moment | null) => void
  dishes: Dish[]
  onOpenDish: (d: Dish) => void
  onQuickAdd: (item: CartItem) => void
  onOpenOrders: () => void
  activeOrders: number
}

export function MenuView(props: Props) {
  const { table, lang, onLangChange, moment, onMomentChange, dishes, onOpenDish, onQuickAdd, onOpenOrders, activeOrders } = props
  const t = DICT[lang]
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState<DishTag | 'favorites' | null>(null)
  const { favorites, toggle } = useFavorites()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return dishes.filter((d) => {
      if (q) {
        const haystack = [d.name, d.description, d.category, ...d.ingredients].join(' ').toLowerCase()
        if (!haystack.includes(q)) return false
      } else if (!d.moments.includes(moment)) return false
      if (tag === 'favorites') return favorites.includes(d.id)
      if (tag) return d.tags.includes(tag)
      return true
    })
  }, [dishes, query, moment, tag, favorites])

  const grouped = useMemo(() => {
    const map = new Map<string, Dish[]>()
    for (const d of filtered) map.set(d.category, [...(map.get(d.category) ?? []), d])
    return [...map.entries()]
  }, [filtered])

  return (
    <div className="mx-auto min-h-dvh max-w-lg pb-32">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur-lg">
        <div className="flex items-center gap-3 px-4 pt-4">
          <button
            type="button"
            onClick={() => onMomentChange(null)}
            className="flex size-10 items-center justify-center rounded-full bg-muted transition-colors hover:bg-secondary"
            aria-label={t.changeMoment}
          >
            <ArrowLeft className="size-4 rtl:rotate-180" />
          </button>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="font-serif text-lg font-semibold leading-tight">Dar Zitoun</span>
            <span className="text-xs text-muted-foreground">
              {t.table} {table}
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenOrders}
            className="relative flex size-10 items-center justify-center rounded-full bg-muted transition-colors hover:bg-secondary"
            aria-label={t.myOrders}
          >
            <ReceiptText className="size-4" />
            {activeOrders > 0 && (
              <span className="absolute -end-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {activeOrders}
              </span>
            )}
          </button>
          <LangSwitch lang={lang} onChange={onLangChange} />
        </div>

        <div className="px-4 pt-3">
          <label className="relative block">
            <span className="sr-only">{t.search}</span>
            <Search className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search}
              className="h-11 w-full rounded-full border border-border bg-card ps-10 pe-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15"
            />
          </label>
        </div>

        <nav aria-label="Moments" className="no-scrollbar flex gap-1 overflow-x-auto px-4 pt-3">
          {MOMENTS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                onMomentChange(m.id)
                setQuery('')
              }}
              aria-current={moment === m.id && !query ? 'page' : undefined}
              className={cn(
                'relative shrink-0 px-3 pb-3 pt-1 text-sm font-medium transition-colors',
                moment === m.id && !query ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t.moments[m.id]}
              {moment === m.id && !query && (
                <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary" aria-hidden="true" />
              )}
            </button>
          ))}
        </nav>
      </header>

      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-4" role="group" aria-label="Filtres">
        <FilterChip active={tag === null} onClick={() => setTag(null)}>
          {t.all}
        </FilterChip>
        <FilterChip active={tag === 'favorites'} onClick={() => setTag(tag === 'favorites' ? null : 'favorites')}>
          <Heart className="size-3.5" />
          {t.favorites}
        </FilterChip>
        {TAGS.map((tg) => (
          <FilterChip key={tg} active={tag === tg} onClick={() => setTag(tag === tg ? null : tg)}>
            {t.tags[tg]}
          </FilterChip>
        ))}
      </div>

      <main className="flex flex-col gap-8 px-4">
        {grouped.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {t.noResults}
          </p>
        )}
        {grouped.map(([category, items]) => (
          <section key={category} aria-labelledby={`cat-${category}`}>
            <h2 id={`cat-${category}`} className="mb-3 font-serif text-xl font-semibold">
              {category}
            </h2>
            <ul className="flex flex-col gap-3">
              {items.map((d) => (
                <li key={d.id}>
                  <DishCard
                    dish={d}
                    t={t}
                    isFavorite={favorites.includes(d.id)}
                    onToggleFavorite={() => toggle(d.id)}
                    onOpen={() => onOpenDish(d)}
                    onQuickAdd={onQuickAdd}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
  )
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'border-foreground bg-foreground text-background'
          : 'border-border bg-card text-foreground hover:border-foreground/30',
      )}
    >
      {children}
    </button>
  )
}
