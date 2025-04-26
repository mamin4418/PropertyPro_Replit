
import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Building,
  Building2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Home,
  LayoutDashboard,
  MessageSquare,
  Settings,
  User,
  Users,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const [location] = useLocation();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    companies: true,
    properties: true,
    tenants: true,
    leases: false,
    maintenance: false,
    communications: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isActive = (path: string) => location === path;

  return (
    <div className="h-full w-64 bg-background border-r flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">PropertyPro</h1>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {/* Dashboard */}
          <li>
            <Link href="/dashboard">
              <Button
                variant={isActive("/dashboard") ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </li>

          {/* Companies Section */}
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => toggleSection("companies")}
            >
              <Building2 className="mr-2 h-4 w-4" />
              Companies
              {openSections.companies ? (
                <ChevronDown className="ml-auto h-4 w-4 transition-transform" />
              ) : (
                <ChevronRight className="ml-auto h-4 w-4 transition-transform" />
              )}
            </Button>
            {openSections.companies && (
              <ul className="pl-6 space-y-1 mt-1">
                <li>
                  <Link href="/companies">
                    <Button
                      variant={isActive("/companies") ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      size="sm"
                    >
                      All Companies
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/add-company">
                    <Button
                      variant={isActive("/add-company") ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      size="sm"
                    >
                      Add Company
                    </Button>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Properties Section */}
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => toggleSection("properties")}
            >
              <Building className="mr-2 h-4 w-4" />
              Properties
              {openSections.properties ? (
                <ChevronDown className="ml-auto h-4 w-4 transition-transform" />
              ) : (
                <ChevronRight className="ml-auto h-4 w-4 transition-transform" />
              )}
            </Button>
            {openSections.properties && (
              <ul className="pl-6 space-y-1 mt-1">
                <li>
                  <Link href="/properties">
                    <Button
                      variant={isActive("/properties") ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      size="sm"
                    >
                      All Properties
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/add-property">
                    <Button
                      variant={
                        isActive("/add-property") ? "secondary" : "ghost"
                      }
                      className="w-full justify-start"
                      size="sm"
                    >
                      Add Property
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/manage-units">
                    <Button
                      variant={
                        isActive("/manage-units") ? "secondary" : "ghost"
                      }
                      className="w-full justify-start"
                      size="sm"
                    >
                      Manage Units
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/manage-vacancies">
                    <Button
                      variant={
                        isActive("/manage-vacancies") ? "secondary" : "ghost"
                      }
                      className="w-full justify-start"
                      size="sm"
                    >
                      Vacancies
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/appliances">
                    <Button
                      variant={isActive("/appliances") ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      size="sm"
                    >
                      Appliances
                    </Button>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Tenants Section */}
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => toggleSection("tenants")}
            >
              <Users className="mr-2 h-4 w-4" />
              Contacts
              {openSections.tenants ? (
                <ChevronDown className="ml-auto h-4 w-4 transition-transform" />
              ) : (
                <ChevronRight className="ml-auto h-4 w-4 transition-transform" />
              )}
            </Button>
            {openSections.tenants && (
              <ul className="pl-6 space-y-1 mt-1">
                <li>
                  <Link href="/tenants">
                    <Button
                      variant={isActive("/tenants") ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      size="sm"
                    >
                      Tenants
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/add-tenant">
                    <Button
                      variant={isActive("/add-tenant") ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      size="sm"
                    >
                      Add Tenant
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/leads">
                    <Button
                      variant={isActive("/leads") ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      size="sm"
                    >
                      Leads
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/vendors">
                    <Button
                      variant={isActive("/vendors") ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      size="sm"
                    >
                      Vendors
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/contacts">
                    <Button
                      variant={isActive("/contacts") ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      size="sm"
                    >
                      All Contacts
                    </Button>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Leases Section */}
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => toggleSection("leases")}
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              Leases
              {openSections.leases ? (
                <ChevronDown className="ml-auto h-4 w-4 transition-transform" />
              ) : (
                <ChevronRight className="ml-auto h-4 w-4 transition-transform" />
              )}
            </Button>
            {openSections.leases && (
              <ul className="pl-6 space-y-1 mt-1">
                <li>
                  <Link href="/leases">
                    <Button
                      variant={isActive("/leases") ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      size="sm"
                    >
                      All Leases
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/add-lease">
                    <Button
                      variant={isActive("/add-lease") ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      size="sm"
                    >
                      Add Lease
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/applications">
                    <Button
                      variant={
                        isActive("/applications") ? "secondary" : "ghost"
                      }
                      className="w-full justify-start"
                      size="sm"
                    >
                      Applications
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/application-templates">
                    <Button
                      variant={
                        isActive("/application-templates")
                          ? "secondary"
                          : "ghost"
                      }
                      className="w-full justify-start"
                      size="sm"
                    >
                      Templates
                    </Button>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Maintenance Section */}
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => toggleSection("maintenance")}
            >
              <Wrench className="mr-2 h-4 w-4" />
              Maintenance
              {openSections.maintenance ? (
                <ChevronDown className="ml-auto h-4 w-4 transition-transform" />
              ) : (
                <ChevronRight className="ml-auto h-4 w-4 transition-transform" />
              )}
            </Button>
            {openSections.maintenance && (
              <ul className="pl-6 space-y-1 mt-1">
                <li>
                  <Link href="/maintenance">
                    <Button
                      variant={isActive("/maintenance") ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      size="sm"
                    >
                      Requests
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/add-maintenance">
                    <Button
                      variant={
                        isActive("/add-maintenance") ? "secondary" : "ghost"
                      }
                      className="w-full justify-start"
                      size="sm"
                    >
                      New Request
                    </Button>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Finances */}
          <li>
            <Link href="/payments">
              <Button
                variant={isActive("/payments") ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Home className="mr-2 h-4 w-4" />
                Payments
              </Button>
            </Link>
          </li>

          {/* Communications Section */}
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => toggleSection("communications")}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Communications
              {openSections.communications ? (
                <ChevronDown className="ml-auto h-4 w-4 transition-transform" />
              ) : (
                <ChevronRight className="ml-auto h-4 w-4 transition-transform" />
              )}
            </Button>
            {openSections.communications && (
              <ul className="pl-6 space-y-1 mt-1">
                <li>
                  <Link href="/reports">
                    <Button
                      variant={isActive("/reports") ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      size="sm"
                    >
                      Reports
                    </Button>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Settings */}
          <li>
            <Link href="/settings">
              <Button
                variant={isActive("/settings") ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t">
        <Link href="/profile">
          <Button variant="ghost" className="w-full justify-start">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
