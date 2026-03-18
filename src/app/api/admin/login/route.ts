import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const { password } = await request.json()
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  }

  // Support both hashed and plain text passwords
  let isValid = false
  if (adminPassword.startsWith('$2')) {
    isValid = await bcrypt.compare(password, adminPassword)
  } else {
    isValid = password === adminPassword
  }

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const token = await createToken()

  const response = NextResponse.json({ success: true })
  response.cookies.set('admin-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return response
}
