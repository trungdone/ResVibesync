"use client";
<<<<<<< HEAD
=======
//auth-context.jsx
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6

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

<<<<<<< HEAD
  // ✅ Load token và xác thực khi ứng dụng khởi chạy
  useEffect(() => {
    const token = localStorage.getItem("token");
    const checkToken = async () => {
      if (token) {
        try {
          await verifyToken(token);
        } catch (err) {
          console.warn("❌ Token không hợp lệ:", err.message);
          clearAuthStorage();
        }
      } else {
        clearAuthStorage();
      }
      setLoading(false);
    };
    checkToken();
  }, []);

  // ✅ Xác thực token
  const verifyToken = async (token) => {
    try {
      const response = await fetch("http://localhost:8000/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("user_id", userData._id || userData.id || "");
=======
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
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
        return userData;
      } else {
        throw new Error("Invalid or expired token");
      }
    } catch (err) {
<<<<<<< HEAD
      clearAuthStorage();
      throw err;
    }
  };

  // ✅ Xóa dữ liệu token khỏi localStorage
  const clearAuthStorage = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    setUser(null);
    setIsAuthenticated(false);
  };

  // ✅ Đăng nhập
=======
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

>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username: email, password }),
      });
<<<<<<< HEAD

=======
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.access_token);
        const userData = await verifyToken(data.access_token);
<<<<<<< HEAD

        if (userData.banned) {
          clearAuthStorage();
          throw new Error("Tài khoản đã bị khóa");
        }

        // Điều hướng theo role
        router.push(userData.role === "admin" ? "/admin/dashboard" : "/profile");
      } else {
        throw new Error(data.detail || "Sai thông tin đăng nhập");
      }
    } catch (err) {
      console.error("❌ Lỗi đăng nhập:", err.message);
=======
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
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
      throw err;
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // ✅ Đăng ký
=======
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
  const signUp = async (name, email, password) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
<<<<<<< HEAD

=======
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
      const data = await response.json();

      if (response.ok) {
        router.push("/signin");
      } else {
<<<<<<< HEAD
        throw new Error(data.detail || "Đăng ký thất bại");
      }
    } catch (err) {
=======
        throw new Error(data.detail || "Failed to create account");
      }
    } catch (err) {
      console.error("❌ Sign-up error:", err.message);
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
      throw err;
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // ✅ Đăng xuất
  const signOut = () => {
    clearAuthStorage();
=======
  const signOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
    router.push("/signin");
  };

  return (
<<<<<<< HEAD
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, signIn, signUp, signOut }}
    >
=======
    <AuthContext.Provider value={{ user, isAuthenticated, loading, signIn, signUp, signOut,refreshUser   }}>
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
      {children}
    </AuthContext.Provider>
  );
}

<<<<<<< HEAD
// ✅ Hook sử dụng Auth trong component
=======
>>>>>>> 0463c946b4ff837dfbe2f4d26bf6c9d6bdddede6
export const useAuth = () => useContext(AuthContext);
