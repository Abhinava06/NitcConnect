import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import mongoose from 'mongoose'
import { Event } from '@/models/Event'
import { Club } from '@/models/Club'
import { User } from '@/models/User'

type ImportBody = { type: 'events' | 'clubs'; csv: string }

function parseCSV(csv: string) {
  const lines = csv.split(/\r?\n/).filter(Boolean)
  if (lines.length <= 1) return []
  const headers = lines[0].split(',').map(h => h.trim())
  return lines.slice(1).map(line => {
    const values: string[] = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') inQuotes = !inQuotes
      else if (ch === ',' && !inQuotes) {
        values.push(current)
        current = ''
      } else {
        current += ch
      }
    }
    values.push(current)
    const obj: Record<string,string> = {}
    headers.forEach((h, i) => obj[h] = (values[i] || '').trim())
    return obj
  })
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ImportBody
    if (!body || !body.type || !body.csv) return NextResponse.json({ error: 'Missing type or csv' }, { status: 400 })

    await connectDB()

    // ensure admin user exists
    let admin = await User.findOne({ email: 'admin@nitc.local' })
    if (!admin) admin = await User.create({ email: 'admin@nitc.local', name: 'Import Admin' })

    const rows = parseCSV(body.csv)
    if (!rows.length) return NextResponse.json({ message: 'No rows' })

    if (body.type === 'events') {
      const docs = rows.map(r => ({
        title: r['Event Name'] || r['title'] || r['Title'] || 'Untitled',
        description: r['Description / Key Activities'] || r['Description'] || r['description'] || '',
        startDate: new Date(),
        endDate: new Date(),
        location: r['Location'] || 'Campus',
        organizer: admin._id,
        category: (r['Event Category'] || r['category'] || 'other').toLowerCase(),
      }))

      // delete existing by title
      await Event.deleteMany({ title: { $in: docs.map((d:any) => d.title) } })
      const res = await Event.insertMany(docs)
      return NextResponse.json({ message: 'Events imported', inserted: res.length })
    }

    if (body.type === 'clubs') {
      const docs = rows.map(r => ({
        name: r['Club Name'] || r['Club'] || r['name'] || 'Unnamed Club',
        description: r['Focus / Key Activities'] || r['description'] || '',
        category: (r['Category'] || r['category'] || 'other').toLowerCase(),
        email: r['Email'] || r['email'] || `${(r['Club']||r['Club Name']||'club').toLowerCase().replace(/[^a-z0-9]+/g,'')}@nitc.ac.in`,
        image: '',
        president: admin._id,
        members: 10,
      }))

      await Club.deleteMany({ name: { $in: docs.map((d:any) => d.name) } })
      const res = await Club.insertMany(docs)
      return NextResponse.json({ message: 'Clubs imported', inserted: res.length })
    }

    return NextResponse.json({ error: 'Unknown type' }, { status: 400 })
  } catch (err: any) {
    console.error('Import CSV error', err)
    return NextResponse.json({ error: err.message || 'Import failed' }, { status: 500 })
  }
}
