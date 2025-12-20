import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/jobs/");
        setJobs(response.data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

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

  return (
    <div className="home-container">
      <div className="hero">
        <h1>
          {user ? `Welcome back, ${user.user?.first_name || user.user?.username}!` : "Welcome to DreamRoute"}
        </h1>
        <p>
          {user ? `Continue your job search, ${user.user?.first_name || user.user?.username}` : "Your path to the right opportunity starts here"}
        </p>
        <div className="button-group">
          <button className="btn btn-secondary" onClick={() => navigate("/jobs")}>
            Browse Jobs
          </button>
          <button className="btn btn-secondary" onClick={() => navigate("/register")}>
            Get Started
          </button>
        </div>
      </div>

      <div className="feature-grid">
        <div className="feature-card">
          <h3>🔍 Find Jobs</h3>
          <p>Search through thousands of job listings tailored to your skills and experience.</p>
        </div>
        <div className="feature-card">
          <h3>📋 Apply Easy</h3>
          <p>Submit applications with just one click and track your progress in real-time.</p>
        </div>
        <div className="feature-card">
          <h3>💼 Build Profile</h3>
          <p>Create a professional profile that showcases your skills and experience.</p>
        </div>
        <div className="feature-card">
          <h3>🎯 Match Skills</h3>
          <p>Get matched with jobs that perfectly align with your expertise.</p>
        </div>
        <div className="feature-card">
          <h3>📊 Track Status</h3>
          <p>Monitor your applications and receive updates on your job search.</p>
        </div>
        <div className="feature-card">
          <h3>🌟 Network</h3>
          <p>Connect with employers and build valuable professional relationships.</p>
        </div>
      </div>

      {jobs.length > 0 && (
        <div>
          <h2 style={{ marginTop: "3rem", marginBottom: "1rem", fontSize: "2rem" }}>
            Featured Jobs
          </h2>
          <div>
            {jobs.map((job) => (
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
                  <span>💰 ${job.salary_min} - ${job.salary_max}</span>
                  <span>⏰ Posted recently</span>
                </div>
                <p className="job-description">{job.description.substring(0, 150)}...</p>
                <div className="job-skills">
                  {job.skills.split(",").slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="skill-tag">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
                <div className="job-footer">
                  <Link
                    to={`/jobs/${job.id}`}
                    className="btn btn-primary"
                    style={{ marginBottom: 0 }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Link to="/jobs" className="btn btn-primary">
              View All Jobs
            </Link>
          </div>
        </div>
      )}

      {loading && <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>}
    </div>
  );
}
