import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";

export default function EmployerApplications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosInstance = useAxios();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [statusLoading, setStatusLoading] = useState({});

  useEffect(() => {
    if (!user || user.profile?.user_type !== 'employer') {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get("/api/applications/");
      setApplications(response.data);
    } catch (err) {
      setError("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    setStatusLoading(prev => ({ ...prev, [applicationId]: true }));
    try {
      const response = await axiosInstance.patch(`/api/applications/${applicationId}/update_status/`, {
        status: newStatus
      });
      setApplications(prev => prev.map(app => app.id === applicationId ? response.data : app));
    } catch (err) {
      setError("Failed to update application status");
    } finally {
      setStatusLoading(prev => ({ ...prev, [applicationId]: false }));
    }
  };

  const filteredApplications = filterStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === filterStatus);

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

  const filterBarStyle = {
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
    flexWrap: "wrap",
    alignItems: "center"
  };

  const filterButtonStyle = (isActive) => ({
    padding: "0.75rem 1.5rem",
    borderRadius: "0.5rem",
    border: "1px solid #e0e0e0",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    background: isActive 
      ? "linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)"
      : "white",
    color: isActive ? "white" : "#0f3460"
  });

  const emptyStyle = {
    textAlign: "center",
    padding: "3rem 2rem",
    background: "white",
    borderRadius: "1rem",
    border: "1px solid #e0e0e0"
  };

  const tableContainerStyle = {
    background: "white",
    borderRadius: "1rem",
    boxShadow: "0 10px 40px rgba(79, 70, 229, 0.1)",
    border: "1px solid #e0e0e0",
    overflowX: "auto"
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse"
  };

  const thStyle = {
    padding: "1rem",
    textAlign: "left",
    fontWeight: "700",
    color: "white",
    background: "linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)",
    borderBottom: "2px solid #e0e0e0"
  };

  const tdStyle = {
    padding: "1rem",
    borderBottom: "1px solid #e0e0e0",
    color: "#4b5563"
  };

  const statusBadgeStyle = (status) => {
    const statusColors = {
      pending: { bg: "#fef3c7", color: "#92400e" },
      reviewed: { bg: "#dbeafe", color: "#1e40af" },
      shortlisted: { bg: "#dcfce7", color: "#166534" },
      rejected: { bg: "#fee2e2", color: "#991b1b" },
      accepted: { bg: "#d1fae5", color: "#065f46" }
    };
    const colors = statusColors[status] || { bg: "#f3f4f6", color: "#374151" };
    return {
      display: "inline-block",
      padding: "0.5rem 1rem",
      borderRadius: "0.5rem",
      background: colors.bg,
      color: colors.color,
      fontWeight: "600",
      fontSize: "0.875rem"
    };
  };

  const actionButtonStyle = {
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    border: "1px solid #e0e0e0",
    background: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.875rem",
    transition: "all 0.3s ease",
    marginRight: "0.5rem"
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <h1 style={headingStyle}>📋 Applications</h1>
          <div style={emptyStyle}>Loading applications...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={headingStyle}>📋 Manage Applications</h1>

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

        {/* Filter Bar */}
        <div style={filterBarStyle}>
          <span style={{ fontWeight: "600", color: "#0f3460" }}>Filter by Status:</span>
          {['all', 'pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={filterButtonStyle(filterStatus === status)}
              onMouseEnter={(e) => {
                if (filterStatus !== status) {
                  e.target.style.background = "#f3f4f6";
                }
              }}
              onMouseLeave={(e) => {
                if (filterStatus !== status) {
                  e.target.style.background = "white";
                }
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Applications Table */}
        {filteredApplications.length === 0 ? (
          <div style={emptyStyle}>
            <p style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>No applications yet</p>
            <p style={{ color: "#999" }}>Applications will appear here when job seekers apply</p>
          </div>
        ) : (
          <div style={tableContainerStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Applicant</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Job Title</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Applied</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map(app => (
                  <tr key={app.id} style={{ ':hover': { background: '#f9fafb' } }}>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: "600" }}>{app.applicant_name}</div>
                    </td>
                    <td style={tdStyle}>{app.applicant_email}</td>
                    <td style={tdStyle}>{app.job_title}</td>
                    <td style={tdStyle}>
                      <span style={statusBadgeStyle(app.status)}>{app.status.toUpperCase()}</span>
                    </td>
                    <td style={tdStyle}>
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td style={tdStyle}>
                      <select
                        value={app.status}
                        onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                        disabled={statusLoading[app.id]}
                        style={{
                          padding: "0.5rem",
                          borderRadius: "0.375rem",
                          border: "1px solid #e0e0e0",
                          cursor: statusLoading[app.id] ? "not-allowed" : "pointer",
                          opacity: statusLoading[app.id] ? 0.6 : 1
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
