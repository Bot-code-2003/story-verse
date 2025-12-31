"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sf_user");
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  const signup = async ({ email, password }) => {
    // Use a fetch with timeout to avoid UI hanging indefinitely
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    let res;
    try {
      res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });
    } catch (e) {
      if (e.name === "AbortError") throw new Error("Signup request timed out");
      throw e;
    } finally {
      clearTimeout(timeout);
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Signup failed");
    }
    const data = await res.json();
    setUser(data);
    localStorage.setItem("sf_user", JSON.stringify(data));
    return data;
  };

  const login = async ({ email, password }) => {
    // Use a fetch with timeout to avoid UI hanging indefinitely
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s

    let res;
    try {
      res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });
    } catch (e) {
      if (e.name === "AbortError") throw new Error("Login request timed out");
      throw e;
    } finally {
      clearTimeout(timeout);
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Login failed");
    }
    const data = await res.json();
    setUser(data);
    localStorage.setItem("sf_user", JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("sf_user");
      // Reset theme to light on logout
      localStorage.setItem("theme", "light");
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-theme", "light");
      }
    } catch (e) {}
    // Use window.location for hard redirect to ensure clean logout
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
