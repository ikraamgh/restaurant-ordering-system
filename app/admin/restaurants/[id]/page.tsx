import type { Metadata } from 'next'
import { RestaurantDetail } from '@/components/admin/restaurant-detail'

export const metadata: Metadata = {
  title: 'Détail Restaurant — Super Admin',
  description: 'Gestion des informations, tables, QR codes et menu du restaurant',
}

export default async function AdminRestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <RestaurantDetail restaurantId={id} />
}
