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

  // Apply theme whenever it changes
  useEffect(() => {
    const themeClasses = [
      "default",
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

    // Remove all theme classes first
    document.documentElement.classList.remove(...themeClasses);

    // Apply the new theme
    document.documentElement.classList.add(currentTheme);

    // Store in localStorage
    localStorage.setItem("pms-theme", currentTheme);

    console.log("Applied theme:", currentTheme);
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