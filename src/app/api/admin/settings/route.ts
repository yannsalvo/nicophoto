import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const settings = await prisma.siteSettings.findFirst()
  return NextResponse.json(settings)
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const settings = await prisma.siteSettings.upsert({
      where: { id: 'singleton' },
      update: data,
      create: { id: 'singleton', ...data },
    })
    return NextResponse.json(settings)
  } catch {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
