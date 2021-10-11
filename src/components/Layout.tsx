import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Footer from "./Footer";
import { FiSun, FiMoon } from "react-icons/fi";
export default function Layout({ children }) {
  const [isMounted, setIsMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  useEffect(() => setIsMounted(true), []);

  return (
    <div className="flex flex-col justify-center mx-auto px-4 max-w-6xl relative">
      {/* <Header /> */}
      <div className="absolute top-4 right-4">
        <button
          aria-label="Toggle Dark Mode"
          type="button"
          className="w-9 h-9 bg-gray-200 rounded-lg dark:bg-green-custom flex items-center justify-center  hover:ring-2 ring-gray-300  transition-all"
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
      </div>
      {children}
      <Footer />
    </div>
  );
}
