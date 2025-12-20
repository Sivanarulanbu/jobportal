import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";

export default function EmployerJobs() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosInstance = useAxios();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState({});

  useEffect(() => {
    if (!user || user.profile?.user_type !== 'employer') {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get("/api/jobs/my_jobs/");
      setJobs(response.data);
    } catch (err) {
      setError("Failed to fetch your jobs");
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) {
      return;
    }

    setDeleteLoading(prev => ({ ...prev, [jobId]: true }));
    try {
      await axiosInstance.delete(`/api/jobs/${jobId}/`);
      setJobs(prev => prev.filter(job => job.id !== jobId));
    } catch (err) {
      setError("Failed to delete job posting");
    } finally {
      setDeleteLoading(prev => ({ ...prev, [jobId]: false }));
    }
  };

  const toggleJobActive = async (jobId, currentStatus) => {
    try {
      const response = await axiosInstance.patch(`/api/jobs/${jobId}/`, {
        is_active: !currentStatus
      });
      setJobs(prev => prev.map(job => job.id === jobId ? response.data : job));
    } catch (err) {
      setError("Failed to update job status");
    }
  };

  const pageStyle = {
    minHeight: "calc(100vh - 200px)",
    paddingTop: "2rem",
    paddingBottom: "4rem",
    background: "linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)"
  };

  const containerStyle = {
    maxWidth: "90rem",
    margin: "0 auto",
    padding: "2rem"
  };

  const headingStyle = {
    fontSize: "2.25rem",
    fontWeight: "800",
    marginBottom: "1.5rem",
    background: "linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  };

  const emptyStyle = {
    textAlign: "center",
    padding: "3rem 2rem",
    background: "white",
    borderRadius: "1rem",
    border: "1px solid #e0e0e0"
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "2rem",
    marginTop: "2rem"
  };

  const cardStyle = {
    background: "white",
    borderRadius: "1rem",
    border: "1px solid #e0e0e0",
    boxShadow: "0 4px 20px rgba(79, 70, 229, 0.1)",
    padding: "1.5rem",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column"
  };

  const jobTitleStyle = {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#0f3460",
    marginBottom: "0.5rem"
  };

  const companyStyle = {
    fontSize: "0.95rem",
    color: "#4f46e5",
    fontWeight: "600",
    marginBottom: "0.5rem"
  };

  const locationStyle = {
    fontSize: "0.875rem",
    color: "#666",
    marginBottom: "1rem"
  };

  const infoRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.5rem",
    fontSize: "0.875rem",
    color: "#666"
  };

  const badgeStyle = (type) => {
    const colors = {
      full_time: { bg: "#dcfce7", color: "#166534" },
      part_time: { bg: "#dbeafe", color: "#1e40af" },
      contract: { bg: "#fef3c7", color: "#92400e" },
      internship: { bg: "#f3e8ff", color: "#581c87" },
      temporary: { bg: "#fee2e2", color: "#991b1b" }
    };
    const color = colors[type] || { bg: "#f3f4f6", color: "#374151" };
    return {
      display: "inline-block",
      padding: "0.25rem 0.75rem",
      borderRadius: "0.25rem",
      background: color.bg,
      color: color.color,
      fontSize: "0.75rem",
      fontWeight: "600"
    };
  };

  const activeStatusStyle = (isActive) => ({
    display: "inline-block",
    padding: "0.25rem 0.75rem",
    borderRadius: "0.25rem",
    background: isActive ? "#dcfce7" : "#fee2e2",
    color: isActive ? "#166534" : "#991b1b",
    fontSize: "0.75rem",
    fontWeight: "600"
  });

  const buttonGroupStyle = {
    display: "flex",
    gap: "0.5rem",
    marginTop: "1rem",
    flexWrap: "wrap"
  };

  const buttonStyle = {
    flex: 1,
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    border: "none",
    fontWeight: "600",
    fontSize: "0.875rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    minWidth: "100px"
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)",
    color: "white"
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: "#06b6d4",
    color: "white"
  };

  const dangerButtonStyle = {
    ...buttonStyle,
    background: "#f87171",
    color: "white"
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <h1 style={headingStyle}>💼 My Job Postings</h1>
          <div style={emptyStyle}>Loading your job postings...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1 style={headingStyle}>💼 My Job Postings</h1>
          <button
            onClick={() => navigate("/employer/post-job")}
            style={{
              ...primaryButtonStyle,
              padding: "0.75rem 1.5rem",
              minWidth: "auto"
            }}
            onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)", e.target.style.boxShadow = "0 6px 25px rgba(79, 70, 229, 0.4)")}
            onMouseLeave={(e) => (e.target.style.transform = "translateY(0)", e.target.style.boxShadow = "none")}
          >
            ➕ Post New Job
          </button>
        </div>

        {error && (
          <div style={{
            padding: "1rem",
            marginBottom: "1.5rem",
            background: "#fee",
            border: "1px solid #fcc",
            borderRadius: "0.5rem",
            color: "#c33"
          }}>
            {error}
          </div>
        )}

        {jobs.length === 0 ? (
          <div style={emptyStyle}>
            <p style={{ fontSize: "1.125rem", marginBottom: "1rem" }}>No job postings yet</p>
            <p style={{ color: "#999", marginBottom: "1.5rem" }}>Start hiring by posting your first job opportunity</p>
            <button
              onClick={() => navigate("/employer/post-job")}
              style={{
                ...primaryButtonStyle,
                display: "inline-block",
                padding: "0.75rem 2rem"
              }}
              onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)", e.target.style.boxShadow = "0 6px 25px rgba(79, 70, 229, 0.4)")}
              onMouseLeave={(e) => (e.target.style.transform = "translateY(0)", e.target.style.boxShadow = "none")}
            >
              ➕ Post Your First Job
            </button>
          </div>
        ) : (
          <div style={gridStyle}>
            {jobs.map(job => (
              <div
                key={job.id}
                style={cardStyle}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 30px rgba(79, 70, 229, 0.2)", e.currentTarget.style.transform = "translateY(-5px)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(79, 70, 229, 0.1)", e.currentTarget.style.transform = "translateY(0)")}
              >
                <h3 style={jobTitleStyle}>{job.title}</h3>
                <p style={companyStyle}>{job.company}</p>
                <p style={locationStyle}>📍 {job.location}</p>

                <div style={{ marginBottom: "1rem" }}>
                  <span style={badgeStyle(job.job_type)}>{job.job_type.replace('_', ' ').toUpperCase()}</span>
                  <span style={{ marginLeft: "0.5rem", ...activeStatusStyle(job.is_active) }}>
                    {job.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                <div style={infoRowStyle}>
                  <span>📧 Applications:</span>
                  <strong>{job.applications_count || 0}</strong>
                </div>

                {job.salary_min && job.salary_max && (
                  <div style={infoRowStyle}>
                    <span>💰 Salary:</span>
                    <strong>{job.salary_min} - {job.salary_max} LPA</strong>
                  </div>
                )}

                <div style={infoRowStyle}>
                  <span>📅 Posted:</span>
                  <strong>{new Date(job.created_at).toLocaleDateString()}</strong>
                </div>

                {job.application_deadline && (
                  <div style={infoRowStyle}>
                    <span>⏰ Deadline:</span>
                    <strong>{new Date(job.application_deadline).toLocaleDateString()}</strong>
                  </div>
                )}

                <p style={{ fontSize: "0.875rem", color: "#666", marginTop: "1rem", lineHeight: "1.5", flex: 1 }}>
                  {job.description.substring(0, 150)}...
                </p>

                <div style={buttonGroupStyle}>
                  <button
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    style={primaryButtonStyle}
                    onMouseEnter={(e) => (e.target.style.transform = "translateY(-1px)")}
                    onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
                  >
                    👁️ View
                  </button>
                  <button
                    onClick={() => navigate(`/employer/applications?job=${job.id}`)}
                    style={secondaryButtonStyle}
                    onMouseEnter={(e) => (e.target.style.transform = "translateY(-1px)")}
                    onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
                  >
                    📋 Apps ({job.applications_count || 0})
                  </button>
                  <button
                    onClick={() => toggleJobActive(job.id, job.is_active)}
                    style={{
                      ...buttonStyle,
                      background: job.is_active ? "#fbbf24" : "#22c55e",
                      color: "white"
                    }}
                    onMouseEnter={(e) => (e.target.style.transform = "translateY(-1px)")}
                    onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
                    title={job.is_active ? "Click to deactivate" : "Click to activate"}
                  >
                    {job.is_active ? "🔴" : "🟢"}
                  </button>
                  <button
                    onClick={() => deleteJob(job.id)}
                    disabled={deleteLoading[job.id]}
                    style={{
                      ...dangerButtonStyle,
                      opacity: deleteLoading[job.id] ? 0.6 : 1,
                      cursor: deleteLoading[job.id] ? "not-allowed" : "pointer"
                    }}
                    onMouseEnter={(e) => !deleteLoading[job.id] && (e.target.style.transform = "translateY(-1px)")}
                    onMouseLeave={(e) => !deleteLoading[job.id] && (e.target.style.transform = "translateY(0)")}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => navigate("/employer-dashboard")}
          style={{
            marginTop: "2rem",
            padding: "0.75rem 1.5rem",
            background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)", e.target.style.boxShadow = "0 6px 25px rgba(6, 182, 212, 0.4)")}
          onMouseLeave={(e) => (e.target.style.transform = "translateY(0)", e.target.style.boxShadow = "none")}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
