import express from "express";
import { unifiedLogin } from "../controllers/authController.js";

const authRouter = express.Router();

// Unified login endpoint for both doctors and patients
authRouter.post("/login", unifiedLogin);

// Doctor login (alias for unified login with role=doctor)
authRouter.post("/doctor-login", (req, res, next) => {
  req.body = { ...req.body, role: "doctor" };
  unifiedLogin(req, res);
});

export default authRouter;
