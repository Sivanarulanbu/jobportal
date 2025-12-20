import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    user_type: 'job_seeker'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/jobs');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formStyle = {
    maxWidth: '400px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#0f172a',
    borderRadius: '0.5rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    border: '1px solid #334155',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#14b8a6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.375rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  };

  return (
    <div style={formStyle}>
      <h1 style={{ marginBottom: '1.5rem', color: '#ffffff' }}>Create Account</h1>
      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1rem' }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} style={inputStyle} required />
        <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} style={inputStyle} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} style={inputStyle} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} style={inputStyle} required />
        <select name="user_type" value={formData.user_type} onChange={handleChange} style={inputStyle}>
          <option value="job_seeker">Job Seeker</option>
          <option value="employer">Employer</option>
        </select>
        <button type="submit" style={buttonStyle} disabled={loading} onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#0d9488')} onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#14b8a6')}>
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
