import type { Metadata } from 'next'
import { RestaurantAdminApp } from '@/components/admin/restaurant-admin-app'

export const metadata: Metadata = { title: 'Dashboard Restaurant — Dar Zitoun' }

export default async function RestaurantAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <RestaurantAdminApp restaurantId={id} />
}
