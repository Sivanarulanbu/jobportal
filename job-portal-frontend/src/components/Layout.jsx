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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      {networkError && (
        <div className="bg-red-50 text-red-800 px-4 py-3 text-center border-b border-red-200">
          {networkError}
        </div>
      )}
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
