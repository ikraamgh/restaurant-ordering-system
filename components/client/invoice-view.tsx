'use client'

import { CheckCircle2 } from 'lucide-react'
import { formatPrice } from '@/lib/format'
import type { AppState } from '@/lib/types'

const UI: Record<string, {
  sent: string; thanks: string; number: string; table: string;
  items: string; total: string; pay: string; new: string
}> = {
  fr: {
    sent: 'Commande envoyée !',
    thanks: 'Merci, votre commande a été transmise au restaurant.',
    number: 'Commande n°',
    table: 'Table',
    items: 'Détail de votre commande',
    total: 'Total à payer',
    pay: 'Paiement en caisse auprès du responsable',
    new: 'Nouvelle commande',
  },
  en: {
    sent: 'Order placed!',
    thanks: 'Thank you, your order has been sent to the restaurant.',
    number: 'Order #',
    table: 'Table',
    items: 'Order details',
    total: 'Total to pay',
    pay: 'Pay at the counter with the manager',
    new: 'New order',
  },
  ar: {
    sent: 'تم إرسال طلبك!',
    thanks: 'شكرًا، تم إرسال طلبك إلى المطعم.',
    number: 'الطلب رقم',
    table: 'طاولة',
    items: 'تفاصيل طلبك',
    total: 'المجموع للدفع',
    pay: 'الدفع في الكاسا للمسؤول',
    new: 'طلب جديد',
  },
}

export function InvoiceView({
  lang,
  restaurantName,
  tableNumber,
  orderNumber,
  orderId,
  state,
  onNewOrder,
}: {
  lang: string
  restaurantName: string
  tableNumber: number
  orderNumber: number
  orderId: string
  cart: { key: string; dishId: string; name: string; unitPrice: number; quantity: number }[]
  state: AppState
  onNewOrder: () => void
}) {
  const ui = UI[lang] ?? UI.fr
  const isRTL = lang === 'ar'

  // Get the placed order from state
  const order = state.orders.find((o) => o.id === orderId)
  const items = order?.items ?? []
  const total = order?.total ?? 0

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-gradient-to-b from-emerald-50 to-background px-6 py-12 text-center"
    >
      {/* Success icon */}
      <div className="flex size-20 items-center justify-center rounded-full bg-emerald-100">
        <CheckCircle2 className="size-10 text-emerald-600" strokeWidth={1.5} />
      </div>

      {/* Title */}
      <div>
        <h1 className="font-serif text-2xl font-semibold text-emerald-700">{ui.sent}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{ui.thanks}</p>
      </div>

      {/* Invoice card */}
      <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        {/* Header */}
        <div className="bg-primary px-5 py-4 text-primary-foreground">
          <p className="font-serif text-xl font-semibold">{restaurantName}</p>
          <div className="mt-1 flex justify-between text-xs text-primary-foreground/70">
            <span>{ui.number}{orderNumber}</span>
            <span>{ui.table} {tableNumber}</span>
          </div>
        </div>

        {/* Items */}
        <div className="px-5 py-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {ui.items}
          </p>
          <ul className="flex flex-col gap-2.5">
            {items.map((item) => (
              <li key={item.key} className="flex items-baseline justify-between gap-3 text-sm">
                <span className="flex-1 text-start">
                  <span className="text-muted-foreground">{item.quantity}×</span>{' '}
                  <span className="font-medium">{item.name}</span>
                </span>
                <span className="shrink-0 tabular-nums font-semibold">
                  {formatPrice(item.unitPrice * item.quantity, lang)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Total */}
        <div className="border-t border-border px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold">{ui.total}</span>
            <span className="font-serif text-2xl font-semibold tabular-nums text-primary">
              {formatPrice(total, lang)}
            </span>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">💳 {ui.pay}</p>
        </div>
      </div>

      {/* New order button */}
      <button
        type="button"
        onClick={onNewOrder}
        className="rounded-xl border border-border bg-card px-8 py-3 text-sm font-medium hover:bg-muted"
      >
        {ui.new}
      </button>
    </div>
  )
}
