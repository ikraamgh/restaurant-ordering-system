'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Check, Flame, Minus, Plus, Scale } from 'lucide-react'
import { BottomSheet } from '@/components/bottom-sheet'
import { formatPrice } from '@/lib/format'
import type { CartItem, Dish, Extra, SpicePreference } from '@/lib/types'
import { cn } from '@/lib/utils'
import type { DICT } from './i18n'

type T = (typeof DICT)['fr']

type Props = {
  dish: Dish | null
  t: T
  dir: 'ltr' | 'rtl'
  onClose: () => void
  onAdd: (item: CartItem) => void
}

export function DishSheet({ dish, t, dir, onClose, onAdd }: Props) {
  return (
    <BottomSheet open={!!dish} onClose={onClose} title={dish?.name ?? ''} hideTitle dir={dir}>
      {dish && <DishDetail key={dish.id} dish={dish} t={t} onAdd={onAdd} />}
    </BottomSheet>
  )
}

function DishDetail({ dish, t, onAdd }: { dish: Dish; t: T; onAdd: (item: CartItem) => void }) {
  const [quantity, setQuantity] = useState(1)
  const [removed, setRemoved] = useState<string[]>([])
  const [extras, setExtras] = useState<Extra[]>([])
  const [spice, setSpice] = useState<SpicePreference>('normal')
  const [note, setNote] = useState('')

  const unitPrice = dish.price + extras.reduce((s, e) => s + e.price, 0)

  const toggle = <V,>(list: V[], value: V, eq: (a: V, b: V) => boolean = (a, b) => a === b) =>
    list.some((v) => eq(v, value)) ? list.filter((v) => !eq(v, value)) : [...list, value]

  const submit = () => {
    const key = [
      dish.id,
      [...removed].sort().join(','),
      extras.map((e) => e.id).sort().join(','),
      spice,
      note.trim(),
    ].join('|')
    onAdd({ key, dishId: dish.id, name: dish.name, unitPrice, quantity, removed, extras, spice, note: note.trim() })
  }

  return (
    <div className="flex flex-col">
      <div className="relative mx-5 aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
        <Image src={dish.image || '/placeholder.svg'} alt={dish.name} fill sizes="512px" className="object-cover" />
      </div>

      <div className="flex flex-col gap-6 p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-primary">{dish.category}</p>
          <h3 className="mt-1 font-serif text-2xl font-semibold">{dish.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{dish.description}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
              <Scale className="size-3.5" /> {t.portion} : {dish.portion}
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
              <Flame className={cn('size-3.5', dish.spiceLevel > 0 && 'text-primary')} /> {t.spice} : {dish.spiceLevel}/3
            </span>
          </div>
        </div>

        <section>
          <h4 className="text-sm font-semibold">{t.ingredients}</h4>
          <p className="mt-1.5 text-sm text-muted-foreground">{dish.ingredients.join(' · ')}</p>
          <h4 className="mt-4 text-sm font-semibold">{t.allergens}</h4>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {dish.allergens.length === 0 ? (
              <span className="text-sm text-muted-foreground">{t.noAllergens}</span>
            ) : (
              dish.allergens.map((a) => (
                <span key={a} className="rounded-md bg-accent/25 px-2 py-0.5 text-xs font-medium">
                  {a}
                </span>
              ))
            )}
          </div>
        </section>

        {dish.removable.length > 0 && (
          <fieldset>
            <legend className="text-sm font-semibold">{t.without}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {dish.removable.map((r) => {
                const active = removed.includes(r)
                return (
                  <button
                    key={r}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setRemoved((l) => toggle(l, r))}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-sm transition-colors',
                      active ? 'border-destructive bg-destructive/10 text-destructive line-through' : 'border-border hover:border-foreground/30',
                    )}
                  >
                    {r}
                  </button>
                )
              })}
            </div>
          </fieldset>
        )}

        {dish.extras.length > 0 && (
          <fieldset>
            <legend className="text-sm font-semibold">{t.extras}</legend>
            <div className="mt-2 flex flex-col gap-2">
              {dish.extras.map((e) => {
                const active = extras.some((x) => x.id === e.id)
                return (
                  <button
                    key={e.id}
                    type="button"
                    role="checkbox"
                    aria-checked={active}
                    onClick={() => setExtras((l) => toggle(l, e, (a, b) => a.id === b.id))}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border p-3 text-sm transition-colors',
                      active ? 'border-primary bg-primary/5' : 'border-border hover:border-foreground/30',
                    )}
                  >
                    <span
                      className={cn(
                        'flex size-5 items-center justify-center rounded-md border',
                        active ? 'border-primary bg-primary text-primary-foreground' : 'border-border',
                      )}
                    >
                      {active && <Check className="size-3.5" />}
                    </span>
                    <span className="flex-1 text-start">{e.label}</span>
                    <span className="text-muted-foreground">+{formatPrice(e.price)}</span>
                  </button>
                )
              })}
            </div>
          </fieldset>
        )}

        {dish.moments.some((m) => m === 'lunch' || m === 'dinner') && (
          <fieldset>
            <legend className="text-sm font-semibold">{t.spice}</legend>
            <div className="mt-2 grid grid-cols-3 gap-1 rounded-xl bg-muted p-1" role="radiogroup">
              {(['mild', 'normal', 'hot'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={spice === s}
                  onClick={() => setSpice(s)}
                  className={cn(
                    'rounded-lg py-2 text-sm font-medium transition-colors',
                    spice === s ? 'bg-card shadow-sm' : 'text-muted-foreground',
                  )}
                >
                  {t.spicePref[s]}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold">{t.note}</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={200}
            rows={2}
            placeholder={t.notePlaceholder}
            className="resize-none rounded-xl border border-border bg-background p-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15"
          />
        </label>
      </div>

      <div className="sticky bottom-0 flex items-center gap-3 border-t border-border bg-card p-4">
        <div className="flex items-center gap-1 rounded-full bg-muted p-1">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex size-9 items-center justify-center rounded-full bg-card shadow-sm disabled:opacity-40"
            disabled={quantity <= 1}
            aria-label="Diminuer"
          >
            <Minus className="size-4" />
          </button>
          <span className="w-8 text-center font-semibold tabular-nums" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(20, q + 1))}
            className="flex size-9 items-center justify-center rounded-full bg-card shadow-sm"
            aria-label="Augmenter"
          >
            <Plus className="size-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={submit}
          disabled={!dish.available}
          className="flex h-12 flex-1 items-center justify-between rounded-full bg-primary px-5 font-semibold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-50"
        >
          <span>{dish.available ? t.addToCart : t.unavailable}</span>
          <span className="tabular-nums">{formatPrice(unitPrice * quantity)}</span>
        </button>
      </div>
    </div>
  )
}
