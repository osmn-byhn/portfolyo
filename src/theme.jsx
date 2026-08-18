import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "death",
  toggleTheme: () => {},
  isLife: false,
});

const STORAGE_KEY = "ob-theme";

function getInitialTheme() {
  if (typeof window === "undefined") return "death";
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "life" || saved === "death") return saved;
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "life"
    : "death";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => (t === "life" ? "death" : "life"));
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, isLife: theme === "life" }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
