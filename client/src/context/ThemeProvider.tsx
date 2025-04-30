
import React, { createContext, useState, useEffect } from "react";

type Theme = "default" | "dark-theme" | "forest-theme" | "ocean-theme" | "sunset-theme" | 
  "purple-theme" | "emerald-theme" | "sky-theme" | "rose-theme" | "atom-theme";

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
        "purple-theme", "emerald-theme", "sky-theme", "rose-theme", "atom-theme"
      ].includes(savedTheme)) {
        return savedTheme;
      }
    }
    return "default";
  };

  const [currentTheme, setCurrentTheme] = useState<Theme>(getInitialTheme);

  // Apply theme whenever it changes
  useEffect(() => {
    const applyThemeToElements = () => {
      // List of all possible theme classes
      const themeClasses = [
        "dark-theme", 
        "forest-theme", 
        "ocean-theme", 
        "sunset-theme",
        "purple-theme",
        "emerald-theme",
        "sky-theme",
        "rose-theme",
        "atom-theme"
      ];

      // List of elements to apply theme to
      const elements = [
        document.documentElement, 
        document.body,
        document.querySelector('.app-container'),
        document.querySelector('.app-layout'),
        document.querySelector('.app-sidebar'),
        document.querySelector('.app-main')
      ].filter(Boolean);
      
      // Remove all theme classes from each element
      elements.forEach(el => {
        if (el) {
          el.classList.remove(...themeClasses);
          
          // Add new theme class if not default
          if (currentTheme !== 'default') {
            el.classList.add(currentTheme);
          }
        }
      });
    };

    // Apply the theme
    applyThemeToElements();
    
    // Store in localStorage
    localStorage.setItem("pms-theme", currentTheme);

    // Force reflow with a slight delay to ensure theme is applied
    const timer = setTimeout(() => {
      applyThemeToElements();
    }, 50);
    
    console.log("Applied theme:", currentTheme);
    
    return () => clearTimeout(timer);
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
