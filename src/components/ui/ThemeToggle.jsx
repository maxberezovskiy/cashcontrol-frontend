import { useEffect, useState } from "react";

const KEY = "cc_theme";

function getInitial() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getInitial);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* localStorage недоступен — тема просто не запомнится */
    }
  }, [theme]);

  const isDark = theme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="text-lg leading-none text-gray-500 hover:text-gray-900 transition-colors"
      title={isDark ? "Светлая тема" : "Тёмная тема"}
      aria-label="Переключить тему"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
