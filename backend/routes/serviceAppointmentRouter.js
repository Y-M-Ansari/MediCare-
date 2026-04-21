// routes/serviceAppointmentRouter.js
import express from "express";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import unifiedAuth from "../middlewares/unifiedAuth.js";

import {
  getServiceAppointments,
  getServiceAppointmentById,
  createServiceAppointment,
  confirmServicePayment,
  updateServiceAppointment,
  cancelServiceAppointment,
  getServiceAppointmentStats,
  getServiceAppointmentsByPatient,
} from "../controllers/serviceAppointmentController.js";

const router = express.Router();

/* FIXED ROUTES FIRST */
router.get("/", getServiceAppointments);
router.get("/confirm", confirmServicePayment);
router.get("/stats/summary", getServiceAppointmentStats);

router.post("/", unifiedAuth, createServiceAppointment);

// 🔥 MUST BE BEFORE :id
router.get(
  "/me",
  unifiedAuth,
  getServiceAppointmentsByPatient
);

/* ID ROUTES LAST */
router.get("/:id", getServiceAppointmentById);
router.put("/:id", updateServiceAppointment);
router.post("/:id/cancel", cancelServiceAppointment);

export default router;
