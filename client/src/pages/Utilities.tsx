
import React, { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, Badge } from "@/components/ui";
import { Building, Zap, Droplets, Flame, ChevronRight } from "lucide-react";

// Simple interface for utility data
interface UtilityAccount {
  id: number;
  propertyName: string;
  utilityProvider: string;
  accountNumber: string;
  utilityType: string;
  status: string;
}

interface UtilityBill {
  id: number;
  propertyName: string;
  utilityProvider: string;
  utilityType: string;
  amount: number;
  dueDate: string;
  status: string;
}

// Static sample data to avoid API dependencies
const sampleAccounts: UtilityAccount[] = [
  {
    id: 1,
    propertyName: "Sunset Heights",
    utilityProvider: "City Water",
    accountNumber: "W-123456",
    utilityType: "Water",
    status: "active"
  },
  {
    id: 2,
    propertyName: "Sunset Heights",
    utilityProvider: "Edison Electric",
    accountNumber: "E-789012",
    utilityType: "Electricity",
    status: "active"
  },
  {
    id: 3,
    propertyName: "Maple Gardens",
    utilityProvider: "Natural Gas Co",
    accountNumber: "G-345678",
    utilityType: "Gas",
    status: "active"
  }
];

const sampleBills: UtilityBill[] = [
  {
    id: 1,
    propertyName: "Sunset Heights",
    utilityProvider: "City Water",
    utilityType: "Water",
    amount: 125.50,
    dueDate: "2023-08-15",
    status: "paid"
  },
  {
    id: 2,
    propertyName: "Sunset Heights",
    utilityProvider: "Edison Electric",
    utilityType: "Electricity",
    amount: 210.75,
    dueDate: "2023-08-20",
    status: "unpaid"
  },
  {
    id: 3,
    propertyName: "Maple Gardens",
    utilityProvider: "Natural Gas Co",
    utilityType: "Gas",
    amount: 85.25,
    dueDate: "2023-08-25",
    status: "overdue"
  }
];

const Utilities: React.FC = () => {
  const [activeTab, setActiveTab] = useState("accounts");

  // Utility functions
  const getUtilityIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'electricity':
        return <Zap className="h-5 w-5 text-yellow-500" />;
      case 'water':
        return <Droplets className="h-5 w-5 text-blue-500" />;
      case 'gas':
        return <Flame className="h-5 w-5 text-orange-500" />;
      default:
        return <Building className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Simple breadcrumb */}
      <div className="mb-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <a href="/" className="text-sm text-blue-600 hover:underline">Dashboard</a>
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="ml-2 text-sm text-gray-700">Utilities Management</span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Utilities Management</h1>
        <Button>Add Utility Account</Button>
      </div>

      {/* Tabs */}
      <Tabs 
        defaultValue="accounts" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="accounts">Utility Accounts</TabsTrigger>
          <TabsTrigger value="bills">Utility Bills</TabsTrigger>
        </TabsList>

        {/* Accounts Tab */}
        <TabsContent value="accounts">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleAccounts.map((account) => (
              <Card key={account.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{account.utilityType}</CardTitle>
                      <p className="text-sm text-gray-500">{account.propertyName}</p>
                    </div>
                    {getUtilityIcon(account.utilityType)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Provider:</span>
                      <span className="text-sm font-medium">{account.utilityProvider}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Account #:</span>
                      <span className="text-sm font-medium">{account.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Status:</span>
                      <Badge className={getStatusColor(account.status)}>{account.status}</Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">Manage Account</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Bills Tab */}
        <TabsContent value="bills">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleBills.map((bill) => (
              <Card key={bill.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{bill.utilityType}</CardTitle>
                      <p className="text-sm text-gray-500">{bill.propertyName}</p>
                    </div>
                    {getUtilityIcon(bill.utilityType)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Provider:</span>
                      <span className="text-sm font-medium">{bill.utilityProvider}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Amount:</span>
                      <span className="text-sm font-medium">{formatCurrency(bill.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Due Date:</span>
                      <span className="text-sm font-medium">{bill.dueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Status:</span>
                      <Badge className={getStatusColor(bill.status)}>{bill.status}</Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">View Bill</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Utilities;
