
import { useEffect, lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import { useTheme } from "./hooks/use-theme";
import { Toaster } from "./components/ui/toaster";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./lib/protected-route";
import { Loader2 } from "lucide-react";

// Lazy load page components
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Properties = lazy(() => import("./pages/Properties"));
const AddProperty = lazy(() => import("./pages/AddProperty"));
const ViewProperty = lazy(() => import("./pages/ViewProperty"));
const EditProperty = lazy(() => import("./pages/EditProperty"));
const ManageUnits = lazy(() => import("./pages/ManageUnits"));
const ManageVacancies = lazy(() => import("./pages/ManageVacancies"));
const CreateVacancy = lazy(() => import("./pages/CreateVacancy"));
const ViewVacancy = lazy(() => import("./pages/ViewVacancy"));
const VacancyListing = lazy(() => import("./pages/VacancyListing"));
const Tenants = lazy(() => import("./pages/Tenants"));
const AddTenant = lazy(() => import("./pages/AddTenant"));
const ViewTenant = lazy(() => import("./pages/ViewTenant"));
const EditTenant = lazy(() => import("./pages/EditTenant"));
const Leases = lazy(() => import("./pages/Leases"));
const AddLease = lazy(() => import("./pages/AddLease"));
const ViewLease = lazy(() => import("./pages/ViewLease"));
const EditLease = lazy(() => import("./pages/EditLease"));
const Maintenance = lazy(() => import("./pages/Maintenance"));
const AddMaintenance = lazy(() => import("./pages/AddMaintenance"));
const ViewMaintenance = lazy(() => import("./pages/ViewMaintenance"));
const EditMaintenance = lazy(() => import("./pages/EditMaintenance"));
const Payments = lazy(() => import("./pages/Payments"));
const AddPayment = lazy(() => import("./pages/AddPayment"));
const ViewPayment = lazy(() => import("./pages/ViewPayment"));
const EditPayment = lazy(() => import("./pages/EditPayment"));
const Vendors = lazy(() => import("./pages/Vendors"));
const AddVendor = lazy(() => import("./pages/AddVendor"));
const ViewVendor = lazy(() => import("./pages/ViewVendor"));
const EditVendor = lazy(() => import("./pages/EditVendor"));
const Contacts = lazy(() => import("./pages/Contacts"));
const AddContact = lazy(() => import("./pages/AddContact"));
const ViewContact = lazy(() => import("./pages/ViewContact"));
const EditContact = lazy(() => import("./pages/EditContact"));
const Leads = lazy(() => import("./pages/Leads"));
const AddLead = lazy(() => import("./pages/AddLead"));
const Applications = lazy(() => import("./pages/Applications"));
const ApplicationTemplates = lazy(() => import("./pages/ApplicationTemplates"));
const CreateApplicationTemplate = lazy(() => import("./pages/CreateApplicationTemplate"));
const GenerateLeaseTemplate = lazy(() => import("./pages/GenerateLeaseTemplate"));
const Settings = lazy(() => import("./pages/Settings"));
const Reports = lazy(() => import("./pages/Reports"));
const Appliances = lazy(() => import("./pages/Appliances"));
const AddAppliance = lazy(() => import("./pages/AddAppliance"));
const ViewAppliance = lazy(() => import("./pages/ViewAppliance"));
const EditAppliance = lazy(() => import("./pages/EditAppliance"));
const NotFound = lazy(() => import("./pages/not-found"));
const AuthPage = lazy(() => import("./pages/auth-page"));
const TenantAuthPage = lazy(() => import("./pages/tenant-auth-page"));
const TenantDashboard = lazy(() => import("./pages/tenant-dashboard"));

// Import company-related pages
const Companies = lazy(() => import("./pages/Companies"));
const AddCompany = lazy(() => import("./pages/AddCompany"));
const ViewCompany = lazy(() => import("./pages/ViewCompany"));
const EditCompany = lazy(() => import("./pages/EditCompany"));

// Loading component
const LoadingScreen = () => (
  <div className="h-screen w-screen flex items-center justify-center">
    <Loader2 className="h-10 w-10 animate-spin" />
  </div>
);

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Switch>
        <Route path="/login">
          <AuthPage />
        </Route>
        <Route path="/tenant-login">
          <TenantAuthPage />
        </Route>
        <Route path="/tenant-dashboard">
          <TenantDashboard />
        </Route>
        
        {/* Protected routes with dashboard layout */}
        <Route path="/">
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard">
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>

        {/* Companies Routes */}
        <Route path="/companies">
          <ProtectedRoute>
            <DashboardLayout>
              <Companies />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/add-company">
          <ProtectedRoute>
            <DashboardLayout>
              <AddCompany />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/view-company/:id">
          {(params) => (
            <ProtectedRoute>
              <DashboardLayout>
                <ViewCompany />
              </DashboardLayout>
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/edit-company/:id">
          {(params) => (
            <ProtectedRoute>
              <DashboardLayout>
                <EditCompany />
              </DashboardLayout>
            </ProtectedRoute>
          )}
        </Route>

        {/* Properties Routes */}
        <Route path="/properties">
          <ProtectedRoute>
            <DashboardLayout>
              <Properties />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/add-property">
          <ProtectedRoute>
            <DashboardLayout>
              <AddProperty />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/view-property/:id">
          {(params) => (
            <ProtectedRoute>
              <DashboardLayout>
                <ViewProperty />
              </DashboardLayout>
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/edit-property/:id">
          {(params) => (
            <ProtectedRoute>
              <DashboardLayout>
                <EditProperty />
              </DashboardLayout>
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/manage-units">
          <ProtectedRoute>
            <DashboardLayout>
              <ManageUnits />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/manage-vacancies">
          <ProtectedRoute>
            <DashboardLayout>
              <ManageVacancies />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/create-vacancy">
          <ProtectedRoute>
            <DashboardLayout>
              <CreateVacancy />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/view-vacancy/:id">
          {(params) => (
            <ProtectedRoute>
              <DashboardLayout>
                <ViewVacancy />
              </DashboardLayout>
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/vacancy-listing">
          <VacancyListing />
        </Route>

        {/* Tenants Routes */}
        <Route path="/tenants">
          <ProtectedRoute>
            <DashboardLayout>
              <Tenants />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/add-tenant">
          <ProtectedRoute>
            <DashboardLayout>
              <AddTenant />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/view-tenant/:id">
          {(params) => (
            <ProtectedRoute>
              <DashboardLayout>
                <ViewTenant />
              </DashboardLayout>
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/edit-tenant/:id">
          {(params) => (
            <ProtectedRoute>
              <DashboardLayout>
                <EditTenant />
              </DashboardLayout>
            </ProtectedRoute>
          )}
        </Route>

        {/* Leases Routes */}
        <Route path="/leases">
          <ProtectedRoute>
            <DashboardLayout>
              <Leases />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/add-lease">
          <ProtectedRoute>
            <DashboardLayout>
              <AddLease />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/view-lease/:id">
          {(params) => (
            <ProtectedRoute>
              <DashboardLayout>
                <ViewLease />
              </DashboardLayout>
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/edit-lease/:id">
          {(params) => (
            <ProtectedRoute>
              <DashboardLayout>
                <EditLease />
              </DashboardLayout>
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/applications">
          <ProtectedRoute>
            <DashboardLayout>
              <Applications />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/application-templates">
          <ProtectedRoute>
            <DashboardLayout>
              <ApplicationTemplates />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/create-application-template">
          <ProtectedRoute>
            <DashboardLayout>
              <CreateApplicationTemplate />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/generate-lease-template">
          <ProtectedRoute>
            <DashboardLayout>
              <GenerateLeaseTemplate />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>

        {/* Maintenance Routes */}
        <Route path="/maintenance">
          <ProtectedRoute>
            <DashboardLayout>
              <Maintenance />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/add-maintenance">
          <ProtectedRoute>
            <DashboardLayout>
              <AddMaintenance />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/view-maintenance/:id">
          {(params) => (
            <ProtectedRoute>
              <DashboardLayout>
                <ViewMaintenance />
              </DashboardLayout>
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/edit-maintenance/:id">
          {(params) => (
            <ProtectedRoute>
              <DashboardLayout>
                <EditMaintenance />
              </DashboardLayout>
            </ProtectedRoute>
          )}
        </Route>

        {/* Payments Routes */}
        <Route path="/payments">
          <ProtectedRoute>
            <DashboardLayout>
              <Payments />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/add-payment">
          <ProtectedRoute>
            <DashboardLayout>
              <AddPayment />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/view-payment/:id">
          {(params) => (
            <ProtectedRoute>
              <DashboardLayout>
                <ViewPayment />
              </DashboardLayout>
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/edit-payment/:id">
          {(params) => (
            <ProtectedRoute>
              <DashboardLayout>
                <EditPayment />
              </DashboardLayout>
            </ProtectedRoute>
          )}
        </Route>

        {/* Vendors Routes */}
        <Route path="/vendors">
          <ProtectedRoute>
            <DashboardLayout>
              <Vendors />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/add-vendor">
          <ProtectedRoute>
            <DashboardLayout>
              <AddVendor />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/view-vendor/:id">
          {(params) => (
            <ProtectedRoute>
              <DashboardLayout>
                <ViewVendor />
              </DashboardLayout>
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/edit-vendor/:id">
          {(params) => (
            <ProtectedRoute>
              <DashboardLayout>
                <EditVendor />
              </DashboardLayout>
            </ProtectedRoute>
          )}
        </Route>

        {/* Contacts Routes */}
        <Route path="/contacts">
          <ProtectedRoute>
            <DashboardLayout>
              <Contacts />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/add-contact">
          <ProtectedRoute>
            <DashboardLayout>
              <AddContact />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/view-contact/:id">
          {(params) => (
            <ProtectedRoute>
              <DashboardLayout>
                <ViewContact />
              </DashboardLayout>
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/edit-contact/:id">
          {(params) => (
            <ProtectedRoute>
              <DashboardLayout>
                <EditContact />
              </DashboardLayout>
            </ProtectedRoute>
          )}
        </Route>

        {/* Leads Routes */}
        <Route path="/leads">
          <ProtectedRoute>
            <DashboardLayout>
              <Leads />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/add-lead">
          <ProtectedRoute>
            <DashboardLayout>
              <AddLead />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>

        {/* Appliances Routes */}
        <Route path="/appliances">
          <ProtectedRoute>
            <DashboardLayout>
              <Appliances />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/add-appliance">
          <ProtectedRoute>
            <DashboardLayout>
              <AddAppliance />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/view-appliance/:id">
          {(params) => (
            <ProtectedRoute>
              <DashboardLayout>
                <ViewAppliance />
              </DashboardLayout>
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/edit-appliance/:id">
          {(params) => (
            <ProtectedRoute>
              <DashboardLayout>
                <EditAppliance />
              </DashboardLayout>
            </ProtectedRoute>
          )}
        </Route>

        {/* Other Routes */}
        <Route path="/reports">
          <ProtectedRoute>
            <DashboardLayout>
              <Reports />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/settings">
          <ProtectedRoute>
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>

        {/* 404 Route */}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Suspense>
  );
}

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark", "system");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  );
}

export default App;
