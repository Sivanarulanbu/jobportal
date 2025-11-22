export default function Footer() {
  const footerStyle = {
    padding: "2.5rem 1rem",
    textAlign: "center",
    borderTop: "3px solid #e5e7eb",
    marginTop: "4rem",
    backgroundColor: "#ffffff",
  };

  const contentStyle = {
    maxWidth: "1200px",
    margin: "0 auto"
  };

  const linksStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "2rem",
    marginBottom: "1.5rem",
    flexWrap: "wrap"
  };

  const linkStyle = {
    color: "#71717a",
    textDecoration: "none",
    fontSize: "0.95rem",
    transition: "color 0.3s ease",
    cursor: "pointer"
  };

  const brandStyle = {
    background: "linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontWeight: "700",
    marginBottom: "1rem",
    fontSize: "1.25rem"
  };

  const copyrightStyle = {
    color: "#9ca3af",
    fontSize: "0.85rem",
    paddingTop: "1rem",
    borderTop: "1px solid #e5e7eb"
  };

  return (
    <footer style={footerStyle}>
      <div style={contentStyle}>
        <div style={brandStyle}>
          <svg width="28" height="28" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "0.5rem", display: "inline-block", verticalAlign: "middle" }}>
            {/* Compass Rose */}
            <g transform="translate(140, 50)">
              {/* Center main star - larger */}
              <path d="M 0 -20 L 8 -8 L 20 0 L 8 8 L 0 20 L -8 8 L -20 0 L -8 -8 Z" fill="#3b46d9" />
              
              {/* North point */}
              <path d="M 0 -28 L 6 -18 L 0 -10 L -6 -18 Z" fill="#4f46e5" />
              {/* NE small star */}
              <path d="M 18 -16 L 22 -12 L 18 -8 L 14 -12 Z" fill="#a855f7" />
              {/* East point - gradient toward cyan */}
              <path d="M 28 0 L 18 6 L 10 0 L 18 -6 Z" fill="#06b6d4" />
              {/* SE small star */}
              <path d="M 16 18 L 20 22 L 16 26 L 12 22 Z" fill="#a855f7" />
              {/* South point */}
              <path d="M 0 30 L 6 20 L 0 12 L -6 20 Z" fill="#4f46e5" />
              {/* SW small star */}
              <path d="M -16 18 L -12 22 L -16 26 L -20 22 Z" fill="#8b5cf6" />
              {/* West small star */}
              <path d="M -18 -4 L -14 0 L -18 4 L -22 0 Z" fill="#4f46e5" />
            </g>
            
            {/* Curved pathway arrows */}
            {/* Outermost arc */}
            <path d="M 80 140 Q 60 150 40 160 Q 20 170 10 185" stroke="#06b6d4" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.6" />
            {/* Middle arc */}
            <path d="M 95 130 Q 70 145 45 165 Q 25 180 8 195" stroke="#7c3aed" strokeWidth="11" fill="none" strokeLinecap="round" opacity="0.75" />
            {/* Inner arc */}
            <path d="M 110 120 Q 85 138 60 165 Q 35 188 12 205" stroke="#4f46e5" strokeWidth="10" fill="none" strokeLinecap="round" />
            
            {/* Arrow head */}
            <path d="M 8 205 L -5 195 L 0 182 Z" fill="#4f46e5" />
            <path d="M 10 185 L -2 177 L 2 167 Z" fill="#06b6d4" opacity="0.6" />
          </svg>
          DreamRoute
        </div>
        <p style={{ color: "#71717a", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
          Your Gateway to Dream Career Opportunities
        </p>
        <div style={linksStyle}>
          <a href="#about" style={linkStyle} onMouseEnter={(e) => e.target.style.color = "#4f46e5"} onMouseLeave={(e) => e.target.style.color = "#71717a"}>About Us</a>
          <a href="#careers" style={linkStyle} onMouseEnter={(e) => e.target.style.color = "#a855f7"} onMouseLeave={(e) => e.target.style.color = "#71717a"}>Careers</a>
          <a href="#contact" style={linkStyle} onMouseEnter={(e) => e.target.style.color = "#06b6d4"} onMouseLeave={(e) => e.target.style.color = "#71717a"}>Contact</a>
          <a href="#privacy" style={linkStyle} onMouseEnter={(e) => e.target.style.color = "#10b981"} onMouseLeave={(e) => e.target.style.color = "#71717a"}>Privacy Policy</a>
          <a href="#terms" style={linkStyle} onMouseEnter={(e) => e.target.style.color = "#f59e0b"} onMouseLeave={(e) => e.target.style.color = "#71717a"}>Terms of Service</a>
        </div>
        <div style={copyrightStyle}>
          © {new Date().getFullYear()} DreamRoute — All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
