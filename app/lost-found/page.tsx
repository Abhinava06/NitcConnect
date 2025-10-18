"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, ArrowLeft, MessageCircle } from "lucide-react"

interface LostItem {
  _id: string
  title: string
  description: string
  category: string
  location: string
  image: string
  type: "lost" | "found"
  reporter: {
    name: string
    rollNumber: string
  }
  createdAt: string
}

export default function LostFoundPage() {
  const router = useRouter()
  const [items, setItems] = useState<LostItem[]>([])
  const [filteredItems, setFilteredItems] = useState<LostItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "lost" | "found">("all")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (!response.ok) {
          router.push("/login")
          return
        }
        const data = await response.json()
        setUser(data.user)
      } catch (err) {
        router.push("/login")
      }
    }

    fetchUser()
  }, [router])

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("/api/lost-found/items")
        if (response.ok) {
          const data = await response.json()
          setItems(data.items)
          setFilteredItems(data.items)
        }
      } catch (err) {
        console.error("Failed to fetch items:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  useEffect(() => {
    let filtered = items

    if (filterType !== "all") {
      filtered = filtered.filter((item) => item.type === filterType)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredItems(filtered)
  }, [searchQuery, filterType, items])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading items...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="border-b border-blue-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Lost & Found</h1>
          <Link href="/lost-found/report">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Report Item
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by item name, description, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-blue-200"
            />
          </div>

          <div className="flex gap-2">
            {(["all", "lost", "found"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filterType === type
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                    : "bg-white border border-blue-200 text-gray-700 hover:border-blue-400"
                }`}
              >
                {type === "all" ? "All Items" : type === "lost" ? "Lost Items" : "Found Items"}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Link key={item._id} href={`/lost-found/${item._id}`}>
                <Card className="overflow-hidden border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all bg-white cursor-pointer h-full flex flex-col">
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={item.image || "/placeholder.svg?height=200&width=300&query=lost-found-item"}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                    <div
                      className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-medium text-white ${
                        item.type === "lost" ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      {item.type === "lost" ? "Lost" : "Found"}
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                    <p className="text-sm text-blue-600 font-medium mb-3">📍 {item.location}</p>
                    <div className="mt-auto">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{item.reporter.name}</span>
                        <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                          <MessageCircle className="w-4 h-4 text-blue-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No items found</p>
            <Link href="/lost-found/report">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Report an Item
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
