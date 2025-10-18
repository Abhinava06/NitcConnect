import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/models/User"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, rollNumber } = await request.json()

    // Validate input
    if (!name || !email || !password || !rollNumber) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    await connectDB()

    // Only allow NITC email addresses
    if (!email.toLowerCase().endsWith('@nitc.ac.in')) {
      return NextResponse.json({ message: 'Only @nitc.ac.in email addresses are allowed' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      rollNumber,
      authProvider: "email",
    })

    return NextResponse.json(
      { message: "User created successfully", user: { id: user._id, name: user.name, email: user.email } },
      { status: 201 },
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
