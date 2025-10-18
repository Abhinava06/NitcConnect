"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, MessageCircle, Share2 } from "lucide-react"

interface LostItem {
  _id: string
  title: string
  description: string
  category: string
  location: string
  image: string
  type: "lost" | "found"
  reporter: {
    _id: string
    name: string
    rollNumber: string
  }
  createdAt: string
}

export default function ItemDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [item, setItem] = useState<LostItem | null>(null)
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
    const fetchItem = async () => {
      try {
        const response = await fetch(`/api/lost-found/items/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setItem(data.item)
        } else {
          router.push("/lost-found")
        }
      } catch (err) {
        console.error("Failed to fetch item:", err)
        router.push("/lost-found")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchItem()
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

  if (!item) {
    return null
  }

  const isOwnReport = user?.id === item.reporter._id

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="border-b border-blue-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/lost-found" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4" />
            Back to Lost & Found
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="bg-gray-200 rounded-lg overflow-hidden h-96">
            <img
              src={item.image || "/placeholder.svg?height=400&width=400&query=lost-found-detail"}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white ${
                    item.type === "lost" ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {item.type === "lost" ? "Lost Item" : "Found Item"}
                </span>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <p className="text-lg font-semibold text-blue-600">📍 {item.location}</p>
            </div>

            <Card className="p-6 border-blue-200 bg-white mb-6">
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Reported by</p>
                  <p className="font-semibold text-gray-900">{item.reporter.name}</p>
                  <p className="text-sm text-gray-600">{item.reporter.rollNumber}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Reported on</p>
                  <p className="text-gray-900">{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {isOwnReport ? (
                <div className="space-y-2">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                    Edit Report
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
                  >
                    Delete Report
                  </Button>
                </div>
              ) : (
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Reporter
                </Button>
              )}
            </Card>

            
          </div>
        </div>
      </div>
    </main>
  )
}
