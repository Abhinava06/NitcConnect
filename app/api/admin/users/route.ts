import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User } from '@/models/User'

export async function GET() {
  try {
    await connectDB()
    const users = await User.find().sort({ createdAt: -1 }).select('-password')
    return NextResponse.json({ users })
  } catch (err) {
    console.error('Admin: failed to list users', err)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
