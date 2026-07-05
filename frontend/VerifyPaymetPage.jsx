import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

const VerifyPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Confirming your payment...");

  useEffect(() => {
    let cancelled = false;

    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search || "");
      const sessionId = params.get("session_id");

      if (location.pathname === "/appointment/cancel") {
        if (!cancelled) {
          setStatus("cancelled");
          setMessage("Payment was cancelled.");
          window.setTimeout(() => {
            window.location.replace("/appointments?payment_status=Cancelled");
          }, 1200);
        }
        return;
      }

      if (!sessionId) {
        if (!cancelled) {
          setStatus("failed");
          setMessage("We could not verify your payment. Please try again.");
          window.setTimeout(() => {
            window.location.replace("/appointments?payment_status=Failed");
          }, 1200);
        }
        return;
      }

      try {
        const res = await axios.get(`${API_BASE}/api/appointments/confirm`, {
          params: { session_id: sessionId },
          timeout: 20000,
        });

        if (cancelled) return;

        if (res?.data?.success) {
          setStatus("success");
          setMessage("Payment confirmed. Redirecting to your appointments...");
          window.setTimeout(() => {
            window.location.replace("/appointments?payment_status=Paid");
          }, 1000);
        } else {
          setStatus("failed");
          setMessage("Payment verification failed. Please contact support if this keeps happening.");
          window.setTimeout(() => {
            window.location.replace("/appointments?payment_status=Failed");
          }, 1200);
        }
      } catch (error) {
        console.error("Payment verification failed:", error);
        if (!cancelled) {
          setStatus("failed");
          setMessage("Payment verification failed. Please contact support if this keeps happening.");
          window.setTimeout(() => {
            window.location.replace("/appointments?payment_status=Failed");
          }, 1200);
        }
      }
    };

    verifyPayment();
    return () => {
      cancelled = true;
    };
  }, [location, navigate]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: "24px" }}>
      <div style={{ maxWidth: "420px", width: "100%", background: "white", borderRadius: "16px", padding: "28px", boxShadow: "0 12px 40px rgba(0,0,0,0.08)", textAlign: "center" }}>
        <h2 style={{ margin: "0 0 12px", color: "#065f46", fontSize: "24px" }}>
          {status === "success" ? "Payment confirmed" : status === "cancelled" ? "Payment cancelled" : status === "failed" ? "Payment issue" : "Processing payment"}
        </h2>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>{message}</p>
      </div>
    </div>
  );
};

export default VerifyPaymentPage;