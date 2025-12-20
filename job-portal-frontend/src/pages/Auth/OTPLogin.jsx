import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/apiClient";
import { useAuth } from "../../hooks/useAuth";

export default function OTPLogin() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stage, setStage] = useState("email"); // email, otp
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [attemptsRemaining, setAttemptsRemaining] = useState(5);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiClient.post("/accounts/otp/send_otp/", {
        email: email.trim(),
        purpose: "login",
      });
      setSuccess("OTP sent to your email!");
      setStage("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.post("/accounts/otp/login_with_otp/", {
        email: email.trim(),
        otp_code: otp.trim(),
      });

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        const userType = response.data.user.user_type;
        navigate(userType === "employer" ? "/employer-dashboard" : "/job-seeker-dashboard");
      }, 1500);
    } catch (err) {
      const message = err.response?.data?.message || "Invalid OTP";
      const remaining = err.response?.data?.attempts_remaining;
      setError(message);
      if (remaining !== undefined) {
        setAttemptsRemaining(remaining);
      }
    } finally {
      setLoading(false);
    }
  };

  // Redirect if already logged in
  if (user) {
    navigate("/");
    return null;
  }

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    padding: "1rem",
  };

  const formContainerStyle = {
    background: "white",
    borderRadius: "1rem",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    maxWidth: "450px",
    width: "100%",
    padding: "2.5rem",
  };

  const titleStyle = {
    fontSize: "2rem",
    fontWeight: "800",
    marginBottom: "0.5rem",
    background: "linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  const subtitleStyle = {
    color: "#64748b",
    marginBottom: "2rem",
    fontSize: "0.95rem",
  };

  const formGroupStyle = {
    marginBottom: "1.5rem",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "0.5rem",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "2px solid #e2e8f0",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    fontFamily: "inherit",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    width: "100%",
    padding: "0.875rem",
    background: "linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "1rem",
  };

  const errorStyle = {
    padding: "0.875rem",
    background: "#fee2e2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    borderRadius: "0.5rem",
    marginBottom: "1.5rem",
    fontSize: "0.9rem",
  };

  const successStyle = {
    padding: "0.875rem",
    background: "#dcfce7",
    border: "1px solid #86efac",
    color: "#166534",
    borderRadius: "0.5rem",
    marginBottom: "1.5rem",
    fontSize: "0.9rem",
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h1 style={titleStyle}>Welcome Back</h1>
        <p style={subtitleStyle}>
          {stage === "email"
            ? "Enter your email to receive OTP"
            : "Enter the OTP sent to your email"}
        </p>

        {error && <div style={errorStyle}>{error}</div>}
        {success && <div style={successStyle}>{success}</div>}

        {/* Stage 1: Email */}
        {stage === "email" && (
          <form onSubmit={handleEmailSubmit}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
                required
              />
            </div>
            <button
              type="submit"
              style={buttonStyle}
              disabled={loading}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = "1";
              }}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Stage 2: OTP Verification */}
        {stage === "otp" && (
          <form onSubmit={handleOTPSubmit}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                maxLength="6"
                style={inputStyle}
                required
              />
              <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.5rem" }}>
                Check your email for the 6-digit code • Attempts remaining: {attemptsRemaining}
              </p>
            </div>
            <button
              type="submit"
              style={buttonStyle}
              disabled={loading}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = "1";
              }}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStage("email");
                setOtp("");
                setError("");
                setSuccess("");
              }}
              style={{
                ...buttonStyle,
                background: "#e2e8f0",
                color: "#1e293b",
                marginTop: "0.5rem",
              }}
            >
              Change Email
            </button>
          </form>
        )}

        <p style={{ marginTop: "1.5rem", textAlign: "center", color: "#64748b" }}>
          Don't have an account?{" "}
          <a
            href="/register"
            style={{
              color: "#4f46e5",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
}
