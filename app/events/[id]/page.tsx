"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Calendar, MapPin, Users, Share2 } from "lucide-react"

interface Event {
  _id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  image: string
  organizer: {
    _id: string
    name: string
    rollNumber: string
  }
  attendees: number
  createdAt: string
}

export default function EventDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isAttending, setIsAttending] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (err) {
        console.error("Failed to fetch user:", err)
      }
    }

    fetchUser()
  }, [])

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setEvent(data.event)
        } else {
          router.push("/events")
        }
      } catch (err) {
        console.error("Failed to fetch event:", err)
        router.push("/events")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchEvent()
    }
  }, [params.id, router])

  const handleAttendance = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}/attend`, {
        method: "POST",
      })

      if (response.ok) {
        setIsAttending(!isAttending)
        if (event) {
          setEvent({
            ...event,
            attendees: isAttending ? event.attendees - 1 : event.attendees + 1,
          })
        }
      }
    } catch (err) {
      console.error("Failed to update attendance:", err)
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

  if (!event) {
    return null
  }

  const isOwnEvent = user?.id === event.organizer._id

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="border-b border-blue-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/events" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="bg-gray-200 rounded-lg overflow-hidden h-96">
            <img
              src={event.image || "/placeholder.svg?height=400&width=400&query=event-detail"}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div>
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
              <p className="text-gray-600 mb-6">{event.description}</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span>
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>{event.attendees} people attending</span>
                </div>
              </div>
            </div>

            <Card className="p-6 border-blue-200 bg-white mb-6">
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-1">Organized by</p>
                <p className="font-semibold text-gray-900">{event.organizer.name}</p>
                <p className="text-sm text-gray-600">{event.organizer.rollNumber}</p>
              </div>

              {isOwnEvent ? (
                <div className="space-y-2">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                    Edit Event
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
                  >
                    Delete Event
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleAttendance}
                  className={`w-full ${
                    isAttending
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  }`}
                >
                  {isAttending ? "Cancel Attendance" : "Mark as Attending"}
                </Button>
              )}
            </Card>

            <Button variant="outline" className="w-full border-blue-200 text-gray-700 hover:bg-blue-50 bg-transparent">
              <Share2 className="w-4 h-4 mr-2" />
              Share Event
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
