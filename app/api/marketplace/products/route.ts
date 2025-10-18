import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Product } from "@/models/Product"
import jwt from "jsonwebtoken"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const products = await Product.find().populate("seller", "name rollNumber").sort({ createdAt: -1 })

    return NextResponse.json({ products }, { status: 200 })
  } catch (error) {
    console.error("Error fetching products:", error)
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

    const { title, description, price, category, image } = await request.json()

    if (!title || !description || !price || !category) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    await connectDB()

    const product = await Product.create({
      title,
      description,
      price: Number(price),
      category,
      image,
      seller: decoded.userId,
    })

    await product.populate("seller", "name rollNumber")

    return NextResponse.json({ message: "Product created successfully", product }, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
