
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './context/ThemeProvider'
import { TooltipProvider } from './components/ui/tooltip'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Router, Switch } from 'wouter';
import './index.css';
import { ThemeProvider } from './context/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';

// Pages
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import ViewProperty from './pages/ViewProperty';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import Tenants from './pages/Tenants';
import AddTenant from './pages/AddTenant';
import EditTenant from './pages/EditTenant';
import ViewTenant from './pages/ViewTenant';
import Leases from './pages/Leases';
import AddLease from './pages/AddLease';
import EditLease from './pages/EditLease';
import ViewLease from './pages/ViewLease';
import Maintenance from './pages/Maintenance';
import AddMaintenance from './pages/AddMaintenance';
import EditMaintenance from './pages/EditMaintenance';
import ViewMaintenance from './pages/ViewMaintenance';
import Vendors from './pages/Vendors';
import AddVendor from './pages/AddVendor';
import EditVendor from './pages/EditVendor';
import ViewVendor from './pages/ViewVendor';
import Contacts from './pages/Contacts';
import AddContact from './pages/AddContact';
import EditContact from './pages/EditContact';
import ViewContact from './pages/ViewContact';
import Payments from './pages/Payments';
import AddPayment from './pages/AddPayment';
import EditPayment from './pages/EditPayment';
import ViewPayment from './pages/ViewPayment';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import ManageUnits from './pages/ManageUnits';
import ManageVacancies from './pages/ManageVacancies';
import VacancyListing from './pages/VacancyListing';
import Leads from './pages/Leads';
import AddLead from './pages/AddLead';
import Applications from './pages/Applications';
import ApplicationTemplates from './pages/ApplicationTemplates';
import CreateApplicationTemplate from './pages/CreateApplicationTemplate';
import CreateVacancy from './pages/CreateVacancy';
import ViewVacancy from './pages/ViewVacancy';
import GenerateLeaseTemplate from './pages/GenerateLeaseTemplate';
import Companies from './pages/Companies';
import AddCompany from './pages/AddCompany';
import EditCompany from './pages/EditCompany';
import ViewCompany from './pages/ViewCompany';
import Appliances from './pages/Appliances';
import AddAppliance from './pages/AddAppliance';
import EditAppliance from './pages/EditAppliance';
import ViewAppliance from './pages/ViewAppliance';
import Mortgages from './pages/Mortgages';
import AddMortgage from './pages/AddMortgage';
import EditMortgage from './pages/EditMortgage';
import Insurances from './pages/Insurances';
import AddInsurance from './pages/AddInsurance';
import AuthPage from './pages/auth-page';
import TenantAuthPage from './pages/tenant-auth-page';
import TenantDashboard from './pages/tenant-dashboard';
import NotFound from './pages/not-found';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <Router>
          <Switch>
            <Route path="/auth" component={AuthPage} />
            <Route path="/tenant/auth" component={TenantAuthPage} />
            <Route path="/tenant/dashboard" component={TenantDashboard} />
            <Route path="/" component={Dashboard} />
            <Route path="/properties" component={Properties} />
            <Route path="/view-property/:id" component={ViewProperty} />
            <Route path="/add-property" component={AddProperty} />
            <Route path="/edit-property/:id" component={EditProperty} />
            <Route path="/manage-units/:propertyId" component={ManageUnits} />
            <Route path="/tenants" component={Tenants} />
            <Route path="/add-tenant" component={AddTenant} />
            <Route path="/edit-tenant/:id" component={EditTenant} />
            <Route path="/view-tenant/:id" component={ViewTenant} />
            <Route path="/leases" component={Leases} />
            <Route path="/add-lease" component={AddLease} />
            <Route path="/add-lease/:tenantId" component={AddLease} />
            <Route path="/edit-lease/:id" component={EditLease} />
            <Route path="/view-lease/:id" component={ViewLease} />
            <Route path="/maintenance" component={Maintenance} />
            <Route path="/add-maintenance" component={AddMaintenance} />
            <Route path="/edit-maintenance/:id" component={EditMaintenance} />
            <Route path="/view-maintenance/:id" component={ViewMaintenance} />
            <Route path="/vendors" component={Vendors} />
            <Route path="/add-vendor" component={AddVendor} />
            <Route path="/edit-vendor/:id" component={EditVendor} />
            <Route path="/view-vendor/:id" component={ViewVendor} />
            <Route path="/contacts" component={Contacts} />
            <Route path="/add-contact" component={AddContact} />
            <Route path="/edit-contact/:id" component={EditContact} />
            <Route path="/view-contact/:id" component={ViewContact} />
            <Route path="/payments" component={Payments} />
            <Route path="/add-payment" component={AddPayment} />
            <Route path="/edit-payment/:id" component={EditPayment} />
            <Route path="/view-payment/:id" component={ViewPayment} />
            <Route path="/reports" component={Reports} />
            <Route path="/settings" component={Settings} />
            <Route path="/vacancies" component={ManageVacancies} />
            <Route path="/vacancies/listing" component={VacancyListing} />
            <Route path="/vacancies/create" component={CreateVacancy} />
            <Route path="/vacancies/view/:id" component={ViewVacancy} />
            <Route path="/leads" component={Leads} />
            <Route path="/add-lead" component={AddLead} />
            <Route path="/applications" component={Applications} />
            <Route path="/application-templates" component={ApplicationTemplates} />
            <Route path="/application-templates/create" component={CreateApplicationTemplate} />
            <Route path="/lease-templates/generate" component={GenerateLeaseTemplate} />
            <Route path="/companies" component={Companies} />
            <Route path="/add-company" component={AddCompany} />
            <Route path="/edit-company/:id" component={EditCompany} />
            <Route path="/view-company/:id" component={ViewCompany} />
            <Route path="/appliances" component={Appliances} />
            <Route path="/appliances/:propertyId" component={Appliances} />
            <Route path="/add-appliance" component={AddAppliance} />
            <Route path="/add-appliance/:unitId" component={AddAppliance} />
            <Route path="/edit-appliance/:id" component={EditAppliance} />
            <Route path="/view-appliance/:id" component={ViewAppliance} />
            <Route path="/mortgages" component={Mortgages} />
            <Route path="/mortgages/:propertyId" component={Mortgages} />
            <Route path="/add-mortgage" component={AddMortgage} />
            <Route path="/add-mortgage/:propertyId" component={AddMortgage} />
            <Route path="/edit-mortgage/:id" component={EditMortgage} />
            <Route path="/insurances" component={Insurances} />
            <Route path="/insurances/:propertyId" component={Insurances} />
            <Route path="/add-insurance" component={AddInsurance} />
            <Route path="/add-insurance/:propertyId" component={AddInsurance} />
            <Route component={NotFound} />
          </Switch>
        </Router>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);

        <TooltipProvider>
          <App />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
