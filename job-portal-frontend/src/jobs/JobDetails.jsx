import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";
import Loader from "../components/Loader";
import { useAuth } from "../hooks/useAuth";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [savingJob, setSavingJob] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/jobs/${id}/`);
        setJob(res.data);
        setError(null);
        
        // Check if user has saved this job
        if (user) {
          try {
            const savedRes = await apiClient.get(`/saved-jobs/?job=${id}`);
            setIsSaved(savedRes.data.length > 0);
          } catch (err) {
            console.error("Error checking saved status:", err);
          }
          
          // Check application status
          try {
            const appRes = await apiClient.get(`/applications/?job=${id}`);
            if (appRes.data.length > 0) {
              setApplicationStatus(appRes.data[0].status);
            }
          } catch (err) {
            console.error("Error checking application status:", err);
          }
        }
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load job details");
        console.error("Error fetching job:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, user]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div style={{
        maxWidth: "64rem",
        margin: "2rem auto",
        padding: "2rem",
        backgroundColor: "#fee2e2",
        border: "1px solid #fecaca",
        borderRadius: "0.75rem",
        color: "#991b1b",
        fontSize: "1rem"
      }}>
        <strong>Failed to load job details</strong><br />
        {error}. Please go back and try again.
      </div>
    );
  }

  if (!job) {
    return (
      <div style={{
        maxWidth: "64rem",
        margin: "2rem auto",
        padding: "2rem",
        textAlign: "center",
        color: "#4b5563"
      }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>😕</div>
        <h2 style={{ fontSize: "1.25rem", color: "#0f3460", marginBottom: "0.5rem", fontWeight: "700" }}>Position Not Found</h2>
        <p>This job may have been removed or filled. Please browse other opportunities.</p>
      </div>
    );
  }

  const handleApplyNow = () => {
    if (!user) {
      navigate("/login", { state: { message: "Please log in to apply for this position" } });
      return;
    }
    navigate(`/jobs/${id}/apply`);
  };

  const handleSaveJob = async () => {
    if (!user) {
      navigate("/login", { state: { message: "Log in to save your favorite jobs" } });
      return;
    }

    try {
      setSavingJob(true);
      if (isSaved) {
        // Remove from saved jobs
        const savedRes = await apiClient.get(`/saved-jobs/?job=${id}`);
        if (savedRes.data.length > 0) {
          await apiClient.delete(`/saved-jobs/${savedRes.data[0].id}/`);
          setIsSaved(false);
        }
      } else {
        // Add to saved jobs
        await apiClient.post("/saved-jobs/", { job: id });
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Error toggling saved job:", err);
      alert(err.response?.data?.error || "Failed to save/unsave job");
    } finally {
      setSavingJob(false);
    }
  };

  const containerStyle = {
    maxWidth: "64rem",
    margin: "2rem auto",
    padding: "2rem",
    background: "linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)",
    border: "1px solid rgba(79, 70, 229, 0.2)",
    borderRadius: "1rem",
    boxShadow: "0 8px 30px rgba(79, 70, 229, 0.15)"
  };

  const titleStyle = {
    fontSize: "2.25rem",
    fontWeight: "800",
    marginBottom: "0.5rem",
    background: "linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  };

  const companyStyle = {
    fontSize: "1.25rem",
    color: "#4b5563",
    fontWeight: "500"
  };

  const badgeStyle = {
    display: "inline-block",
    background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
    color: "#fff",
    padding: "0.35rem 0.85rem",
    borderRadius: "0.375rem",
    fontSize: "0.8rem",
    fontWeight: "600",
    marginRight: "0.75rem",
    marginTop: "1rem"
  };

  const hrStyle = {
    margin: "1.5rem 0",
    border: "none",
    borderTop: "2px solid rgba(79, 70, 229, 0.2)"
  };

  const headingStyle = {
    fontSize: "1.5rem",
    fontWeight: "700",
    marginTop: "1.75rem",
    marginBottom: "0.75rem",
    color: "#0f3460"
  };

  const textStyle = {
    color: "#4b5563",
    lineHeight: "1.8"
  };

  const skillsContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
    marginTop: "1rem"
  };

  const skillStyle = {
    display: "inline-block",
    background: "linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
    color: "#4f46e5",
    padding: "0.4rem 1rem",
    borderRadius: "0.375rem",
    fontSize: "0.9rem",
    fontWeight: "600",
    border: "1px solid rgba(79, 70, 229, 0.3)"
  };

  const buttonGroupStyle = {
    display: "flex",
    gap: "1.25rem",
    marginTop: "2rem",
    flexWrap: "wrap"
  };

  const buttonStyle = {
    padding: "0.85rem 1.75rem",
    borderRadius: "0.5rem",
    border: "none",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)"
  };

  const applyButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)",
    color: "#fff"
  };

  const saveButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "#fff"
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>{job.title}</h1>
      <p style={companyStyle}>{job.company} • {job.location}</p>

      <div>
        <span style={badgeStyle}>{job.job_type}</span>
        {job.experience_required && (
          <span style={badgeStyle}>{job.experience_required}</span>
        )}
      </div>

      {(job.salary_min || job.salary_max) && (
        <p style={{ ...textStyle, background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontWeight: "700", fontSize: "1.25rem", marginTop: "1rem" }}>
          ₹{job.salary_min} - ₹{job.salary_max} per annum
        </p>
      )}

      <hr style={hrStyle} />

      <h2 style={headingStyle}>About This Role</h2>
      <p style={textStyle}>{job.description}</p>

      <h2 style={headingStyle}>What We're Looking For</h2>
      <p style={textStyle}>{job.requirements}</p>

      {job.skills && (
        <>
          <h2 style={headingStyle}>Key Skills</h2>
          <div style={skillsContainerStyle}>
            {job.skills.split(",").map((skill, idx) => (
              <span key={idx} style={skillStyle}>{skill.trim()}</span>
            ))}
          </div>
        </>
      )}

      {applicationStatus && (
        <div style={{
          marginTop: "1.5rem",
          padding: "1.25rem",
          background: applicationStatus === "accepted" ? "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)" : 
                      applicationStatus === "rejected" ? "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)" :
                      "linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
          border: applicationStatus === "accepted" ? "1px solid #10b981" : 
                  applicationStatus === "rejected" ? "1px solid #ef4444" :
                  "1px solid #4f46e5",
          borderRadius: "0.75rem",
          color: applicationStatus === "accepted" ? "#059669" : 
                 applicationStatus === "rejected" ? "#991b1b" :
                 "#4f46e5"
        }}>
          <strong>Your Application Status</strong>
          <div style={{
            textTransform: "capitalize",
            fontWeight: "700",
            marginTop: "0.5rem",
            fontSize: "1.05rem"
          }}>
            {applicationStatus === "accepted" ? "✓ Accepted" : applicationStatus === "rejected" ? "✗ Not Selected" : "⏳ Under Review"}
          </div>
        </div>
      )}

      <div style={buttonGroupStyle}>
        <button 
          onClick={handleApplyNow}
          style={{
            ...applyButtonStyle,
            opacity: applicationStatus ? 0.6 : 1,
            cursor: applicationStatus ? "not-allowed" : "pointer"
          }} 
          disabled={applicationStatus}
          aria-label={applicationStatus ? "You have already applied" : "Apply now for this position"}
          onMouseEnter={(e) => !applicationStatus && (e.target.style.transform = "translateY(-2px)", e.target.style.boxShadow = "0 6px 25px rgba(79, 70, 229, 0.4)")} 
          onMouseLeave={(e) => !applicationStatus && (e.target.style.transform = "translateY(0)", e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)")}
        >
          {applicationStatus ? "✓ Applied" : "Apply Now"}
        </button>
        <button 
          onClick={handleSaveJob}
          style={{
            ...saveButtonStyle,
            background: isSaved ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" : "linear-gradient(135deg, #10b981 0%, #059669 100%)"
          }} 
          disabled={savingJob}
          aria-label={isSaved ? "Remove from saved jobs" : "Save this job for later"}
          onMouseEnter={(e) => !savingJob && (e.target.style.transform = "translateY(-2px)", e.target.style.boxShadow = "0 6px 25px rgba(0, 0, 0, 0.2)")} 
          onMouseLeave={(e) => !savingJob && (e.target.style.transform = "translateY(0)", e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)")}
        >
          {savingJob ? "Updating..." : isSaved ? "❌ Unsave" : "❤️ Save for Later"}
        </button>
      </div>
    </div>
  );
}
