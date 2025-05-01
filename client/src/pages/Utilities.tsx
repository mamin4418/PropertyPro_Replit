
import { useState } from "react";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bolt, CalendarClock, ChevronDown, ChevronRight, Clock, DollarSign, Download, FileText, Filter, Home, Plus, Search } from "lucide-react";

export default function Utilities() {
  const [_, navigate] = useLocation();
  const [selectedProperty, setSelectedProperty] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedAccount, setExpandedAccount] = useState<number | null>(null);
  const [expandedBill, setExpandedBill] = useState<number | null>(null);
  
  // Fake data for utilities
  const utilityAccounts = [
    {
      id: 1,
      propertyId: 1,
      propertyName: "Sunset Heights",
      utilityType: "Electricity",
      provider: "Pacific Power",
      accountNumber: "EL-12345-ST",
      setupDate: "2022-01-15",
      status: "active",
      averageCost: 350,
      nextReading: "2023-08-25",
      paymentMethod: "Auto-pay",
      billingAddress: "123 Main St, Anytown, CA 12345",
      lastBillAmount: 375.82
    },
    {
      id: 2,
      propertyId: 1,
      propertyName: "Sunset Heights",
      utilityType: "Water",
      provider: "City Water",
      accountNumber: "WA-67890-ST",
      setupDate: "2022-01-15",
      status: "active",
      averageCost: 120,
      nextReading: "2023-08-20",
      paymentMethod: "Manual",
      billingAddress: "123 Main St, Anytown, CA 12345",
      lastBillAmount: 105.50
    },
    {
      id: 3,
      propertyId: 2,
      propertyName: "Maple Gardens",
      utilityType: "Gas",
      provider: "National Gas",
      accountNumber: "GS-54321-MG",
      setupDate: "2021-11-10",
      status: "active",
      averageCost: 200,
      nextReading: "2023-08-18",
      paymentMethod: "Auto-pay",
      billingAddress: "456 Elm St, Anytown, CA 12345",
      lastBillAmount: 185.25
    },
    {
      id: 4,
      propertyId: 3,
      propertyName: "Urban Lofts",
      utilityType: "Internet",
      provider: "SpeedFiber",
      accountNumber: "IN-98765-UL",
      setupDate: "2022-03-05",
      status: "active",
      averageCost: 89,
      nextReading: null,
      paymentMethod: "Auto-pay",
      billingAddress: "789 Oak Ave, Anytown, CA 12345",
      lastBillAmount: 89.99
    }
  ];
  
  const utilityBills = [
    {
      id: 1,
      utilityAccountId: 1,
      billDate: "2023-07-25",
      dueDate: "2023-08-15",
      amount: 375.82,
      consumption: "1,250 kWh",
      startDate: "2023-06-25",
      endDate: "2023-07-25",
      status: "unpaid",
      uploadedBill: "bill-el-123456-july.pdf"
    },
    {
      id: 2,
      utilityAccountId: 1,
      billDate: "2023-06-25",
      dueDate: "2023-07-15",
      amount: 355.50,
      consumption: "1,185 kWh",
      startDate: "2023-05-25",
      endDate: "2023-06-25",
      status: "paid",
      paymentDate: "2023-07-10",
      paymentMethod: "Auto-pay",
      uploadedBill: "bill-el-123456-june.pdf"
    },
    {
      id: 3,
      utilityAccountId: 2,
      billDate: "2023-07-20",
      dueDate: "2023-08-10",
      amount: 105.50,
      consumption: "2,500 gal",
      startDate: "2023-06-20",
      endDate: "2023-07-20",
      status: "unpaid",
      uploadedBill: "bill-wa-67890-july.pdf"
    },
    {
      id: 4,
      utilityAccountId: 3,
      billDate: "2023-07-18",
      dueDate: "2023-08-08",
      amount: 185.25,
      consumption: "125 therms",
      startDate: "2023-06-18",
      endDate: "2023-07-18",
      status: "unpaid",
      uploadedBill: "bill-gs-54321-july.pdf"
    },
    {
      id: 5,
      utilityAccountId: 4,
      billDate: "2023-07-05",
      dueDate: "2023-07-25",
      amount: 89.99,
      consumption: "Unlimited",
      startDate: "2023-07-05",
      endDate: "2023-08-05",
      status: "paid",
      paymentDate: "2023-07-20",
      paymentMethod: "Auto-pay",
      uploadedBill: "bill-in-98765-aug.pdf"
    }
  ];
  
  // For display - adds property name to bills
  const displayUtilityAccounts = utilityAccounts.map(account => account);
  
  const displayUtilityBills = utilityBills.map(bill => {
    const account = utilityAccounts.find(acc => acc.id === bill.utilityAccountId);
    return {
      ...bill,
      propertyId: account?.propertyId,
      propertyName: account?.propertyName,
      utilityType: account?.utilityType,
      provider: account?.provider
    };
  });
  
  // Filter utilities based on selected property
  const filteredAccounts = selectedProperty === "all" 
    ? displayUtilityAccounts 
    : displayUtilityAccounts.filter(account => account.propertyId.toString() === selectedProperty);
  
  const filteredBills = selectedProperty === "all"
    ? displayUtilityBills
    : displayUtilityBills.filter(bill => {
        const account = displayUtilityAccounts.find(acc => acc.id === bill.utilityAccountId);
        return account && account.propertyId.toString() === selectedProperty;
      });
  
  // Mock properties for the dropdown
  const properties = [
    { id: 1, name: "Sunset Heights" },
    { id: 2, name: "Maple Gardens" },
    { id: 3, name: "Urban Lofts" },
  ];
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Utility Management</h1>
          <p className="text-muted-foreground">Track and manage utility accounts, bills, and consumption</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedProperty} onValueChange={setSelectedProperty}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.id.toString()}>
                  {property.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => navigate("/add-utility-account")}>
            <Plus className="mr-2 h-4 w-4" /> Add Utility Account
          </Button>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Utilities</CardTitle>
            <CardDescription>Number of active utility accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{utilityAccounts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <CardDescription>Average monthly utility expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${displayUtilityAccounts.reduce((sum, account) => sum + account.averageCost, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Bills Due</CardTitle>
            <CardDescription>Number of unpaid utility bills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {displayUtilityBills.filter(bill => bill.status === "unpaid").length}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Search Bar and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search utilities..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Tabs for Accounts and Bills */}
      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts">
            <Bolt className="mr-2 h-4 w-4" />
            Utility Accounts
          </TabsTrigger>
          <TabsTrigger value="bills">
            <FileText className="mr-2 h-4 w-4" />
            Utility Bills
          </TabsTrigger>
        </TabsList>
        
        {/* Utility Accounts Tab */}
        <TabsContent value="accounts">
          <div className="space-y-4">
            {filteredAccounts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <Bolt className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold">No utility accounts</h3>
                  <p className="text-muted-foreground mt-2">
                    No utility accounts for the selected property.
                  </p>
                  <Button onClick={() => navigate("/add-utility-account")} className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Utility Account
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredAccounts.map((account) => (
                <Card key={account.id} className="overflow-hidden">
                  <div 
                    className="p-4 cursor-pointer" 
                    onClick={() => setExpandedAccount(expandedAccount === account.id ? null : account.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Bolt className="h-5 w-5 text-muted-foreground mr-2" />
                        <div>
                          <h3 className="text-lg font-semibold">{account.utilityType} - {account.provider}</h3>
                          <p className="text-sm text-muted-foreground">{account.propertyName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={account.status === "active" ? "default" : "secondary"}>
                          {account.status}
                        </Badge>
                        {expandedAccount === account.id ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {expandedAccount === account.id && (
                    <CardContent className="border-t pt-4 pb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Account Number</p>
                            <p>{account.accountNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Setup Date</p>
                            <p>{account.setupDate}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                            <p>{account.paymentMethod}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Last Bill Amount</p>
                            <p className="font-medium">${account.lastBillAmount.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Average Monthly Cost</p>
                            <p className="font-medium">${account.averageCost.toFixed(2)}</p>
                          </div>
                          {account.nextReading && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Next Reading</p>
                              <p>{account.nextReading}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end mt-4 gap-2">
                        <Button variant="outline" size="sm">
                          Edit Account
                        </Button>
                        <Button variant="outline" size="sm">
                          Usage History
                        </Button>
                        <Button size="sm" onClick={() => navigate(`/add-utility-bill/${account.id}`)}>
                          <Plus className="mr-1 h-3 w-3" />
                          Add Bill
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        {/* Utility Bills Tab */}
        <TabsContent value="bills">
          <div className="space-y-4">
            {filteredBills.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold">No utility bills</h3>
                  <p className="text-muted-foreground mt-2">
                    No utility bills for the selected property.
                  </p>
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Utility Bill
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredBills.map((bill) => (
                <Card key={bill.id} className="overflow-hidden">
                  <div 
                    className="p-4 cursor-pointer" 
                    onClick={() => setExpandedBill(expandedBill === bill.id ? null : bill.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                        <div>
                          <h3 className="text-lg font-semibold">
                            {bill.utilityType} - {bill.provider}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {bill.propertyName} • Bill Date: {bill.billDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <p className="font-medium">${bill.amount.toFixed(2)}</p>
                          <Badge variant={bill.status === "paid" ? "outline" : "default"}>
                            {bill.status}
                          </Badge>
                        </div>
                        {expandedBill === bill.id ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {expandedBill === bill.id && (
                    <CardContent className="border-t pt-4 pb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Bill Date</p>
                            <p>{bill.billDate}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                            <div className="flex items-center">
                              <p>{bill.dueDate}</p>
                              {bill.status === "unpaid" && new Date(bill.dueDate) < new Date() && (
                                <Badge variant="destructive" className="ml-2">Overdue</Badge>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Service Period</p>
                            <p>{bill.startDate} to {bill.endDate}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Amount</p>
                            <p className="font-medium">${bill.amount.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Consumption</p>
                            <p>{bill.consumption}</p>
                          </div>
                          {bill.status === "paid" && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Payment Date</p>
                              <p>{bill.paymentDate} via {bill.paymentMethod}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end mt-4 gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="mr-1 h-3 w-3" />
                          Download
                        </Button>
                        {bill.status === "unpaid" ? (
                          <Button size="sm">
                            <DollarSign className="mr-1 h-3 w-3" />
                            Record Payment
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm">
                            View Payment
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
