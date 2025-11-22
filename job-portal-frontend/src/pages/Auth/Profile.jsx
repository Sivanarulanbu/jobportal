import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return <div style={{ textAlign: "center", padding: "2rem", color: "#000" }}>Loading...</div>;
  }

  const containerStyle = {
    minHeight: "calc(100vh - 200px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    padding: "1rem"
  };

  const profileStyle = {
    width: "100%",
    maxWidth: "450px",
    backgroundColor: "#ffffff",
    padding: "2.5rem",
    borderRadius: "0.75rem",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb"
  };

  const headingStyle = {
    fontSize: "1.75rem",
    fontWeight: "700",
    color: "#000",
    marginBottom: "2rem",
    textAlign: "center"
  };

  const sectionStyle = {
    marginBottom: "1.5rem"
  };

  const labelStyle = {
    fontWeight: "700",
    color: "#000",
    marginBottom: "0.5rem",
    fontSize: "0.95rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  };

  const valueStyle = {
    padding: "1rem",
    backgroundColor: "#f9fafb",
    borderRadius: "0.5rem",
    border: "1px solid #d1d5db",
    color: "#000",
    wordBreak: "break-all"
  };

  const userTypeStyle = {
    display: "inline-block",
    padding: "0.5rem 1rem",
    backgroundColor: "#2563eb",
    color: "#fff",
    borderRadius: "0.375rem",
    fontWeight: "600",
    fontSize: "0.85rem",
    textTransform: "capitalize",
    marginTop: "0.5rem"
  };

  const logoutButtonStyle = {
    width: "100%",
    padding: "1rem",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "0.5rem",
    fontWeight: "700",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "2rem",
    transition: "all 0.3s ease"
  };

  const backButtonStyle = {
    display: "inline-block",
    marginBottom: "1.5rem",
    color: "#2563eb",
    cursor: "pointer",
    fontWeight: "600",
    transition: "color 0.3s ease"
  };

  return (
    <div style={containerStyle}>
      <div style={profileStyle}>
        <div 
          style={backButtonStyle}
          onClick={() => navigate("/")}
          onMouseEnter={(e) => e.target.style.color = "#1d4ed8"}
          onMouseLeave={(e) => e.target.style.color = "#2563eb"}
        >
          ← Back to Home
        </div>

        <h1 style={headingStyle}>👤 My Profile</h1>

        <div style={sectionStyle}>
          <div style={labelStyle}>Full Name</div>
          <div style={valueStyle}>
            {user.user?.first_name && user.user?.last_name
              ? `${user.user.first_name} ${user.user.last_name}`
              : user.username}
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={labelStyle}>Username</div>
          <div style={valueStyle}>{user.username}</div>
        </div>

        <div style={sectionStyle}>
          <div style={labelStyle}>Email</div>
          <div style={valueStyle}>{user.email}</div>
        </div>

        <div style={sectionStyle}>
          <div style={labelStyle}>Account Type</div>
          <div style={userTypeStyle}>
            {user.profile?.user_type === 'employer' ? '👔 Employer' : '💼 Job Seeker'}
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          style={logoutButtonStyle}
          onMouseEnter={(e) => e.target.style.backgroundColor = "#dc2626"}
          onMouseLeave={(e) => e.target.style.backgroundColor = "#ef4444"}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
