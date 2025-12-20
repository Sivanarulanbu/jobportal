/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback } from "react";
import apiClient from "../utils/apiClient";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state by checking if user is authenticated with Django backend
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          // If no token, maybe we have a session? Try anyway.
        }

        const resp = await apiClient.get("/accounts/auth/current_user/");
        const userData = resp.data.user || resp.data;
        // Merge profile data if returned separately
        if (resp.data.profile && !userData.profile) {
          userData.profile = resp.data.profile;
        }
        setUser(userData);
      } catch (err) {
        // User not authenticated
        // console.log("User not authenticated");
        setUser(null);
        if (err.response?.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(
    async (credentials) => {
      try {
        setError(null);
        setLoading(true);
        // Django handles authentication, response includes user data and tokens
        const response = await apiClient.post("/accounts/auth/login/", credentials);

        const data = response.data;
        if (data.tokens) {
          localStorage.setItem('access_token', data.tokens.access);
          localStorage.setItem('refresh_token', data.tokens.refresh);
        }

        setUser(data.user);
        setLoading(false);
        return data;
      } catch (err) {
        setLoading(false);
        const msg = err?.response?.data?.message || err?.response?.data?.errors || err.message || "Login failed";
        setError(msg);
        throw err;
      }
    },
    []
  );

  const register = useCallback(
    async (data) => {
      try {
        setError(null);
        setLoading(true);
        // Django handles registration and authentication
        const response = await apiClient.post("/accounts/auth/register/", data);

        const respData = response.data;
        if (respData.tokens) {
          localStorage.setItem('access_token', respData.tokens.access);
          localStorage.setItem('refresh_token', respData.tokens.refresh);
        }

        setUser(respData.user);
        setLoading(false);
        return respData;
      } catch (err) {
        setLoading(false);
        const errData = err?.response?.data;
        let msg = "Registration failed";
        if (errData) {
          if (errData.errors) {
            const first = Object.values(errData.errors)[0];
            msg = Array.isArray(first) ? first[0] : first;
          } else if (errData.message) {
            msg = errData.message;
          }
        } else {
          msg = err.message || msg;
        }
        setError(msg);
        throw err;
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      // Call Django logout endpoint (Django will clear session)
      await apiClient.post("/accounts/auth/logout/");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Always clear local state
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setError(null);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, error, loading, login, register, logout, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
}
