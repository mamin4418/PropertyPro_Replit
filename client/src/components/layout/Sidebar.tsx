import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Home,
  Building2,
  Users,
  FileText,
  DollarSign,
  Drill,
  BarChart,
  Settings,
  ChevronRight,
  ChevronDown,
  X
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import ThemeSwitcher from "./ThemeSwitcher";

interface SidebarProps {
  open: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ open, toggleSidebar }: SidebarProps) => {
  const [location] = useLocation();
  const currentPage = location.split("/")[1] || "dashboard";
  
  const [propertiesOpen, setPropertiesOpen] = useState(
    ["properties", "add-property"].includes(currentPage)
  );
  const [tenantsOpen, setTenantsOpen] = useState(
    ["tenants", "add-tenant"].includes(currentPage)
  );

  return (
    <aside 
      className={`sidebar fixed top-0 bottom-0 left-0 z-40 w-64 transition-transform duration-300 lg:translate-x-0 border-r border-custom ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="h-full flex flex-col overflow-y-auto">
        {/* Logo */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
              PM
            </div>
            <div className="ml-3 font-semibold text-xl">PropManager</div>
          </div>
          <button 
            onClick={toggleSidebar} 
            className="lg:hidden p-2 rounded-md text-muted-foreground hover:bg-secondary"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {/* Dashboard */}
          <Link href="/dashboard">
            <a
              className={`w-full flex items-center p-3 rounded-md transition-colors ${
                currentPage === "dashboard" ? "bg-primary/10 text-primary" : "hover:bg-secondary"
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="ml-3">Dashboard</span>
            </a>
          </Link>
          
          {/* Properties */}
          <div className="space-y-1">
            <button
              onClick={() => setPropertiesOpen(!propertiesOpen)}
              className={`w-full flex items-center justify-between p-3 rounded-md transition-colors ${
                ["properties", "add-property"].includes(currentPage) 
                  ? "bg-primary/10 text-primary" 
                  : "hover:bg-secondary"
              }`}
            >
              <div className="flex items-center">
                <Building2 className="w-5 h-5" />
                <span className="ml-3">Properties</span>
              </div>
              {propertiesOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            
            {propertiesOpen && (
              <div className="pl-10 space-y-1">
                <Link href="/properties">
                  <a
                    className={`w-full text-left p-2 rounded-md transition-colors ${
                      currentPage === "properties" 
                        ? "bg-primary/5 text-primary" 
                        : "hover:bg-secondary"
                    }`}
                  >
                    All Properties
                  </a>
                </Link>
                <Link href="/add-property">
                  <a
                    className={`w-full text-left p-2 rounded-md transition-colors ${
                      currentPage === "add-property" 
                        ? "bg-primary/5 text-primary" 
                        : "hover:bg-secondary"
                    }`}
                  >
                    Add Property
                  </a>
                </Link>
              </div>
            )}
          </div>
          
          {/* Tenants */}
          <div className="space-y-1">
            <button
              onClick={() => setTenantsOpen(!tenantsOpen)}
              className={`w-full flex items-center justify-between p-3 rounded-md transition-colors ${
                ["tenants", "add-tenant"].includes(currentPage) 
                  ? "bg-primary/10 text-primary" 
                  : "hover:bg-secondary"
              }`}
            >
              <div className="flex items-center">
                <Users className="w-5 h-5" />
                <span className="ml-3">Tenants</span>
              </div>
              {tenantsOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            
            {tenantsOpen && (
              <div className="pl-10 space-y-1">
                <Link href="/tenants">
                  <a
                    className={`w-full text-left p-2 rounded-md transition-colors ${
                      currentPage === "tenants" 
                        ? "bg-primary/5 text-primary" 
                        : "hover:bg-secondary"
                    }`}
                  >
                    All Tenants
                  </a>
                </Link>
                <Link href="/add-tenant">
                  <a
                    className={`w-full text-left p-2 rounded-md transition-colors ${
                      currentPage === "add-tenant" 
                        ? "bg-primary/5 text-primary" 
                        : "hover:bg-secondary"
                    }`}
                  >
                    Add Tenant
                  </a>
                </Link>
              </div>
            )}
          </div>
          
          {/* Leases */}
          <Link href="/leases">
            <a
              className={`w-full flex items-center p-3 rounded-md transition-colors ${
                currentPage === "leases" ? "bg-primary/10 text-primary" : "hover:bg-secondary"
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="ml-3">Leases</span>
            </a>
          </Link>
          
          {/* Payments */}
          <Link href="/payments">
            <a
              className={`w-full flex items-center p-3 rounded-md transition-colors ${
                currentPage === "payments" ? "bg-primary/10 text-primary" : "hover:bg-secondary"
              }`}
            >
              <DollarSign className="w-5 h-5" />
              <span className="ml-3">Payments</span>
            </a>
          </Link>
          
          {/* Maintenance */}
          <Link href="/maintenance">
            <a
              className={`w-full flex items-center p-3 rounded-md transition-colors ${
                currentPage === "maintenance" ? "bg-primary/10 text-primary" : "hover:bg-secondary"
              }`}
            >
              <Drill className="w-5 h-5" />
              <span className="ml-3">Maintenance</span>
            </a>
          </Link>
          
          {/* Reports */}
          <Link href="/reports">
            <a
              className={`w-full flex items-center p-3 rounded-md transition-colors ${
                currentPage === "reports" ? "bg-primary/10 text-primary" : "hover:bg-secondary"
              }`}
            >
              <BarChart className="w-5 h-5" />
              <span className="ml-3">Reports</span>
            </a>
          </Link>
          
          {/* Settings */}
          <Link href="/settings">
            <a
              className={`w-full flex items-center p-3 rounded-md transition-colors ${
                currentPage === "settings" ? "bg-primary/10 text-primary" : "hover:bg-secondary"
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="ml-3">Settings</span>
            </a>
          </Link>
        </nav>
        
        {/* Theme Switcher */}
        <div className="p-4 border-t border-custom">
          <ThemeSwitcher />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
