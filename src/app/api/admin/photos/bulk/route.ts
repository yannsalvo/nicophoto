import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { photos } = await request.json()
    const results = await Promise.all(
      photos.map((photo: Record<string, unknown>) => prisma.photo.create({ data: photo as never }))
    )
    return NextResponse.json(results)
  } catch {
    return NextResponse.json({ error: 'Failed to create photos' }, { status: 500 })
  }
}
