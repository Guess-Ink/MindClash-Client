/**
 * ============================================
 * THEMECONTEXT.JSX - Theme Management Context
 * ============================================
 * Context untuk manage theme state (light/dark mode)
 * Menyediakan:
 * - theme: current theme ("light" atau "dark")
 * - toggleTheme: function untuk toggle theme
 * - Theme persisted di localStorage
 */

import { createContext, useState, useEffect } from "react";

// ============================================
// CREATE CONTEXT
// ============================================
const ThemeContext = createContext();

// ============================================
// THEME PROVIDER COMPONENT
// ============================================
export function ThemeProvider({ children }) {
  // Initialize theme dari localStorage atau default ke "dark"
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "dark";
  });

  // Effect untuk apply theme ke document root dan save ke localStorage
  useEffect(() => {
    // Apply theme class ke document root
    document.documentElement.setAttribute("data-theme", theme);
    
    // Save theme preference ke localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Function untuk toggle theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Context value yang akan di-provide
  const value = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// Export context untuk digunakan di custom hook
export { ThemeContext };
