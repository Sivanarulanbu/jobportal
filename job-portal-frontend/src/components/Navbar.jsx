import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/dreamroute-logo.svg";

export default function Navbar() {
  const { user, logout } = useAuth();

  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 0",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  };

  const logoStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginRight: "3rem",
    background: "linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    textDecoration: "none"
  };

  const navLinksStyle = {
    display: "flex",
    gap: "2rem",
    alignItems: "center",
    listStyle: "none"
  };

  const linkStyle = {
    color: "#64748b",
    fontSize: "0.95rem",
    fontWeight: "500",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    transition: "all 0.3s ease",
    cursor: "pointer",
    textDecoration: "none",
  };

  const signInStyle = {
    ...linkStyle,
    border: "2px solid #4f46e5",
    color: "#4f46e5",
  };

  const signUpStyle = {
    ...linkStyle,
    background: "linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)",
    color: "#fff",
    fontWeight: "600",
  };

  const logoutButtonStyle = {
    ...linkStyle,
    backgroundColor: "#ef4444",
    color: "#fff",
    fontWeight: "600",
    border: "none",
    padding: "0.5rem 1.25rem",
  };

  const userGreetStyle = {
    color: "#4f46e5",
    fontWeight: "600",
    fontSize: "0.95rem",
  };

  return (
    <nav style={navStyle}>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <Link to="/" style={logoStyle}>
          <img src={logo} alt="DreamRoute" style={{ width: "36px", height: "36px", marginRight: "0.75rem", display: "inline-block", verticalAlign: "middle" }} />
          DreamRoute
        </Link>

        <div style={navLinksStyle}>
          <Link to="/jobs" style={linkStyle} onMouseEnter={(e) => e.target.style.color = "#a855f7"} onMouseLeave={(e) => e.target.style.color = "#64748b"}>Jobs</Link>

          {user ? (
            <>
              <Link to="/saved-jobs" style={linkStyle} onMouseEnter={(e) => e.target.style.color = "#06b6d4"} onMouseLeave={(e) => e.target.style.color = "#64748b"}>💾 Saved</Link>
              <span style={{ ...userGreetStyle, marginRight: "1rem" }}>
                {user.user?.first_name || user.username}
                <span style={{ marginLeft: "0.5rem", fontSize: "0.85rem", opacity: 0.8 }}>
                  ({user.profile?.user_type === 'employer' ? '👔 Employer' : '💼 Job Seeker'})
                </span>
              </span>
              <Link to="/profile" style={linkStyle}>👤</Link>
              <button onClick={logout} style={logoutButtonStyle} onMouseEnter={(e) => e.target.style.backgroundColor = "#dc2626"} onMouseLeave={(e) => e.target.style.backgroundColor = "#ef4444"}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={signInStyle} onMouseEnter={(e) => e.target.style.backgroundColor = "#4f46e5"} onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}>Sign In</Link>
              <Link to="/register" style={signUpStyle}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
