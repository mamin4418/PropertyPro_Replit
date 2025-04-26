import { useLocation } from "wouter";
import { Bell, User, ChevronDown, LogOut, Settings } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";

const Header = () => {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  const pageName = location === "/" 
    ? "Dashboard" 
    : location.split("/")[1].charAt(0).toUpperCase() + location.split("/")[1].slice(1).replace(/-/g, ' ');
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <header className="bg-card shadow-sm flex items-center justify-between p-4 z-20 border-b border-border">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold">{pageName}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-md text-muted-foreground hover:bg-secondary">
          <Bell size={20} />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="hidden md:inline">{user?.username || "User"}</span>
            <ChevronDown className="w-4 h-4 hidden md:inline" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = "/settings"}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
