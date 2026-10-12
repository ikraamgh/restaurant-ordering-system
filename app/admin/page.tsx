import type { Metadata } from 'next'
import { SuperAdminApp } from '@/components/admin/super-admin-app'

export const metadata: Metadata = { title: 'Super Administration — Dar Zitoun' }

export default function AdminPage() {
  return <SuperAdminApp />
}
