import type { Metadata } from 'next'
import { ResponsableApp } from '@/components/responsable/responsable-app'

export const metadata: Metadata = { title: 'Responsable — Resto QR' }

export default async function ResponsablePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  // id is the restaurant slug
  return <ResponsableApp restaurantSlug={id} />
}
