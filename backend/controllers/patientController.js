import jwt from "jsonwebtoken";
import Patient from "../models/Patient.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

/* ==================== PATIENT LOGIN ==================== */
export async function patientLogin(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const patient = await Patient.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!patient) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Direct comparison (NO bcrypt, match doctor model)
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

    return res.json({ success: true, token, data: out });
  } catch (err) {
    console.error("patientLogin error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

/* ==================== PATIENT SIGNUP ==================== */
export async function patientSignup(req, res) {
  try {
    const body = req.body || {};
    if (!body.email || !body.password || !body.name) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and name are required",
      });
    }

    const emailLC = (body.email || "").toLowerCase();

    // Check if patient already exists
    if (await Patient.findOne({ email: emailLC })) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const patient = new Patient({
      email: emailLC,
      password: body.password,
      name: body.name,
      phone: body.phone || "",
      age: body.age || null,
      gender: body.gender || "",
      address: body.address || "",
      city: body.city || "",
      state: body.state || "",
      zipCode: body.zipCode || "",
      medicalHistory: body.medicalHistory || "",
      allergies: body.allergies || "",
    });

    const saved = await patient.save();
    const out = saved.toObject();
    delete out.password;

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET not configured",
      });
    }

    const token = jwt.sign(
      {
        id: saved._id.toString(),
        email: saved.email,
        role: "patient",
      },
      secret,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Patient registered successfully",
      token,
      data: out,
    });
  } catch (err) {
    console.error("patientSignup error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

/* ==================== GET PATIENT ==================== */
export async function getPatientById(req, res) {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id).select("-password");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.json({ success: true, data: patient });
  } catch (err) {
    console.error("getPatientById error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

/* ==================== UPDATE PATIENT ==================== */
export async function updatePatient(req, res) {
  try {
    const { id } = req.params;
    const body = req.body || {};

    const patient = await Patient.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.json({
      success: true,
      message: "Patient updated successfully",
      data: patient,
    });
  } catch (err) {
    console.error("updatePatient error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

/* ==================== DELETE PATIENT ==================== */
export async function deletePatient(req, res) {
  try {
    const { id } = req.params;
    const patient = await Patient.findByIdAndDelete(id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (err) {
    console.error("deletePatient error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

/* ==================== GET ALL PATIENTS ==================== */
export async function getAllPatients(req, res) {
  try {
    const patients = await Patient.find({}).select("-password");

    return res.json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (err) {
    console.error("getAllPatients error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
