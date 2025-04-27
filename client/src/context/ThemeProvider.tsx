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
    // Apply theme to the app root element
    const applyTheme = (theme: Theme) => {
      // Get the root element
      const rootElement = document.querySelector('.app-root');
      
      if (!rootElement) {
        console.error("Root element not found for theme application");
        return;
      }
      
      // First remove all theme classes
      rootElement.classList.remove(
        "dark-theme", 
        "forest-theme", 
        "ocean-theme", 
        "sunset-theme",
        "lavender-theme",
        "honey-theme",
        "sky-theme",
        "mint-theme",
        "atom-theme"
      );
      
      // Then add the current theme if it's not default
      if (theme !== "default") {
        rootElement.classList.add(theme);
      }
      
      // For backwards compatibility, also apply to body
      document.body.classList.remove(
        "dark-theme", 
        "forest-theme", 
        "ocean-theme", 
        "sunset-theme",
        "lavender-theme",
        "honey-theme",
        "sky-theme",
        "mint-theme",
        "atom-theme"
      );
      
      if (theme !== "default") {
        document.body.classList.add(theme);
      }
      
      console.log("Applied theme:", theme);
      console.log("Root element classes:", rootElement.className);
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
