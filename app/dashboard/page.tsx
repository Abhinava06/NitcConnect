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
  const [showHallModal, setShowHallModal] = useState(false);
  // Hall venues data
  const hallVenues = [
    { name: "Vivekananda Auditorium", category: "Main Auditorium", location: "South Campus", use: "Major Institutional Ceremonies (Convocation, Foundation Day), large-scale conferences, and the flagship events of student fests (Ragam/Tathva).", capacity: "~1000+ seats (Large Auditorium)" },
    { name: "Open Air Theatre (OAT)", category: "Amphitheatre/Venue", location: "Central Campus (Near Academic Complex)", use: "Large student gatherings, evening cultural events, and live Pro-Shows during fests.", capacity: "Large crowd capacity (Open-air venue)" },
    { name: "Chaitanya Auditorium", category: "Multipurpose Hall", location: "Central Campus (Near Main Building)", use: "Institutional functions, banquets (e.g., Sadhyas), and larger academic examinations.", capacity: "Medium-to-Large (Used for dining of ~324+ in new proposals)" },
    { name: "Chanakya Hall", category: "Ceremonial/Meeting Hall", location: "Academic Complex", use: "Used for high-level administrative meetings, institutional inaugurations, and small ceremonies.", capacity: "Medium (Standard Hall)" },
    { name: "Guest House Conference Hall", category: "Conference Room", location: "\"Atithi\" Guest House (West Campus)", use: "Official meetings, workshops, and high-level training programs.", capacity: "Up to 50 people" },
    { name: "Department Seminar Halls", category: "Seminar Hall", location: "Located in ECED, MED, etc.", use: "Departmental research presentations, PhD defenses, guest lectures, and student association events.", capacity: "Typically 70–100 seats" },
    { name: "Department Conference Rooms", category: "Conference Room", location: "Located in ECE, Career Dev. Centres, etc.", use: "Internal committee meetings, small official discussions.", capacity: "Typically 20–30 people (e.g., ECE has a 20-person room)" },
    { name: "New Academic Block", category: "Lecture Halls / Classrooms", location: "New Construction", use: "Modern, smart classrooms and lecture halls with updated A/V facilities.", capacity: "Varies (Lecture Halls have high seating capacity)" },
    { name: "Central Computer Centre (CCC)", category: "IT/Exam Center", location: "Central Computer Centre Building", use: "High-performance computing, lab sessions, and large-scale online placement tests/exams.", capacity: "~190+ client machines (for computing/exams)" }
  ];
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
  { icon: <Building2 className="w-6 h-6" />, title: "Hall Booking", description: "Reserve halls" },
    {
      icon: <Calendar className="w-6 h-6 text-blue-600" />,
      title: "Placement Analytics",
      href: "/placement-analytics",
      description: "View placement & internship stats",
      accent: "blue"
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-blue-200">
      {/* Navigation */}
      <nav className="border-b border-blue-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl tracking-wide">NC</span>
            </div>
            <span className="font-bold text-2xl text-gray-900 tracking-tight">NITCConnect</span>
          </div>
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <div className="text-right">
              <p className="font-semibold text-gray-900 text-lg">{user.name}</p>
              <p className="text-sm text-gray-500">{user.rollNumber}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-blue-200 text-gray-700 hover:bg-blue-100 bg-white shadow-sm rounded-lg px-4 py-2"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-blue-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-blue-200 bg-white p-4 rounded-b-xl shadow">
            <div className="mb-4 pb-4 border-b border-blue-200">
              <p className="font-semibold text-gray-900 text-lg">{user.name}</p>
              <p className="text-sm text-gray-500">{user.rollNumber}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-blue-200 text-gray-700 hover:bg-blue-100 bg-white shadow-sm rounded-lg px-4 py-2"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        )}
      </nav>
      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-3 tracking-tight drop-shadow">Welcome, {user.name.split(" ")[0]}!</h1>
          <p className="text-lg text-gray-600">Access all campus services in one place</p>
        </div>
        {/* Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module) => (
            module.title === "Hall Booking" ? (
              <div key={module.title} className="cursor-pointer" onClick={() => setShowHallModal(true)}>
                <Card
                  className="p-8 border-blue-200 hover:border-blue-400 hover:shadow-2xl transition-all bg-white cursor-pointer h-full rounded-2xl shadow-md group"
                >
                  <div className="flex items-start gap-5">
                    <div className="p-4 rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition">
                      {module.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:text-blue-700 transition">{module.title}</h3>
                      <p className="text-base text-gray-600 group-hover:text-blue-600 transition">{module.description}</p>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              module.href ? (
                <Link key={module.href} href={module.href}>
                  <Card
                    className={`p-8 border-blue-200 hover:border-blue-400 hover:shadow-2xl transition-all bg-white cursor-pointer h-full rounded-2xl shadow-md group ${module.title === "Placement Analytics" ? "ring-2 ring-blue-400" : ""}`}
                  >
                    <div className="flex items-start gap-5">
                      <div className={`p-4 rounded-xl ${module.title === "Placement Analytics" ? "bg-blue-100 text-blue-600" : "bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600"} group-hover:bg-blue-200 transition`}>
                        {module.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:text-blue-700 transition">{module.title}</h3>
                        <p className="text-base text-gray-600 group-hover:text-blue-600 transition">{module.description}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ) : (
                <div key={module.title}>
                  <Card
                    className={`p-8 border-blue-200 hover:border-blue-400 hover:shadow-2xl transition-all bg-white cursor-pointer h-full rounded-2xl shadow-md group ${module.title === "Placement Analytics" ? "ring-2 ring-blue-400" : ""}`}
                  >
                    <div className="flex items-start gap-5">
                      <div className={`p-4 rounded-xl ${module.title === "Placement Analytics" ? "bg-blue-100 text-blue-600" : "bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600"} group-hover:bg-blue-200 transition`}>
                        {module.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:text-blue-700 transition">{module.title}</h3>
                        <p className="text-base text-gray-600 group-hover:text-blue-600 transition">{module.description}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              )
            )
          ))}
        </div>
      </section>
      {/* Hall Booking Modal */}
      {showHallModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-2xl w-full overflow-y-auto max-h-[80vh] border border-blue-200 relative animate-fade-in">
            <div className="flex items-center justify-between mb-6 border-b pb-4 border-blue-100">
              <h2 className="text-3xl font-extrabold text-blue-700">Hall Booking Venues</h2>
              <Button variant="ghost" className="text-gray-500 hover:text-blue-700 text-xl px-3 py-1" onClick={() => setShowHallModal(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>
            <div className="grid gap-6">
              {hallVenues.map(venue => (
                <Card key={venue.name} className="p-6 flex flex-col md:flex-row md:items-center gap-6 rounded-xl border-blue-100 shadow group hover:shadow-lg transition">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2 text-blue-800 group-hover:text-blue-900 transition">{venue.name}</h3>
                    <p className="mb-1"><span className="font-semibold">Category:</span> {venue.category}</p>
                    <p className="mb-1"><span className="font-semibold">Location:</span> {venue.location}</p>
                    <p className="mb-1"><span className="font-semibold">Primary Use:</span> {venue.use}</p>
                    <p className="mb-1"><span className="font-semibold">Capacity:</span> {venue.capacity}</p>
                  </div>
                  <Button className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow hover:bg-blue-700 transition">Book</Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
