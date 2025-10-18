"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LogOut, Replace as Marketplace, Heart, Calendar, Users, Ticket, Clock, Building2, Menu, X } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  rollNumber: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
    } catch (err) {
      console.error("Logout failed:", err)
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

  if (!user) {
    return null
  }

  const modules = [
    {
      icon: <Marketplace className="w-6 h-6" />, 
      title: "Marketplace",
      href: "/marketplace",
      description: "Buy and sell items",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Lost & Found",
      href: "/lost-found",
      description: "Report lost items",
    },
    { icon: <Calendar className="w-6 h-6" />, title: "Events", href: "/events", description: "Discover events" },
    { icon: <Users className="w-6 h-6" />, title: "Clubs", href: "/clubs", description: "Join clubs" },
    { icon: <Ticket className="w-6 h-6" />, title: "Hostel Tickets", href: "/hostel", description: "Book facilities" },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Faculty Appointments",
      href: "/appointments",
      description: "Schedule meetings",
    },
    { icon: <Building2 className="w-6 h-6" />, title: "Hall Booking", href: "/halls", description: "Reserve halls" },
    {
      icon: <Calendar className="w-6 h-6 text-blue-600" />,
      title: "Placement Analytics",
      href: "/placement-analytics",
      description: "View placement & internship stats",
      accent: "blue"
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="border-b border-blue-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">NC</span>
            </div>
            <span className="font-bold text-xl text-gray-900">NITCConnect</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-600">{user.rollNumber}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-blue-200 text-gray-700 hover:bg-blue-50 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-blue-50 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-blue-200 bg-white p-4">
            <div className="mb-4 pb-4 border-b border-blue-200">
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-600">{user.rollNumber}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-blue-200 text-gray-700 hover:bg-blue-50 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome, {user.name.split(" ")[0]}!</h1>
          <p className="text-gray-600">Access all campus services in one place</p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Link key={module.href} href={module.href}>
              <Card
                className={`p-6 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all bg-white cursor-pointer h-full ${module.title === "Placement Analytics" ? "ring-2 ring-blue-400" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${module.title === "Placement Analytics" ? "bg-blue-100 text-blue-600" : "bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600"}`}>
                    {module.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{module.title}</h3>
                    <p className="text-sm text-gray-600">{module.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
