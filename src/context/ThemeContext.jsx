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
  // 3. Initialize state from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  // 4. Apply theme whenever the state changes (and on initial mount)
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // 5. Toggle function
  const toggleTheme = () => {
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
