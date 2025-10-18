import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    rollNumber: {
      type: String,
    },
    googleId: {
      type: String,
    },
    authProvider: {
      type: String,
      enum: ["email", "google"],
      default: "email",
    },
    profileImage: {
      type: String,
    },
    bio: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

export const User = mongoose.models.User || mongoose.model("User", userSchema)
