import jwt from "jsonwebtoken";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

/* ==================== UNIFIED LOGIN ==================== */
export async function unifiedLogin(req, res) {
  try {
    const { email, password, role } = req.body || {};

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and role are required",
      });
    }

    const emailLC = email.toLowerCase();

    // Login as Doctor
    if (role === "doctor") {
      const doctor = await Doctor.findOne({ email: emailLC }).select(
        "+password"
      );

      if (!doctor) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials or doctor not registered by admin",
        });
      }

      // Direct comparison (NO bcrypt)
      if (doctor.password !== password) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      if (!JWT_SECRET) {
        return res.status(500).json({
          success: false,
          message: "JWT_SECRET not configured",
        });
      }

      const token = jwt.sign(
        {
          id: doctor._id.toString(),
          email: doctor.email,
          role: "doctor",
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      const out = doctor.toObject();
      delete out.password;

      return res.json({
        success: true,
        token,
        role: "doctor",
        data: out,
      });
    }

    // Login as Patient
    if (role === "patient") {
      const patient = await Patient.findOne({ email: emailLC }).select(
        "+password"
      );

      if (!patient) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials or patient not registered",
        });
      }

      // Direct comparison (NO bcrypt)
      if (patient.password !== password) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      if (!JWT_SECRET) {
        return res.status(500).json({
          success: false,
          message: "JWT_SECRET not configured",
        });
      }

      const token = jwt.sign(
        {
          id: patient._id.toString(),
          email: patient.email,
          role: "patient",
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      const out = patient.toObject();
      delete out.password;

      return res.json({
        success: true,
        token,
        role: "patient",
        data: out,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid role. Must be 'doctor' or 'patient'",
    });
  } catch (err) {
    console.error("unifiedLogin error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
