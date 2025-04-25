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
import { Menu } from "lucide-react";

function App() {
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
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen">
          {/* Mobile Header */}
          <div className="lg:hidden bg-card shadow-sm flex items-center justify-between p-4 z-20">
            <div className="flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-muted-foreground hover:bg-secondary"
              >
                <Menu size={20} />
              </button>
              <div className="ml-3 font-semibold text-xl">PropManager</div>
            </div>
          </div>
          
          <div className="flex flex-1 relative">
            {/* Sidebar - Always visible on desktop, conditional on mobile */}
            <aside 
              className={`
                fixed top-0 bottom-0 left-0 w-64 z-40 
                bg-background border-r border-custom overflow-y-auto
                transition-transform duration-200
                lg:relative lg:transform-none lg:translate-x-0
                ${isMobile ? (mobileMenuOpen ? 'translate-x-0' : '-translate-x-full') : ''}
              `}
            >
              <Sidebar />
            </aside>
            
            {/* Backdrop for mobile */}
            {mobileMenuOpen && isMobile && (
              <div 
                className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
            )}
            
            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
              {/* Desktop Header */}
              <Header />
              
              {/* Content */}
              <div className="flex-1 p-4 lg:p-6">
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
        </div>
        
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
