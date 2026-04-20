import express from "express";
import { unifiedLogin } from "../controllers/authController.js";

const authRouter = express.Router();

// Unified login endpoint for both doctors and patients
authRouter.post("/login", unifiedLogin);

export default authRouter;
