export default function AuthModal({
  authMode,
  setAuthMode,
  userType,
  setUserType,
  credentials,
  setCredentials,
  error,
  loading,
  onSubmit,
  onClose,
  inputStyle,
  primaryButtonStyle,
  buttonStyle
}) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '0.5rem',
        width: '90%',
        maxWidth: '400px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#3b82f6' }}>
          {authMode === 'login' ? 'Sign In' : 'Sign Up'}
        </h2>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            marginBottom: '1rem',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}

        {authMode === 'register' && (
          <>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#1e293b', fontWeight: '500' }}>User Type</label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              style={inputStyle}
            >
              <option value="job_seeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>

            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#1e293b', fontWeight: '500' }}>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              style={inputStyle}
              autoComplete="off"
            />
          </>
        )}

        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#1e293b', fontWeight: '500' }}>Username</label>
        <input
          type="text"
          placeholder="username"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          style={inputStyle}
          autoComplete="off"
        />

        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#1e293b', fontWeight: '500' }}>Password</label>
        <input
          type="password"
          placeholder="password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          style={inputStyle}
          autoComplete="off"
        />

        <button
          onClick={onSubmit}
          disabled={loading}
          style={{
            ...primaryButtonStyle,
            width: '100%',
            marginBottom: '1rem',
            opacity: loading ? 0.5 : 1
          }}
        >
          {loading ? 'Loading...' : (authMode === 'login' ? 'Sign In' : 'Sign Up')}
        </button>

        <button
          onClick={() => {
            setAuthMode(authMode === 'login' ? 'register' : 'login');
          }}
          style={{
            ...buttonStyle,
            width: '100%',
            marginBottom: '1rem'
          }}
        >
          {authMode === 'login' ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
        </button>

        <button
          onClick={onClose}
          style={{
            backgroundColor: '#ef4444',
            color: '#fff',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            width: '100%',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
