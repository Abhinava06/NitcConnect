import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body || {}

    if (email === 'admin@nitc.ac.in' && password === 'admin123') {
      const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' })
      const res = NextResponse.json({ message: 'Admin login successful' }, { status: 200 })
      res.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
      })
      return res
    }

    return NextResponse.json({ message: 'Invalid admin credentials' }, { status: 401 })
  } catch (err) {
    console.error('Admin login error', err)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
