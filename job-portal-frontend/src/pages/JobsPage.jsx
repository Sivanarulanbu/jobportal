import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import SearchBar from '../components/SearchBar';
import apiClient from '../utils/apiClient';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock data for display while loading
  const mockJobs = [
    { id: 1, title: 'Senior React Developer', company: 'Tech Corp', location: 'Remote' },
    { id: 2, title: 'Full Stack Engineer', company: 'StartUp Inc', location: 'San Francisco, CA' },
    { id: 3, title: 'Backend Developer', company: 'DataFlow Systems', location: 'New York, NY' }
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        console.log('Fetching jobs from API...');
        const data = await apiClient('/jobs');
        console.log('API Response:', data);
        setJobs(data.results || data || mockJobs);
      } catch (err) {
        console.error('API Error:', err);
        console.log('Using mock data instead');
        setError(err.message || 'Failed to load jobs from server, showing sample data');
        setJobs(mockJobs);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <Loader />;

  const jobCardStyle = {
    backgroundColor: '#1e293b',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    border: '1px solid #334155',
    cursor: 'pointer',
    transition: 'box-shadow 0.3s ease'
  };

  return (
    <div>
      <SearchBar />
      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          color: '#991b1b',
          padding: '1rem',
          borderRadius: '0.375rem',
          marginBottom: '1rem',
          border: '1px solid #fecaca'
        }}>
          {error}
        </div>
      )}
      {jobs.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: '#64748b',
          backgroundColor: '#1e293b',
          borderRadius: '0.5rem'
        }}>
          No jobs found
        </div>
      ) : (
        <div>
          {jobs.map(job => (
            <Link key={job.id} to={`/jobs/${job.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div
                style={jobCardStyle}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(20, 184, 166, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#ffffff' }}>{job.title}</h3>
                <p style={{ margin: '0.25rem 0', color: '#cbd5e1' }}>{job.company}</p>
                <p style={{ margin: '0.25rem 0', color: '#14b8a6', fontWeight: '500' }}>{job.location}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
