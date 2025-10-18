import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Faculty } from "@/models/Faculty"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const faculty = await Faculty.findById(params.id)

    if (!faculty) {
      return NextResponse.json({ message: "Faculty not found" }, { status: 404 })
    }

    return NextResponse.json({ faculty }, { status: 200 })
  } catch (error) {
    console.error("Error fetching faculty:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
