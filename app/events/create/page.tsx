"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"

export default function CreateEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch("/api/auth/me")
      if (!response.ok) {
        router.push("/login")
      }
    }
    checkAuth()
  }, [router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const title = formData.get("title") as string | null
    const description = formData.get("description") as string | null
    const date = formData.get("date") as string | null // YYYY-MM-DD
    const time = formData.get("time") as string | null // HH:mm
    const endTime = formData.get("endTime") as string | null // HH:mm optional
    const location = formData.get("location") as string | null
    const category = formData.get("category") as string | null

    if (!title || !description || !location || !category) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    // Build startDate/endDate ISO strings
    let payload: any = { title, description, location, category }

    if (formData.get("startDate") && formData.get("endDate")) {
      // If form provides ISO dates directly
      payload.startDate = formData.get("startDate")
      payload.endDate = formData.get("endDate")
    } else if (date && time) {
      const startISO = `${date}T${time}`
      payload.date = date
      payload.time = time
      if (endTime) {
        payload.endTime = endTime
      }
      // API will construct startDate/endDate; still include both for clarity
      payload.startDate = startISO
      payload.endDate = endTime ? `${date}T${endTime}` : new Date(new Date(startISO).getTime() + 60 * 60 * 1000).toISOString()
    } else {
      setError("Please provide date and time")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || "Failed to create event")
      }

      router.push("/events")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="border-b border-blue-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/events" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-8 border-blue-200 bg-white">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Event</h1>
          <p className="text-gray-600 mb-8">Organize an event for the NITC community</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
              <Input
                type="text"
                name="title"
                placeholder="e.g., Tech Fest 2025"
                required
                className="border-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                placeholder="Describe your event..."
                required
                rows={4}
                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <Input
                  type="date"
                  name="date"
                  required
                  className="border-blue-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start time</label>
                <Input
                  type="time"
                  name="time"
                  required
                  className="border-blue-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End time (optional)</label>
                <Input
                  type="time"
                  name="endTime"
                  className="border-blue-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <Input
                type="text"
                name="location"
                placeholder="e.g., Main Auditorium"
                required
                className="border-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                name="category"
                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="academic">Academic</option>
                <option value="cultural">Cultural</option>
                <option value="sports">Sports</option>
                <option value="technical">Technical</option>
                <option value="social">Social</option>
                <option value="other">Other</option>
              </select>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              {loading ? "Creating event..." : "Create Event"}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  )
}
