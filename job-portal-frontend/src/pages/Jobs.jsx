import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/jobs/");
        setJobs(response.data);
        setFilteredJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter((job) => job.job_type === selectedType);
    }

    if (selectedLocation) {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [searchTerm, selectedType, selectedLocation, jobs]);

  return (
    <div className="jobs-container">
      <h1 style={{ marginBottom: "2rem", fontSize: "2.5rem" }}>Job Opportunities</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="form-group">
          <label>Search Jobs</label>
          <input
            type="text"
            placeholder="Job title, company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Job Type</label>
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="">All Types</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="remote">Remote</option>
          </select>
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            placeholder="City, country..."
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading jobs...</p>
      ) : filteredJobs.length > 0 ? (
        <div>
          <p style={{ marginBottom: "1.5rem", color: "#64748b" }}>
            Found {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""}
          </p>
          {filteredJobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-header">
                <div>
                  <h3 className="job-title">{job.title}</h3>
                  <p className="job-company">{job.company}</p>
                </div>
                <span className="job-badge">{job.job_type}</span>
              </div>
              <div className="job-meta">
                <span>📍 {job.location}</span>
                <span>💰 ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}</span>
              </div>
              <p className="job-description">{job.description}</p>
              <div className="job-skills">
                {job.skills.split(",").map((skill, idx) => (
                  <span key={idx} className="skill-tag">
                    {skill.trim()}
                  </span>
                ))}
              </div>
              <div className="job-footer">
                <Link to={`/jobs/${job.id}`} className="btn btn-primary" style={{ marginBottom: 0 }}>
                  Apply Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "#64748b" }}>No jobs found matching your criteria.</p>
      )}
    </div>
  );
}
