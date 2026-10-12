import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ClientApp } from '@/components/client/client-app'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  return { title: `Table ${id} ÔÇö Dar Zitoun` }
}

export default async function TablePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const table = Number(id)
  if (!Number.isInteger(table) || table < 1) notFound()
  return <ClientApp table={table} />
}
