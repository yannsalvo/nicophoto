import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const { items } = await request.json()
    await Promise.all(
      items.map((item: { id: string; order: number }) =>
        prisma.category.update({ where: { id: item.id }, data: { order: item.order } })
      )
    )
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to reorder' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
