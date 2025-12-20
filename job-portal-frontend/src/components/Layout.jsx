import { useState, useEffect, useCallback } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  const [networkError, setNetworkError] = useState(null);

  useEffect(() => {
    const handleOffline = () => {
      setNetworkError("No internet connection");
    };

    const handleOnline = () => {
      setNetworkError(null);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        height: "100%",
        width: "100%",
        backgroundColor: "#0f172a",
      }}
    >
      <Navbar />
      {networkError && (
        <div style={{
          backgroundColor: "#fee2e2",
          color: "#991b1b",
          padding: "1rem",
          textAlign: "center"
        }}>
          {networkError}
        </div>
      )}
      <main style={{
        flex: 1,
        padding: "1.5rem",
        backgroundColor: "#0f172a",
        width: "100%",
        overflowY: "auto",
      }}>
        <div className="container" style={{ width: "100%" }}>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
