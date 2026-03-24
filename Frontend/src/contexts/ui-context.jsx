/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const UIContext = createContext(null);

const getInitialTheme = () => {
  try {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme !== null) return JSON.parse(savedTheme);
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
};

export function UIProvider({ children }) {
  const [isAuthPanelOpen, setIsAuthPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    try {
      localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    } catch {
      // ignore
    }
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({
      isAuthPanelOpen,
      setIsAuthPanelOpen,
      searchQuery,
      setSearchQuery,
      isDarkMode,
      toggleDarkMode,
    }),
    [isAuthPanelOpen, searchQuery, isDarkMode, toggleDarkMode],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}