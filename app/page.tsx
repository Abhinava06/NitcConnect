import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Replace as Marketplace, Heart, Users, Calendar, BookOpen, Ticket, Clock, Building2 } from "lucide-react"

export default function Home() {
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
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-700">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                Sign Up
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="outline" className="text-gray-700">
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 text-balance">Your Campus, Connected</h1>
          <p className="text-xl text-gray-600 mb-8 text-balance max-w-2xl mx-auto">
            Buy, sell, discover events, find lost items, and connect with your NITC community all in one place.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg px-8"
            >
              Get Started
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Marketplace className="w-6 h-6" />}
            title="Marketplace"
            description="Buy and sell items within the campus community"
          />
          <FeatureCard
            icon={<Heart className="w-6 h-6" />}
            title="Lost & Found"
            description="Report and find lost items on campus"
          />
          <FeatureCard
            icon={<Calendar className="w-6 h-6" />}
            title="Events"
            description="Discover and join campus events"
          />
          <FeatureCard
            icon={<Users className="w-6 h-6" />}
            title="Clubs"
            description="Connect with campus clubs and communities"
          />
          <FeatureCard
            icon={<Ticket className="w-6 h-6" />}
            title="Hostel Tickets"
            description="Book hostel facilities and services"
          />
          <FeatureCard
            icon={<Clock className="w-6 h-6" />}
            title="Faculty Appointments"
            description="Schedule meetings with faculty members"
          />
          <FeatureCard
            icon={<Building2 className="w-6 h-6" />}
            title="Hall Booking"
            description="Reserve halls for events and meetings"
          />
          <FeatureCard
            icon={<BookOpen className="w-6 h-6" />}
            title="Community"
            description="Connect with fellow NITC students"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-200 bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-600">
            <p>NITCConnect - Connecting the NITC Community</p>
            <p className="text-sm mt-2">© 2025 All rights reserved</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="p-6 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all bg-white">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg text-blue-600">{icon}</div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Card>
  )
}
