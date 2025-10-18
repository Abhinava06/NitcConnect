import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { HostelTicket } from "@/models/HostelTicket"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const ticket = await HostelTicket.findById(params.id).populate("user", "name rollNumber")

    if (!ticket) {
      return NextResponse.json({ message: "Ticket not found" }, { status: 404 })
    }

    return NextResponse.json({ ticket }, { status: 200 })
  } catch (error) {
    console.error("Error fetching ticket:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
