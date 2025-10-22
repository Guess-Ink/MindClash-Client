/**
 * ============================================
 * USETHEME.JS - Custom Hook for Theme Context
 * ============================================
 * Custom hook untuk mengakses ThemeContext
 */

import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

/**
 * Hook untuk mengakses theme context
 * @returns {Object} - { theme, toggleTheme }
 * @throws {Error} - Jika digunakan di luar ThemeProvider
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
