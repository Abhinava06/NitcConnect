"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, ArrowLeft, Users } from "lucide-react"

interface Club {
  _id: string
  name: string
  description: string
  category: string
  image: string
  members: number
  president: {
    name: string
    rollNumber: string
  }
  email: string
  createdAt: string
}

export default function ClubsPage() {
  const router = useRouter()
  const [clubs, setClubs] = useState<Club[]>([])
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [user, setUser] = useState<any>(null)

  const categories = ["all", "technical", "cultural", "sports", "academic", "social", "other"]

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
    const fetchClubs = async () => {
      try {
        const response = await fetch("/api/clubs")
        if (response.ok) {
          const data = await response.json()
          setClubs(data.clubs)
          setFilteredClubs(data.clubs)
        }
      } catch (err) {
        console.error("Failed to fetch clubs:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchClubs()
  }, [])

  useEffect(() => {
    let filtered = clubs

    if (selectedCategory !== "all") {
      filtered = filtered.filter((c) => c.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredClubs(filtered)
  }, [searchQuery, selectedCategory, clubs])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading clubs...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Clubs</h1>
          <Link href="/clubs/create">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Club
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
              placeholder="Search clubs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-blue-200"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                    : "bg-white border border-blue-200 text-gray-700 hover:border-blue-400"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Clubs Grid */}
        {filteredClubs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map((club) => (
              <Link key={club._id} href={`/clubs/${club._id}`}>
                <Card className="overflow-hidden border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all bg-white cursor-pointer h-full flex flex-col">
                  <div className="h-40 bg-gray-200 overflow-hidden">
                    <img
                      src={club.image || "/placeholder.svg?height=160&width=300&query=club"}
                      alt={club.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        {club.category.charAt(0).toUpperCase() + club.category.slice(1)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{club.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{club.description}</p>
                    <div className="mt-auto space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        {club.members} members
                      </div>
                      <div className="text-sm text-gray-600">
                        <p className="font-medium text-gray-900">{club.president.name}</p>
                        <p className="text-xs">President</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No clubs found</p>
            <Link href="/clubs/create">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create First Club
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
