// src/contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on first render
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // Login function - FIXED
  const login = (userData) => {
    console.log("🔐 Login called with:", userData);
    
    // Store tokens
    if (userData.access) {
      localStorage.setItem('access_token', userData.access);
    }
    if (userData.refresh) {
      localStorage.setItem('refresh_token', userData.refresh);
    }
    
    // Handle user data - try different possible structures
    let userToStore = null;
    
    if (userData.user) {
      // Structure: { access, refresh, user: { ... } }
      userToStore = userData.user;
    } else if (userData.id || userData.email) {
      // Structure: { access, refresh, id, email, ... }
      userToStore = userData;
    } else {
      // If no user data, create minimal user object from tokens
      userToStore = { 
        id: Date.now(), // temporary ID
        email: 'user@system.com', // temporary email
        access_token: userData.access 
      };
    }
    
    console.log("✅ Storing user:", userToStore);
    setUser(userToStore);
    localStorage.setItem("user", JSON.stringify(userToStore));
  };

  // Logout
  const logout = () => {
    console.log("🔓 Logout called");
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};