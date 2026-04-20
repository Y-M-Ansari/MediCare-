import express from "express";
import {
  patientLogin,
  patientSignup,
  getPatientById,
  updatePatient,
  deletePatient,
  getAllPatients,
} from "../controllers/patientController.js";

const patientRouter = express.Router();

// Public routes
patientRouter.post("/login", patientLogin);
patientRouter.post("/signup", patientSignup);

// Get all patients
patientRouter.get("/", getAllPatients);

// Get patient by ID
patientRouter.get("/:id", getPatientById);

// Update patient
patientRouter.put("/:id", updatePatient);

// Delete patient
patientRouter.delete("/:id", deletePatient);

export default patientRouter;
