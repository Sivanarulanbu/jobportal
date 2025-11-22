import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login, user } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      console.log("User already logged in, redirecting to home");
      nav("/");
    }
  }, [user, nav]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!form.username.trim() || !form.password.trim()) {
      setError("Please enter both username and password");
      return;
    }
    
    try {
      setLoading(true);
      console.log("Starting login...");
      await login(form.username, form.password);
      console.log("Login successful, redirecting...");
      
      // Give it a moment to ensure state is updated
      setTimeout(() => {
        nav("/");
      }, 500);
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Login failed. Please check your credentials.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    padding: "1rem"
  };

  const formContainerStyle = {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "#ffffff",
    padding: "2.5rem",
    borderRadius: "0.75rem",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb"
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "2rem"
  };

  const logoStyle = {
    fontSize: "2.5rem",
    fontWeight: "800",
    color: "#000",
    marginBottom: "0.5rem"
  };

  const subtitleStyle = {
    color: "#666",
    fontSize: "0.95rem",
    fontWeight: "500"
  };

  const headingStyle = {
    fontSize: "1.75rem",
    fontWeight: "700",
    color: "#000",
    marginBottom: "1.5rem",
    textAlign: "center"
  };

  const errorStyle = {
    padding: "1rem",
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    borderRadius: "0.5rem",
    marginBottom: "1.5rem",
    border: "1px solid #fca5a5",
    fontSize: "0.95rem"
  };

  const inputGroupStyle = {
    marginBottom: "1.25rem"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "600",
    color: "#000",
    fontSize: "0.95rem"
  };

  const inputStyle = {
    width: "100%",
    padding: "0.85rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    fontFamily: "inherit",
    color: "#000",
    backgroundColor: "#f9fafb",
    transition: "all 0.3s ease",
    boxSizing: "border-box"
  };

  const buttonStyle = {
    width: "100%",
    padding: "0.9rem",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "0.5rem",
    fontWeight: "700",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "0.5rem"
  };

  const linkStyle = {
    textAlign: "center",
    marginTop: "1.5rem",
    color: "#666",
    fontSize: "0.95rem"
  };

  const registerLinkStyle = {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "600",
    transition: "color 0.3s ease"
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <div style={headerStyle}>
          <div style={logoStyle}>
            <svg width="48" height="48" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "0.75rem", display: "inline-block", verticalAlign: "middle" }}>
              {/* Compass Rose */}
              <g transform="translate(140, 50)">
                {/* Center main star - larger */}
                <path d="M 0 -20 L 8 -8 L 20 0 L 8 8 L 0 20 L -8 8 L -20 0 L -8 -8 Z" fill="#3b46d9" />
                
                {/* North point */}
                <path d="M 0 -28 L 6 -18 L 0 -10 L -6 -18 Z" fill="#4f46e5" />
                {/* NE small star */}
                <path d="M 18 -16 L 22 -12 L 18 -8 L 14 -12 Z" fill="#a855f7" />
                {/* East point - gradient toward cyan */}
                <path d="M 28 0 L 18 6 L 10 0 L 18 -6 Z" fill="#06b6d4" />
                {/* SE small star */}
                <path d="M 16 18 L 20 22 L 16 26 L 12 22 Z" fill="#a855f7" />
                {/* South point */}
                <path d="M 0 30 L 6 20 L 0 12 L -6 20 Z" fill="#4f46e5" />
                {/* SW small star */}
                <path d="M -16 18 L -12 22 L -16 26 L -20 22 Z" fill="#8b5cf6" />
                {/* West small star */}
                <path d="M -18 -4 L -14 0 L -18 4 L -22 0 Z" fill="#4f46e5" />
              </g>
              
              {/* Curved pathway arrows */}
              {/* Outermost arc */}
              <path d="M 80 140 Q 60 150 40 160 Q 20 170 10 185" stroke="#06b6d4" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.6" />
              {/* Middle arc */}
              <path d="M 95 130 Q 70 145 45 165 Q 25 180 8 195" stroke="#7c3aed" strokeWidth="11" fill="none" strokeLinecap="round" opacity="0.75" />
              {/* Inner arc */}
              <path d="M 110 120 Q 85 138 60 165 Q 35 188 12 205" stroke="#4f46e5" strokeWidth="10" fill="none" strokeLinecap="round" />
              
              {/* Arrow head */}
              <path d="M 8 205 L -5 195 L 0 182 Z" fill="#4f46e5" />
              <path d="M 10 185 L -2 177 L 2 167 Z" fill="#06b6d4" opacity="0.6" />
            </svg>
            DreamRoute
          </div>
          <p style={subtitleStyle}>Your Gateway to Dream Career</p>
        </div>

        <h2 style={headingStyle}>Sign In</h2>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
            />
          </div>

          <button
            type="submit"
            style={buttonStyle}
            disabled={loading}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = "#1d4ed8")}
            onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = "#2563eb")}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={linkStyle}>
          Don't have an account?{" "}
          <Link 
            to="/register" 
            style={registerLinkStyle}
            onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
            onMouseLeave={(e) => e.target.style.textDecoration = "none"}
          >
            Create one here
          </Link>
        </div>
      </div>
    </div>
  );
}
