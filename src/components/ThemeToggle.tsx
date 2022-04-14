import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { FiSun, FiMoon } from "react-icons/fi";

export const ThemeToggle = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  useEffect(() => setIsMounted(true), []);
  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className="w-9 h-9 bg-slate-200 rounded-lg dark:bg-primary-green flex items-center justify-center  hover:ring-2 ring-slate-400  transition-all"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {isMounted && (
        <div>
          {resolvedTheme === "dark" ? (
            <FiSun stroke="currentColor" />
          ) : (
            <FiMoon stroke="currentColor" />
          )}
        </div>
      )}
    </button>
  );
};
