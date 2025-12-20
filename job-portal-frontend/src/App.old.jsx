import { useState, useEffect } from 'react';
import apiClient from './utils/apiClient';
import AuthModal from './components/AuthModal';
import CreateJobModal from './components/CreateJobModal';

export default function App() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [userType, setUserType] = useState('job_seeker');
  const [credentials, setCredentials] = useState({ username: '', password: '', email: '' });
  const [currentPage, setCurrentPage] = useState('home');
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    job_type: 'full-time',
    description: '',
    requirements: '',
    salary_min: '',
    salary_max: '',
    skills: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch jobs on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Auto-load user if logged in
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchCurrentUser();
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await apiClient.get('/accounts/auth/current_user/');
      setUser(response.data);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  };

  const fetchJobs = async (search = '') => {
    try {
      setLoading(true);
      const response = await apiClient.get('/jobs/', {
        params: search ? { search } : {}
      });
      setJobs(Array.isArray(response.data) ? response.data : response.data.results || []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!credentials.username || !credentials.password || !credentials.email) {
      setError('All fields are required');
      return;
    }

      try {
      setLoading(true);
      const response = await apiClient.post('/accounts/auth/register/', {
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
        password_confirm: credentials.password,
        user_type: userType
      });

      localStorage.setItem('access_token', response.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.tokens.refresh);
      await fetchCurrentUser();      setCredentials({ username: '', password: '', email: '' });
      setShowAuthModal(false);
      setCurrentPage('home');
      setError('');
    } catch (err) {
      console.error('Registration failed:', err);
      const errorData = err.response?.data;
      if (errorData?.errors) {
        // Handle validation errors from backend
        const firstError = Object.values(errorData.errors)[0];
        setError(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        setError(errorData?.detail || errorData?.error || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!credentials.username || !credentials.password) {
      setError('Username and password are required');
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.post('/accounts/auth/login/', {
        username: credentials.username,
        password: credentials.password
      });

      localStorage.setItem('access_token', response.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.tokens.refresh);
      await fetchCurrentUser();

      setCredentials({ username: '', password: '', email: '' });
      setShowAuthModal(false);
      setCurrentPage('home');
      setError('');
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.detail || err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setCredentials({ username: '', password: '', email: '' });
    setCurrentPage('home');
  };

  const handleCreateJob = async () => {
    if (!newJob.title || !newJob.company || !newJob.location) {
      setError('Title, company, and location are required');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...newJob,
        salary_min: newJob.salary_min ? parseFloat(newJob.salary_min) : null,
        salary_max: newJob.salary_max ? parseFloat(newJob.salary_max) : null
      };
      const response = await apiClient.post('/jobs/', payload);
      setJobs([response.data, ...jobs]);
      setNewJob({
        title: '',
        company: '',
        location: '',
        job_type: 'full-time',
        description: '',
        requirements: '',
        salary_min: '',
        salary_max: '',
        skills: ''
      });
      setShowCreateJobModal(false);
      setError('');
      alert('Job posted successfully!');
    } catch (err) {
      console.error('Failed to create job:', err);
      setError(err.response?.data?.detail || err.response?.data?.error || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyJob = async (jobId) => {
    try {
      setLoading(true);
      await apiClient.post(`/jobs/${jobId}/apply/`, {
        cover_letter: 'I am interested in this position.'
      });
      alert('Application submitted successfully!');
      setError('');
    } catch (err) {
      console.error('Failed to apply:', err);
      setError(err.response?.data?.error || err.response?.data?.detail || 'Failed to apply for job');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      setLoading(true);
      await apiClient.delete(`/jobs/${jobId}/`);
      setJobs(jobs.filter(job => job.id !== jobId));
      alert('Job deleted successfully!');
    } catch (err) {
      console.error('Failed to delete job:', err);
      setError('Failed to delete job');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(searchQuery);
  };

  const openAuthModal = (mode, type = 'job_seeker') => {
    setAuthMode(mode);
    setUserType(type);
    setShowAuthModal(true);
    setError('');
  };

  // Styling
  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#fff',
    borderBottom: '3px solid #3b82f6',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  };

  const containerStyle = {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
    color: '#1e293b'
  };

  const buttonStyle = {
    backgroundColor: 'transparent',
    color: '#3b82f6',
    border: '2px solid #3b82f6',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease'
  };

  const primaryButtonStyle = {
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease'
  };

  const cardStyle = {
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    marginBottom: '1rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    border: '1px solid #cbd5e1',
    backgroundColor: '#fff',
    color: '#1e293b',
    marginBottom: '1rem',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    fontSize: '1rem',
    pointerEvents: 'auto',
    cursor: 'text'
  };

  // ==================== PAGES ====================

  const HomePage = () => (
    <div style={{ padding: '2rem', flex: 1 }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#3b82f6' }}>
        Welcome to DreamRoute 🎯
      </h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#475569' }}>
        Find your dream job or hire top talent
      </p>
      {!user && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => openAuthModal('register', 'job_seeker')}
            style={primaryButtonStyle}
          >
            Join as Job Seeker
          </button>
          <button
            onClick={() => openAuthModal('register', 'employer')}
            style={primaryButtonStyle}
          >
            Join as Employer
          </button>
        </div>
      )}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#3b82f6' }}>
        Recent Opportunities
      </h2>
      <JobsGrid />
    </div>
  );

  const JobsPage = () => (
    <div style={{ padding: '2rem', flex: 1 }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#3b82f6' }}>
        {user?.user_type === 'employer' ? 'My Job Postings' : 'Available Jobs'}
      </h1>

      {user?.user_type === 'job_seeker' && (
        <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search jobs by title, company, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ ...inputStyle, flex: 1, minWidth: '200px', marginBottom: 0 }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{ ...primaryButtonStyle, width: 'auto', padding: '0.75rem 1.5rem' }}
            >
              Search
            </button>
          </div>
        </form>
      )}

      <JobsGrid />
    </div>
  );

  const JobsGrid = () => (
    <div>
      {loading && <p style={{ color: '#3b82f6' }}>Loading...</p>}
      {jobs.length === 0 && !loading && <p style={{ color: '#64748b' }}>No jobs found</p>}
      {jobs.map((job) => (
        <div key={job.id} style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#3b82f6' }}>
                {job.title}
              </h3>
              <p style={{ color: '#64748b', marginBottom: '0.5rem' }}>
                📍 {job.company} - {job.location}
              </p>
              <p style={{ color: '#64748b', marginBottom: '0.5rem' }}>
                💼 {job.job_type || 'Full-time'} | 💰 ${job.salary_min?.toLocaleString() || 'N/A'} - ${job.salary_max?.toLocaleString() || 'N/A'}
              </p>
              <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                {job.description}
              </p>
            </div>
          </div>

          {user?.user_type === 'employer' && job.employer === user.id && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => handleDeleteJob(job.id)}
                disabled={loading}
                style={{
                  backgroundColor: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Delete
              </button>
            </div>
          )}

          {user?.user_type === 'job_seeker' && (
            <button
              onClick={() => handleApplyJob(job.id)}
              disabled={loading}
              style={{
                ...primaryButtonStyle,
                opacity: loading ? 0.5 : 1
              }}
            >
              {loading ? 'Applying...' : 'Apply Now'}
            </button>
          )}

          {!user && (
            <button
              onClick={() => openAuthModal('login', 'job_seeker')}
              style={primaryButtonStyle}
            >
              Sign In to Apply
            </button>
          )}
        </div>
      ))}
    </div>
  );

  // ==================== MAIN RENDER ====================

  return (
    <div style={containerStyle}>
      {/* NAVBAR */}
      <nav style={navStyle}>
        <div
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#3b82f6',
            cursor: 'pointer'
          }}
          onClick={() => {
            setCurrentPage('home');
            setShowAuthModal(false);
          }}
        >
          🎯 DreamRoute
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {user && user.user_type === 'employer' && (
            <button
              onClick={() => setCurrentPage('jobs')}
              style={{
                ...buttonStyle,
                backgroundColor: currentPage === 'jobs' ? '#3b82f6' : 'transparent',
                color: currentPage === 'jobs' ? '#fff' : '#3b82f6'
              }}
            >
              My Jobs
            </button>
          )}

          {user && user.user_type === 'job_seeker' && (
            <button
              onClick={() => setCurrentPage('jobs')}
              style={{
                ...buttonStyle,
                backgroundColor: currentPage === 'jobs' ? '#3b82f6' : 'transparent',
                color: currentPage === 'jobs' ? '#fff' : '#3b82f6'
              }}
            >
              Browse Jobs
            </button>
          )}

          {user ? (
            <>
              {user.user_type === 'employer' && (
                <button
                  onClick={() => setShowCreateJobModal(true)}
                  style={primaryButtonStyle}
                >
                  ➕ Post Job
                </button>
              )}

              <span style={{ color: '#3b82f6', fontWeight: '600' }}>
                {user.username} ({user.user_type === 'employer' ? '👔 Employer' : '💼 Seeker'})
              </span>

              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => openAuthModal('login', 'job_seeker')}
                style={buttonStyle}
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal('register', 'job_seeker')}
                style={primaryButtonStyle}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'jobs' && <JobsPage />}

      {/* MODALS */}
      {showAuthModal && (
        <AuthModal
          authMode={authMode}
          setAuthMode={setAuthMode}
          userType={userType}
          setUserType={setUserType}
          credentials={credentials}
          setCredentials={setCredentials}
          error={error}
          loading={loading}
          onSubmit={authMode === 'login' ? handleLogin : handleRegister}
          onClose={() => setShowAuthModal(false)}
          inputStyle={{
            width: '100%',
            padding: '0.75rem',
            marginBottom: '1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
          primaryButtonStyle={{
            backgroundColor: '#3b82f6',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
          buttonStyle={{
            backgroundColor: '#e5e7eb',
            color: '#1e293b',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        />
      )}
      {showCreateJobModal && user?.user_type === 'employer' && (
        <CreateJobModal
          newJob={newJob}
          setNewJob={setNewJob}
          error={error}
          loading={loading}
          onSubmit={handleCreateJob}
          onClose={() => setShowCreateJobModal(false)}
          inputStyle={{
            width: '100%',
            padding: '0.75rem',
            marginBottom: '1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
          primaryButtonStyle={{
            backgroundColor: '#3b82f6',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        />
      )}
    </div>
  );
}
