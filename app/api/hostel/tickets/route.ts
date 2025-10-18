import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { HostelTicket } from "@/models/HostelTicket"
import jwt from "jsonwebtoken"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const tickets = await HostelTicket.find().populate("user", "name rollNumber").sort({ createdAt: -1 })

    return NextResponse.json({ tickets }, { status: 200 })
  } catch (error) {
    console.error("Error fetching tickets:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: string }

    const { title, description, type } = await request.json()

    if (!title || !description || !type) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    await connectDB()

    const ticket = await HostelTicket.create({
      title,
      description,
      type,
      user: decoded.userId,
      status: "pending",
    })

    await ticket.populate("user", "name rollNumber")

    return NextResponse.json({ message: "Ticket created successfully", ticket }, { status: 201 })
  } catch (error) {
    console.error("Error creating ticket:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
