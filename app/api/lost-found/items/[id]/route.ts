import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { LostFoundItem } from "@/models/LostFoundItem"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const item = await LostFoundItem.findById(params.id).populate("reporter", "name rollNumber")

    if (!item) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 })
    }

    return NextResponse.json({ item }, { status: 200 })
  } catch (error) {
    console.error("Error fetching item:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
