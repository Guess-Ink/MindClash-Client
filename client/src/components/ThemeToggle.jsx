/**
 * ============================================
 * THEMETOGGLE.JSX - Theme Toggle Button
 * ============================================
 * Button component untuk toggle theme antara light/dark mode
 * Menggunakan useTheme hook dari ThemeContext
 */

import { useTheme } from "../hooks/useTheme";
import "./ThemeToggle.css";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
