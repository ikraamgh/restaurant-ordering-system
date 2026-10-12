'use client'

import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { BottomSheet } from '@/components/bottom-sheet'
import { actions } from '@/lib/store'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { AppState, CartItem, Restaurant } from '@/lib/types'

const UI: Record<string, {
  title: string; empty: string; total: string; confirm: string;
  remove: string; pay: string
}> = {
  fr: { title: 'Mon panier', empty: 'Votre panier est vide', total: 'Total', confirm: 'Commander', remove: 'Retirer', pay: 'à payer au responsable' },
  en: { title: 'My cart',    empty: 'Your cart is empty',   total: 'Total', confirm: 'Order',   remove: 'Remove',  pay: 'payable to the manager' },
  ar: { title: 'سلتي',       empty: 'سلتك فارغة',           total: 'المجموع', confirm: 'اطلب', remove: 'أزل',    pay: 'يُدفع للمسؤول' },
}

export function CartSheet({
  open,
  onClose,
  cart,
  lang,
  restaurant,
  tableNumber,
  onUpdateQty,
  onOrderPlaced,
  state,
}: {
  open: boolean
  onClose: () => void
  cart: CartItem[]
  lang: string
  restaurant: Restaurant
  tableNumber: number
  onUpdateQty: (dishId: string, delta: number) => void
  onOrderPlaced: (id: string, number: number) => void
  state: AppState
}) {
  const ui = UI[lang] ?? UI.fr
  const total = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0)
  const isRTL = lang === 'ar'

  const handleConfirm = () => {
    if (cart.length === 0) return
    const result = actions.placeOrder(restaurant.id, tableNumber, lang, cart)
    toast.success(lang === 'ar' ? 'تم إرسال طلبك!' : lang === 'en' ? 'Order sent!' : 'Commande envoyée !')
    onOrderPlaced(result.id, result.number)
  }

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={ui.title}
      dir={isRTL ? 'rtl' : 'ltr'}
      footer={
        cart.length > 0 ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{ui.total}</span>
              <span className="font-serif text-xl font-semibold tabular-nums text-primary">
                {formatPrice(total, lang)}
              </span>
            </div>
            <p className="text-center text-xs text-muted-foreground">💳 {ui.pay}</p>
            <button
              type="button"
              onClick={handleConfirm}
              className="h-12 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground active:scale-[0.98]"
            >
              ✓ {ui.confirm}
            </button>
          </div>
        ) : null
      }
    >
      {cart.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-5 py-16 text-center text-muted-foreground">
          <span className="text-5xl">🛒</span>
          <p className="text-sm">{ui.empty}</p>
        </div>
      ) : (
        <ul className="divide-y divide-border px-5">
          {cart.map((item) => (
            <li key={item.key} className="flex items-center gap-3 py-4">
              {/* Qty controls */}
              <div className="flex items-center gap-2 rounded-full bg-muted px-2 py-1">
                <button
                  type="button"
                  onClick={() => onUpdateQty(item.dishId, -1)}
                  className="flex size-7 items-center justify-center rounded-full bg-card text-sm font-bold shadow-sm"
                >
                  −
                </button>
                <span className="w-5 text-center text-sm font-semibold tabular-nums">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQty(item.dishId, +1)}
                  className="flex size-7 items-center justify-center rounded-full bg-card text-sm font-bold shadow-sm"
                >
                  +
                </button>
              </div>

              {/* Name */}
              <p className="min-w-0 flex-1 text-sm font-medium">{item.name}</p>

              {/* Price */}
              <span className="shrink-0 text-sm font-semibold tabular-nums">
                {formatPrice(item.unitPrice * item.quantity, lang)}
              </span>

              {/* Remove */}
              <button
                type="button"
                onClick={() => onUpdateQty(item.dishId, -item.quantity)}
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-destructive hover:bg-destructive/10"
                aria-label={ui.remove}
              >
                <Trash2 className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </BottomSheet>
  )
}
