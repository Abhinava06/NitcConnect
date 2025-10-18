import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Faculty } from "@/models/Faculty"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const faculties = await Faculty.find().sort({ name: 1 })

    return NextResponse.json({ faculties }, { status: 200 })
  } catch (error) {
    console.error("Error fetching faculties:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
