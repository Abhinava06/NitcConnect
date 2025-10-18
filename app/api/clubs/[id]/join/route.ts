import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Club } from "@/models/Club"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: string }

    await connectDB()

    const club = await Club.findById(params.id)

    if (!club) {
      return NextResponse.json({ message: "Club not found" }, { status: 404 })
    }

    const memberIndex = club.membersList.indexOf(decoded.userId)

    if (memberIndex > -1) {
      club.membersList.splice(memberIndex, 1)
      club.members = Math.max(0, club.members - 1)
    } else {
      club.membersList.push(decoded.userId)
      club.members += 1
    }

    await club.save()

    return NextResponse.json({ message: "Membership updated", club }, { status: 200 })
  } catch (error) {
    console.error("Error updating membership:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
