
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
    { id: "slate-theme", name: "Slate", gradient: "bg-gradient-to-br from-[#EFF1F3] to-[#5D737E]" },
    { id: "navy-theme", name: "Navy", gradient: "bg-gradient-to-br from-[#E6EAEE] to-[#243447]" },
    { id: "slate-blue-theme", name: "Slate Blue", gradient: "bg-gradient-to-br from-[#E6E9FA] to-[#6A5ACD]" },
    { id: "purple-theme", name: "Purple", gradient: "bg-gradient-to-br from-[#f5f3ff] to-[#ddd6fe]" },
    { id: "emerald-theme", name: "Emerald", gradient: "bg-gradient-to-br from-[#ecfdf5] to-[#a7f3d0]" },
    { id: "sky-theme", name: "Sky", gradient: "bg-gradient-to-br from-[#e8fbff] to-[#c4f5ff]" },
    { id: "rose-theme", name: "Rose", gradient: "bg-gradient-to-br from-[#fff1f2] to-[#fecdd3]" },
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
