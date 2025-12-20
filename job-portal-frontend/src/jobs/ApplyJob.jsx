import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";

export default function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    cover_letter: ""
  });
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await apiClient.get(`/jobs/${id}/`);
        setJob(res.data);
      } catch (err) {
        setError("Failed to load job");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.cover_letter.trim()) {
      setError("Please share why you're interested in this role. Your cover letter helps employers understand your motivations.");
      return;
    }

    try {
      setSubmitting(true);
      let response;
      if (resumeFile) {
        const fd = new FormData();
        fd.append('cover_letter', formData.cover_letter);
        fd.append('resume', resumeFile);
        response = await apiClient.post(`/jobs/${id}/apply/`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await apiClient.post(`/jobs/${id}/apply/`, formData);
      }
      console.log("Application submitted:", response.data);
      alert("Application submitted successfully!");
      
      // Navigate back to job details after successful submission
      setTimeout(() => {
        navigate(`/job/${id}`);
      }, 500);
    } catch (err) {
      console.error("Full error response:", err.response);
      console.error("Error data:", err.response?.data);
      
      // Extract error message from different possible formats
      let errorMsg = "We couldn't submit your application. Please try again or contact support.";
      if (err.response?.data) {
        if (err.response.data.error) {
          errorMsg = err.response.data.error;
        } else if (err.response.data.detail) {
          errorMsg = err.response.data.detail;
        } else if (typeof err.response.data === 'object') {
          // Handle field-specific errors
          const firstError = Object.values(err.response.data)[0];
          if (Array.isArray(firstError)) {
            errorMsg = firstError[0];
          } else if (typeof firstError === 'string') {
            errorMsg = firstError;
          }
        }
      }
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "2rem", color: "#4b5563" }}>Loading application form...</div>;
  if (error) return (
    <div style={{
      maxWidth: "60rem",
      margin: "2rem auto",
      padding: "2rem",
      color: "#dc2626",
      textAlign: "center"
    }}>
      Error: {error}
    </div>
  );
  if (!job) return (
    <div style={{
      maxWidth: "60rem",
      margin: "2rem auto",
      padding: "2rem",
      color: "#4b5563",
      textAlign: "center"
    }}>
      <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>😕</div>
      <p>This position is no longer available. Please browse other opportunities.</p>
    </div>
  );

  const formStyle = {
    maxWidth: "60rem",
    margin: "2rem auto",
    padding: "2.5rem",
    background: "linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)",
    borderRadius: "1rem",
    border: "1px solid rgba(79, 70, 229, 0.2)",
    boxShadow: "0 8px 30px rgba(79, 70, 229, 0.15)"
  };

  const jobInfoStyle = {
    background: "linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)",
    padding: "1.75rem",
    borderRadius: "0.75rem",
    marginBottom: "2rem",
    border: "none"
  };

  const jobTitleStyle = {
    fontSize: "1.75rem",
    fontWeight: "800",
    color: "#fff",
    marginBottom: "0.5rem"
  };

  const jobCompanyStyle = {
    fontSize: "1.15rem",
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: "0.25rem"
  };

  const errorStyle = {
    padding: "1.25rem",
    background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)",
    color: "#991b1b",
    borderRadius: "0.75rem",
    marginBottom: "1.5rem",
    border: "1px solid #ef4444"
  };

  const textareaStyle = {
    width: "100%",
    padding: "1rem",
    marginTop: "0.75rem",
    marginBottom: "1.5rem",
    border: "1px solid rgba(79, 70, 229, 0.3)",
    borderRadius: "0.5rem",
    fontFamily: "inherit",
    minHeight: "150px",
    fontSize: "1rem",
    color: "#1a1a2e",
    backgroundColor: "#fff",
    transition: "all 0.3s ease"
  };

  const buttonStyle = {
    padding: "0.85rem 1.75rem",
    borderRadius: "0.5rem",
    fontWeight: "700",
    fontSize: "1rem",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)"
  };

  const backButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
    color: "#fff",
    marginRight: "1rem"
  };

  return (
    <div style={formStyle}>
      <div style={jobInfoStyle}>
        <div style={jobTitleStyle}>{job.title}</div>
        <div style={jobCompanyStyle}>{job.company}</div>
        <div style={{ color: "#999", fontSize: "0.875rem" }}>{job.location}</div>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", fontWeight: "600", marginBottom: "0.5rem", color: "#000" }}>
          Cover Letter <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <p style={{ fontSize: "0.875rem", color: "#7c8aad", marginBottom: "0.75rem" }}>
          Introduce yourself and explain why you're interested in this role. Share relevant experiences that make you a strong fit.
        </p>
        <textarea
          value={formData.cover_letter}
          onChange={(e) => setFormData({ ...formData, cover_letter: e.target.value })}
          placeholder="Example: 'I'm excited about this opportunity because...'"
          style={textareaStyle}
          required
        ></textarea>

        <label style={{ display: 'block', marginTop: '1rem', marginBottom: '0.5rem', color: '#1e293b', fontWeight: 500 }}>
          Attach Resume (optional)
        </label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setResumeFile(e.target.files[0] || null)}
          style={{ marginBottom: '1rem', display: 'block' }}
        />
        <div>
          <button 
            type="button" 
            style={backButtonStyle} 
            onClick={() => navigate(`/job/${id}`)}
          >
            Back
          </button>
          <button 
            type="submit" 
            style={{...buttonStyle, background: "linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)", color: "#fff"}}
            disabled={submitting}
            aria-label="Submit your application for this position"
            onMouseEnter={(e) => !submitting && (e.target.style.transform = "translateY(-2px)", e.target.style.boxShadow = "0 6px 25px rgba(79, 70, 229, 0.4)")}
            onMouseLeave={(e) => !submitting && (e.target.style.transform = "translateY(0)", e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)")}
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  );
}
