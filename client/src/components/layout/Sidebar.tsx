
import { useLocation } from "wouter";
import {
  LayoutDashboard,
  Home,
  Users,
  ClipboardList,
  DollarSign,
  Wrench,
  User,
  Settings,
  FileText,
  BarChart3,
  Building,
  Building2,
  Contact,
  UserCheck,
  LogOut,
  Shield,
  Menu as MenuIcon,
  Zap,
  ClipboardCheck,
  ChevronDown,
  ChevronRight,
  Binary,
  UtilityPole
} from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeSwitch from "./ThemeSwitch";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

interface SidebarNavItemProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  indented?: boolean;
}

interface SidebarCategoryProps {
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function SidebarNavItem({ href, icon: Icon, children, indented = false }: SidebarNavItemProps) {
  const [location] = useLocation();
  const isActive = location === href || (href !== "/" && location.startsWith(href));

  return (
    <div className={cn(
          "flex items-center py-2 px-3 rounded-md hover:bg-secondary cursor-pointer",
          isActive && "bg-secondary text-primary font-medium",
          indented && "ml-4 text-sm"
        )} onClick={() => window.location.href = href}>
      <Icon className="h-5 w-5 mr-3" />
      <span>{children}</span>
    </div>
  );
}

function SidebarCategory({ title, icon: Icon, children, defaultOpen = false }: SidebarCategoryProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="mb-2">
      <div 
        className="flex items-center px-3 py-2 text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground"
        onClick={() => setIsOpen(!isOpen)}
      >
        {Icon && <Icon className="h-4 w-4 mr-2" />}
        <span>{title}</span>
        {isOpen ? 
          <ChevronDown className="h-4 w-4 ml-auto" /> : 
          <ChevronRight className="h-4 w-4 ml-auto" />
        }
      </div>
      {isOpen && (
        <div className="mt-1 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
}

// Using Building icon as our bank icon instead
const BankIcon = Building;

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <div className="sidebar-container flex flex-col h-full">
      <div className="p-3 flex items-center justify-center lg:justify-start">
        <Building2 className="h-6 w-6 mr-2" />
        <span className="text-xl font-semibold hidden lg:inline-block">PropManager</span>
      </div>

      <nav className="mt-3 px-2 flex-1 overflow-auto">
        <div className="py-2">
          <SidebarNavItem href="/" icon={LayoutDashboard}>
            Dashboard
          </SidebarNavItem>
        </div>

        <SidebarCategory title="PROPERTIES" icon={Building2} defaultOpen={true}>
          <SidebarNavItem href="/companies" icon={Building}>
            Companies
          </SidebarNavItem>
          <SidebarNavItem href="/properties" icon={Home}>
            Properties
          </SidebarNavItem>
          <SidebarNavItem href="/units" icon={Home} indented>
            Units
          </SidebarNavItem>
          <SidebarNavItem href="/appliances" icon={Wrench} indented>
            Appliances
          </SidebarNavItem>
          <SidebarNavItem href="/insurances" icon={Shield} indented>
            Insurance
          </SidebarNavItem>
          <SidebarNavItem href="/mortgages" icon={DollarSign} indented>
            Mortgages
          </SidebarNavItem>
        </SidebarCategory>

        <SidebarCategory title="TENANTS & LEASES" icon={Users}>
          <SidebarNavItem href="/tenants" icon={Users}>
            Tenants
          </SidebarNavItem>
          <SidebarNavItem href="/leases" icon={FileText}>
            Leases
          </SidebarNavItem>
          <SidebarNavItem href="/document-signing" icon={FileText}>
            Documents & Signing
          </SidebarNavItem>
        </SidebarCategory>

        <SidebarCategory title="FINANCIAL" icon={DollarSign}>
          <SidebarNavItem href="/rent/charges" icon={DollarSign}>
            Rent Charges
          </SidebarNavItem>
          <SidebarNavItem href="/rent/deposits" icon={DollarSign}>
            Deposits
          </SidebarNavItem>
          <SidebarNavItem href="/rent/add-charge" icon={DollarSign}>
            Add Charge/Lease
          </SidebarNavItem>
          <SidebarNavItem href="/rent/late-fee-rules" icon={DollarSign}>
            Late Fee Rules
          </SidebarNavItem>
          <SidebarNavItem href="/rent/export" icon={DollarSign}>
            Export Charges
          </SidebarNavItem>
          <SidebarNavItem href="/rent/roll" icon={DollarSign}>
            Rent Roll
          </SidebarNavItem>
          <SidebarNavItem href="/banking" icon={BankIcon}>
            Banking
          </SidebarNavItem>
          <SidebarNavItem href="/banking/accounts" icon={DollarSign} indented>
            Accounts
          </SidebarNavItem>
          <SidebarNavItem href="/banking/transactions" icon={DollarSign} indented>
            Transactions
          </SidebarNavItem>
          <SidebarNavItem href="/banking/integration" icon={DollarSign} indented>
            Bank Integration
          </SidebarNavItem>
        </SidebarCategory>

        <SidebarCategory title="MAINTENANCE" icon={Wrench}>
          <SidebarNavItem href="/maintenance" icon={Wrench}>
            Maintenance Requests
          </SidebarNavItem>
          <SidebarNavItem href="/property-inspections" icon={ClipboardCheck}>
            Property Inspections
          </SidebarNavItem>
          <SidebarNavItem href="/utilities" icon={UtilityPole}>
            Utilities
          </SidebarNavItem>
        </SidebarCategory>

        <SidebarCategory title="LEASING" icon={FileText}>
          <SidebarNavItem href="/leads" icon={UserCheck}>
            Leads
          </SidebarNavItem>
          <SidebarNavItem href="/applications" icon={FileText}>
            Applications
          </SidebarNavItem>
          <SidebarNavItem href="/vacancy-listing" icon={Home}>
            Vacancies
          </SidebarNavItem>
        </SidebarCategory>

        <SidebarCategory title="CONTACTS" icon={Contact}>
          <SidebarNavItem href="/contacts" icon={Contact}>
            Contacts
          </SidebarNavItem>
          <SidebarNavItem href="/vendors" icon={User}>
            Vendors
          </SidebarNavItem>
        </SidebarCategory>

        <SidebarCategory title="TASKS" icon={ClipboardList}>
          <SidebarNavItem href="/tasks" icon={ClipboardList}>
            Tasks Overview
          </SidebarNavItem>
          <SidebarNavItem href="/tasks/add" icon={ClipboardList}>
            Add Task
          </SidebarNavItem>
          <SidebarNavItem href="/tasks/all" icon={ClipboardList}>
            View All Tasks
          </SidebarNavItem>
        </SidebarCategory>

        <SidebarCategory title="REPORTS" icon={BarChart3}>
          <SidebarNavItem href="/reports" icon={BarChart3}>
            Reports
          </SidebarNavItem>
        </SidebarCategory>

        <div className="py-2 mt-2">
          <SidebarNavItem href="/settings" icon={Settings}>
            Settings
          </SidebarNavItem>
        </div>
      </nav>

      <div className="p-3 border-t">
        <ThemeSwitch />
      </div>
    </div>
  );
}
