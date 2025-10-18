"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Users, Mail, Share2 } from "lucide-react"

interface Club {
  _id: string
  name: string
  description: string
  category: string
  image: string
  members: number
  president: {
    _id: string
    name: string
    rollNumber: string
  }
  email: string
  createdAt: string
}

export default function ClubDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [club, setClub] = useState<Club | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isMember, setIsMember] = useState(false)

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
    const fetchClub = async () => {
      try {
        const response = await fetch(`/api/clubs/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setClub(data.club)
        } else {
          router.push("/clubs")
        }
      } catch (err) {
        console.error("Failed to fetch club:", err)
        router.push("/clubs")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchClub()
    }
  }, [params.id, router])

  const handleMembership = async () => {
    try {
      const response = await fetch(`/api/clubs/${params.id}/join`, {
        method: "POST",
      })

      if (response.ok) {
        setIsMember(!isMember)
        if (club) {
          setClub({
            ...club,
            members: isMember ? club.members - 1 : club.members + 1,
          })
        }
      }
    } catch (err) {
      console.error("Failed to update membership:", err)
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

  if (!club) {
    return null
  }

  const isPresident = user?.id === club.president._id

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="border-b border-blue-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/clubs" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4" />
            Back to Clubs
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="bg-gray-200 rounded-lg overflow-hidden h-96">
            <img
              src={club.image || "/placeholder.svg?height=400&width=400&query=club-detail"}
              alt={club.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div>
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                {club.category.charAt(0).toUpperCase() + club.category.slice(1)}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{club.name}</h1>
              <p className="text-gray-600 mb-6">{club.description}</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>{club.members} members</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <a href={`mailto:${club.email}`} className="text-blue-600 hover:underline">
                    {club.email}
                  </a>
                </div>
              </div>
            </div>

            <Card className="p-6 border-blue-200 bg-white mb-6">
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-1">President</p>
                <p className="font-semibold text-gray-900">{club.president.name}</p>
                <p className="text-sm text-gray-600">{club.president.rollNumber}</p>
              </div>

              {isPresident ? (
                <div className="space-y-2">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                    Edit Club
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
                  >
                    Delete Club
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleMembership}
                  className={`w-full ${
                    isMember
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  }`}
                >
                  {isMember ? "Leave Club" : "Join Club"}
                </Button>
              )}
            </Card>

            <Button variant="outline" className="w-full border-blue-200 text-gray-700 hover:bg-blue-50 bg-transparent">
              <Share2 className="w-4 h-4 mr-2" />
              Share Club
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
