"use client"

import React, { useState } from 'react'

export default function AdminImportPage() {
  const [tab, setTab] = useState<'events'|'clubs'>('events')
  const [csv, setCsv] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const runImport = async () => {
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/import-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: tab, csv }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Import failed')
      setMessage(`Success: ${json.message || 'Imported'}. Inserted: ${json.inserted || 0}`)
    } catch (err: any) {
      setMessage(err.message || 'Import failed')
    } finally {
      setLoading(false)
    }
  }

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const text = await f.text()
    setCsv(text)
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Import (Events & Clubs)</h1>
      <div className="mb-4">
        <button onClick={() => setTab('events')} className={`px-3 py-1 mr-2 border ${tab==='events'?'bg-gray-200':''}`}>Events</button>
        <button onClick={() => setTab('clubs')} className={`px-3 py-1 border ${tab==='clubs'?'bg-gray-200':''}`}>Clubs</button>
      </div>

      <div className="mb-2">
        <label className="block mb-1">Upload CSV</label>
        <input type="file" accept=".csv,text/csv" onChange={onFile} />
      </div>

      <div className="mb-2">
        <label className="block mb-1">Or paste CSV content</label>
        <textarea value={csv} onChange={(e) => setCsv(e.target.value)} rows={12} className="w-full p-2 border rounded" />
      </div>

      <div>
        <button onClick={runImport} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading? 'Running...' : 'Run Import'}</button>
      </div>

      {message && <div className="mt-4 p-3 border rounded">{message}</div>}
    </main>
  )
}
