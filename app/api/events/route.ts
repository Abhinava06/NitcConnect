import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Event } from "@/models/Event"
import jwt from "jsonwebtoken"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const events = await Event.find().populate("organizer", "name email").sort({ startDate: 1 })

    return NextResponse.json({ events })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value
    if (!token) {
      return NextResponse.json({ error: "Please login to create an event" }, { status: 401 })
    }

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      console.error("JWT_SECRET is not configured")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    let decoded
    try {
      decoded = jwt.verify(token, jwtSecret) as { userId: string }
    } catch (err) {
      return NextResponse.json({ error: "Invalid session, please login again" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, location, category } = body

    // Accept either:
    // - body.startDate (ISO) and body.endDate (ISO)
    // - or body.date (YYYY-MM-DD) + body.time (HH:mm) [+ body.endTime (HH:mm)]
    if (!title || !description || !location || !category) {
      return NextResponse.json({ error: "Missing required fields (title, description, location, category)" }, { status: 400 })
    }

    let startDate: Date | null = null
    let endDate: Date | null = null

    if (body.startDate && body.endDate) {
      startDate = new Date(body.startDate)
      endDate = new Date(body.endDate)
    } else if (body.date && body.time) {
      const date = body.date // expected YYYY-MM-DD
      const time = body.time // expected HH:mm
      const startStr = `${date}T${time}`
      startDate = new Date(startStr)
      if (body.endTime) {
        endDate = new Date(`${date}T${body.endTime}`)
      } else {
        // default duration 1 hour
        endDate = new Date(startDate.getTime() + 60 * 60 * 1000)
      }
    } else {
      return NextResponse.json({ error: "Missing date/time. Provide startDate & endDate or date + time (and optional endTime)" }, { status: 400 })
    }

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json({ error: "Invalid date/time format" }, { status: 400 })
    }

    if (endDate <= startDate) {
      return NextResponse.json({ error: "endDate must be after startDate" }, { status: 400 })
    }

    await connectDB()

    const event = await Event.create({
      title,
      description,
      startDate,
      endDate,
      location,
      category,
      organizer: decoded.userId,
    })

    await event.populate("organizer", "name email")

    return NextResponse.json({ event }, { status: 201 })
  } catch (error: any) {
    // include validation details when available
    console.error("Event creation error:", error)
    const details = error?.errors ? Object.keys(error.errors).map(k => ({ field: k, message: error.errors[k].message })) : undefined
    return NextResponse.json({ error: error.message || "Failed to create event", details }, { status: 500 })
  }
}
