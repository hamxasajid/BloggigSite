// src/context/AuthCon.jsx
import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const AuthCon = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Session timeout management
  useEffect(() => {
    if (!user) return;

    const checkSessionTimeout = () => {
      const lastActivity = localStorage.getItem("lastActivity");
      const sessionTimeout = 30 * 60 * 1000; // 30 minutes in milliseconds

      if (lastActivity) {
        const lastActivityTime = new Date(lastActivity).getTime();
        const currentTime = new Date().getTime();

        if (currentTime - lastActivityTime > sessionTimeout) {
          logout();
        }
      }
    };

    // Set up activity tracking
    const updateLastActivity = () => {
      localStorage.setItem("lastActivity", new Date().toISOString());
    };

    // Add event listeners for user activity
    const events = ["mousemove", "keydown", "scroll", "click", "touchstart"];
    events.forEach((event) => {
      window.addEventListener(event, updateLastActivity);
    });

    // Check session every minute
    const interval = setInterval(checkSessionTimeout, 60 * 1000);

    // Initial check
    checkSessionTimeout();

    return () => {
      clearInterval(interval);
      events.forEach((event) => {
        window.removeEventListener(event, updateLastActivity);
      });
    };
  }, [user]);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token || "");
    localStorage.setItem("lastActivity", new Date().toISOString());
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("lastActivity");
    setUser(null);
    navigate("/login");
  };

  if (loading) return null; // Or a loading spinner

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthCon;
