import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const photo = await prisma.photo.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      event: true,
    },
  })
  if (!photo) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(photo)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const photo = await prisma.photo.update({
      where: { id: params.id },
      data,
    })
    return NextResponse.json(photo)
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.photo.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
