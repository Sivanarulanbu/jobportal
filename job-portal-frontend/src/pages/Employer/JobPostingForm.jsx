import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import { useEffect } from "react";

export default function JobPostingForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosInstance = useAxios();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    job_type: "full-time",
    description: "",
    requirements: "",
    salary_min: "",
    salary_max: "",
    experience_required: "",
    skills: "",
    deadline: ""
  });

  useEffect(() => {
    if (!user || user.profile?.user_type !== 'employer') {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.trim()
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!formData.title || !formData.company || !formData.location || !formData.description) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/api/jobs/", {
        ...formData,
        salary_min: formData.salary_min ? parseFloat(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseFloat(formData.salary_max) : null,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/employer-dashboard");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to post job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pageStyle = {
    minHeight: "calc(100vh - 200px)",
    paddingTop: "2rem",
    paddingBottom: "4rem",
    background: "linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)"
  };

  const containerStyle = {
    maxWidth: "48rem",
    margin: "0 auto",
    padding: "2rem",
    background: "white",
    borderRadius: "1rem",
    boxShadow: "0 10px 40px rgba(79, 70, 229, 0.1)",
    border: "1px solid rgba(79, 70, 229, 0.2)"
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

  const formGroupStyle = {
    marginBottom: "1.5rem"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "600",
    color: "#0f3460",
    fontSize: "0.95rem"
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #e0e0e0",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    fontFamily: "Open Sans, sans-serif",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
    boxSizing: "border-box"
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: "120px",
    resize: "vertical",
    fontFamily: "Open Sans, sans-serif"
  };

  const rowStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem"
  };

  const errorStyle = {
    padding: "1rem",
    marginBottom: "1.5rem",
    background: "#fee",
    border: "1px solid #fcc",
    borderRadius: "0.5rem",
    color: "#c33"
  };

  const successStyle = {
    padding: "1rem",
    marginBottom: "1.5rem",
    background: "#efe",
    border: "1px solid #cfc",
    borderRadius: "0.5rem",
    color: "#3c3"
  };

  const buttonStyle = {
    width: "100%",
    padding: "1rem",
    background: "linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    fontWeight: "700",
    fontSize: "1rem",
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.7 : 1,
    transition: "all 0.3s ease",
    marginTop: "1rem"
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={headingStyle}>📝 Post a New Job</h1>

        {error && <div style={errorStyle}>{error}</div>}
        {success && <div style={successStyle}>✓ Job posted successfully! Redirecting...</div>}

        <form onSubmit={handleSubmit}>
          {/* Title and Company */}
          <div style={rowStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Job Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Senior React Developer"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#4f46e5", e.target.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.1)")}
                onBlur={(e) => (e.target.style.borderColor = "#e0e0e0", e.target.style.boxShadow = "none")}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Company Name *</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your company name"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#4f46e5", e.target.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.1)")}
                onBlur={(e) => (e.target.style.borderColor = "#e0e0e0", e.target.style.boxShadow = "none")}
              />
            </div>
          </div>

          {/* Location and Job Type */}
          <div style={rowStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., New York, Remote"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#4f46e5", e.target.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.1)")}
                onBlur={(e) => (e.target.style.borderColor = "#e0e0e0", e.target.style.boxShadow = "none")}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Job Type</label>
              <select
                name="job_type"
                value={formData.job_type}
                onChange={handleChange}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#4f46e5", e.target.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.1)")}
                onBlur={(e) => (e.target.style.borderColor = "#e0e0e0", e.target.style.boxShadow = "none")}
              >
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>

          {/* Salary Range */}
          <div style={rowStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Minimum Salary in LPA (Optional)</label>
              <input
                type="number"
                name="salary_min"
                value={formData.salary_min}
                onChange={handleChange}
                placeholder="e.g., 5 (for 5 LPA)"
                step="0.5"
                min="0"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#4f46e5", e.target.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.1)")}
                onBlur={(e) => (e.target.style.borderColor = "#e0e0e0", e.target.style.boxShadow = "none")}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Maximum Salary in LPA (Optional)</label>
              <input
                type="number"
                name="salary_max"
                value={formData.salary_max}
                onChange={handleChange}
                placeholder="e.g., 12 (for 12 LPA)"
                step="0.5"
                min="0"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#4f46e5", e.target.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.1)")}
                onBlur={(e) => (e.target.style.borderColor = "#e0e0e0", e.target.style.boxShadow = "none")}
              />
            </div>
          </div>

          {/* Description */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Job Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the role, responsibilities, and why it's exciting..."
              style={textareaStyle}
              onFocus={(e) => (e.target.style.borderColor = "#4f46e5", e.target.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.1)")}
              onBlur={(e) => (e.target.style.borderColor = "#e0e0e0", e.target.style.boxShadow = "none")}
            />
          </div>

          {/* Requirements */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Requirements</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="List key qualifications and requirements..."
              style={textareaStyle}
              onFocus={(e) => (e.target.style.borderColor = "#4f46e5", e.target.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.1)")}
              onBlur={(e) => (e.target.style.borderColor = "#e0e0e0", e.target.style.boxShadow = "none")}
            />
          </div>

          {/* Experience and Skills */}
          <div style={rowStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Experience Required</label>
              <select
                name="experience_required"
                value={formData.experience_required}
                onChange={handleChange}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#4f46e5", e.target.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.1)")}
                onBlur={(e) => (e.target.style.borderColor = "#e0e0e0", e.target.style.boxShadow = "none")}
              >
                <option value="">Select...</option>
                <option value="fresher">Fresher/Entry-level</option>
                <option value="junior">Junior (0-2 years)</option>
                <option value="mid">Mid-level (2-5 years)</option>
                <option value="senior">Senior (5-10 years)</option>
                <option value="expert">Expert (10+ years)</option>
              </select>
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Application Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#4f46e5", e.target.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.1)")}
                onBlur={(e) => (e.target.style.borderColor = "#e0e0e0", e.target.style.boxShadow = "none")}
              />
            </div>
          </div>

          {/* Skills */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Required Skills</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g., React, Node.js, PostgreSQL (comma-separated)"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#4f46e5", e.target.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.1)")}
              onBlur={(e) => (e.target.style.borderColor = "#e0e0e0", e.target.style.boxShadow = "none")}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={buttonStyle}
            disabled={loading}
            onMouseEnter={(e) => !loading && (e.target.style.transform = "translateY(-2px)", e.target.style.boxShadow = "0 6px 25px rgba(79, 70, 229, 0.4)")}
            onMouseLeave={(e) => !loading && (e.target.style.transform = "translateY(0)", e.target.style.boxShadow = "none")}
          >
            {loading ? "Posting..." : "📤 Post Job"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/employer-dashboard")}
            style={{
              ...buttonStyle,
              background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
              marginTop: "0.5rem"
            }}
            onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)", e.target.style.boxShadow = "0 6px 25px rgba(6, 182, 212, 0.4)")}
            onMouseLeave={(e) => (e.target.style.transform = "translateY(0)", e.target.style.boxShadow = "none")}
          >
            ← Back to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
