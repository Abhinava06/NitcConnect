import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Club } from "@/models/Club"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const club = await Club.findById(params.id).populate("president", "name rollNumber")

    if (!club) {
      return NextResponse.json({ message: "Club not found" }, { status: 404 })
    }

    return NextResponse.json({ club }, { status: 200 })
  } catch (error) {
    console.error("Error fetching club:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
