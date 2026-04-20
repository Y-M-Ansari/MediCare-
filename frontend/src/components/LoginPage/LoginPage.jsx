import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import logo from "../../assets/logo.png";
import { ArrowLeft } from "lucide-react";
import { loginPageStyles, toastStyles } from "../../assets/dummyStyles";

const DOCTOR_TOKEN_KEY = "doctorToken_v1";
const PATIENT_TOKEN_KEY = "patientToken_v1";

export default function LoginPage({ apiBase }) {
  const API_BASE = apiBase || import.meta.env.VITE_API_URL;
  const [role, setRole] = useState(""); // "doctor" or "patient"
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!role) {
      toast.error("Please select Doctor or Patient role", {
        style: toastStyles.errorToast,
      });
      return;
    }

    if (!formData.email || !formData.password) {
      toast.error("All fields are required!", {
        style: toastStyles.errorToast,
      });
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role,
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(json?.message || "Login failed", { duration: 4000 });
        setBusy(false);
        return;
      }

      /* ================= IMPORTANT PART ================= */

      // token
      const token = json?.token || json?.data?.token;
      if (!token) {
        toast.error("Authentication token missing");
        setBusy(false);
        return;
      }

      // user id
      const userId =
        json?.data?._id || json?.doctor?._id || json?.patient?._id;

      if (!userId) {
        toast.error("User ID missing from server response");
        setBusy(false);
        return;
      }

      // Store token based on role
      const tokenKey = role === "doctor" ? DOCTOR_TOKEN_KEY : PATIENT_TOKEN_KEY;
      localStorage.setItem(tokenKey, token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userId", userId);
      
      window.dispatchEvent(
        new StorageEvent("storage", { key: tokenKey, newValue: token })
      );

      toast.success("Login successful — redirecting...", {
        style: toastStyles.successToast,
      });

      // ✅ Navigate to dynamic route based on role
      setTimeout(() => {
        if (role === "doctor") {
          navigate(`/doctor-admin/${userId}`);
        } else {
          navigate(`/`);
        }
      }, 700);
    } catch (err) {
      console.error("login error", err);
      toast.error("Network error during login");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={loginPageStyles.mainContainer}>
      <Toaster position="top-right" reverseOrder={false} />

      <button
        onClick={() => navigate("/")}
        className={loginPageStyles.backButton}
      >
        <ArrowLeft className={loginPageStyles.backButtonIcon} />
        Back to Home
      </button>

      <div className={loginPageStyles.loginCard}>
        <div className={loginPageStyles.logoContainer}>
          <img src={logo} alt="Logo" className={loginPageStyles.logo} />
        </div>

        <h2 className={loginPageStyles.title}>MediCare Login</h2>
        <p className={loginPageStyles.subtitle}>
          Sign in to your account
        </p>

        {/* Role Selector */}
        <div style={{ marginBottom: "1.5rem", display: "flex", gap: "1rem" }}>
          <button
            type="button"
            onClick={() => setRole("doctor")}
            style={{
              flex: 1,
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "2px solid",
              borderColor: role === "doctor" ? "#059669" : "#e5e7eb",
              backgroundColor: role === "doctor" ? "#ecfdf5" : "#f9fafb",
              color: role === "doctor" ? "#059669" : "#6b7280",
              fontWeight: role === "doctor" ? "600" : "500",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            Doctor
          </button>
          <button
            type="button"
            onClick={() => setRole("patient")}
            style={{
              flex: 1,
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "2px solid",
              borderColor: role === "patient" ? "#059669" : "#e5e7eb",
              backgroundColor: role === "patient" ? "#ecfdf5" : "#f9fafb",
              color: role === "patient" ? "#059669" : "#6b7280",
              fontWeight: role === "patient" ? "600" : "500",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            Patient
          </button>
        </div>

        {role && (
          <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "1rem", textAlign: "center" }}>
            Logging in as <strong>{role === "doctor" ? "Doctor" : "Patient"}</strong>
          </p>
        )}

        <form onSubmit={handleLogin} className={loginPageStyles.form}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className={loginPageStyles.input}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={loginPageStyles.input}
            required
          />

          <button
            type="submit"
            disabled={busy || !role}
            className={loginPageStyles.submitButton}
            style={{ opacity: !role ? 0.6 : 1, cursor: !role ? "not-allowed" : "pointer" }}
          >
            {busy ? "Signing in…" : "Login"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.875rem", color: "#6b7280" }}>
          {role === "patient" && (
            <>
              Don't have an account? <a href="/signup" style={{ color: "#059669", fontWeight: "600" }}>Sign up here</a>
            </>
          )}
          {role === "doctor" && (
            <span>Contact admin to register your account</span>
          )}
        </p>
      </div>
    </div>
  );
}
