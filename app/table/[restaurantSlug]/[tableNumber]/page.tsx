import type { Metadata } from 'next'
import { ClientFlow } from '@/components/client/client-flow'

export const metadata: Metadata = { title: 'Commandez — Resto QR' }

export default async function TablePage({
  params,
}: {
  params: Promise<{ restaurantSlug: string; tableNumber: string }>
}) {
  const { restaurantSlug, tableNumber } = await params
  return <ClientFlow restaurantSlug={restaurantSlug} tableNumber={Number(tableNumber)} />
}
