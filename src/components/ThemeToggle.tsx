"use client";

import * as React from "react";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle = () => {
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = storedTheme === "dark" || (!storedTheme && prefersDark);
    setEnabled(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !enabled;
    setEnabled(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300
        ${enabled ? "bg-neutral-700" : "bg-gray-300"}`}
    >
      <span
        className={`absolute left-1 top-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md transform transition-transform duration-300
          ${enabled ? "translate-x-6 bg-black" : "translate-x-0 bg-white"}`}
      >
        {enabled ? (
          <Moon className="w-4 h-4 text-blue-400" />
        ) : (
          <Sun className="w-4 h-4 text-yellow-400" />
        )}
      </span>
    </button>
  );
};
