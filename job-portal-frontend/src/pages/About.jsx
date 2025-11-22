export default function About() {
  return (
    <div style={{ maxWidth: "56rem", margin: "0 auto", padding: "2rem 0" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem" }}>About Job Portal</h1>
      <p style={{ color: "#666", fontSize: "1.125rem", lineHeight: "1.75", marginBottom: "1.5rem" }}>
        Job Portal is a modern platform designed to connect job seekers with employers. 
        We aim to make the job search process simple, efficient, and accessible to everyone.
      </p>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem" }}>Our Mission</h2>
      <p style={{ color: "#666", lineHeight: "1.75", marginBottom: "1.5rem" }}>
        To empower job seekers by providing them with access to the best job opportunities 
        and helping employers find the perfect talent for their organizations.
      </p>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem" }}>Why Choose Us?</h2>
      <ul style={{ color: "#666", lineHeight: "1.75", marginLeft: "2rem" }}>
        <li style={{ marginBottom: "0.5rem" }}>✓ Easy-to-use platform</li>
        <li style={{ marginBottom: "0.5rem" }}>✓ Thousands of job listings</li>
        <li style={{ marginBottom: "0.5rem" }}>✓ Advanced search and filtering</li>
        <li style={{ marginBottom: "0.5rem" }}>✓ Secure and reliable</li>
        <li>✓ 24/7 support</li>
      </ul>
    </div>
  );
}
