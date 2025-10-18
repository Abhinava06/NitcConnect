import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Event } from '@/models/Event'
import jwt from 'jsonwebtoken'

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookie = (request as any).cookies?.get?.('admin_token')?.value
    if (!cookie) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    try {
      const decoded = jwt.verify(cookie, process.env.JWT_SECRET || 'your-secret-key') as any
      if (decoded?.role !== 'admin') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    } catch (e) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const deleted = await Event.findByIdAndDelete(params.id)
    if (!deleted) return NextResponse.json({ message: 'Event not found' }, { status: 404 })
    return NextResponse.json({ message: 'Event deleted' }, { status: 200 })
  } catch (err) {
    console.error('Admin: failed to delete event', err)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
