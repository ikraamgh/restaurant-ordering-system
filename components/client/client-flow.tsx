'use client'

import { useState } from 'react'
import { AppLoader } from '@/components/app-loader'
import { useAppState } from '@/lib/store'
import { LANGUAGES } from '@/lib/types'
import type { CartItem } from '@/lib/types'
import { LangSelect } from './lang-select'
import { MenuView } from './menu-view'
import { CartSheet } from './cart-sheet'
import { InvoiceView } from './invoice-view'

type Step = 'lang' | 'menu' | 'invoice'

export function ClientFlow({
  restaurantSlug,
  tableNumber,
}: {
  restaurantSlug: string
  tableNumber: number
}) {
  const state = useAppState()
  const [lang, setLang] = useState<string | null>(null)
  const [step, setStep] = useState<Step>('lang')
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [orderNumber, setOrderNumber] = useState<number | null>(null)

  if (!state) return <AppLoader />

  const restaurant = state.restaurants.find((r) => r.slug === restaurantSlug)

  // ── Restaurant introuvable ou suspendu ────────────────────
  if (!restaurant || restaurant.status === 'suspended') {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-secondary/40 p-8 text-center">
        <div className="text-6xl">😕</div>
        <h1 className="font-serif text-2xl font-semibold">Restaurant indisponible</h1>
        <p className="max-w-xs text-sm text-muted-foreground">
          Ce restaurant n&apos;est pas disponible pour le moment. Veuillez contacter le personnel.
        </p>
      </div>
    )
  }

  const enabledLanguages = LANGUAGES.filter((l) => restaurant.languages.includes(l.code))
  const currentLang = lang ?? 'fr'
  const isRTL = currentLang === 'ar'

  // ── Helpers panier ────────────────────────────────────────
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.dishId === item.dishId)
      if (existing) {
        return prev.map((i) =>
          i.dishId === item.dishId ? { ...i, quantity: i.quantity + 1 } : i,
        )
      }
      return [...prev, item]
    })
  }

  const updateQty = (dishId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.dishId === dishId ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0),
    )
  }

  const clearCart = () => setCart([])

  const handleOrderPlaced = (id: string, num: number) => {
    setOrderId(id)
    setOrderNumber(num)
    setCartOpen(false)
    setStep('invoice')
    clearCart()
  }

  const handleNewOrder = () => {
    setStep('lang')
    setLang(null)
    setOrderId(null)
    setOrderNumber(null)
  }

  const totalQty = cart.reduce((s, i) => s + i.quantity, 0)

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-dvh bg-background font-sans">
      {/* ── Étape 1 : sélection langue ── */}
      {step === 'lang' && (
        <LangSelect
          restaurantName={restaurant.name}
          languages={enabledLanguages}
          onSelect={(code) => {
            setLang(code)
            setStep('menu')
          }}
        />
      )}

      {/* ── Étape 2 : menu ── */}
      {step === 'menu' && (
        <>
          <MenuView
            restaurant={restaurant}
            lang={currentLang}
            state={state}
            cart={cart}
            tableNumber={tableNumber}
            onAddToCart={addToCart}
            onOpenCart={() => setCartOpen(true)}
            totalQty={totalQty}
          />
          <CartSheet
            open={cartOpen}
            onClose={() => setCartOpen(false)}
            cart={cart}
            lang={currentLang}
            restaurant={restaurant}
            tableNumber={tableNumber}
            onUpdateQty={updateQty}
            onOrderPlaced={handleOrderPlaced}
            state={state}
          />
        </>
      )}

      {/* ── Étape 3 : facture ── */}
      {step === 'invoice' && orderId && (
        <InvoiceView
          lang={currentLang}
          restaurantName={restaurant.name}
          tableNumber={tableNumber}
          orderNumber={orderNumber!}
          cart={[]}
          state={state}
          orderId={orderId}
          onNewOrder={handleNewOrder}
        />
      )}
    </div>
  )
}
