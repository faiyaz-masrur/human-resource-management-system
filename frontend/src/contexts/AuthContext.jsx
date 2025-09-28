// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import Spinner from "../utils/Spinner";

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on first render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      console.log("Stored User:", storedUser);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Save user to localStorage when updated
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Fake login (replace with API call)
  const login = (userData) => {
    setUser(userData);
  };

  // Logout
  const logout = () => {
    setUser(null);
  };

  if (loading) return <Spinner />; // show spinner while loading

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
