import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import logo from "../../assets/logo.png";
import { ArrowLeft } from "lucide-react";
import { loginPageStyles, toastStyles } from "../../assets/dummyStyles";

const PATIENT_TOKEN_KEY = "patientToken_v1";

export default function SignUpPage({ apiBase }) {
  const API_BASE = apiBase || import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    age: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.password || !formData.name) {
      toast.error("Email, password, and name are required!", {
        style: toastStyles.errorToast,
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!", {
        style: toastStyles.errorToast,
      });
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters!", {
        style: toastStyles.errorToast,
      });
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(`${API_BASE}/api/patients/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone || "",
          age: formData.age ? parseInt(formData.age) : null,
          gender: formData.gender || "",
          address: formData.address || "",
          city: formData.city || "",
          state: formData.state || "",
          zipCode: formData.zipCode || "",
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(json?.message || "Signup failed", { duration: 4000 });
        setBusy(false);
        return;
      }

      // token
      const token = json?.token || json?.data?.token;
      if (!token) {
        toast.error("Authentication token missing");
        setBusy(false);
        return;
      }

      const patientId = json?.data?._id;
      if (!patientId) {
        toast.error("Patient ID missing from server response");
        setBusy(false);
        return;
      }

      // Store token
      localStorage.setItem(PATIENT_TOKEN_KEY, token);
      localStorage.setItem("userRole", "patient");
      localStorage.setItem("userId", patientId);

      window.dispatchEvent(
        new StorageEvent("storage", {
          key: PATIENT_TOKEN_KEY,
          newValue: token,
        })
      );

      toast.success("Signup successful — redirecting...", {
        style: toastStyles.successToast,
      });

      // ✅ Navigate to home
      setTimeout(() => {
        navigate("/");
      }, 700);
    } catch (err) {
      console.error("signup error", err);
      toast.error("Network error during signup");
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

      <div className={loginPageStyles.loginCard} style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <div className={loginPageStyles.logoContainer}>
          <img src={logo} alt="Logo" className={loginPageStyles.logo} />
        </div>

        <h2 className={loginPageStyles.title}>Create Patient Account</h2>
        <p className={loginPageStyles.subtitle}>
          Register to book appointments and manage your health
        </p>

        <form onSubmit={handleSignup} className={loginPageStyles.form}>
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className={loginPageStyles.input}
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className={loginPageStyles.input}
            required
          />

          {/* Phone */}
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className={loginPageStyles.input}
          />

          {/* Age */}
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            className={loginPageStyles.input}
          />

          {/* Gender */}
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={loginPageStyles.input}
            style={{ appearance: "auto" }}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          {/* Address */}
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className={loginPageStyles.input}
          />

          {/* City */}
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className={loginPageStyles.input}
          />

          {/* State */}
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            className={loginPageStyles.input}
          />

          {/* Zip Code */}
          <input
            type="text"
            name="zipCode"
            placeholder="Zip Code"
            value={formData.zipCode}
            onChange={handleChange}
            className={loginPageStyles.input}
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={loginPageStyles.input}
            required
          />

          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={loginPageStyles.input}
            required
          />

          <button
            type="submit"
            disabled={busy}
            className={loginPageStyles.submitButton}
          >
            {busy ? "Creating account…" : "Sign Up"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.875rem", color: "#6b7280" }}>
          Already have an account?{" "}
          <a href="/doctor-admin/login" style={{ color: "#059669", fontWeight: "600" }}>
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
