import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { LostFoundItem } from "@/models/LostFoundItem"
import jwt from "jsonwebtoken"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const items = await LostFoundItem.find().populate("reporter", "name rollNumber").sort({ createdAt: -1 })

    return NextResponse.json({ items }, { status: 200 })
  } catch (error) {
    console.error("Error fetching items:", error)
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

    const { title, description, category, location, type, image } = await request.json()

    if (!title || !description || !category || !location || !type) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    await connectDB()

    const item = await LostFoundItem.create({
      title,
      description,
      category,
      location,
      type,
      image,
      reporter: decoded.userId,
    })

    await item.populate("reporter", "name rollNumber")

    return NextResponse.json({ message: "Item reported successfully", item }, { status: 201 })
  } catch (error) {
    console.error("Error creating item:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
