'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ShoppingCart, Star } from 'lucide-react'
import { t } from '@/lib/seed'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/format'
import type { AppState, CartItem, Restaurant } from '@/lib/types'

const UI: Record<string, { menu: string; popular: string; unavailable: string; add: string; cart: string; table: string }> = {
  fr: { menu: 'Menu', popular: 'Populaire', unavailable: 'Épuisé', add: 'Ajouter', cart: 'Panier', table: 'Table' },
  en: { menu: 'Menu', popular: 'Popular',   unavailable: 'Out of stock', add: 'Add',    cart: 'Cart',   table: 'Table' },
  ar: { menu: 'قائمة الطعام', popular: 'الأكثر طلبًا', unavailable: 'نفذ', add: 'أضف',  cart: 'السلة', table: 'طاولة' },
}

export function MenuView({
  restaurant,
  lang,
  state,
  cart,
  tableNumber,
  onAddToCart,
  onOpenCart,
  totalQty,
}: {
  restaurant: Restaurant
  lang: string
  state: AppState
  cart: CartItem[]
  tableNumber: number
  onAddToCart: (item: CartItem) => void
  onOpenCart: () => void
  totalQty: number
}) {
  const ui = UI[lang] ?? UI.fr
  const categories = state.categories
    .filter((c) => c.restaurantId === restaurant.id)
    .sort((a, b) => a.order - b.order)

  const dishes = state.dishes.filter((d) => d.restaurantId === restaurant.id)

  const [activeCat, setActiveCat] = useState<string>(categories[0]?.id ?? 'all')

  const visibleDishes =
    activeCat === 'all'
      ? dishes.filter((d) => d.available)
      : dishes.filter((d) => d.categoryId === activeCat && d.available)

  const cartQty = (dishId: string) =>
    cart.find((i) => i.dishId === dishId)?.quantity ?? 0

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      {/* ── Header ── */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur">
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <div>
            <h1 className="font-serif text-lg font-semibold leading-tight">{restaurant.name}</h1>
            <p className="text-xs text-muted-foreground">
              {ui.table} {tableNumber}
            </p>
          </div>
          {/* Cart button (mobile header) */}
          {totalQty > 0 && (
            <button
              type="button"
              onClick={onOpenCart}
              className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              <ShoppingCart className="size-4" />
              {totalQty}
            </button>
          )}
        </div>

        {/* Category tabs */}
        {categories.length > 0 && (
          <nav className="no-scrollbar flex gap-1 overflow-x-auto px-4 pb-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCat(cat.id)}
                className={cn(
                  'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                  activeCat === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground',
                )}
              >
                {t(cat.name, lang)}
              </button>
            ))}
          </nav>
        )}
      </header>

      {/* ── Dish Grid ── */}
      <main className="flex-1 p-4 pb-28">
        {visibleDishes.length === 0 ? (
          <div className="mt-20 flex flex-col items-center gap-3 text-center text-muted-foreground">
            <span className="text-4xl">🍽️</span>
            <p className="text-sm">{ui.unavailable}</p>
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {visibleDishes.map((dish) => {
              const qty = cartQty(dish.id)
              return (
                <li
                  key={dish.id}
                  className="flex gap-3 rounded-2xl border border-border bg-card p-3 transition-shadow hover:shadow-sm"
                >
                  {/* Image */}
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={dish.image || '/placeholder.svg'}
                      alt={t(dish.name, lang)}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                    {dish.popular && (
                      <span className="absolute top-1 start-1 flex items-center gap-0.5 rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold text-amber-900">
                        <Star className="size-2.5 fill-amber-900" /> {ui.popular}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="font-semibold leading-tight line-clamp-2">
                      {t(dish.name, lang)}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                      {t(dish.description, lang)}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                      <span className="font-semibold text-primary tabular-nums">
                        {formatPrice(dish.price, lang)}
                      </span>

                      {qty === 0 ? (
                        <button
                          type="button"
                          onClick={() =>
                            onAddToCart({
                              key: `${dish.id}-${Date.now()}`,
                              dishId: dish.id,
                              name: t(dish.name, lang),
                              unitPrice: dish.price,
                              quantity: 1,
                            })
                          }
                          className="flex h-8 items-center gap-1 rounded-full bg-primary px-3 text-xs font-semibold text-primary-foreground active:scale-95"
                        >
                          + {ui.add}
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 rounded-full bg-primary/10 px-2 py-1">
                          <button
                            type="button"
                            onClick={() =>
                              onAddToCart({
                                key: `${dish.id}-${Date.now()}`,
                                dishId: dish.id,
                                name: t(dish.name, lang),
                                unitPrice: dish.price,
                                quantity: -1,
                              })
                            }
                            className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
                          >
                            −
                          </button>
                          <span className="w-4 text-center text-sm font-semibold tabular-nums">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onAddToCart({
                                key: `${dish.id}-${Date.now()}`,
                                dishId: dish.id,
                                name: t(dish.name, lang),
                                unitPrice: dish.price,
                                quantity: 1,
                              })
                            }
                            className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </main>

      {/* ── Floating cart button ── */}
      {totalQty > 0 && (
        <div className="fixed bottom-6 start-0 end-0 z-20 flex justify-center px-4">
          <button
            type="button"
            onClick={onOpenCart}
            className="flex w-full max-w-sm items-center justify-between gap-3 rounded-2xl bg-foreground px-5 py-4 text-background shadow-2xl active:scale-[0.98] transition-transform"
          >
            <span className="flex size-7 items-center justify-center rounded-full bg-background/20 text-sm font-bold">
              {totalQty}
            </span>
            <span className="font-semibold">{ui.cart}</span>
            <ShoppingCart className="size-5" />
          </button>
        </div>
      )}
    </div>
  )
}
