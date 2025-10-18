"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, ArrowLeft, Calendar, Clock, User } from "lucide-react"

interface Faculty {
  _id: string
  name: string
  department: string
  email?: string
  office?: string
  availableSlots: number
  designation?: string
  specialization?: string
}

export default function AppointmentsPage() {
  const router = useRouter()
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [filteredFaculties, setFilteredFaculties] = useState<Faculty[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
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
    const fetchFaculties = async () => {
      try {
        const response = await fetch("/api/appointments/faculty")
        if (response.ok) {
          const data = await response.json()
          setFaculties(data.faculties)
          setFilteredFaculties(data.faculties)
        }
      } catch (err) {
        console.error("Failed to fetch faculties:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchFaculties()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = faculties.filter(
        (f) =>
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.department.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredFaculties(filtered)
    } else {
      setFilteredFaculties(faculties)
    }
  }, [searchQuery, faculties])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading faculties...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Faculty Appointments</h1>
          <Link href="/appointments/my-appointments">
            <Button variant="outline" className="border-blue-200 text-gray-700 hover:bg-blue-50 bg-transparent">
              My Appointments
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search faculty by name or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-blue-200"
            />
          </div>
        </div>

        {/* Faculties Grid */}
        {filteredFaculties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFaculties.map((faculty) => (
              <Link key={faculty._id} href={`/appointments/${faculty._id}`}>
                <Card className="p-6 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all bg-white cursor-pointer h-full flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{faculty.name}</h3>
                      {faculty.designation && (
                        <p className="text-xs text-blue-700 font-medium mb-1">{faculty.designation}</p>
                      )}
                      <p className="text-sm text-gray-600">{faculty.department}</p>
                      {faculty.specialization && (
                        <p className="text-xs text-gray-500 mt-1">{faculty.specialization}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{faculty.availableSlots} slots available</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium text-gray-900">{faculty.office}</p>
                      <p className="text-xs">{faculty.email}</p>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </Button>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No faculties found</p>
          </div>
        )}
      </div>
    </main>
  )
}
