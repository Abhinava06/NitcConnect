"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

type User = { _id: string; name: string; email: string; rollNumber?: string }
type Product = { _id: string; title: string; price: number; seller?: User }
type Event = { _id: string; title: string; startDate: string }
type Club = { _id: string; name: string; president?: User }

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [clubs, setClubs] = useState<Club[]>([])
  const [error, setError] = useState<string | null>(null)
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)
        const me = await fetch('/api/admin/me')
        const meJson = await me.json()
        setIsAdmin(Boolean(meJson.isAdmin))
        if (!meJson.isAdmin) {
          setLoading(false)
          return
        }

        const [uRes, pRes, eRes, cRes] = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/marketplace/products'),
          fetch('/api/events'),
          fetch('/api/clubs'),
        ])

        if (!uRes.ok) throw new Error('Failed to load users')
        const uJson = await uRes.json()
        setUsers(uJson.users || [])

        if (pRes.ok) setProducts((await pRes.json()).products || [])
        if (eRes.ok) setEvents((await eRes.json()).events || [])
        if (cRes.ok) setClubs((await cRes.json()).clubs || [])
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  const del = async (path: string, id: string) => {
    if (!confirm('Delete this item?')) return
    try {
      const res = await fetch(`${path}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      // refresh lists
      setUsers((u) => u.filter((x) => x._id !== id))
      setProducts((p) => p.filter((x) => x._id !== id))
      setEvents((e) => e.filter((x) => x._id !== id))
      setClubs((c) => c.filter((x) => x._id !== id))
    } catch (err) {
      console.error(err)
      setError('Delete failed')
    }
  }

  const loginAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      })
      if (!res.ok) {
        setError('Invalid admin credentials')
        return
      }
      // reload to fetch admin-only data
      window.location.reload()
    } catch (err) {
      console.error(err)
      setError('Login failed')
    }
  }

  if (loading) return <div className="p-8">Loading admin...</div>

  if (!isAdmin) {
    return (
      <main className="p-8">
    <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <form onSubmit={loginAdmin} className="max-w-md">
          <label className="block mb-2">Email</label>
          <input value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="mb-4 w-full p-2 border rounded" />
          <label className="block mb-2">Password</label>
          <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="mb-4 w-full p-2 border rounded" />
          <div>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Login as Admin</button>
          </div>
        </form>
        {/* hint removed as requested */}
      </main>
    )
  }

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <div>
          <button
            onClick={async () => {
              await fetch('/api/admin/logout', { method: 'POST' })
              window.location.reload()
            }}
            className="px-3 py-1 border rounded text-sm"
          >
            Logout
          </button>
        </div>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <section className="mb-8">
        <h2 className="font-semibold mb-2">Users ({users.length})</h2>
        <div className="overflow-auto border rounded">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Roll</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.rollNumber || '-'}</td>
                  <td className="p-2">
                    <button onClick={() => del('/api/admin/users', u._id)} className="text-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold mb-2">Hostel Management</h2>
        <div className="mb-4">
          <Link href="/admin/hostel" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Manage Hostel Tickets →
          </Link>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold mb-2">Products ({products.length})</h2>
        <div className="grid gap-4">
          {products.map((p) => (
            <div key={p._id} className="p-4 border rounded flex justify-between items-center">
              <div>
                <div className="font-medium">{p.title}</div>
                <div className="text-sm text-gray-600">₹{p.price}</div>
                <div className="text-sm text-gray-500">Seller: {p.seller?.name || '-'}</div>
              </div>
              <div>
                <button onClick={() => del('/api/admin/products', p._id)} className="text-red-600">
                  Delete
                </button>
                <Link href={`/marketplace/${p._id}`} className="ml-4 text-blue-600">
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold mb-2">Events ({events.length})</h2>
        <div className="grid gap-4">
          {events.map((ev) => (
            <div key={ev._id} className="p-4 border rounded flex items-center gap-4">
              <div className="w-24 h-24 bg-gray-200 overflow-hidden flex-shrink-0 rounded">
                <img src={(ev as any).image || '/placeholder.svg?height=96&width=96&query=event'} alt={ev.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{ev.title}</div>
                <div className="text-sm text-gray-600">{new Date(ev.startDate).toLocaleString()}</div>
                <div className="text-sm text-gray-500 truncate">{(ev as any).description || ''}</div>
              </div>
              <div>
                <button onClick={() => del('/api/admin/events', ev._id)} className="text-red-600">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-2">Clubs ({clubs.length})</h2>
        <div className="grid gap-4">
          {clubs.map((c) => (
            <div key={c._id} className="p-4 border rounded flex items-center gap-4">
              <div className="w-24 h-24 bg-gray-200 overflow-hidden flex-shrink-0 rounded">
                <img src={(c as any).image || '/placeholder.svg?height=96&width=96&query=club'} alt={c.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{c.name}</div>
                <div className="text-sm text-gray-500">President: {c.president?.name || '-'}</div>
                <div className="text-sm text-gray-600 truncate">{(c as any).description || ''}</div>
              </div>
              <div>
                <button onClick={() => del('/api/admin/clubs', c._id)} className="text-red-600">
                  Delete
                </button>
                <Link href={`/clubs/${c._id}`} className="ml-4 text-blue-600">
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
