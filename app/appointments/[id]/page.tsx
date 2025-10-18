"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Clock, MapPin, Mail } from "lucide-react"

interface Faculty {
  _id: string
  name: string
  department: string
  email: string
  office: string
  availableSlots: number
}

export default function BookAppointmentPage() {
  const router = useRouter()
  const params = useParams()
  const [faculty, setFaculty] = useState<Faculty | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    purpose: "",
  })

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await fetch(`/api/appointments/faculty/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setFaculty(data.faculty)
        } else {
          router.push("/appointments")
        }
      } catch (err) {
        console.error("Failed to fetch faculty:", err)
        router.push("/appointments")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchFaculty()
    }
  }, [params.id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facultyId: params.id,
          ...formData,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.message || "Failed to book appointment")
        return
      }

      router.push("/appointments/my-appointments")
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!faculty) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="border-b border-blue-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/appointments" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4" />
            Back to Faculties
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Faculty Info */}
          <Card className="p-6 border-blue-200 bg-white h-fit">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{faculty.name}</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Department</p>
                <p className="font-semibold text-gray-900">{faculty.department}</p>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span>{faculty.office}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="w-5 h-5 text-blue-600" />
                <a href={`mailto:${faculty.email}`} className="text-blue-600 hover:underline">
                  {faculty.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="w-5 h-5 text-blue-600" />
                <span>{faculty.availableSlots} slots available</span>
              </div>
            </div>
          </Card>

          {/* Booking Form */}
          <Card className="p-6 border-blue-200 bg-white">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Book Appointment</h3>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                <Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="border-blue-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                <Input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="border-blue-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purpose of Meeting</label>
                <textarea
                  name="purpose"
                  placeholder="Describe the purpose of your appointment..."
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                {submitting ? "Booking..." : "Book Appointment"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </main>
  )
}
