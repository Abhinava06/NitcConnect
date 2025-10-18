import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Club } from "@/models/Club"
import jwt from "jsonwebtoken"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const clubs = await Club.find().populate("president", "name rollNumber").sort({ createdAt: -1 })

    return NextResponse.json({ clubs }, { status: 200 })
  } catch (error) {
    console.error("Error fetching clubs:", error)
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

    const { name, description, category, email, image } = await request.json()

    if (!name || !description || !category || !email) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    await connectDB()

    const club = await Club.create({
      name,
      description,
      category,
      email,
      image,
      president: decoded.userId,
      membersList: [decoded.userId],
      members: 1,
    })

    await club.populate("president", "name rollNumber")

    return NextResponse.json({ message: "Club created successfully", club }, { status: 201 })
  } catch (error) {
    console.error("Error creating club:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
