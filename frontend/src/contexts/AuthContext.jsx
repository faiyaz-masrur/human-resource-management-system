import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem("accessToken");

      if (savedToken) {
        setToken(savedToken);
        await fetchUser(); 
      } else {
        setLoading(false);
      }
    };

    initializeAuth(); 
  }, []);


  const fetchUser = async () => {
    try {
      setLoading(true)
      const res = await api.get("system/auth/get-user-data/");
      setUser(res.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      toast.error("Failed to fetch the user")
      logout();
    } finally {
      setLoading(false);
    }
  };


  const login = async (accessToken, refreshToken) => {
    try {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setToken(accessToken);
      await fetchUser();
      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  // ✅ Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
