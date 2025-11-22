import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect based on user type
  useEffect(() => {
    if (user) {
      if (user.profile?.user_type === 'employer') {
        navigate("/employer-dashboard");
      } else if (user.profile?.user_type === 'job_seeker') {
        navigate("/job-seeker-dashboard");
      }
    }
  }, [user, navigate]);

  const pageStyle = {
    minHeight: "100vh",
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
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(79, 70, 229, 0.2)"
  };

  const headingStyle = {
    fontSize: "3.5rem",
    fontWeight: "800",
    marginBottom: "1rem",
    background: "linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    letterSpacing: "-0.025em"
  };

  const descriptionStyle = {
    color: "#4b5563",
    fontSize: "1.25rem",
    marginBottom: "2.5rem",
    fontWeight: "500"
  };

  const buttonGroupStyle = {
    display: "flex",
    gap: "1.25rem",
    justifyContent: "center",
    marginBottom: "3rem",
    flexWrap: "wrap"
  };

  const buttonStyle = {
    padding: "1rem 2rem",
    borderRadius: "0.5rem",
    fontWeight: "700",
    fontSize: "1rem",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)"
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)",
    color: "white",
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
    color: "white",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
    marginTop: "4rem",
    maxWidth: "68rem",
    margin: "4rem auto",
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

  const cardIconStyle = {
    fontSize: "2.5rem",
    marginBottom: "1rem"
  };

  const cardHeadingStyle = {
    fontSize: "1.5rem",
    fontWeight: "700",
    marginBottom: "0.75rem",
    color: "#0f3460"
  };

  const cardTextStyle = {
    color: "#4b5563",
    lineHeight: "1.6"
  };

  const features = [
    {
      icon: "🎯",
      title: "Find Your Perfect Role",
      description: "Browse curated job opportunities from top companies, filtered by skills, location, and career level"
    },
    {
      icon: "⚡",
      title: "Apply in Minutes",
      description: "Submit applications quickly with just a cover letter. No complex forms—just what employers need."
    },
    {
      icon: "📊",
      title: "Track Progress Instantly",
      description: "See real-time updates on all your applications—from submitted to under review to accepted"
    },
    {
      icon: "❤️",
      title: "Save & Revisit Jobs",
      description: "Bookmark positions you love and return to them anytime without losing your progress"
    },
    {
      icon: "🔒",
      title: "Your Privacy Matters",
      description: "We protect your resume and personal data with enterprise-grade security standards"
    },
    {
      icon: "📈",
      title: "Advance Your Career",
      description: "Connect with opportunities that align with your goals and unlock your professional potential"
    }
  ];

  return (
    <div style={pageStyle}>
      <div style={heroStyle}>
        <h1 style={headingStyle}>
          {user ? `Welcome back, ${user.user?.first_name || user.user?.username}!` : "Welcome to DreamRoute"}
        </h1>
        <p style={descriptionStyle}>
          {user ? `Continue your job search, ${user.user?.first_name || user.user?.username}` : "Your path to the right opportunity starts here"}
        </p>
        
        <div style={buttonGroupStyle}>
          <button
            onClick={() => navigate("/jobs")}
            style={primaryButtonStyle}
            aria-label="Browse and search for job opportunities"
            onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)", e.target.style.boxShadow = "0 6px 25px rgba(79, 70, 229, 0.4)")}
            onMouseLeave={(e) => (e.target.style.transform = "translateY(0)", e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)")}
          >
            🔍 Find Jobs
          </button>
          {user && (
            <button
              onClick={() => navigate("/saved-jobs")}
              style={secondaryButtonStyle}
              aria-label="View your saved job listings"
              onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)", e.target.style.boxShadow = "0 6px 25px rgba(6, 182, 212, 0.4)")}
              onMouseLeave={(e) => (e.target.style.transform = "translateY(0)", e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)")}
            >
              ❤️ Saved Jobs
            </button>
          )}
        </div>
      </div>

      <div style={gridStyle}>
        {features.map((feature, index) => (
          <div 
            key={index} 
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(79, 70, 229, 0.2)";
              e.currentTarget.style.transform = "translateY(-5px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(79, 70, 229, 0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={cardIconStyle}>{feature.icon}</div>
            <h3 style={cardHeadingStyle}>{feature.title}</h3>
            <p style={cardTextStyle}>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
