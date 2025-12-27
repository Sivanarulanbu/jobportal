import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

export default function JobSeekerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.profile?.user_type !== 'job_seeker') {
      navigate("/login");
    }
  }, [user, navigate]);

  const pageStyle = {
    minHeight: "calc(100vh - 200px)",
    paddingTop: "2rem",
    paddingBottom: "4rem"
  };

  const heroStyle = {
    maxWidth: "68rem",
    margin: "0 auto 3rem",
    padding: "4rem 2rem",
    textAlign: "center",
    background: "linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
    borderRadius: "1rem",
    border: "1px solid rgba(79, 70, 229, 0.2)"
  };

  const headingStyle = {
    fontSize: "3rem",
    fontWeight: "800",
    marginBottom: "1rem",
    background: "linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  };

  const descriptionStyle = {
    color: "#4b5563",
    fontSize: "1.125rem",
    marginBottom: "2rem",
    fontWeight: "500"
  };

  const buttonGroupStyle = {
    display: "flex",
    gap: "1.25rem",
    justifyContent: "center",
    marginBottom: "2rem",
    flexWrap: "wrap"
  };

  const primaryButtonStyle = {
    padding: "1rem 2rem",
    borderRadius: "0.5rem",
    fontWeight: "700",
    fontSize: "1rem",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    background: "linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)",
    color: "white"
  };

  const secondaryButtonStyle = {
    ...primaryButtonStyle,
    background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
    marginTop: "3rem",
    maxWidth: "68rem",
    margin: "3rem auto",
    padding: "0 2rem"
  };

  const cardStyle = {
    padding: "2rem",
    background: "linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)",
    borderRadius: "1rem",
    border: "1px solid rgba(79, 70, 229, 0.2)",
    boxShadow: "0 4px 20px rgba(79, 70, 229, 0.1)",
    transition: "all 0.3s ease"
  };

  const features = [
    {
      icon: "🔍",
      title: "Find Jobs",
      description: "Browse thousands of job opportunities tailored to your skills",
      path: "/jobs"
    },
    {
      icon: "⚡",
      title: "Quick Apply",
      description: "Apply to jobs in seconds with just a cover letter",
      path: "/jobs"
    },
    {
      icon: "📊",
      title: "Track Applications",
      description: "Monitor the status of all your job applications in real-time",
      path: "/profile",
      state: { activeTab: "applications" }
    },
    {
      icon: "❤️",
      title: "Save Jobs",
      description: "Bookmark your favorite positions and revisit them anytime",
      path: "/profile",
      state: { activeTab: "saved" }
    },
    {
      icon: "💬",
      title: "Get Responses",
      description: "Receive feedback and interview invitations from employers",
      path: "/profile",
      state: { activeTab: "applications" }
    },
    {
      icon: "📈",
      title: "Career Growth",
      description: "Build your profile and advance your career journey",
      path: "/profile",
      state: { activeTab: "profile" }
    }
  ];

  return (
    <div style={pageStyle}>
      <div style={heroStyle}>
        <h1 style={headingStyle}>
          Welcome back, {user?.user?.first_name || user?.username}! 💼
        </h1>
        <p style={descriptionStyle}>
          Your path to the perfect job opportunity starts here
        </p>

        <div style={buttonGroupStyle}>
          <button
            onClick={() => navigate("/jobs")}
            style={primaryButtonStyle}
            onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)", e.target.style.boxShadow = "0 6px 25px rgba(79, 70, 229, 0.4)")}
            onMouseLeave={(e) => (e.target.style.transform = "translateY(0)", e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)")}
          >
            🔍 Find Jobs
          </button>
          <button
            onClick={() => navigate("/profile", { state: { activeTab: "saved" } })}
            style={secondaryButtonStyle}
            onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)", e.target.style.boxShadow = "0 6px 25px rgba(6, 182, 212, 0.4)")}
            onMouseLeave={(e) => (e.target.style.transform = "translateY(0)", e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)")}
          >
            ❤️ Saved Jobs
          </button>
        </div>
      </div>

      <div style={gridStyle}>
        {features.map((feature, index) => (
          <div
            key={index}
            style={{ ...cardStyle, cursor: "pointer" }}
            onClick={() => navigate(feature.path, { state: feature.state })}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(79, 70, 229, 0.2)";
              e.currentTarget.style.transform = "translateY(-5px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(79, 70, 229, 0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{feature.icon}</div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "0.75rem", color: "#0f3460" }}>
              {feature.title}
            </h3>
            <p style={{ color: "#4b5563", lineHeight: "1.6" }}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
