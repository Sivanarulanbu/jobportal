export default function CreateJobModal({
  newJob,
  setNewJob,
  error,
  loading,
  onSubmit,
  onClose,
  inputStyle,
  primaryButtonStyle
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
      zIndex: 1000,
      overflowY: 'auto'
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '0.5rem',
        width: '90%',
        maxWidth: '500px',
        border: '1px solid #e2e8f0',
        margin: '2rem auto',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#3b82f6' }}>Create Job</h2>

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

        <input
          type="text"
          placeholder="Job Title"
          value={newJob.title}
          onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
          style={inputStyle}
          autoComplete="off"
        />

        <input
          type="text"
          placeholder="Company"
          value={newJob.company}
          onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
          style={inputStyle}
          autoComplete="off"
        />

        <input
          type="text"
          placeholder="Location"
          value={newJob.location}
          onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
          style={inputStyle}
          autoComplete="off"
        />

        <select
          value={newJob.job_type}
          onChange={(e) => setNewJob({ ...newJob, job_type: e.target.value })}
          style={inputStyle}
        >
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
        </select>

        <textarea
          placeholder="Description"
          value={newJob.description}
          onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
          style={{ ...inputStyle, minHeight: '100px', fontFamily: 'inherit' }}
        />

        <textarea
          placeholder="Requirements"
          value={newJob.requirements}
          onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
          style={{ ...inputStyle, minHeight: '100px', fontFamily: 'inherit' }}
        />

        <input
          type="number"
          placeholder="Min Salary"
          value={newJob.salary_min}
          onChange={(e) => setNewJob({ ...newJob, salary_min: e.target.value })}
          style={inputStyle}
          autoComplete="off"
        />

        <input
          type="number"
          placeholder="Max Salary"
          value={newJob.salary_max}
          onChange={(e) => setNewJob({ ...newJob, salary_max: e.target.value })}
          style={inputStyle}
          autoComplete="off"
        />

        <input
          type="text"
          placeholder="Skills (comma-separated)"
          value={newJob.skills}
          onChange={(e) => setNewJob({ ...newJob, skills: e.target.value })}
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
          {loading ? 'Creating...' : 'Create Job'}
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
