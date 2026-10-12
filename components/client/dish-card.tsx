'use client'

import Image from 'next/image'
import { Flame, Heart, Leaf, Plus } from 'lucide-react'
import { formatPrice } from '@/lib/format'
import type { CartItem, Dish } from '@/lib/types'
import { cn } from '@/lib/utils'
import type { DICT } from './i18n'

type Props = {
  dish: Dish
  t: (typeof DICT)['fr']
  isFavorite: boolean
  onToggleFavorite: () => void
  onOpen: () => void
  onQuickAdd: (item: CartItem) => void
}

export function DishCard({ dish, t, isFavorite, onToggleFavorite, onOpen, onQuickAdd }: Props) {
  const disabled = !dish.available
  return (
    <article
      className={cn(
        'group relative flex gap-3 rounded-2xl border border-border bg-card p-2.5 transition-shadow hover:shadow-md',
        disabled && 'opacity-60',
      )}
    >
      <button
        type="button"
        onClick={onOpen}
        className="relative size-28 shrink-0 overflow-hidden rounded-xl bg-muted"
        aria-label={dish.name}
      >
        <Image
          src={dish.image || '/placeholder.svg'}
          alt=""
          fill
          sizes="112px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {dish.popular && dish.available && (
          <span className="absolute start-1.5 top-1.5 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
            {t.popular}
          </span>
        )}
        {disabled && (
          <span className="absolute inset-0 flex items-center justify-center bg-foreground/50 text-xs font-semibold text-background">
            {t.unavailable}
          </span>
        )}
      </button>

      <div className="flex min-w-0 flex-1 flex-col py-0.5 pe-1">
        <div className="flex items-start gap-2">
          <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-start">
            <h3 className="font-semibold leading-snug">{dish.name}</h3>
          </button>
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-pressed={isFavorite}
            aria-label={t.favorites}
            className="-me-1 -mt-1 flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-primary"
          >
            <Heart className={cn('size-4', isFavorite && 'fill-primary text-primary')} />
          </button>
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{dish.description}</p>
        <div className="mt-auto flex items-center gap-2 pt-2">
          <span className="font-semibold text-foreground">{formatPrice(dish.price)}</span>
          {dish.tags.includes('vegetarian') && <Leaf className="size-3.5 text-success" aria-label={t.tags.vegetarian} />}
          {dish.spiceLevel > 0 && (
            <span className="flex text-primary" aria-label={`${t.spice} ${dish.spiceLevel}/3`}>
              {Array.from({ length: dish.spiceLevel }).map((_, i) => (
                <Flame key={i} className="size-3.5" aria-hidden="true" />
              ))}
            </span>
          )}
          <button
            type="button"
            disabled={disabled}
            onClick={() =>
              dish.removable.length || dish.extras.length
                ? onOpen()
                : onQuickAdd({
                    key: `${dish.id}|||normal|`,
                    dishId: dish.id,
                    name: dish.name,
                    unitPrice: dish.price,
                    quantity: 1,
                    removed: [],
                    extras: [],
                    spice: 'normal',
                    note: '',
                  })
            }
            aria-label={`${t.add} ${dish.name}`}
            className="ms-auto flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:bg-muted disabled:text-muted-foreground"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>
    </article>
  )
}
