import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Zap, FileText, AlertCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface UtilityAccount {
  id: number;
  propertyId: number;
  propertyName?: string;
  utilityProvider: string;
  accountNumber: string;
  serviceType?: string;
  billingCycle?: string;
  autoPayEnabled?: boolean;
  notes?: string;
  status?: string;
  paymentMethod?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UtilityBill {
  id: number;
  utilityAccountId: number;
  propertyId: number;
  amount: number;
  dueDate: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  isPaid?: boolean;
  paidDate?: string;
  paidAmount?: number;
  billPdf?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function Utilities() {
  const [accounts, setAccounts] = useState<UtilityAccount[]>([]);
  const [bills, setBills] = useState<UtilityBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUtilities() {
      try {
        setLoading(true);
        // Fetch utility accounts
        const accountsResponse = await fetch('/api/utilities/accounts');
        if (!accountsResponse.ok) {
          throw new Error(`Failed to fetch utility accounts: ${accountsResponse.statusText}`);
        }
        const accountsData = await accountsResponse.json();
        setAccounts(accountsData);

        // Fetch utility bills
        const billsResponse = await fetch('/api/utilities/bills');
        if (!billsResponse.ok) {
          throw new Error(`Failed to fetch utility bills: ${billsResponse.statusText}`);
        }
        const billsData = await billsResponse.json();
        setBills(billsData);

        setError(null);
      } catch (err) {
        console.error('Error fetching utilities:', err);
        setError('Failed to load utility data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchUtilities();
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;

    switch (status.toLowerCase()) {
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Inactive</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Paid</Badge>;
      case 'unpaid':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Unpaid</Badge>;
      case 'overdue':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Utility Management</h1>
        <Link to="/add-utility-account">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Utility Account
          </Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 mb-6 rounded-md border border-red-200">
          <AlertCircle className="h-5 w-5 inline mr-2" />
          {error}
        </div>
      )}

      <Tabs defaultValue="accounts">
        <TabsList className="mb-4">
          <TabsTrigger value="accounts">Utility Accounts</TabsTrigger>
          <TabsTrigger value="bills">Utility Bills</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts">
          {loading ? (
            <div className="text-center p-8">
              <Clock className="h-8 w-8 mx-auto mb-2 animate-spin text-muted-foreground" />
              <p>Loading utility accounts...</p>
            </div>
          ) : accounts.length === 0 ? (
            <div className="text-center p-8 border rounded-md bg-muted/20">
              <Zap className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <h3 className="text-lg font-medium">No utility accounts</h3>
              <p className="text-muted-foreground mt-1">Add your first utility account to get started</p>
              <Link to="/add-utility-account" className="mt-4 inline-block">
                <Button>Add Utility Account</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accounts.map((account) => (
                <Card key={account.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{account.utilityProvider}</CardTitle>
                      {getStatusBadge(account.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Account #:</span>
                        <span>{account.accountNumber}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Property:</span>
                        <span>{account.propertyName || `Property ${account.propertyId}`}</span>
                      </div>
                      {account.serviceType && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Service:</span>
                          <span>{account.serviceType}</span>
                        </div>
                      )}
                      {account.billingCycle && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Billing Cycle:</span>
                          <span>{account.billingCycle}</span>
                        </div>
                      )}
                      {account.autoPayEnabled !== undefined && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">AutoPay:</span>
                          <span>{account.autoPayEnabled ? 'Enabled' : 'Disabled'}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-end space-x-2">
                      <Link to={`/utility-accounts/${account.id}`}>
                        <Button variant="outline" size="sm">View Details</Button>
                      </Link>
                      <Button size="sm">Add Bill</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="bills">
          {loading ? (
            <div className="text-center p-8">
              <Clock className="h-8 w-8 mx-auto mb-2 animate-spin text-muted-foreground" />
              <p>Loading utility bills...</p>
            </div>
          ) : bills.length === 0 ? (
            <div className="text-center p-8 border rounded-md bg-muted/20">
              <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <h3 className="text-lg font-medium">No utility bills</h3>
              <p className="text-muted-foreground mt-1">Add bills to your utility accounts to get started</p>
              <Button className="mt-4">Add Utility Bill</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bills.map((bill) => {
                const account = accounts.find(a => a.id === bill.utilityAccountId);
                const isPastDue = new Date(bill.dueDate) < new Date() && !(bill.isPaid || bill.status === 'paid');

                return (
                  <Card key={bill.id} className={`overflow-hidden ${isPastDue ? 'border-red-300' : ''}`}>
                    <CardHeader className={`${isPastDue ? 'bg-red-50' : 'bg-muted/30'} pb-3`}>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">
                          {account ? account.utilityProvider : `Account #${bill.utilityAccountId}`}
                        </CardTitle>
                        {bill.status ? getStatusBadge(bill.status) : getStatusBadge(bill.isPaid ? 'paid' : isPastDue ? 'overdue' : 'unpaid')}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="font-medium">{formatCurrency(bill.amount)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Due Date:</span>
                          <span className={isPastDue ? 'text-red-600 font-medium' : ''}>
                            {formatDate(bill.dueDate)}
                          </span>
                        </div>
                        {bill.startDate && bill.endDate && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Service Period:</span>
                            <span>{formatDate(bill.startDate)} - {formatDate(bill.endDate)}</span>
                          </div>
                        )}
                        {bill.paidDate && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Paid On:</span>
                            <span>{formatDate(bill.paidDate)}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 pt-4 border-t flex justify-end space-x-2">
                        <Link to={`/utility-bills/${bill.id}`}>
                          <Button variant="outline" size="sm">View Details</Button>
                        </Link>
                        {!(bill.isPaid || bill.status === 'paid') && (
                          <Button size="sm">Mark as Paid</Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}