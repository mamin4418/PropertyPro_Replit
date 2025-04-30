
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Plus, FileText, Search, Filter, ArrowUpDown, Download, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UtilityManagement = () => {
  const [, navigate] = useLocation();
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  const [utilityAccounts, setUtilityAccounts] = useState<any[]>([]);
  const [utilityBills, setUtilityBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchUtilityData = async () => {
      try {
        setLoading(true);
        
        // Fetch utility accounts
        const accountsResponse = await fetch('/api/utilities/accounts');
        if (!accountsResponse.ok) {
          throw new Error('Failed to fetch utility accounts');
        }
        const accountsData = await accountsResponse.json();
        setUtilityAccounts(accountsData);
        
        // Fetch utility bills
        const billsResponse = await fetch('/api/utilities/bills');
        if (!billsResponse.ok) {
          throw new Error('Failed to fetch utility bills');
        }
        const billsData = await billsResponse.json();
        setUtilityBills(billsData);
        
      } catch (error) {
        console.error('Error fetching utility data:', error);
        toast({
          title: "Error",
          description: "Failed to load utility data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUtilityData();
  }, [toast]);

  // Use API data, fallback to sample data if API fails
  const displayUtilityAccounts = utilityAccounts.length ? utilityAccounts : [
    {
      id: 1,
      propertyId: 1,
      propertyName: "Sunset Heights",
      utilityType: "Electricity",
      provider: "PowerCo Energy",
      accountNumber: "EL-12345-789",
      meterNumber: "MT-98765",
      billingCycle: "Monthly",
      averageCost: 450,
      status: "active"
    },
    {
      id: 2,
      propertyId: 1,
      propertyName: "Sunset Heights",
      utilityType: "Water",
      provider: "City Water Services",
      accountNumber: "WT-56789-123",
      meterNumber: "MT-45678",
      billingCycle: "Quarterly",
      averageCost: 320,
      status: "active"
    },
    {
      id: 3,
      propertyId: 2,
      propertyName: "Maple Gardens",
      utilityType: "Gas",
      provider: "NaturalGas Co.",
      accountNumber: "GS-98765-432",
      meterNumber: "MT-34521",
      billingCycle: "Monthly",
      averageCost: 180,
      status: "active"
    },
    {
      id: 4,
      propertyId: 3,
      propertyName: "Urban Lofts",
      utilityType: "Internet",
      provider: "FastConnect ISP",
      accountNumber: "IN-54321-987",
      meterNumber: "N/A",
      billingCycle: "Monthly",
      averageCost: 89,
      status: "active"
    },
    {
      id: 5,
      propertyId: 2,
      propertyName: "Maple Gardens",
      utilityType: "Electricity",
      provider: "PowerCo Energy",
      accountNumber: "EL-67890-543",
      meterNumber: "MT-76543",
      billingCycle: "Monthly",
      averageCost: 380,
      status: "active"
    },
  ];
  
  // Use API data, fallback to sample data if API fails
  const displayUtilityBills = utilityBills.length ? utilityBills : [
    {
      id: 1,
      utilityAccountId: 1,
      propertyName: "Sunset Heights",
      utilityType: "Electricity",
      billDate: "2023-06-01",
      dueDate: "2023-06-15",
      amount: 445.78,
      consumption: "4,823 kWh",
      status: "paid",
      paidDate: "2023-06-10"
    },
    {
      id: 2,
      utilityAccountId: 1,
      propertyName: "Sunset Heights",
      utilityType: "Electricity",
      billDate: "2023-07-01",
      dueDate: "2023-07-15",
      amount: 467.92,
      consumption: "5,102 kWh",
      status: "paid",
      paidDate: "2023-07-12"
    },
    {
      id: 3,
      utilityAccountId: 2,
      propertyName: "Sunset Heights",
      utilityType: "Water",
      billDate: "2023-06-01",
      dueDate: "2023-06-30",
      amount: 315.45,
      consumption: "28,450 gal",
      status: "paid",
      paidDate: "2023-06-25"
    },
    {
      id: 4,
      utilityAccountId: 3,
      propertyName: "Maple Gardens",
      utilityType: "Gas",
      billDate: "2023-07-01",
      dueDate: "2023-07-21",
      amount: 178.32,
      consumption: "148 therms",
      status: "due",
      paidDate: null
    },
    {
      id: 5,
      utilityAccountId: 5,
      propertyName: "Maple Gardens",
      utilityType: "Electricity",
      billDate: "2023-07-01",
      dueDate: "2023-07-25",
      amount: 392.17,
      consumption: "4,235 kWh",
      status: "overdue",
      paidDate: null
    },
  ];

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
            <CardDescription>Number of upcoming or overdue bills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {displayUtilityBills.filter(bill => bill.status === "due" || bill.status === "overdue").length}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for different views */}
      <Tabs defaultValue="accounts" className="mb-6">
        <TabsList>
          <TabsTrigger value="accounts">Utility Accounts</TabsTrigger>
          <TabsTrigger value="bills">Bills & Payments</TabsTrigger>
          <TabsTrigger value="consumption">Consumption Analytics</TabsTrigger>
        </TabsList>
        
        {/* Utility Accounts Tab */}
        <TabsContent value="accounts">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Active Utility Accounts</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search accounts..."
                      className="pl-8 w-[200px] md:w-[300px]"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Account #</TableHead>
                    <TableHead>Meter #</TableHead>
                    <TableHead>Billing Cycle</TableHead>
                    <TableHead>Avg. Cost</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.propertyName}</TableCell>
                      <TableCell>{account.utilityType}</TableCell>
                      <TableCell>{account.provider}</TableCell>
                      <TableCell>{account.accountNumber}</TableCell>
                      <TableCell>{account.meterNumber}</TableCell>
                      <TableCell>{account.billingCycle}</TableCell>
                      <TableCell>${account.averageCost}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          account.status === "active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/view-utility-account/${account.id}`)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/edit-utility-account/${account.id}`)}>
                              Edit Account
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/add-utility-bill/${account.id}`)}>
                              Add Bill
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Deactivate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Bills & Payments Tab */}
        <TabsContent value="bills">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Recent Utility Bills</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search bills..."
                      className="pl-8 w-[200px] md:w-[300px]"
                    />
                  </div>
                  <Button variant="outline" onClick={() => navigate("/add-utility-bill")}>
                    <Plus className="mr-2 h-4 w-4" /> Add Bill
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Utility Type</TableHead>
                    <TableHead>Bill Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Consumption</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBills.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell className="font-medium">{bill.propertyName}</TableCell>
                      <TableCell>{bill.utilityType}</TableCell>
                      <TableCell>{bill.billDate}</TableCell>
                      <TableCell>{bill.dueDate}</TableCell>
                      <TableCell>${bill.amount.toFixed(2)}</TableCell>
                      <TableCell>{bill.consumption}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          bill.status === "paid" ? "bg-green-100 text-green-700" : 
                          bill.status === "due" ? "bg-blue-100 text-blue-700" : 
                          "bg-red-100 text-red-700"
                        }`}>
                          {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/view-utility-bill/${bill.id}`)}>
                              View Details
                            </DropdownMenuItem>
                            {bill.status !== "paid" && (
                              <DropdownMenuItem onClick={() => navigate(`/pay-utility-bill/${bill.id}`)}>
                                Mark as Paid
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" /> Download PDF
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Consumption Analytics Tab */}
        <TabsContent value="consumption">
          <Card>
            <CardHeader>
              <CardTitle>Utility Consumption Analytics</CardTitle>
              <CardDescription>
                Track and analyze utility consumption patterns across all properties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <Select defaultValue="electricity">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Utility Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electricity">Electricity</SelectItem>
                      <SelectItem value="water">Water</SelectItem>
                      <SelectItem value="gas">Gas</SelectItem>
                      <SelectItem value="internet">Internet</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="6">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Time Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">Last 3 Months</SelectItem>
                      <SelectItem value="6">Last 6 Months</SelectItem>
                      <SelectItem value="12">Last 12 Months</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Export Data
                </Button>
              </div>
              
              {/* Placeholder for consumption chart */}
              <div className="h-80 border border-dashed rounded-md flex items-center justify-center">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Consumption Analytics Chart</h3>
                  <p className="mt-2 text-muted-foreground">
                    Visualization of consumption patterns over time
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Average Monthly Consumption</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4,680 kWh</div>
                    <p className="text-sm text-muted-foreground">
                      <span className="text-green-600">↓ 3.2%</span> compared to previous period
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Cost per Unit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$0.098 / kWh</div>
                    <p className="text-sm text-muted-foreground">
                      <span className="text-red-600">↑ 1.5%</span> compared to previous period
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UtilityManagement;
