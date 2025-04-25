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
import { Menu, X } from "lucide-react";

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
            <aside className={`app-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
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
              <div className="content-container">
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
