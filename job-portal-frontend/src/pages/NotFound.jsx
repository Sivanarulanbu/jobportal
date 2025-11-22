export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1 style={{ fontSize: "3rem", fontWeight: "bold", color: "#dc2626", marginBottom: "1rem" }}>404</h1>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Page Not Found</h2>
      <p style={{ color: "#666", marginBottom: "2rem" }}>Sorry, the page you're looking for doesn't exist.</p>
      <a href="/" style={{
        display: "inline-block",
        backgroundColor: "#2563eb",
        color: "#fff",
        padding: "0.75rem 1.5rem",
        borderRadius: "0.25rem",
        textDecoration: "none",
        fontWeight: "600"
      }}>
        Go Home
      </a>
    </div>
  );
}
