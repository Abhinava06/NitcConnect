import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Event } from "@/models/Event"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const event = await Event.findById(params.id).populate("organizer", "name rollNumber")

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({ event }, { status: 200 })
  } catch (error) {
    console.error("Error fetching event:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
