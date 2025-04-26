import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, FileText, DollarSign, Wrench, Bell, LogOut } from "lucide-react";

export default function TenantDashboard() {
  const { user, logoutMutation } = useAuth();

  // Redirect if not logged in or not a tenant
  if (!user) {
    return <Redirect to="/tenant-auth" />;
  }
  
  if (user.role !== "tenant") {
    return <Redirect to="/" />;
  }

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Tenant Header */}
      <header className="bg-card shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
            PM
          </div>
          <h1 className="text-xl font-bold">Tenant Portal</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full bg-secondary hover:bg-secondary/80">
            <Bell size={18} />
          </button>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut size={16} />
            <span>Sign Out</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome, {user.username}</h2>
          <p className="text-muted-foreground">Access your rental information and services</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Lease Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <FileText className="text-primary" size={20} />
              </div>
              <CardTitle>My Lease</CardTitle>
              <CardDescription>View your lease details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium">Active</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Expires:</span>
                  <span className="font-medium">Dec 31, 2023</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">View Lease</Button>
            </CardFooter>
          </Card>

          {/* Rent Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <DollarSign className="text-primary" size={20} />
              </div>
              <CardTitle>Rent & Payments</CardTitle>
              <CardDescription>Manage your monthly payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Current Rent:</span>
                  <span className="font-medium">$1,250.00</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Due Date:</span>
                  <span className="font-medium">1st of each month</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="sm" className="w-full">Make Payment</Button>
            </CardFooter>
          </Card>

          {/* Property Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Home className="text-primary" size={20} />
              </div>
              <CardTitle>My Property</CardTitle>
              <CardDescription>Your rental property details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Address:</span>
                  <span className="font-medium">123 Main St, Apt 4B</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Property:</span>
                  <span className="font-medium">Parkside Apartments</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">View Details</Button>
            </CardFooter>
          </Card>

          {/* Maintenance Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Wrench className="text-primary" size={20} />
              </div>
              <CardTitle>Maintenance</CardTitle>
              <CardDescription>Request repairs or service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Open Requests:</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Last Request:</span>
                  <span className="font-medium">None</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="sm" className="w-full">Submit Request</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
          <div className="bg-card rounded-lg border p-4">
            <div className="text-center py-6 text-muted-foreground">
              No recent activity to display
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-muted py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2023 Property Manager. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Button variant="link" size="sm" className="text-muted-foreground">Terms of Service</Button>
            <Button variant="link" size="sm" className="text-muted-foreground">Privacy Policy</Button>
            <Button variant="link" size="sm" className="text-muted-foreground">Contact Support</Button>
          </div>
        </div>
      </footer>
    </div>
  );
}