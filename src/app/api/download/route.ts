import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { photoId, firstName, lastName, email } = await request.json()

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const photo = await prisma.photo.findUnique({ where: { id: photoId } })
    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    }

    const settings = await prisma.siteSettings.findFirst()
    if (!settings?.allowDownload) {
      return NextResponse.json({ error: 'Download disabled' }, { status: 403 })
    }

    await prisma.downloadLead.create({
      data: { firstName, lastName, email, photoId: photo.id, photoTitle: photo.title },
    })

    // Return the high-res Cloudinary URL for download
    const downloadUrl = photo.imageUrl.replace('/upload/', '/upload/fl_attachment/')

    return NextResponse.json({ downloadUrl })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
