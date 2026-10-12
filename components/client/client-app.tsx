'use client'

import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { AppLoader } from '@/components/app-loader'
import { actions, ACTIVE_STATUSES, useAppState } from '@/lib/store'
import type { CartItem, Dish, Moment, PaymentMethod } from '@/lib/types'
import { CartBar } from './cart-bar'
import { CartSheet } from './cart-sheet'
import { DishSheet } from './dish-sheet'
import { DICT, type Lang } from './i18n'
import { MenuView } from './menu-view'
import { OrdersSheet } from './orders-sheet'
import { WelcomeScreen } from './welcome-screen'

export function ClientApp({ table }: { table: number }) {
  const state = useAppState()
  const [lang, setLang] = useState<Lang>('fr')
  const [moment, setMoment] = useState<Moment | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [activeDish, setActiveDish] = useState<Dish | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [ordersOpen, setOrdersOpen] = useState(false)
  const t = DICT[lang]
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  const tableOrders = useMemo(
    () => (state?.orders ?? []).filter((o) => o.table === table).sort((a, b) => b.createdAt - a.createdAt),
    [state?.orders, table],
  )
  const activeCount = tableOrders.filter((o) => ACTIVE_STATUSES.includes(o.status)).length

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.key === item.key)
      if (existing) return prev.map((p) => (p.key === item.key ? { ...p, quantity: p.quantity + item.quantity } : p))
      return [...prev, item]
    })
    setActiveDish(null)
    toast.success(`${item.quantity} × ${item.name}`, { duration: 1800 })
  }, [])

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setCart((prev) => (quantity <= 0 ? prev.filter((p) => p.key !== key) : prev.map((p) => (p.key === key ? { ...p, quantity } : p))))
  }, [])

  const placeOrder = (payment: PaymentMethod) => {
    const { number } = actions.placeOrder(table, cart, payment)
    setCart([])
    setCartOpen(false)
    setOrdersOpen(true)
    toast.success(`Commande n°${number} envoyée en cuisine`)
  }

  if (!state) return <AppLoader />

  const tableExists = state.tables.some((tb) => tb.number === table)
  if (!tableExists) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-2 p-6 text-center">
        <h1 className="font-serif text-2xl font-semibold">Table introuvable</h1>
        <p className="text-muted-foreground">Ce QR code ne correspond à aucune table active. Veuillez appeler un serveur.</p>
      </main>
    )
  }

  const billPending = state.billRequests.some((b) => b.table === table && !b.resolved)

  return (
    <div dir={dir} lang={lang}>
      {moment === null ? (
        <WelcomeScreen table={table} lang={lang} onLangChange={setLang} onSelect={setMoment} />
      ) : (
        <MenuView
          table={table}
          lang={lang}
          onLangChange={setLang}
          moment={moment}
          onMomentChange={setMoment}
          dishes={state.dishes}
          onOpenDish={setActiveDish}
          onQuickAdd={addToCart}
          onOpenOrders={() => setOrdersOpen(true)}
          activeOrders={activeCount}
        />
      )}

      <CartBar cart={cart} t={t} onOpen={() => setCartOpen(true)} />

      <DishSheet dish={activeDish} t={t} dir={dir} onClose={() => setActiveDish(null)} onAdd={addToCart} />

      <CartSheet
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        t={t}
        dir={dir}
        onQuantity={updateQuantity}
        onSubmit={placeOrder}
      />

      <OrdersSheet
        open={ordersOpen}
        onClose={() => setOrdersOpen(false)}
        orders={tableOrders}
        t={t}
        dir={dir}
        billPending={billPending}
        onRequestBill={() => {
          actions.requestBill(table)
          toast.success('Un serveur arrive avec votre addition')
        }}
      />
    </div>
  )
}
