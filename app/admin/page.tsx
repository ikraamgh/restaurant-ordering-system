import type { Metadata } from 'next'
import { SuperAdminHome } from '@/components/admin/super-admin-home'

export const metadata: Metadata = {
  title: 'Super Administration — Resto QR',
  description: 'Gestion centralisée des restaurants et statistiques globales',
}

export default function AdminPage() {
  return <SuperAdminHome />
}
