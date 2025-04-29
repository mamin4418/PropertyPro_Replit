import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, ArrowRight, Landmark, DollarSign, RefreshCw, AlertCircle, Wrench } from "lucide-react";

export default function BankIntegration() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Bank Integration</h2>
        <Button>
          <RefreshCw className="mr-2 h-4 w-4" />
          Sync Now
        </Button>
      </div>

      <Tabs defaultValue="plaid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="plaid">Plaid</TabsTrigger>
          <TabsTrigger value="quickbooks">QuickBooks</TabsTrigger>
        </TabsList>

        <TabsContent value="plaid" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plaid Integration</CardTitle>
              <CardDescription>
                Connect your bank accounts to automatically import transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-4 border rounded-lg bg-muted/30">
                  <div className="flex-1">
                    <h3 className="font-medium">Integration Status</h3>
                    <div className="flex items-center gap-1 text-sm text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Connected</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Last synced: Today at 9:30 AM</p>
                  </div>
                  <Button variant="outline">Manage Connection</Button>
                </div>

                <h3 className="font-semibold text-lg mt-4">Connected Accounts</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Landmark className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">First National Bank</h4>
                        <p className="text-sm text-muted-foreground">2 accounts connected</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Landmark className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Chase Bank</h4>
                        <p className="text-sm text-muted-foreground">1 account connected</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <Button className="mt-4">Connect Another Bank</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction Matching</CardTitle>
              <CardDescription>
                Configure how transactions are matched to tenants and expenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Automatic Matching Rules</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure how incoming transactions are matched with tenants and properties
                    </p>
                  </div>
                  <Button variant="outline">Configure Rules</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Unmatched Transactions</h3>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-amber-600">8</span> transactions need review
                    </p>
                  </div>
                  <Button>Review Transactions</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quickbooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>QuickBooks Integration</CardTitle>
              <CardDescription>
                Synchronize your accounting data with QuickBooks Online
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-4 border rounded-lg bg-muted/30">
                  <div className="flex-1">
                    <h3 className="font-medium">Integration Status</h3>
                    <div className="flex items-center gap-1 text-sm text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Connected</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Last synced: Today at 9:30 AM</p>
                  </div>
                  <Button variant="outline">Manage Connection</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Income Sync</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      All income transactions are automatically synced to QuickBooks
                    </p>
                    <Button size="sm" variant="outline" className="mt-2">Configure</Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Expense Sync</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      All expense transactions are automatically synced to QuickBooks
                    </p>
                    <Button size="sm" variant="outline" className="mt-2">Configure</Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg mt-4 bg-amber-50">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-amber-800">Chart of Accounts</h3>
                      <p className="text-sm text-amber-700">
                        Your QuickBooks chart of accounts needs to be mapped to PropertyManager accounts.
                        This ensures transactions are properly categorized in QuickBooks.
                      </p>
                      <Button size="sm" variant="outline" className="mt-2">Map Accounts</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Placeholder for Help section with Tool icon */}
      <div>
        <Button>
          <Wrench className="mr-2 h-4 w-4"/> Help
        </Button>
      </div>
    </div>
  );
}