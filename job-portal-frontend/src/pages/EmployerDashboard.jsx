import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.profile?.user_type !== 'employer') {
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

  const buttonStyle = {
    padding: "1rem 2rem",
    borderRadius: "0.5rem",
    fontWeight: "700",
    fontSize: "1rem",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    background: "linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)",
    color: "white",
    marginTop: "1rem"
  };

  const features = [
    {
      icon: "📋",
      title: "Post a New Job",
      description: "Create and publish job listings to attract qualified candidates",
      action: () => navigate("/employer/post-job")
    },
    {
      icon: "👥",
      title: "View Applications",
      description: "Review applications and manage candidate responses",
      action: () => navigate("/employer/applications")
    },
    {
      icon: "💼",
      title: "Manage Postings",
      description: "Edit, update, or close your active job listings",
      action: () => navigate("/employer/jobs")
    },
    {
      icon: "🎯",
      title: "Find Talent",
      description: "Search and filter candidates by skills and experience",
      action: () => navigate("/jobs")
    },
    {
      icon: "📊",
      title: "Analytics",
      description: "Track job performance and application statistics",
      action: () => alert("Analytics feature coming soon!")
    },
    {
      icon: "✉️",
      title: "Communicate",
      description: "Message candidates and schedule interviews directly",
      action: () => alert("Messaging feature coming soon!")
    }
  ];

  return (
    <div style={pageStyle}>
      <div style={heroStyle}>
        <h1 style={headingStyle}>
          Welcome, {user?.user?.first_name || user?.username}! 👔
        </h1>
        <p style={descriptionStyle}>
          Manage your job postings, review applications, and find the right talent
        </p>
        <button
          onClick={() => navigate("/employer/post-job")}
          style={buttonStyle}
          onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)", e.target.style.boxShadow = "0 6px 25px rgba(79, 70, 229, 0.4)")}
          onMouseLeave={(e) => (e.target.style.transform = "translateY(0)", e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)")}
        >
          ➕ Post New Job
        </button>
      </div>

      <div style={gridStyle}>
        {features.map((feature, index) => (
          <div 
            key={index} 
            style={cardStyle}
            onClick={feature.action}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(79, 70, 229, 0.2)";
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.cursor = "pointer";
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
