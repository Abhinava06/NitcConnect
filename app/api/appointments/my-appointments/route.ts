import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Appointment } from "@/models/Appointment"
import jwt from "jsonwebtoken"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: string }

    await connectDB()

    const appointments = await Appointment.find({ student: decoded.userId })
      .populate("faculty", "name office")
      .sort({ date: 1 })

    return NextResponse.json({ appointments }, { status: 200 })
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
