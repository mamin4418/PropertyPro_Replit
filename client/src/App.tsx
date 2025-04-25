import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { useState, useEffect } from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import AddProperty from "./pages/AddProperty";
import Tenants from "./pages/Tenants";
import Leases from "./pages/Leases";
import Payments from "./pages/Payments";
import Maintenance from "./pages/Maintenance";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // On desktop, sidebar should always be open
      if (!mobile) {
        setSidebarOpen(true);
      }
    };
    
    // Set initial states
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />
          
          {/* Backdrop - mobile only */}
          {sidebarOpen && isMobile && (
            <div 
              className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
              onClick={toggleSidebar}
            ></div>
          )}
          
          {/* Main Content */}
          <main className="flex-1 lg:ml-64 transition-all duration-300">
            <Header toggleSidebar={toggleSidebar} isMobile={isMobile} />
            
            <div className="p-4 lg:p-6">
              <Switch>
                <Route path="/" component={Dashboard} />
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/properties" component={Properties} />
                <Route path="/add-property" component={AddProperty} />
                <Route path="/tenants" component={Tenants} />
                <Route path="/leases" component={Leases} />
                <Route path="/payments" component={Payments} />
                <Route path="/maintenance" component={Maintenance} />
                <Route path="/reports" component={Reports} />
                <Route path="/settings" component={Settings} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </main>
        </div>
        
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
