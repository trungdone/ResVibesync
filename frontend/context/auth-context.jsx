"use client";
//auth-context.jsx

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      verifyToken(token).catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const text = await response.text();

      if (response.ok) {
        const userData = JSON.parse(text);
        setUser(userData);
        setIsAuthenticated(true);
          // check role change
  const previousRole = localStorage.getItem("previousRole")
  if (previousRole && previousRole !== userData.role) {
    localStorage.setItem("roleChanged", `Role changed from ${previousRole} to ${userData.role}`)
  }
  localStorage.setItem("previousRole", userData.role)
        return userData;
      } else {
        throw new Error("Invalid or expired token");
      }
    } catch (err) {
      console.warn("🔒 Token verification failed:", err.message);
      throw err;
    } finally {
      setLoading(false);
    }
    
  };


  const refreshUser = async () => {
  const token = localStorage.getItem("token");
    if (token) {
      try {
        await verifyToken(token); // this will update the context
      } catch {
        clearAuthStorage();
      }
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username: email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.access_token);
        const userData = await verifyToken(data.access_token);
        if (userData.banned) {
          localStorage.removeItem("token");
          throw new Error("Account is banned");
        }
        setUser(userData);
        setIsAuthenticated(true);

      localStorage.setItem("welcomeNotification", `Welcome back, ${userData.name}! You are logged in as ${userData.role}.`);

      router.push(
  userData.role === "admin"
    ? "/admin/dashboard"
    : userData.role === "artist"
      ? "/role_artist/dashboard"
      : "/profile"
);

        // Push welcome notification to server
  try {
  const res = await fetch("http://localhost:8000/api/notifications", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${data.access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_id: userData.id,
      title: "Welcome",
      message: `Welcome back, ${userData.name}! You are logged in as ${userData.role}.`,
      type: "login"
    })
  });
  if (!res.ok) console.error("Notify welcome failed");
} catch (err) {
  console.error("Notify welcome failed", err);
}
      } else {
        throw new Error(data.detail || "Invalid credentials");
      }
    } catch (err) {
      console.error("❌ Sign-in error:", err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name, email, password) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        router.push("/signin");
      } else {
        throw new Error(data.detail || "Failed to create account");
      }
    } catch (err) {
      console.error("❌ Sign-up error:", err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    router.push("/signin");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, signIn, signUp, signOut,refreshUser   }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);