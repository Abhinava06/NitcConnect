import mongoose from "mongoose"

const facultySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    office: {
      type: String,
      required: false,
    },
    designation: {
      type: String,
      required: false,
    },
    specialization: {
      type: String,
      required: false,
    },
    availableSlots: {
      type: Number,
      default: 10,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

export const Faculty = mongoose.models.Faculty || mongoose.model("Faculty", facultySchema)
