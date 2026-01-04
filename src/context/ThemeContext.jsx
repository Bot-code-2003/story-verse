// src/components/ThemeContext.jsx
"use client";

import React, { createContext, useState, useEffect, useContext } from "react";

// 1. Create the Context
const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

// Helper function to apply the theme attribute globally
const applyTheme = (theme) => {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }
};

// 2. Create the Provider Component
export function ThemeProvider({ children }) {
  // Track user authentication status
  const [user, setUser] = useState(null);

  // 3. Initialize state from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  // Monitor user authentication status
  useEffect(() => {
    const checkUser = () => {
      try {
        const raw = localStorage.getItem("sf_user");
        setUser(raw ? JSON.parse(raw) : null);
      } catch (e) {
        setUser(null);
      }
    };

    // Initial check
    checkUser();

    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener("storage", checkUser);
    
    // Listen for custom event when user logs in/out in the same tab
    window.addEventListener("authChange", checkUser);

    return () => {
      window.removeEventListener("storage", checkUser);
      window.removeEventListener("authChange", checkUser);
    };
  }, []);

  // 4. Force light theme when user is not logged in
  useEffect(() => {
    if (!user) {
      // User is not logged in - ALWAYS use light theme
      setTheme("light");
      applyTheme("light");
    }
  }, [user]);

  // 5. Apply theme whenever the state changes (and on initial mount)
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // 6. Toggle function (only works when user is logged in)
  const toggleTheme = () => {
    // Only allow theme toggle if user is logged in
    if (!user) return;
    
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      return newTheme;
    });
  };

  const contextValue = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// 6. Custom Hook for easy access
export const useTheme = () => useContext(ThemeContext);
