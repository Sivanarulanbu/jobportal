export default function Contact() {
  return (
    <div style={{ maxWidth: "56rem", margin: "0 auto", padding: "2rem 0" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Contact Us</h1>
      <p style={{ color: "#666", fontSize: "1.125rem", lineHeight: "1.75", marginBottom: "2rem" }}>
        Have questions? We'd love to hear from you. Get in touch with our team.
      </p>

      <div style={{ backgroundColor: "#f3f4f6", padding: "2rem", borderRadius: "0.5rem", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>Get In Touch</h2>
        <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Name</label>
            <input 
              type="text" 
              placeholder="Your name" 
              style={{ 
                width: "100%", 
                padding: "0.5rem", 
                border: "1px solid #ddd", 
                borderRadius: "0.25rem",
                fontFamily: "inherit"
              }} 
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Email</label>
            <input 
              type="email" 
              placeholder="your@email.com" 
              style={{ 
                width: "100%", 
                padding: "0.5rem", 
                border: "1px solid #ddd", 
                borderRadius: "0.25rem",
                fontFamily: "inherit"
              }} 
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Message</label>
            <textarea 
              placeholder="Your message" 
              rows="5"
              style={{ 
                width: "100%", 
                padding: "0.5rem", 
                border: "1px solid #ddd", 
                borderRadius: "0.25rem",
                fontFamily: "inherit"
              }} 
            ></textarea>
          </div>
          <button 
            type="submit"
            style={{
              backgroundColor: "#2563eb",
              color: "#fff",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.25rem",
              border: "none",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Send Message
          </button>
        </form>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem" }}>
        <div>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.5rem" }}>📧 Email</h3>
          <p style={{ color: "#666" }}>support@jobportal.com</p>
        </div>
        <div>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.5rem" }}>📱 Phone</h3>
          <p style={{ color: "#666" }}>+1 (555) 123-4567</p>
        </div>
        <div>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.5rem" }}>📍 Location</h3>
          <p style={{ color: "#666" }}>New York, USA</p>
        </div>
      </div>
    </div>
  );
}
