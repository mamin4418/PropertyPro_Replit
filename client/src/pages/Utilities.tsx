
import React, { useState, useEffect } from "react";
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, Badge } from "@/components/ui";
import { Plus, Building, Zap, Droplets, Flame, Trash2, Receipt, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";

interface UtilityAccount {
  id: number;
  propertyId: number;
  propertyName: string;
  utilityProvider: string;
  accountNumber: string;
  utilityType: string;
  status: string;
}

interface UtilityBill {
  id: number;
  utilityAccountId: number;
  propertyId: number;
  amount: number;
  dueDate: string | Date;
  status: string;
}

export function Utilities() {
  const [utilityAccounts, setUtilityAccounts] = useState<UtilityAccount[]>([]);
  const [utilityBills, setUtilityBills] = useState<UtilityBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUtilities = async () => {
      try {
        setLoading(true);
        
        // Sample data as fallback
        const sampleAccounts = [
          {
            id: 1,
            propertyId: 1,
            propertyName: "Sunset Heights",
            utilityProvider: "City Water",
            accountNumber: "W-123456",
            utilityType: "Water",
            status: "active"
          },
          {
            id: 2,
            propertyId: 1,
            propertyName: "Sunset Heights",
            utilityProvider: "Edison Electric",
            accountNumber: "E-789012",
            utilityType: "Electricity",
            status: "active"
          },
          {
            id: 3,
            propertyId: 2,
            propertyName: "Maple Gardens",
            utilityProvider: "Natural Gas Co",
            accountNumber: "G-345678",
            utilityType: "Gas",
            status: "active"
          }
        ];

        const sampleBills = [
          {
            id: 1,
            utilityAccountId: 1,
            propertyId: 1,
            amount: 125.50,
            dueDate: new Date("2023-08-15"),
            status: "paid"
          },
          {
            id: 2,
            utilityAccountId: 2,
            propertyId: 1,
            amount: 210.75,
            dueDate: new Date("2023-08-20"),
            status: "unpaid"
          },
          {
            id: 3,
            utilityAccountId: 3,
            propertyId: 2,
            amount: 85.25,
            dueDate: new Date("2023-08-25"),
            status: "overdue"
          }
        ];

        try {
          const accountsRes = await fetch('/api/utilities/accounts');
          if (accountsRes.ok) {
            const accountsData = await accountsRes.json();
            setUtilityAccounts(accountsData.length > 0 ? accountsData : sampleAccounts);
          } else {
            console.warn("Using sample utility accounts due to API error");
            setUtilityAccounts(sampleAccounts);
          }

          const billsRes = await fetch('/api/utilities/bills');
          if (billsRes.ok) {
            const billsData = await billsRes.json();
            setUtilityBills(billsData.length > 0 ? billsData : sampleBills);
          } else {
            console.warn("Using sample utility bills due to API error");
            setUtilityBills(sampleBills);
          }
          
          setError(null);
        } catch (err) {
          console.warn("Error fetching utilities data, using fallback data", err);
          setUtilityAccounts(sampleAccounts);
          setUtilityBills(sampleBills);
        }
      } catch (error) {
        console.error('Error in utilities component:', error);
        setError('An error occurred while loading utilities data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUtilities();
  }, []);

  const addUtilityAccount = () => {
    navigate('/add-utility-account');
  };

  const getUtilityIcon = (type: string) => {
    if (!type) return <Building className="h-5 w-5 text-gray-500" />;

    switch (type.toLowerCase()) {
      case 'electricity':
        return <Zap className="h-5 w-5 text-yellow-500" />;
      case 'water':
        return <Droplets className="h-5 w-5 text-blue-500" />;
      case 'gas':
        return <Flame className="h-5 w-5 text-orange-500" />;
      case 'trash':
        return <Trash2 className="h-5 w-5 text-gray-500" />;
      default:
        return <Building className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';

    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'unpaid':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateStr: string | Date) => {
    if (!dateStr) return 'N/A';

    try {
      const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
      return date.toLocaleDateString();
    } catch (e) {
      console.error("Error formatting date:", dateStr, e);
      return 'Invalid date';
    }
  };

  const getBillStatusIcon = (status: string) => {
    if (!status) return null;

    switch (status.toLowerCase()) {
      case 'paid':
        return null;
      case 'unpaid':
        return <Receipt className="h-5 w-5 text-yellow-500" />;
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  // Safely merge bills with account info
  const mergedBills = utilityBills.map(bill => {
    const account = utilityAccounts.find(acc => acc.id === bill.utilityAccountId);
    return {
      ...bill,
      utilityProvider: account?.utilityProvider || 'Unknown Provider',
      utilityType: account?.utilityType || 'Unknown Type',
      propertyName: account?.propertyName || 'Unknown Property'
    };
  });

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading utilities...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <PageBreadcrumb
        items={[
          { label: 'Dashboard', link: '/' },
          { label: 'Utilities Management', link: '/utilities' }
        ]}
      />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Utilities Management</h1>
        <Button onClick={addUtilityAccount}>
          <Plus className="mr-2 h-4 w-4" /> Add Utility Account
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      <Tabs defaultValue="accounts">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="accounts">Utility Accounts</TabsTrigger>
          <TabsTrigger value="bills">Utility Bills</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {utilityAccounts && utilityAccounts.length > 0 ? (
              utilityAccounts.map((account) => (
                <Card key={account.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{account.utilityType || 'Utility'}</CardTitle>
                        <CardDescription>{account.propertyName || 'Property'}</CardDescription>
                      </div>
                      {getUtilityIcon(account.utilityType)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Provider:</span>
                        <span className="text-sm font-medium">{account.utilityProvider || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Account #:</span>
                        <span className="text-sm font-medium">{account.accountNumber || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <Badge className={getStatusColor(account.status)}>{account.status || 'Unknown'}</Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="outline" className="w-full">Manage Account</Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No utility accounts found.</p>
                <Button variant="outline" className="mt-4" onClick={addUtilityAccount}>
                  <Plus className="mr-2 h-4 w-4" /> Add Utility Account
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="bills">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mergedBills && mergedBills.length > 0 ? (
              mergedBills.map((bill) => (
                <Card key={bill.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{bill.utilityType || 'Utility'}</CardTitle>
                        <CardDescription>{bill.propertyName || 'Property'}</CardDescription>
                      </div>
                      {getUtilityIcon(bill.utilityType)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Provider:</span>
                        <span className="text-sm font-medium">{bill.utilityProvider || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Amount:</span>
                        <span className="text-sm font-medium">{typeof bill.amount === 'number' ? formatAmount(bill.amount) : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Due Date:</span>
                        <span className="text-sm font-medium">{formatDate(bill.dueDate)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <div className="flex items-center gap-1">
                          {getBillStatusIcon(bill.status)}
                          <Badge className={getStatusColor(bill.status)}>{bill.status || 'Unknown'}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="outline" className="w-full">View Bill</Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No utility bills found.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Utilities;
