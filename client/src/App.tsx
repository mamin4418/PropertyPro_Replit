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
import NewApplication from "@/pages/NewApplication";
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
import ViewBankAccount from "@/pages/ViewBankAccount";
import EditBankAccount from "@/pages/EditBankAccount";
import ViewTransaction from "@/pages/ViewTransaction";
import MatchTransaction from "@/pages/MatchTransaction";
import ImportTransaction from './pages/ImportTransaction';
import { ThemeProvider } from "./context/ThemeProvider";
import ReconciliationDashboard from "@/pages/ReconciliationDashboard"; // Added import
import TransactionRules from "@/pages/TransactionRules"; // Added import
import { lazy } from 'react';
import Tasks from "./pages/tasks/index"; //added import
import AddTask from "./pages/tasks/AddTask"; //added import
import ViewTasks from "./pages/tasks/ViewTasks"; //added import


// Rent Management Components
import ViewCharges from "./pages/rent/ViewCharges";
import ViewDeposits from "./pages/rent/ViewDeposits";
import AddCharge from "./pages/rent/AddCharge";
import LateFeeRules from "./pages/rent/LateFeeRules";
import AddLateFeeRule from "./pages/rent/AddLateFeeRule";
import ExportCharges from "./pages/rent/ExportCharges";
import RentRoll from "./pages/rent/RentRoll";


function AppRoutes() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="app-container">
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

      <div className="app-layout">
        <aside className={`app-sidebar ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-300 ease-in-out z-50 fixed lg:static`}>
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

        {mobileMenuOpen && isMobile && (
          <div 
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <main className="app-main">
          <Header />

          <div className="content-container p-4">
            <Switch>
              <Route path="/dashboard" component={Dashboard} />

              <ProtectedRoute path="/properties" component={Properties} />
              <ProtectedRoute path="/add-property" component={AddProperty} />
              <ProtectedRoute path="/view-property/:id" component={ViewProperty} />
              <ProtectedRoute path="/edit-property/:id" component={EditProperty} />
              <ProtectedRoute path="/manage-units/:id" component={ManageUnits} />

              <ProtectedRoute path="/tenants" component={Tenants} />
              <ProtectedRoute path="/add-tenant" component={AddTenant} />
              <ProtectedRoute path="/view-tenant/:id" component={ViewTenant} />
              <ProtectedRoute path="/edit-tenant/:id" component={EditTenant} />

              <ProtectedRoute path="/leases" component={Leases} />
              <ProtectedRoute path="/add-lease" component={AddLease} />
              <ProtectedRoute path="/view-lease/:id" component={ViewLease} />
              <ProtectedRoute path="/edit-lease/:id" component={EditLease} />
              <Route path="/generate-lease-template" component={GenerateLeaseTemplate} />

              <ProtectedRoute path="/payments" component={Payments} />
              <ProtectedRoute path="/add-payment" component={AddPayment} />
              <ProtectedRoute path="/view-payment/:id" component={ViewPayment} />
              <ProtectedRoute path="/edit-payment/:id" component={EditPayment} />

              <ProtectedRoute path="/maintenance" component={Maintenance} />
              <ProtectedRoute path="/add-maintenance" component={AddMaintenance} />
              <ProtectedRoute path="/view-maintenance/:id" component={ViewMaintenance} />
              <ProtectedRoute path="/edit-maintenance/:id" component={EditMaintenance} />

              <ProtectedRoute path="/appliances" component={Appliances} />
              <ProtectedRoute path="/add-appliance" component={AddAppliance} />
              <ProtectedRoute path="/view-appliance/:id" component={ViewAppliance} />
              <ProtectedRoute path="/edit-appliance/:id" component={EditAppliance} />

              <ProtectedRoute path="/insurances" component={Insurances} />
              <ProtectedRoute path="/insurances/:propertyId" component={Insurances} />
              <ProtectedRoute path="/add-insurance" component={AddInsurance} />
              <ProtectedRoute path="/add-insurance/:propertyId" component={AddInsurance} />
              <ProtectedRoute path="/view-insurance/:id" component={ViewInsurance} />
              <ProtectedRoute path="/edit-insurance/:id" component={EditInsurance} />

              <ProtectedRoute path="/mortgages" component={Mortgages} />
              <ProtectedRoute path="/mortgages/:propertyId" component={Mortgages} />
              <ProtectedRoute path="/add-mortgage" component={AddMortgage} />
              <ProtectedRoute path="/add-mortgage/:propertyId" component={AddMortgage} />
              <ProtectedRoute path="/view-mortgage/:id" component={ViewMortgage} />
              <ProtectedRoute path="/edit-mortgage/:id" component={EditMortgage} />

              <ProtectedRoute path="/vendors" component={Vendors} />
              <ProtectedRoute path="/add-vendor" component={AddVendor} />
              <ProtectedRoute path="/view-vendor/:id" component={ViewVendor} />
              <ProtectedRoute path="/edit-vendor/:id" component={EditVendor} />

              <ProtectedRoute path="/companies" component={Companies} />
              <ProtectedRoute path="/add-company" component={AddCompany} />
              <ProtectedRoute path="/view-company/:id" component={ViewCompany} />
              <ProtectedRoute path="/edit-company/:id" component={EditCompany} />

              <ProtectedRoute path="/contacts" component={Contacts} />
              <ProtectedRoute path="/add-contact" component={AddContact} />
              <ProtectedRoute path="/view-contact/:id" component={ViewContact} />
              <ProtectedRoute path="/edit-contact/:id" component={EditContact} />

              <ProtectedRoute path="/leads" component={Leads} />
              <ProtectedRoute path="/add-lead" component={AddLead} />
              <ProtectedRoute path="/view-lead/:id" component={ViewContact} />
              <ProtectedRoute path="/edit-lead/:id" component={EditContact} />
              <ProtectedRoute path="/applications" component={Applications} />
              <ProtectedRoute path="/applications/new" component={NewApplication} />
              <ProtectedRoute path="/application-templates" component={ApplicationTemplates} />
              <ProtectedRoute path="/create-template" component={CreateApplicationTemplate} />
              <ProtectedRoute path="/edit-template/:id" component={CreateApplicationTemplate} />

              <ProtectedRoute path="/vacancy-listing" component={VacancyListing} />
              <ProtectedRoute path="/manage-vacancies" component={ManageVacancies} />
              <ProtectedRoute path="/create-vacancy" component={CreateVacancy} />
              <ProtectedRoute path="/edit-vacancy/:id" component={CreateVacancy} />
              <ProtectedRoute path="/view-vacancy/:id" component={ViewVacancy} />
              <ProtectedRoute path="/vacancy/:id" component={ViewVacancy} />

              {/* Reports Routes */}
              <Route path="/reports" component={Reports} />

              {/* Utilities Management */}
              <Route path="/utilities" component={lazy(() => import('./pages/Utilities'))} />
              <Route path="/add-utility-account" component={lazy(() => import('./pages/AddUtilityAccount'))} />

              {/* Property Inspections */}
              <Route path="/property-inspections" component={lazy(() => import('./pages/PropertyInspections'))} />
              <Route path="/schedule-inspection" component={lazy(() => import('./pages/ScheduleInspection'))} />

              {/* Settings Routes */}
              <Route path="/settings" component={Settings} />
              <Route path="/help-center" component={HelpCenter} />
              <Route path="/documentation" component={HelpCenter} />
              <Route path="/tutorial" component={HelpCenter} />
              <Route path="/faq" component={HelpCenter} />
              <Route path="/support" component={HelpCenter} />

              <Route path="/auth" component={AuthPage} />
              <Route path="/tenant-auth" component={TenantAuthPage} />
              <Route path="/tenant-dashboard" component={TenantDashboard} />

              <Route path="/document-signing" component={DocumentSigning} />
              <Route path="/create-document" component={CreateDocument} />
              <Route path="/document-templates" component={DocumentTemplates} />
              <Route path="/view-document/:id" component={ViewDocument} />

              <Route path="/banking" component={Banking} />
              <Route path="/banking/accounts" component={BankAccounts} />
              <Route path="/banking/accounts/add" component={AddBankAccount} />
              <Route path="/banking/accounts/:id" component={ViewBankAccount} />
              <Route path="/banking/accounts/:id/edit" component={EditBankAccount} />
              <Route path="/banking/transactions" component={BankTransactions} />
              <Route path="/banking/transactions/:id" component={ViewTransaction} />
              <Route path="/banking/transactions/:id/match" component={MatchTransaction} />
              <Route path="/banking/transactions/import" component={ImportTransaction} />
              <Route path="/banking/reconciliation" component={ReconciliationDashboard} />
              <Route path="/banking/transactions/rules" component={TransactionRules} />
              <Route path="/banking/integration" component={BankIntegration} />

              {/* Rent Management Routes */}
              <Route path="/rent/charges" component={ViewCharges} />
              <Route path="/rent/deposits" component={ViewDeposits} />
              <Route path="/rent/add-charge" component={AddCharge} />
              <Route path="/rent/late-fee-rules" component={LateFeeRules} />
              <Route path="/rent/late-fee-rules/new" component={AddLateFeeRule} />
              <Route path="/rent/export" component={ExportCharges} />
              <Route path="/rent/roll" component={RentRoll} />

              <Route path="/tasks" component={Tasks} />
              <Route path="/tasks/add" component={AddTask} />
              <Route path="/tasks/all" component={ViewTasks} />

              <Route path="/" component={Dashboard} />

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