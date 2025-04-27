
import React, { createContext, useState, useEffect } from "react";

type Theme = "default" | "dark-theme" | "forest-theme" | "ocean-theme" | "sunset-theme" | 
  "lavender-theme" | "honey-theme" | "sky-theme" | "mint-theme" | "atom-theme";

interface ThemeContextType {
  currentTheme: Theme;
  changeTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  currentTheme: "default",
  changeTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize theme from localStorage
  const getInitialTheme = (): Theme => {
    // Check for localStorage support
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("pms-theme") as Theme | null;
      if (savedTheme && [
        "default", "dark-theme", "forest-theme", "ocean-theme", "sunset-theme",
        "lavender-theme", "honey-theme", "sky-theme", "mint-theme", "atom-theme"
      ].includes(savedTheme)) {
        return savedTheme;
      }
    }
    return "default";
  };
  
  const [currentTheme, setCurrentTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    // Apply theme globally to document and all potential root elements
    const applyTheme = (theme: Theme) => {
      const themeClasses = [
        "dark-theme", 
        "forest-theme", 
        "ocean-theme", 
        "sunset-theme",
        "lavender-theme",
        "honey-theme",
        "sky-theme",
        "mint-theme",
        "atom-theme"
      ];
      
      // Remove all theme classes from document element (html)
      document.documentElement.classList.remove(...themeClasses);
      
      // Remove all theme classes from body
      document.body.classList.remove(...themeClasses);
      
      // Apply to app root if it exists
      const rootElement = document.querySelector('.app-root');
      if (rootElement) {
        rootElement.classList.remove(...themeClasses);
        if (theme !== "default") {
          rootElement.classList.add(theme);
        }
      }
      
      // Apply to document and body for maximum coverage
      if (theme !== "default") {
        document.documentElement.classList.add(theme);
        document.body.classList.add(theme);
      }
      
      console.log("Applied theme:", theme);
      console.log("Applied to elements:", document.querySelectorAll(`.${theme}`).length);
    };
    
    // Apply theme immediately
    applyTheme(currentTheme);
    
    // Save theme preference to localStorage
    localStorage.setItem("pms-theme", currentTheme);
  }, [currentTheme]);

  const changeTheme = (theme: Theme) => {
    console.log("ThemeProvider changeTheme called with:", theme);
    setCurrentTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
