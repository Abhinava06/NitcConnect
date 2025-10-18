import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Product } from '@/models/Product'
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
    const deleted = await Product.findByIdAndDelete(params.id)
    if (!deleted) return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    return NextResponse.json({ message: 'Product deleted' }, { status: 200 })
  } catch (err) {
    console.error('Admin: failed to delete product', err)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
