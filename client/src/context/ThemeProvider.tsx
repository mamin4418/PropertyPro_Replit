import React, { createContext, useState, useEffect } from "react";

type Theme = "default" | "dark-theme" | "forest-theme" | "ocean-theme" | "sunset-theme";

interface ThemeContextType {
  currentTheme: Theme;
  changeTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  currentTheme: "default",
  changeTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    // Get theme from localStorage if available
    const savedTheme = localStorage.getItem("pms-theme") as Theme | null;
    return savedTheme || "default";
  });

  useEffect(() => {
    // Apply theme to body element
    document.body.className = "";
    if (currentTheme !== "default") {
      document.body.classList.add(currentTheme);
    }

    // Save theme preference to localStorage
    localStorage.setItem("pms-theme", currentTheme);
  }, [currentTheme]);

  const changeTheme = (theme: Theme) => {
    setCurrentTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
