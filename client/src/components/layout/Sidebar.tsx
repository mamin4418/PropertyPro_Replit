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
  Hammer,
  Store,
  BookUser,
  Contact
} from "lucide-react";
import ThemeSwitch from "./ThemeSwitch";

interface NavLinkProps {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
  className?: string;
}

// Custom navigation link that doesn't use nested <a> tags
const NavLink = ({ href, isActive, children, className = "" }: NavLinkProps) => {
  return (
    <Link href={href}>
      <div 
        className={`w-full cursor-pointer flex items-center p-3 rounded-md transition-colors ${
          isActive ? "bg-primary/10 text-primary" : "hover:bg-secondary"
        } ${className}`}
      >
        {children}
      </div>
    </Link>
  );
};

interface SubNavLinkProps {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}

// Sub-navigation link for dropdowns
const SubNavLink = ({ href, isActive, children }: SubNavLinkProps) => {
  return (
    <Link href={href}>
      <div 
        className={`w-full cursor-pointer text-left p-2 rounded-md transition-colors ${
          isActive ? "bg-primary/5 text-primary" : "hover:bg-secondary"
        }`}
      >
        {children}
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const [location] = useLocation();
  const currentPage = location.split("/")[1] || "dashboard";
  
  const [propertiesOpen, setPropertiesOpen] = useState(
    ["properties", "add-property"].includes(currentPage)
  );
  const [contactsOpen, setContactsOpen] = useState(
    ["contacts", "add-contact", "view-contact", "edit-contact", "tenants", "add-tenant", "vendors", "add-vendor"].includes(currentPage)
  );

  return (
    <div className="h-full flex flex-col pt-0 lg:pt-4">
      {/* Logo (desktop only) */}
      <div className="hidden lg:flex items-center p-4">
        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
          PM
        </div>
        <div className="ml-3 font-semibold text-xl">PropManager</div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {/* Dashboard */}
        <NavLink href="/dashboard" isActive={currentPage === "dashboard"}>
          <Home className="w-5 h-5" />
          <span className="ml-3">Dashboard</span>
        </NavLink>
        
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
              <SubNavLink href="/properties" isActive={currentPage === "properties"}>
                All Properties
              </SubNavLink>
              <SubNavLink href="/add-property" isActive={currentPage === "add-property"}>
                Add Property
              </SubNavLink>
            </div>
          )}
        </div>
        
        {/* Leases */}
        <NavLink href="/leases" isActive={currentPage === "leases"}>
          <FileText className="w-5 h-5" />
          <span className="ml-3">Leases</span>
        </NavLink>
        
        {/* Payments */}
        <NavLink href="/payments" isActive={currentPage === "payments"}>
          <DollarSign className="w-5 h-5" />
          <span className="ml-3">Payments</span>
        </NavLink>
        
        {/* Maintenance */}
        <NavLink href="/maintenance" isActive={currentPage === "maintenance"}>
          <Drill className="w-5 h-5" />
          <span className="ml-3">Maintenance</span>
        </NavLink>
        
        {/* Contacts - Centralized contact management */}
        <div className="space-y-1">
          <button
            onClick={() => setContactsOpen(!contactsOpen)}
            className={`w-full flex items-center justify-between p-3 rounded-md transition-colors ${
              ["contacts", "add-contact", "view-contact", "edit-contact", "tenants", "add-tenant", "vendors", "add-vendor"].includes(currentPage) 
                ? "bg-primary/10 text-primary" 
                : "hover:bg-secondary"
            }`}
          >
            <div className="flex items-center">
              <Contact className="w-5 h-5" />
              <span className="ml-3">Contacts</span>
            </div>
            {contactsOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          
          {contactsOpen && (
            <div className="pl-10 space-y-1">
              <SubNavLink href="/contacts" isActive={currentPage === "contacts"}>
                All Contacts
              </SubNavLink>
              <SubNavLink href="/tenants" isActive={currentPage === "tenants"}>
                All Tenants
              </SubNavLink>
              <SubNavLink href="/vendors" isActive={currentPage === "vendors"}>
                All Vendors
              </SubNavLink>
              <SubNavLink href="/leads" isActive={currentPage === "leads"}>
                Leads
              </SubNavLink>
              <SubNavLink href="/applications" isActive={currentPage === "applications"}>
                Applications
              </SubNavLink>
              <SubNavLink href="/add-contact" isActive={currentPage === "add-contact"}>
                Add Contact
              </SubNavLink>
            </div>
          )}
        </div>
        
        {/* Reports */}
        <NavLink href="/reports" isActive={currentPage === "reports"}>
          <BarChart className="w-5 h-5" />
          <span className="ml-3">Reports</span>
        </NavLink>
        
        {/* Settings */}
        <NavLink href="/settings" isActive={currentPage === "settings"}>
          <Settings className="w-5 h-5" />
          <span className="ml-3">Settings</span>
        </NavLink>
      </nav>
      
      {/* Theme Switcher */}
      <div className="p-4 border-t border-custom mt-auto">
        <ThemeSwitch />
      </div>
    </div>
  );
};

export default Sidebar;
