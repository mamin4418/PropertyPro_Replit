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
  ClipboardCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeSwitch from "./ThemeSwitch";
import { useAuth } from "@/hooks/use-auth";

interface SidebarNavItemProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  indented?: boolean;
}

function SidebarNavItem({ href, icon: Icon, children, indented = false }: SidebarNavItemProps) {
  const [location] = useLocation();
  const isActive = location === href || (href !== "/" && location.startsWith(href));

  return (
    <div className={cn(
          "flex items-center py-2 px-3 rounded-md hover:bg-secondary",
          isActive && "bg-secondary text-primary font-medium",
          indented && "ml-4 text-sm"
        )} onClick={() => window.location.href = href}>
      <Icon className="h-5 w-5 mr-3" />
      <span>{children}</span>
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

      <nav className="mt-6 space-y-1 px-2 flex-1 overflow-auto">
        <div className="py-2">
          <SidebarNavItem href="/" icon={LayoutDashboard}>
            Dashboard
          </SidebarNavItem>
        </div>

        <div className="pt-4 pb-2">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground">PROPERTY MANAGEMENT</h3>
        </div>

        <SidebarNavItem href="/companies" icon={Building}>
          Companies
        </SidebarNavItem>

        <SidebarNavItem href="/properties" icon={Home}>
          Properties
        </SidebarNavItem>

        <div className="pt-2">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground">Rent</h3>
          <SidebarNavItem href="/rent/charges" icon={DollarSign} indented>
            View All Charges
          </SidebarNavItem>
          <SidebarNavItem href="/rent/deposits" icon={DollarSign} indented>
            View Deposits
          </SidebarNavItem>
          <SidebarNavItem href="/rent/add-charge" icon={DollarSign} indented>
            Add Charge or Lease
          </SidebarNavItem>
          <SidebarNavItem href="/rent/late-fee-rules" icon={DollarSign} indented>
            Manage Late Fee Rules
          </SidebarNavItem>
          <SidebarNavItem href="/rent/export" icon={DollarSign} indented>
            Export Charges
          </SidebarNavItem>
          <SidebarNavItem href="/rent/roll" icon={DollarSign} indented>
            View Rent Roll
          </SidebarNavItem>
        </div>


        <SidebarNavItem href="/tenants" icon={Users} indented>
          Tenants
        </SidebarNavItem>

        <SidebarNavItem href="/leases" icon={FileText} indented>
          Leases
        </SidebarNavItem>

        <SidebarNavItem href="/document-signing" icon={FileText} indented>
          Documents & Signing
        </SidebarNavItem>

        <SidebarNavItem href="/maintenance" icon={Wrench} indented>
          Maintenance
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

        <div className="pt-4 pb-2">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground">UTILITIES</h3>
        </div>

        <SidebarNavItem href="/utilities" icon={Zap}>
          Utilities
        </SidebarNavItem>


        <div className="pt-4 pb-2">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground">PROPERTY INSPECTIONS</h3>
        </div>

        <SidebarNavItem href="/property-inspections" icon={ClipboardCheck}>
          Inspections
        </SidebarNavItem>


        <div className="pt-4 pb-2">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground">CONTACTS</h3>
        </div>

        <SidebarNavItem href="/contacts" icon={Contact}>
          Contacts
        </SidebarNavItem>

        <SidebarNavItem href="/vendors" icon={User}>
          Vendors
        </SidebarNavItem>

        <div className="pt-4 pb-2">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground">LEASING</h3>
        </div>

        <SidebarNavItem href="/leads" icon={UserCheck}>
          Leads
        </SidebarNavItem>

        <SidebarNavItem href="/applications" icon={FileText}>
          Applications
        </SidebarNavItem>

        <SidebarNavItem href="/vacancy-listing" icon={Home}>
          Vacancies
        </SidebarNavItem>

        <div className="pt-4 pb-2">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground">ACCOUNTING</h3>
        </div>

        <SidebarNavItem href="/banking" icon={Building}>
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

        <div className="pt-4 pb-2">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground">REPORTS</h3>
        </div>

        <SidebarNavItem href="/reports" icon={BarChart3}>
          Reports
        </SidebarNavItem>

        <div className="pt-4 pb-2">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground">SYSTEM</h3>
        </div>

        <SidebarNavItem href="/settings" icon={Settings}>
          Settings
        </SidebarNavItem>
      </nav>

      <div className="p-4 border-t flex flex-col gap-4">
        {user ? (
          <button
            onClick={() => logout()}
            className="flex items-center py-2 px-3 rounded-md hover:bg-secondary"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span>Logout</span>
          </button>
        ) : (
          <div className="flex items-center py-2 px-3 rounded-md hover:bg-secondary" onClick={() => window.location.href = "/auth"}>
              <LogOut className="h-5 w-5 mr-3" />
              <span>Login</span>
          </div>
        )}
      </div>
    </div>
  );
}