import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Event } from "@/models/Event"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: string }

    await connectDB()

    const event = await Event.findById(params.id)

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 })
    }

    const attendeeIndex = event.attendeesList.indexOf(decoded.userId)

    if (attendeeIndex > -1) {
      event.attendeesList.splice(attendeeIndex, 1)
      event.attendees = Math.max(0, event.attendees - 1)
    } else {
      event.attendeesList.push(decoded.userId)
      event.attendees += 1
    }

    await event.save()

    return NextResponse.json({ message: "Attendance updated", event }, { status: 200 })
  } catch (error) {
    console.error("Error updating attendance:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
