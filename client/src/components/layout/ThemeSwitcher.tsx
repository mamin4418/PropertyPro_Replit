import { useTheme } from "@/hooks/use-theme";

const ThemeSwitcher = () => {
  const { currentTheme, changeTheme } = useTheme();
  
  const themes = [
    { id: "default", gradient: "bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6]" },
    { id: "dark-theme", gradient: "bg-gradient-to-br from-[#111827] to-[#1F2937]" },
    { id: "forest-theme", gradient: "bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7]" },
    { id: "ocean-theme", gradient: "bg-gradient-to-br from-[#ECFEFF] to-[#CFFAFE]" },
    { id: "sunset-theme", gradient: "bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5]" }
  ];
  
  return (
    <div>
      <div className="mb-2 text-sm font-medium">Theme</div>
      <div className="grid grid-cols-5 gap-2">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => changeTheme(theme.id as any)}
            className={`h-8 rounded-md border-2 transition-all ${
              currentTheme === theme.id 
                ? "border-primary scale-110" 
                : "border-border"
            } ${theme.gradient}`}
            aria-label={`Switch to ${theme.id} theme`}
          />
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
