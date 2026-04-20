import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    // Plain text password (match doctor model for consistency)
    password: {
      type: String,
      required: true,
      select: false,
    },

    name: { type: String, required: true, trim: true },
    
    phone: { type: String, default: "" },
    age: { type: Number, default: null },
    gender: { type: String, enum: ["Male", "Female", "Other"], default: "" },
    
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zipCode: { type: String, default: "" },

    profileImage: { type: String, default: null },
    medicalHistory: { type: String, default: "" },
    allergies: { type: String, default: "" },

    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

// text search
patientSchema.index({ name: "text", email: "text" });

const Patient =
  mongoose.models.Patient || mongoose.model("Patient", patientSchema);

export default Patient;
