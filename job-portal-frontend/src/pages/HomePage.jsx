import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

export default function HomePage() {
  const heroStyle = {
    backgroundColor: '#1e293b',
    color: '#ffffff',
    padding: '4rem 2rem',
    textAlign: 'center',
    borderRadius: '0.5rem',
    marginBottom: '2rem',
    border: '2px solid #14b8a6'
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#14b8a6'
  };

  const subtitleStyle = {
    fontSize: '1.125rem',
    color: '#e2e8f0',
    marginBottom: '2rem'
  };

  const ctaButtonStyle = {
    backgroundColor: '#14b8a6',
    color: '#ffffff',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.375rem',
    textDecoration: 'none',
    fontWeight: '600',
    display: 'inline-block',
    transition: 'background-color 0.3s ease'
  };

  return (
    <div>
      <div style={heroStyle}>
        <h1 style={titleStyle}>Welcome to DreamRoute</h1>
        <p style={subtitleStyle}>Your Gateway to Dream Career Opportunities</p>
        <Link 
          to="/jobs" 
          style={ctaButtonStyle}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#0d9488'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#14b8a6'}
        >
          Explore Jobs
        </Link>
      </div>
      <SearchBar />
    </div>
  );
}
