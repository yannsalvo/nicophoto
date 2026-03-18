import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const photos = await prisma.photo.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      category: { select: { name: true, slug: true } },
      event: { select: { name: true } },
    },
  })
  return NextResponse.json(photos)
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const photo = await prisma.photo.create({ data })
    return NextResponse.json(photo)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create photo' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
