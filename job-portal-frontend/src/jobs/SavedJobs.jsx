import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Loader from "../components/Loader";
import { useAuth } from "../hooks/useAuth";

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        setLoading(true);
        const res = await api.get("/saved-jobs/");
        setSavedJobs(res.data);
        setError(null);
      } catch (err) {
        // If 401 (unauthenticated), just show empty list instead of error
        if (err.response?.status === 401) {
          setSavedJobs([]);
          setError(null);
        } else {
          setError(err.response?.data?.detail || "Failed to load saved jobs");
          console.error("Error fetching saved jobs:", err);
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchSavedJobs();
    }
  }, [user]);

  const handleRemoveSavedJob = async (jobId, savedJobId) => {
    try {
      setRemoving(jobId);
      await api.delete(`/saved-jobs/${savedJobId}/`);
      setSavedJobs(savedJobs.filter(item => item.id !== savedJobId));
    } catch (err) {
      alert("Failed to remove saved job");
      console.error("Error removing saved job:", err);
    } finally {
      setRemoving(null);
    }
  };

  if (loading) return <Loader />;

  if (!user) {
    return (
      <div style={{ 
        textAlign: "center", 
        marginTop: "3rem",
        padding: "2.5rem",
        background: "linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
        borderRadius: "1rem",
        maxWidth: "60rem",
        margin: "3rem auto",
        border: "1px solid rgba(79, 70, 229, 0.2)"
      }}>
        <p style={{ color: "#4f46e5", fontSize: "1.25rem", marginBottom: "1.5rem", fontWeight: "600" }}>🔐 Please login to view your saved jobs</p>
        <button 
          onClick={() => navigate("/login")}
          style={{
            padding: "0.85rem 2rem",
            background: "linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(79, 70, 229, 0.3)"
          }}
          onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
          onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (error) {
    return <div style={{ color: "#dc2626", textAlign: "center", fontSize: "1.125rem", marginTop: "1.5rem" }}>{error}</div>;
  }

  const containerStyle = {
    maxWidth: "68rem",
    margin: "2rem auto",
    padding: "0 1.5rem"
  };

  const titleStyle = {
    fontSize: "2.25rem",
    fontWeight: "800",
    marginBottom: "2rem",
    background: "linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  };

  const emptyStyle = {
    color: "#4b5563",
    fontSize: "1.1rem"
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "1.5rem"
  };

  const cardStyle = {
    border: "1px solid rgba(79, 70, 229, 0.2)",
    padding: "1.75rem",
    borderRadius: "0.75rem",
    backgroundColor: "#fff",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
    cursor: "pointer",
    transition: "all 0.3s ease"
  };

  const jobTitleStyle = {
    fontSize: "1.35rem",
    fontWeight: "700",
    color: "#4f46e5"
  };

  const companyStyle = {
    color: "#1a1a2e",
    fontWeight: "600"
  };

  const locationStyle = {
    color: "#7c8aad",
    fontSize: "0.95rem"
  };

  const linkStyle = {
    marginTop: "1rem",
    color: "#4f46e5",
    fontWeight: "700",
    cursor: "pointer",
    transition: "color 0.3s ease"
  };

  const removeButtonStyle = {
    marginTop: "1rem",
    padding: "0.65rem 1.5rem",
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "0.375rem",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "0.95rem",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)"
  };

  const salaryStyle = {
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontWeight: "700",
    marginTop: "0.75rem"
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Saved Jobs ({savedJobs.length})</h1>

      {savedJobs.length === 0 && (
        <div style={{ 
          padding: "3rem 2rem", 
          background: "linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)",
          borderRadius: "1rem",
          textAlign: "center",
          border: "1px solid rgba(79, 70, 229, 0.2)"
        }}>
          <p style={{...emptyStyle, fontSize: "1.2rem", marginBottom: "1.5rem"}}>💾 No saved jobs yet</p>
          <p style={{...emptyStyle, marginBottom: "1.5rem"}}>Start saving jobs to keep track of your favorites!</p>
          <button 
            onClick={() => navigate("/jobs")}
            style={{
              marginTop: "1rem",
              padding: "0.85rem 2rem",
              background: "linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "0.5rem",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(79, 70, 229, 0.3)"
            }}
            onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
          >
            🔍 Browse Jobs
          </button>
        </div>
      )}

      <div style={gridStyle}>
        {savedJobs.map((item) => {
          const job = item.job || item;
          return (
            <div
              key={item.id}
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(79, 70, 229, 0.3)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.08)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <h2 style={jobTitleStyle}>{job.title}</h2>
              <p style={companyStyle}>{job.company}</p>
              <p style={locationStyle}>{job.location}</p>
              {job.salary_min && job.salary_max && (
                <p style={salaryStyle}>₹{job.salary_min} - ₹{job.salary_max}</p>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.25rem", gap: "1rem", flexWrap: "wrap" }}>
                <div style={linkStyle} onClick={() => navigate(`/job/${job.id}`)} onMouseEnter={(e) => e.target.style.color = "#a855f7"} onMouseLeave={(e) => e.target.style.color = "#4f46e5"}>
                  View Details →
                </div>
                <button 
                  style={removeButtonStyle}
                  onClick={() => handleRemoveSavedJob(job.id, item.id)}
                  disabled={removing === job.id}
                  onMouseEnter={(e) => !removing && (e.target.style.transform = "translateY(-2px)", e.target.style.boxShadow = "0 6px 20px rgba(239, 68, 68, 0.4)")}
                  onMouseLeave={(e) => !removing && (e.target.style.transform = "translateY(0)", e.target.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.3)")}
                >
                  {removing === job.id ? "Removing..." : "🗑️ Remove"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
