/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";
import api from "../utils/api";
import { saveToken, logoutUser } from "../utils/storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile if token exists
  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log("Attempting to load user profile");
        const token = localStorage.getItem("access");
        if (token) {
          const res = await api.get("/auth/me/");
          console.log("User loaded:", res.data);
          setUser(res.data);
        } else {
          console.log("No token found");
          setUser(null);
        }
      } catch (error) {
        console.error("Error loading user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await api.post("/auth/login/", { username, password });
      console.log("Login response:", res.data);
      
      if (res.data) {
        saveToken(res.data);
        console.log("✅ Tokens saved");
      }
      
      const profile = await api.get("/auth/me/");
      console.log("Profile response:", profile.data);
      
      setUser(profile.data);
      console.log("✅ User profile set");
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response?.data);
      throw error;
    }
  };

  const registerUser = async (data) => {
    const registrationData = {
      ...data,
      user_type: data.user_type || 'job_seeker'
    };
    try {
      const res = await api.post("/auth/register/", registrationData);
      console.log("Registration response:", res.data);
      
      // Don't save tokens or set user - let them login manually
      // This prevents token validation issues
      return res.data;
    } catch (error) {
      console.error("Registration error:", error);
      console.error("Error response:", error.response?.data);
      throw error;
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, registerUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
