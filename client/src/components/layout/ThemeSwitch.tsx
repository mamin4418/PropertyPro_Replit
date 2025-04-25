import { useState, useEffect } from 'react';

// Define available themes
type Theme = 'default' | 'dark-theme' | 'forest-theme' | 'ocean-theme' | 'sunset-theme';

// Different theme options with display names and gradient colors
const themeOptions: {
  id: Theme;
  name: string;
  gradient: string;
}[] = [
  { id: 'default', name: 'Default', gradient: 'bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6]' },
  { id: 'dark-theme', name: 'Dark', gradient: 'bg-gradient-to-br from-[#111827] to-[#1F2937]' },
  { id: 'forest-theme', name: 'Forest', gradient: 'bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7]' },
  { id: 'ocean-theme', name: 'Ocean', gradient: 'bg-gradient-to-br from-[#ECFEFF] to-[#CFFAFE]' },
  { id: 'sunset-theme', name: 'Sunset', gradient: 'bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5]' }
];

const ThemeSwitch = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pms-theme') as Theme | null;
      if (saved && themeOptions.some(t => t.id === saved)) {
        return saved;
      }
    }
    return 'default';
  });

  // Apply theme when it changes
  useEffect(() => {
    // Remove all theme classes first
    document.documentElement.classList.remove(...themeOptions.map(t => t.id).filter(id => id !== 'default'));
    
    // Apply new theme class (if not default)
    if (theme !== 'default') {
      document.documentElement.classList.add(theme);
    }
    
    // Store preference
    localStorage.setItem('pms-theme', theme);
    
    console.log('Theme applied:', theme);
  }, [theme]);

  // Handle theme change
  const handleThemeChange = (newTheme: Theme) => {
    console.log('Changing theme to:', newTheme);
    setTheme(newTheme);
  };

  return (
    <div>
      <div className="mb-2 text-sm font-medium">Theme</div>
      <div className="grid grid-cols-5 gap-2">
        {themeOptions.map((themeOption) => (
          <button
            key={themeOption.id}
            onClick={() => handleThemeChange(themeOption.id)}
            className={`h-8 rounded-md border-2 transition-all ${
              theme === themeOption.id 
                ? 'border-primary scale-110' 
                : 'border-border hover:border-primary/50'
            } ${themeOption.gradient}`}
            title={themeOption.name}
            aria-label={`Switch to ${themeOption.name} theme`}
          />
        ))}
      </div>
      <div className="text-xs text-muted-foreground mt-2">
        Current: {themeOptions.find(t => t.id === theme)?.name || 'Default'}
      </div>
    </div>
  );
};

export default ThemeSwitch;