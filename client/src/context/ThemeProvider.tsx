
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

  // Effect to apply theme when it changes
  useEffect(() => {
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
      
      // Apply to html element
      document.documentElement.classList.remove(...themeClasses);
      if (theme !== "default") {
        document.documentElement.classList.add(theme);
      }
      
      // Apply to body
      document.body.classList.remove(...themeClasses);
      if (theme !== "default") {
        document.body.classList.add(theme);
      }
      
      // Apply to root element
      const rootElement = document.querySelector('.app-root');
      if (rootElement) {
        rootElement.classList.remove(...themeClasses);
        if (theme !== "default") {
          rootElement.classList.add(theme);
        }
        console.log("Root element classes:", rootElement.className);
      }
      
      // Save to localStorage
      localStorage.setItem("pms-theme", theme);
      
      console.log("Applied theme:", theme);
    };
    
    applyTheme(currentTheme);
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
