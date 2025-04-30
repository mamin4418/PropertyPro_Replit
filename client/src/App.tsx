import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import TenantAuthPage from "@/pages/tenant-auth-page";
import TenantDashboard from "@/pages/tenant-dashboard";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { useState, useEffect } from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import AddProperty from "./pages/AddProperty";
import ViewProperty from "./pages/ViewProperty";
import EditProperty from "./pages/EditProperty";
import ManageUnits from "./pages/ManageUnits";
import Tenants from "./pages/Tenants";
import AddTenant from "./pages/AddTenant";
import ViewTenant from "./pages/ViewTenant";
import EditTenant from "./pages/EditTenant";
import Leases from "./pages/Leases";
import AddLease from "./pages/AddLease";
import ViewLease from "./pages/ViewLease";
import EditLease from "./pages/EditLease";
import Payments from "./pages/Payments";
import AddPayment from "./pages/AddPayment";
import ViewPayment from "./pages/ViewPayment";
import EditPayment from "./pages/EditPayment";
import Maintenance from "./pages/Maintenance";
import AddMaintenance from "./pages/AddMaintenance";
import ViewMaintenance from "./pages/ViewMaintenance";
import EditMaintenance from "./pages/EditMaintenance";
import Vendors from "./pages/Vendors";
import AddVendor from "./pages/AddVendor";
import ViewVendor from "./pages/ViewVendor";
import EditVendor from "./pages/EditVendor";
import Companies from "./pages/Companies";
import AddCompany from "./pages/AddCompany";
import ViewCompany from "./pages/ViewCompany";
import EditCompany from "./pages/EditCompany";
import Contacts from "./pages/Contacts";
import AddContact from "./pages/AddContact";
import ViewContact from "./pages/ViewContact";
import EditContact from "./pages/EditContact";
import Leads from "./pages/Leads";
import AddLead from "./pages/AddLead";
import Applications from "./pages/Applications";
import ApplicationTemplates from "./pages/ApplicationTemplates";
import CreateApplicationTemplate from "./pages/CreateApplicationTemplate";
import VacancyListing from "./pages/VacancyListing";
import ManageVacancies from "./pages/ManageVacancies";
import CreateVacancy from "./pages/CreateVacancy";
import ViewVacancy from "./pages/ViewVacancy";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Appliances from "./pages/Appliances";
import AddAppliance from "./pages/AddAppliance";
import ViewAppliance from "./pages/ViewAppliance";
import EditAppliance from "./pages/EditAppliance";
import GenerateLeaseTemplate from "./pages/GenerateLeaseTemplate";
import Insurances from "./pages/Insurances";
import AddInsurance from "./pages/AddInsurance";
import Mortgages from "./pages/Mortgages";
import AddMortgage from "./pages/AddMortgage";
import EditMortgage from "./pages/EditMortgage";
import ViewMortgage from "./pages/ViewMortgage";
import ViewInsurance from "./pages/ViewInsurance";
import EditInsurance from "./pages/EditInsurance";
import { Menu, X } from "lucide-react";
import DocumentSigning from "@/pages/DocumentSigning"; 
import CreateDocument from "@/pages/CreateDocument";
import DocumentTemplates from "@/pages/DocumentTemplates";
import ViewDocument from "@/pages/ViewDocument";
import Banking from "@/pages/Banking";
import BankAccounts from "@/pages/BankAccounts";
import AddBankAccount from "@/pages/AddBankAccount";
import BankTransactions from "@/pages/BankTransactions";
import BankIntegration from "@/pages/BankIntegration";
import HelpCenter from './pages/HelpCenter';
import ViewBankAccount from "@/pages/ViewBankAccount"; // Added
import EditBankAccount from "@/pages/EditBankAccount"; // Added
import ViewTransaction from "@/pages/ViewTransaction"; // Added
import MatchTransaction from "@/pages/MatchTransaction"; // Added
import ImportTransaction from './pages/ImportTransaction'; // Added
import { ThemeProvider } from "./context/ThemeProvider"; // Added


function AppRoutes() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile and update state
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileMenuOpen(false);
      }
    };

    // Check on initial load
    checkMobile();

    // Setup listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="app-container">
      {/* Mobile Header - Only visible on mobile */}
      <header className="mobile-header lg:hidden flex items-center justify-between p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md text-muted-foreground hover:bg-secondary"
          >
            <Menu size={20} />
          </button>
          <div className="font-semibold text-xl">PropManager</div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="app-layout">
        {/* Sidebar - Fixed on desktop, toggleable on mobile */}
        <aside className={`app-sidebar ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-300 ease-in-out z-50 fixed lg:static`}>
          {/* Mobile Close Button */}
          {isMobile && mobileMenuOpen && (
            <button 
              onClick={toggleMobileMenu} 
              className="absolute top-4 right-4 p-2 rounded-md text-muted-foreground hover:bg-secondary lg:hidden"
            >
              <X size={18} />
            </button>
          )}
          <Sidebar />
        </aside>

        {/* Mobile Backdrop */}
        {mobileMenuOpen && isMobile && (
          <div 
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className="app-main">
          {/* Desktop Header */}
          <Header />

          {/* Page Content */}
          <div className="content-container p-4">
            <Switch>
              {/* Dashboard accessible without login for easier testing */}
              <Route path="/dashboard" component={Dashboard} />

              {/* Properties Routes */}
              <ProtectedRoute path="/properties" component={Properties} />
              <ProtectedRoute path="/add-property" component={AddProperty} />
              <ProtectedRoute path="/view-property/:id" component={ViewProperty} />
              <ProtectedRoute path="/edit-property/:id" component={EditProperty} />
              <ProtectedRoute path="/manage-units/:id" component={ManageUnits} />

              {/* Tenants Routes */}
              <ProtectedRoute path="/tenants" component={Tenants} />
              <ProtectedRoute path="/add-tenant" component={AddTenant} />
              <ProtectedRoute path="/view-tenant/:id" component={ViewTenant} />
              <ProtectedRoute path="/edit-tenant/:id" component={EditTenant} />

              {/* Leases Routes */}
              <ProtectedRoute path="/leases" component={Leases} />
              <ProtectedRoute path="/add-lease" component={AddLease} />
              <ProtectedRoute path="/view-lease/:id" component={ViewLease} />
              <ProtectedRoute path="/edit-lease/:id" component={EditLease} />
              <Route path="/generate-lease-template" component={GenerateLeaseTemplate} />

              {/* Payments Routes */}
              <ProtectedRoute path="/payments" component={Payments} />
              <ProtectedRoute path="/add-payment" component={AddPayment} />
              <ProtectedRoute path="/view-payment/:id" component={ViewPayment} />
              <ProtectedRoute path="/edit-payment/:id" component={EditPayment} />

              {/* Maintenance Routes */}
              <ProtectedRoute path="/maintenance" component={Maintenance} />
              <ProtectedRoute path="/add-maintenance" component={AddMaintenance} />
              <ProtectedRoute path="/view-maintenance/:id" component={ViewMaintenance} />
              <ProtectedRoute path="/edit-maintenance/:id" component={EditMaintenance} />

              {/* Appliances Routes */}
              <ProtectedRoute path="/appliances" component={Appliances} />
              <ProtectedRoute path="/add-appliance" component={AddAppliance} />
              <ProtectedRoute path="/view-appliance/:id" component={ViewAppliance} />
              <ProtectedRoute path="/edit-appliance/:id" component={EditAppliance} />

              {/* Insurance Routes */}
              <ProtectedRoute path="/insurances" component={Insurances} />
              <ProtectedRoute path="/insurances/:propertyId" component={Insurances} />
              <ProtectedRoute path="/add-insurance" component={AddInsurance} />
              <ProtectedRoute path="/add-insurance/:propertyId" component={AddInsurance} />
              <ProtectedRoute path="/view-insurance/:id" component={ViewInsurance} />
              <ProtectedRoute path="/edit-insurance/:id" component={EditInsurance} />

              {/* Mortgage Routes */}
              <ProtectedRoute path="/mortgages" component={Mortgages} />
              <ProtectedRoute path="/mortgages/:propertyId" component={Mortgages} />
              <ProtectedRoute path="/add-mortgage" component={AddMortgage} />
              <ProtectedRoute path="/add-mortgage/:propertyId" component={AddMortgage} />
              <ProtectedRoute path="/view-mortgage/:id" component={ViewMortgage} />
              <ProtectedRoute path="/edit-mortgage/:id" component={EditMortgage} />

              {/* Vendors Routes */}
              <ProtectedRoute path="/vendors" component={Vendors} />
              <ProtectedRoute path="/add-vendor" component={AddVendor} />
              <ProtectedRoute path="/view-vendor/:id" component={ViewVendor} />
              <ProtectedRoute path="/edit-vendor/:id" component={EditVendor} />

              {/* Company Routes */}
              <ProtectedRoute path="/companies" component={Companies} />
              <ProtectedRoute path="/add-company" component={AddCompany} />
              <ProtectedRoute path="/view-company/:id" component={ViewCompany} />
              <ProtectedRoute path="/edit-company/:id" component={EditCompany} />

              {/* Contacts Routes */}
              <ProtectedRoute path="/contacts" component={Contacts} />
              <ProtectedRoute path="/add-contact" component={AddContact} />
              <ProtectedRoute path="/view-contact/:id" component={ViewContact} />
              <ProtectedRoute path="/edit-contact/:id" component={EditContact} />

              {/* Tenant Acquisition Process Routes */}
              <ProtectedRoute path="/leads" component={Leads} />
              <ProtectedRoute path="/add-lead" component={AddLead} />
              <ProtectedRoute path="/view-lead/:id" component={ViewContact} />
              <ProtectedRoute path="/edit-lead/:id" component={EditContact} />
              <ProtectedRoute path="/applications" component={Applications} />
              <ProtectedRoute path="/application-templates" component={ApplicationTemplates} />
              <ProtectedRoute path="/create-template" component={CreateApplicationTemplate} />
              <ProtectedRoute path="/edit-template/:id" component={CreateApplicationTemplate} />

              {/* Vacancy Management Routes */}
              <ProtectedRoute path="/vacancy-listing" component={VacancyListing} />
              <ProtectedRoute path="/manage-vacancies" component={ManageVacancies} />
              <ProtectedRoute path="/create-vacancy" component={CreateVacancy} />
              <ProtectedRoute path="/edit-vacancy/:id" component={CreateVacancy} />
              <ProtectedRoute path="/view-vacancy/:id" component={ViewVacancy} />
              <ProtectedRoute path="/vacancy/:id" component={ViewVacancy} />

              {/* Reports and Settings */}
              <Route path="/reports" component={Reports} /> {/* Removed authentication for testing */}
              <ProtectedRoute path="/settings" component={Settings} />
              <Route path="/help-center" component={HelpCenter} />
              <Route path="/documentation" component={HelpCenter} />
              <Route path="/tutorial" component={HelpCenter} />
              <Route path="/faq" component={HelpCenter} />
              <Route path="/support" component={HelpCenter} />


              {/* Auth Routes - Keep them accessible without login */}
              <Route path="/auth" component={AuthPage} />
              <Route path="/tenant-auth" component={TenantAuthPage} />
              <Route path="/tenant-dashboard" component={TenantDashboard} />

              {/* Document Signing Routes */}
              <Route path="/document-signing" component={DocumentSigning} />
              <Route path="/create-document" component={CreateDocument} />
              <Route path="/document-templates" component={DocumentTemplates} />
              <Route path="/view-document/:id" component={ViewDocument} />

              {/* Banking/Accounting Routes */}
              <Route path="/banking" component={Banking} />
              <Route path="/banking/accounts" component={BankAccounts} />
              <Route path="/banking/accounts/add" component={AddBankAccount} />
              <Route path="/banking/accounts/:id" component={ViewBankAccount} />
              <Route path="/banking/accounts/:id/edit" component={EditBankAccount} />
              <Route path="/banking/transactions" component={BankTransactions} />
              <Route path="/banking/transactions/import" component={ImportTransaction} />
              <Route path="/banking/transactions/:id" component={ViewTransaction} />
              <Route path="/banking/transactions/:id/match" component={MatchTransaction} />
              <Route path="/banking/integration" component={BankIntegration} />

              {/* Make Dashboard accessible without login for testing */}
              <Route path="/" component={Dashboard} />

              {/* Catch all */}
              <Route component={NotFound} />
            </Switch>
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <AppRoutes />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;