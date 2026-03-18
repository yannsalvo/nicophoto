import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const events = await prisma.event.findMany({
    orderBy: { order: 'asc' },
    include: {
      category: { select: { name: true } },
      _count: { select: { photos: true } },
    },
  })
  return NextResponse.json(events)
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const event = await prisma.event.create({ data })
    return NextResponse.json(event)
  } catch {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
