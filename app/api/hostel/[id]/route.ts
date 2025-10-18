import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { HostelTicket } from "@/models/HostelTicket"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()
    await connectDB()

    const ticket = await HostelTicket.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    )

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(ticket)
  } catch (error) {
    console.error("Error updating hostel ticket:", error)
    return NextResponse.json(
      { error: "Failed to update ticket" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const ticket = await HostelTicket.findById(params.id)
      .populate("user", "name email")

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(ticket)
  } catch (error) {
    console.error("Error fetching hostel ticket:", error)
    return NextResponse.json(
      { error: "Failed to fetch ticket" },
      { status: 500 }
    )
  }
}