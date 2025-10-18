import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { HostelTicket } from "@/models/HostelTicket"

export async function GET() {
  try {
    await connectDB()
    const tickets = await HostelTicket.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
    
    return NextResponse.json(tickets)
  } catch (error) {
    console.error("Error fetching hostel tickets:", error)
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    )
  }
}