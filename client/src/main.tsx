import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Router, Switch } from 'wouter';
import './index.css';
import { ThemeProvider } from './context/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { TooltipProvider } from './components/ui/tooltip';

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
import ViewMortgage from "./pages/ViewMortgage"; //Added
import Insurances from './pages/Insurances';
import AddInsurance from './pages/AddInsurance';
import EditInsurance from "./pages/EditInsurance"; //Added
import ViewInsurance from "./pages/ViewInsurance"; //Added
import AuthPage from './pages/auth-page';
import TenantAuthPage from './pages/tenant-auth-page';
import TenantDashboard from './pages/tenant-dashboard';
import NotFound from './pages/not-found';
import App from './App';

// Import appliance pages
import ViewAppliance from './pages/ViewAppliance';
import EditAppliance from './pages/EditAppliance';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <TooltipProvider>
          <App />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);