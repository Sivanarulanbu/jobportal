import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";
import Loader from "../components/Loader";
import SearchBar from "../components/SearchBar";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchJobs = async (filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      // Add filters to params
      if (filters.search) params.append("search", filters.search);
      if (filters.experience_required) params.append("experience_required", filters.experience_required);
      if (filters.salary_min) params.append("salary_min", filters.salary_min);
      if (filters.salary_max) params.append("salary_max", filters.salary_max);
      if (filters.location) params.append("location", filters.location);
      if (filters.company) params.append("company", filters.company);
      if (filters.job_type) params.append("job_type", filters.job_type);
      if (filters.skills) params.append("skills", filters.skills);

      const url = `/jobs/${params.toString() ? "?" + params.toString() : ""}`;
      const res = await apiClient.get(url);
      setJobs(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load jobs");
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (filters) => {
    fetchJobs(filters);
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div style={{
        maxWidth: "68rem",
        margin: "2rem auto",
        padding: "2rem",
        backgroundColor: "#fee2e2",
        border: "1px solid #fecaca",
        borderRadius: "0.75rem",
        color: "#991b1b",
        fontSize: "1rem"
      }}>
        <strong>Unable to load jobs</strong><br />
        {error}. Please try refreshing the page.
      </div>
    );
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

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "1.5rem"
  };

  const cardStyle = {
    padding: "1.5rem",
    backgroundColor: "#fff",
    border: "1px solid rgba(79, 70, 229, 0.2)",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
    cursor: "pointer",
    transition: "all 0.3s ease"
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1rem"
  };

  const titleCardStyle = {
    fontSize: "1.35rem",
    fontWeight: "700",
    color: "#4f46e5",
    marginBottom: "0.5rem"
  };

  const companyStyle = {
    color: "#1a1a2e",
    fontWeight: "600",
    marginBottom: "0.25rem"
  };

  const locationStyle = {
    color: "#7c8aad",
    fontSize: "0.95rem"
  };

  const badgeStyle = {
    display: "inline-block",
    background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
    color: "#fff",
    padding: "0.35rem 0.85rem",
    borderRadius: "0.375rem",
    fontSize: "0.8rem",
    fontWeight: "600"
  };

  const descStyle = {
    marginTop: "0.75rem",
    color: "#4b5563",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    lineHeight: "1.5"
  };

  const footerStyle = {
    marginTop: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "1rem",
    borderTop: "1px solid rgba(79, 70, 229, 0.1)"
  };

  const salaryStyle = {
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontWeight: "700",
    fontSize: "1.1rem"
  };

  const buttonStyle = {
    background: "linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)",
    color: "#fff",
    padding: "0.65rem 1.5rem",
    borderRadius: "0.375rem",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.95rem",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)"
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Job Opportunities</h2>
      <SearchBar onSearch={handleSearch} />
      <p style={{ color: "#4b5563", marginBottom: "2rem", fontSize: "1rem" }}>
        {jobs.length} {jobs.length === 1 ? "position" : "positions"} matching your search
      </p>

      {jobs.length === 0 ? (
        <div style={{
          padding: "3rem 2rem",
          textAlign: "center",
          background: "linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)",
          borderRadius: "1rem",
          border: "2px dashed rgba(79, 70, 229, 0.2)"
        }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🔍</div>
          <h3 style={{ fontSize: "1.25rem", color: "#0f3460", marginBottom: "0.5rem", fontWeight: "700" }}>No Jobs Found</h3>
          <p style={{ color: "#4b5563", marginBottom: "1.5rem" }}>We don't have any openings right now, but check back soon or try different filters.</p>
        </div>
      ) : (
        <div style={gridStyle}>
          {jobs.map((job) => (
            <div
              key={job.id}
              style={cardStyle}
              onClick={() => navigate(`/job/${job.id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(79, 70, 229, 0.3)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.08)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={headerStyle}>
                <div>
                  <div style={titleCardStyle}>{job.title}</div>
                  <p style={companyStyle}>{job.company}</p>
                  <p style={locationStyle}>{job.location}</p>
                </div>
                <span style={badgeStyle}>{job.job_type}</span>
              </div>
              <p style={descStyle}>{job.description}</p>
              <div style={footerStyle}>
                <div>
                  {job.salary_min && job.salary_max && (
                    <p style={salaryStyle}>₹{job.salary_min} - ₹{job.salary_max}</p>
                  )}
                </div>
                <button 
                  style={buttonStyle}
                  aria-label={`View details for ${job.title} at ${job.company}`}
                  onMouseEnter={(e) => {
                    e.target.style.boxShadow = "0 6px 20px rgba(79, 70, 229, 0.5)";
                    e.target.style.transform = "translateY(-2px)";
                  }} 
                  onMouseLeave={(e) => {
                    e.target.style.boxShadow = "0 4px 12px rgba(79, 70, 229, 0.3)";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
