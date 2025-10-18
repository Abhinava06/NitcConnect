import mongoose from "mongoose"

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["technical", "cultural", "sports", "academic", "social", "other"],
      default: "other",
    },
    email: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    president: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: {
      type: Number,
      default: 1,
    },
    membersList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

export const Club = mongoose.models.Club || mongoose.model("Club", clubSchema)
