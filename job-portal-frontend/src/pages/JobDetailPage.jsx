import { useParams } from 'react-router-dom';

export default function JobDetailPage() {
  const { id } = useParams();

  return (
    <div style={{ padding: '2rem', backgroundColor: '#0f172a', borderRadius: '0.5rem' }}>
      <h1 style={{ color: '#ffffff' }}>Job Details</h1>
      <p style={{ color: '#cbd5e1' }}>Job ID: {id}</p>
    </div>
  );
}
