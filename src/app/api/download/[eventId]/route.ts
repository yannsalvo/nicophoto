import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: { eventId: string } }
) {
  // Check if download is allowed
  const settings = await prisma.siteSettings.findFirst()
  if (!settings?.allowDownload) {
    return NextResponse.json({ error: 'Téléchargement désactivé' }, { status: 403 })
  }

  const event = await prisma.event.findUnique({
    where: { id: params.eventId },
    include: {
      photos: {
        where: { isVisible: true },
        orderBy: { order: 'asc' },
        select: { imageUrl: true, title: true, imagePublicId: true },
      },
    },
  })

  if (!event || !event.isVisible) {
    return NextResponse.json({ error: 'Événement introuvable' }, { status: 404 })
  }

  if (event.photos.length === 0) {
    return NextResponse.json({ error: 'Aucune photo disponible' }, { status: 404 })
  }

  // For a single photo, redirect directly
  if (event.photos.length === 1) {
    const photo = event.photos[0]
    // Use Cloudinary fl_attachment to force download
    const downloadUrl = photo.imageUrl.includes('/upload/')
      ? photo.imageUrl.replace('/upload/', '/upload/fl_attachment/')
      : photo.imageUrl

    return NextResponse.redirect(downloadUrl)
  }

  // For multiple photos, create a Cloudinary ZIP archive
  // Cloudinary supports generating zip files from multiple assets
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  if (!cloudName) {
    return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
  }

  // Build Cloudinary multi-resource archive URL
  // Use the /generate_archive endpoint via the download API
  const publicIds = event.photos.map((p) => p.imagePublicId)

  const apiSecret = process.env.CLOUDINARY_API_SECRET
  const apiKey = process.env.CLOUDINARY_API_KEY

  if (!apiSecret || !apiKey) {
    return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
  }

  // Use Cloudinary's generate_archive API
  const timestamp = Math.floor(Date.now() / 1000)
  const { createHash } = await import('crypto')

  const paramsToSign: Record<string, string> = {
    mode: 'download',
    public_ids: publicIds.join(','),
    target_format: 'zip',
    timestamp: String(timestamp),
  }

  const signatureString = Object.keys(paramsToSign)
    .sort()
    .map((key) => `${key}=${paramsToSign[key]}`)
    .join('&') + apiSecret

  const signature = createHash('sha1').update(signatureString).digest('hex')

  // Call Cloudinary generate_archive API
  const formData = new URLSearchParams()
  formData.append('mode', 'download')
  formData.append('target_format', 'zip')
  formData.append('timestamp', String(timestamp))
  formData.append('api_key', apiKey)
  formData.append('signature', signature)
  publicIds.forEach((id) => formData.append('public_ids[]', id))

  const archiveRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/generate_archive`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!archiveRes.ok) {
    console.error('Cloudinary archive error:', await archiveRes.text())
    return NextResponse.json(
      { error: 'Erreur lors de la génération de l\'archive' },
      { status: 500 }
    )
  }

  const archiveData = await archiveRes.json()
  const archiveUrl = archiveData.url || archiveData.secure_url

  if (!archiveUrl) {
    return NextResponse.json(
      { error: 'Erreur lors de la génération de l\'archive' },
      { status: 500 }
    )
  }

  // Redirect to the generated archive URL
  return NextResponse.redirect(archiveUrl)
}
