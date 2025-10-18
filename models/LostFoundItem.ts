import mongoose from "mongoose"

const lostFoundItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["electronics", "documents", "accessories", "clothing", "other"],
      default: "other",
    },
    location: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },
    image: {
      type: String,
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "resolved", "removed"],
      default: "active",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

export const LostFoundItem = mongoose.models.LostFoundItem || mongoose.model("LostFoundItem", lostFoundItemSchema)
