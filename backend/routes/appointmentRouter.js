// routes/appointmentRouter.js
import express from "express";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import unifiedAuth from "../middlewares/unifiedAuth.js";

import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  confirmPayment,
  updateAppointment,
  cancelAppointment,
  getStats,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  
  getRegisteredUserCount,
} from "../controllers/appointmentController.js";

const appointmentRouter = express.Router();

/* =========================
   PUBLIC / FIXED ROUTES
   ========================= */

// list appointments
appointmentRouter.get("/", getAppointments);

// stripe confirm
appointmentRouter.get("/confirm", confirmPayment);

// stats
appointmentRouter.get("/stats/summary", getStats);

/* =========================
   AUTHENTICATED ROUTES
   ========================= */

// create appointment (unified auth - Clerk or JWT)
appointmentRouter.post(
  "/",
  unifiedAuth,
  createAppointment
);

// 🔥 IMPORTANT: /me MUST COME BEFORE /:id
appointmentRouter.get(
  "/me",
  unifiedAuth,
  getAppointmentsByPatient
);
// appointmentRouter.get("/:id", getAppointmentById);
appointmentRouter.get(
  "/doctor/:doctorId",
  getAppointmentsByDoctor
);

appointmentRouter.post("/:id/cancel", cancelAppointment);
appointmentRouter.get("/patients/count",getRegisteredUserCount); 
appointmentRouter.put("/:id", updateAppointment);


export default appointmentRouter;
