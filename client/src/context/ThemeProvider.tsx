
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
    // Apply theme to the document body and html element
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
      
      // Remove all theme classes
      document.documentElement.classList.remove(...themeClasses);
      document.body.classList.remove(...themeClasses);
      
      // Apply the theme class if it's not default
      if (theme !== "default") {
        document.documentElement.classList.add(theme);
        document.body.classList.add(theme);
      }
      
      // Apply to app root if it exists
      const appRoot = document.querySelector('#root');
      if (appRoot) {
        appRoot.classList.remove(...themeClasses);
        if (theme !== "default") {
          appRoot.classList.add(theme);
        }
      }

      // Store in localStorage
      localStorage.setItem("pms-theme", theme);
      
      console.log("Theme applied:", theme);
    };
    
    // Apply theme immediately and save preference
    applyTheme(currentTheme);
  }, [currentTheme]);

  const changeTheme = (theme: Theme) => {
    console.log("Changing theme to:", theme);
    setCurrentTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
