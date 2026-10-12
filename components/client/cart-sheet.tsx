'use client'

import { useState } from 'react'
import { Banknote, HandPlatter, Minus, Plus, ShoppingBag } from 'lucide-react'
import { BottomSheet } from '@/components/bottom-sheet'
import { formatPrice } from '@/lib/format'
import type { CartItem, PaymentMethod } from '@/lib/types'
import { cn } from '@/lib/utils'
import type { DICT } from './i18n'

type Props = {
  open: boolean
  onClose: () => void
  cart: CartItem[]
  t: (typeof DICT)['fr']
  dir: 'ltr' | 'rtl'
  onQuantity: (key: string, q: number) => void
  onSubmit: (payment: PaymentMethod) => void
}

export function CartSheet({ open, onClose, cart, t, dir, onQuantity, onSubmit }: Props) {
  const [payment, setPayment] = useState<PaymentMethod>('table')
  const total = cart.reduce((s, i) => s + i.quantity * i.unitPrice, 0)

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={t.cart}
      dir={dir}
      footer={
        cart.length > 0 && (
          <div className="flex flex-col gap-4">
            <fieldset>
              <legend className="mb-2 text-sm font-semibold">{t.payment}</legend>
              <div className="grid grid-cols-2 gap-2" role="radiogroup">
                {(
                  [
                    { id: 'table', label: t.payTable, icon: HandPlatter },
                    { id: 'counter', label: t.payCounter, icon: Banknote },
                  ] as const
                ).map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={payment === id}
                    onClick={() => setPayment(id)}
                    className={cn(
                      'flex items-center gap-2 rounded-xl border p-3 text-sm font-medium transition-colors',
                      payment === id ? 'border-primary bg-primary/5 text-primary' : 'border-border',
                    )}
                  >
                    <Icon className="size-4" />
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>
            <button
              type="button"
              onClick={() => onSubmit(payment)}
              className="flex h-13 items-center justify-between rounded-full bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
            >
              <span>{t.order}</span>
              <span className="tabular-nums">{formatPrice(total)}</span>
            </button>
          </div>
        )
      }
    >
      {cart.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-5 py-14 text-center text-muted-foreground">
          <ShoppingBag className="size-8" />
          <p>{t.emptyCart}</p>
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-border px-5 pb-2">
          {cart.map((item) => (
            <li key={item.key} className="flex gap-3 py-4">
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{item.name}</p>
                <ul className="mt-1 flex flex-col gap-0.5 text-xs text-muted-foreground">
                  {item.removed.length > 0 && <li>Sans : {item.removed.join(', ')}</li>}
                  {item.extras.length > 0 && <li>+ {item.extras.map((e) => e.label).join(', ')}</li>}
                  {item.spice !== 'normal' && <li>{t.spicePref[item.spice]}</li>}
                  {item.note && <li className="italic">{`┬½ ${item.note} ┬╗`}</li>}
                </ul>
                <p className="mt-2 text-sm font-semibold tabular-nums">{formatPrice(item.unitPrice * item.quantity)}</p>
              </div>
              <div className="flex h-fit items-center gap-1 rounded-full bg-muted p-1">
                <button
                  type="button"
                  onClick={() => onQuantity(item.key, item.quantity - 1)}
                  className="flex size-8 items-center justify-center rounded-full bg-card shadow-sm"
                  aria-label={`Retirer un ${item.name}`}
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-6 text-center text-sm font-semibold tabular-nums">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => onQuantity(item.key, Math.min(20, item.quantity + 1))}
                  className="flex size-8 items-center justify-center rounded-full bg-card shadow-sm"
                  aria-label={`Ajouter un ${item.name}`}
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </BottomSheet>
  )
}
