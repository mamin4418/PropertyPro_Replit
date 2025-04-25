import { useState } from "react";
import { useLocation } from "wouter";
import { Menu, Bell, User, ChevronDown } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  toggleSidebar: () => void;
  isMobile?: boolean;
}

const Header = ({ toggleSidebar, isMobile = false }: HeaderProps) => {
  const [location] = useLocation();
  const pageName = location === "/" 
    ? "Dashboard" 
    : location.split("/")[1].charAt(0).toUpperCase() + location.split("/")[1].slice(1).replace(/-/g, ' ');
  
  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden bg-card shadow-sm flex items-center justify-between p-4 sticky top-0 z-30">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-muted-foreground hover:bg-secondary"
          >
            <Menu size={20} />
          </button>
          <div className="ml-3 font-semibold text-xl">PMS</div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-md text-muted-foreground hover:bg-secondary">
            <Bell size={20} />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:flex items-center justify-between p-4 bg-card shadow-sm sticky top-0 z-20">
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
              <span>Admin User</span>
              <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
};

export default Header;
