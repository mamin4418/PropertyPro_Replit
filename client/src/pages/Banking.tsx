
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, DollarSign, ArrowUp, ArrowDown, Plus } from "lucide-react";
import { Link } from "wouter";

export default function Banking() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Banking</h2>
        <div className="flex items-center gap-2">
          <Link href="/banking/accounts/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Bank Account
            </Button>
          </Link>
        </div>
      </div>
      
      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="accounts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Operating Account</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$24,231.89</div>
                <p className="text-xs text-muted-foreground">
                  First National Bank • 1234
                </p>
                <div className="mt-3">
                  <Link href="/banking/accounts/1">
                    <Button variant="outline" size="sm">View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security Deposits</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$18,500.00</div>
                <p className="text-xs text-muted-foreground">
                  First National Bank • 5678
                </p>
                <div className="mt-3">
                  <Link href="/banking/accounts/2">
                    <Button variant="outline" size="sm">View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-dashed bg-muted/50 flex flex-col items-center justify-center p-6">
              <Plus className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium mb-1">Add New Account</h3>
              <p className="text-sm text-muted-foreground text-center mb-3">
                Connect a new bank account or add one manually
              </p>
              <Link href="/banking/accounts/add">
                <Button>Add Account</Button>
              </Link>
            </Card>
          </div>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Integration Status</h3>
          
          <Card>
            <CardHeader>
              <CardTitle>Connected Services</CardTitle>
              <CardDescription>Manage your financial integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">QuickBooks Online</h4>
                    <p className="text-sm text-muted-foreground">Connected • Last sync: Today at 9:30 AM</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Plaid</h4>
                    <p className="text-sm text-muted-foreground">Connected • 2 bank accounts</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Showing the last 5 transactions across all accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h4 className="font-medium">Rent Payment - Unit 303</h4>
                    <div className="text-sm text-muted-foreground">May 1, 2023 • Operating Account</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowUp className="h-4 w-4 text-green-500" />
                    <span className="text-lg font-semibold text-green-500">$1,850.00</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h4 className="font-medium">Water Bill - Sunset Heights</h4>
                    <div className="text-sm text-muted-foreground">Apr 28, 2023 • Operating Account</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowDown className="h-4 w-4 text-red-500" />
                    <span className="text-lg font-semibold text-red-500">$342.15</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h4 className="font-medium">Rent Payment - Unit 201</h4>
                    <div className="text-sm text-muted-foreground">Apr 30, 2023 • Operating Account</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowUp className="h-4 w-4 text-green-500" />
                    <span className="text-lg font-semibold text-green-500">$1,425.00</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h4 className="font-medium">Security Deposit - New Tenant</h4>
                    <div className="text-sm text-muted-foreground">Apr 27, 2023 • Security Deposits</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowUp className="h-4 w-4 text-green-500" />
                    <span className="text-lg font-semibold text-green-500">$1,500.00</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Plumbing Repair - Unit 105</h4>
                    <div className="text-sm text-muted-foreground">Apr 25, 2023 • Operating Account</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowDown className="h-4 w-4 text-red-500" />
                    <span className="text-lg font-semibold text-red-500">$275.00</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <Link href="/banking/transactions">
                  <Button variant="outline">View All Transactions</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reconciliation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Reconciliation</CardTitle>
              <CardDescription>Match transactions and reconcile your accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>No pending reconciliation tasks.</p>
                <Button variant="outline">Start New Reconciliation</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
