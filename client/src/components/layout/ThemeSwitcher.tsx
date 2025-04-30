
import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/use-theme';

const ThemeSwitcher = () => {
  const { currentTheme, changeTheme } = useTheme();
  const [activeTheme, setActiveTheme] = useState(currentTheme);
  
  useEffect(() => {
    setActiveTheme(currentTheme);
  }, [currentTheme]);
  
  const themes = [
    { id: "default", name: "Default", gradient: "bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6]" },
    { id: "dark-theme", name: "Dark", gradient: "bg-gradient-to-br from-[#111827] to-[#1F2937]" },
    { id: "forest-theme", name: "Forest", gradient: "bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7]" },
    { id: "ocean-theme", name: "Ocean", gradient: "bg-gradient-to-br from-[#ECFEFF] to-[#CFFAFE]" },
    { id: "sunset-theme", name: "Sunset", gradient: "bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5]" },
    // Additional themes
    { id: "lavender-theme", name: "Lavender", gradient: "bg-gradient-to-br from-[#fbf1ff] to-[#f5e0ff]" },
    { id: "honey-theme", name: "Honey", gradient: "bg-gradient-to-br from-[#fffbeb] to-[#fef3c7]" },
    { id: "sky-theme", name: "Sky", gradient: "bg-gradient-to-br from-[#e8fbff] to-[#c4f5ff]" },
    { id: "mint-theme", name: "Mint", gradient: "bg-gradient-to-br from-[#fbffe8] to-[#e9ffc4]" },
    { id: "atom-theme", name: "Atom One", gradient: "bg-gradient-to-br from-[#282c34] to-[#21252b]" }
  ];
  
  const handleThemeChange = (themeId) => {
    changeTheme(themeId);
    setActiveTheme(themeId);
  };
  
  return (
    <div>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {themes.slice(0, 5).map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            className={`h-14 rounded-md border-2 transition-all ${
              activeTheme === theme.id 
                ? "border-primary scale-105" 
                : "border-border hover:border-primary/50"
            } ${theme.gradient}`}
            title={theme.name}
            aria-label={`Switch to ${theme.name} theme`}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-5 gap-2">
        {themes.slice(5).map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            className={`h-14 rounded-md border-2 transition-all ${
              activeTheme === theme.id 
                ? "border-primary scale-105" 
                : "border-border hover:border-primary/50"
            } ${theme.gradient}`}
            title={theme.name}
            aria-label={`Switch to ${theme.name} theme`}
          />
        ))}
      </div>
      
      <div className="text-xs text-muted-foreground mt-2">
        Current: {themes.find(t => t.id === activeTheme)?.name || "Default"}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
