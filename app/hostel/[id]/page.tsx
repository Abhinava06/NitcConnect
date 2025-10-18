"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react"

interface Ticket {
  _id: string
  title: string
  description: string
  type: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  user: {
    _id: string
    name: string
    rollNumber: string
  }
}

export default function TicketDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

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
    const fetchTicket = async () => {
      try {
        const response = await fetch(`/api/hostel/tickets/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setTicket(data.ticket)
        } else {
          router.push("/hostel")
        }
      } catch (err) {
        console.error("Failed to fetch ticket:", err)
        router.push("/hostel")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchTicket()
    }
  }, [params.id, router])

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

  if (!ticket) {
    return null
  }

  const isOwnTicket = user?.id === ticket.user._id

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-6 h-6 text-yellow-600" />
      case "approved":
        return <CheckCircle className="w-6 h-6 text-green-600" />
      case "rejected":
        return <XCircle className="w-6 h-6 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "approved":
        return "bg-green-100 text-green-700"
      case "rejected":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="border-b border-blue-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/hostel" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4" />
            Back to Hostel Services
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-8 border-blue-200 bg-white">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{ticket.title}</h1>
              <p className="text-gray-600">{ticket.description}</p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(ticket.status)}
              <span className={`px-4 py-2 rounded-full font-medium ${getStatusColor(ticket.status)}`}>
                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="border-t border-blue-200 pt-6 space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Issue Type</p>
              <p className="font-semibold text-gray-900">
                {ticket.type.charAt(0).toUpperCase() + ticket.type.slice(1)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Submitted by</p>
              <p className="font-semibold text-gray-900">{ticket.user.name}</p>
              <p className="text-sm text-gray-600">{ticket.user.rollNumber}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Created on</p>
              <p className="text-gray-900">{new Date(ticket.createdAt).toLocaleString()}</p>
            </div>
          </div>

          {isOwnTicket && (
            <div className="mt-8 pt-6 border-t border-blue-200 space-y-2">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                Edit Ticket
              </Button>
              <Button variant="outline" className="w-full border-red-200 text-red-700 hover:bg-red-50 bg-transparent">
                Delete Ticket
              </Button>
            </div>
          )}
        </Card>
      </div>
    </main>
  )
}
