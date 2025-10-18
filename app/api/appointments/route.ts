import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Appointment } from "@/models/Appointment"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: string }

    const { facultyId, date, time, purpose } = await request.json()

    if (!facultyId || !date || !time || !purpose) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    await connectDB()

    const appointment = await Appointment.create({
      faculty: facultyId,
      student: decoded.userId,
      date,
      time,
      purpose,
      status: "pending",
    })

    await appointment.populate("faculty", "name office")

    return NextResponse.json({ message: "Appointment booked successfully", appointment }, { status: 201 })
  } catch (error) {
    console.error("Error booking appointment:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
