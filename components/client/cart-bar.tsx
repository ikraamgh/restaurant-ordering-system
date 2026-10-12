'use client'

import { ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/lib/format'
import type { CartItem } from '@/lib/types'
import type { DICT } from './i18n'

export function CartBar({ cart, t, onOpen }: { cart: CartItem[]; t: (typeof DICT)['fr']; onOpen: () => void }) {
  const count = cart.reduce((s, i) => s + i.quantity, 0)
  const total = cart.reduce((s, i) => s + i.quantity * i.unitPrice, 0)
  if (count === 0) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <button
        type="button"
        onClick={onOpen}
        className="pointer-events-auto mx-auto flex h-14 w-full max-w-md items-center gap-3 rounded-full bg-foreground ps-2 pe-5 text-background shadow-xl animate-in slide-in-from-bottom-4 transition-transform active:scale-[0.98]"
      >
        <span className="relative flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <ShoppingBag className="size-4" />
          <span className="absolute -end-1 -top-1 flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
            {count}
          </span>
        </span>
        <span className="font-semibold">{t.viewCart}</span>
        <span className="ms-auto font-semibold tabular-nums">{formatPrice(total)}</span>
      </button>
    </div>
  )
}
