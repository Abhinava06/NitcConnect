import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(request: Request) {
  try {
    const cookie = (request as any).cookies?.get?.('admin_token')?.value || ''
    if (!cookie) return NextResponse.json({ isAdmin: false })
    try {
      const decoded = jwt.verify(cookie, process.env.JWT_SECRET || 'your-secret-key') as any
      return NextResponse.json({ isAdmin: decoded?.role === 'admin' })
    } catch (e) {
      return NextResponse.json({ isAdmin: false })
    }
  } catch (err) {
    console.error('admin me error', err)
    return NextResponse.json({ isAdmin: false })
  }
}
