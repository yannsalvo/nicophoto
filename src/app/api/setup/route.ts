import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst()
    return NextResponse.json({ configured: !!settings })
  } catch {
    return NextResponse.json({ configured: false })
  }
}
