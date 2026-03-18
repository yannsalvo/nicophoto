import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { photos: true, events: true } } },
  })
  return NextResponse.json(categories)
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const category = await prisma.category.create({ data })
    return NextResponse.json(category)
  } catch {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
