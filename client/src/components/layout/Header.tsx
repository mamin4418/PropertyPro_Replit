import { useLocation } from "wouter";
import { Bell, User, ChevronDown } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [location] = useLocation();
  const pageName = location === "/" 
    ? "Dashboard" 
    : location.split("/")[1].charAt(0).toUpperCase() + location.split("/")[1].slice(1).replace(/-/g, ' ');
  
  return (
    <header className="bg-card shadow-sm flex items-center justify-between p-4 sticky top-0 z-20">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold">{pageName}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-md text-muted-foreground hover:bg-secondary">
          <Bell size={20} />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center space-x-2 focus:outline-none">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="hidden md:inline">Admin User</span>
            <ChevronDown className="w-4 h-4 hidden md:inline" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
