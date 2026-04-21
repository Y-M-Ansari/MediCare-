// backend/middlewares/unifiedAuth.js
import jwt from "jsonwebtoken";
import { getAuth } from "@clerk/express";
import Patient from "../models/Patient.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

/**
 * Unified authentication middleware
 * - First tries Clerk authentication
 * - Falls back to JWT token (patient login via our system)
 * - Attaches userId and role to req.auth
 */
export default async function unifiedAuth(req, res, next) {
  try {
    // 1️⃣ Try Clerk auth first
    const clerkAuth = getAuth(req);
    if (clerkAuth?.userId) {
      req.auth = {
        userId: clerkAuth.userId,
        type: "clerk",
      };
      return next();
    }

    // 2️⃣ Fall back to JWT token (patient or doctor)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated. Please sign in.",
      });
    }

    const token = authHeader.split(" ")[1];

    try {
      const payload = jwt.verify(token, JWT_SECRET);

      // Verify user exists in database
      if (payload.role === "patient") {
        const patient = await Patient.findById(payload.id);
        if (!patient) {
          return res.status(401).json({
            success: false,
            message: "Patient not found",
          });
        }
        req.auth = {
          userId: payload.id,
          type: "jwt",
          role: "patient",
          email: payload.email,
        };
      } else if (payload.role === "doctor") {
        // For doctors, just use the payload
        req.auth = {
          userId: payload.id,
          type: "jwt",
          role: "doctor",
          email: payload.email,
        };
      } else {
        throw new Error("Invalid role in token");
      }

      return next();
    } catch (jwtErr) {
      console.error("JWT verification failed:", jwtErr.message);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  } catch (err) {
    console.error("unifiedAuth error:", err);
    return res.status(500).json({
      success: false,
      message: "Authentication error",
    });
  }
}
