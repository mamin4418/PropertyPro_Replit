
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Plus,
  Zap,
  FileText,
  Droplet,
  Trash2,
  Signal,
  BarChart2,
  Check,
  Search,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";

interface UtilityAccount {
  id: number;
  propertyId: number;
  propertyName: string;
  type: string;
  provider: string;
  accountNumber: string;
  dueDate: number;
  status: string;
}

interface UtilityBill {
  id: number;
  utilityAccountId: number;
  propertyId: number;
  amount: number;
  dueDate: Date;
  status: string;
}

const utilityTypeIcons: Record<string, React.ReactNode> = {
  'electricity': <Zap className="h-5 w-5 text-yellow-500" />,
  'water': <Droplet className="h-5 w-5 text-blue-500" />,
  'gas': <Signal className="h-5 w-5 text-orange-500" />,
  'internet': <Signal className="h-5 w-5 text-purple-500" />,
  'trash': <Trash2 className="h-5 w-5 text-green-500" />,
  'default': <FileText className="h-5 w-5 text-gray-500" />
};

const Utilities: React.FC = () => {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("accounts");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Fetch utility accounts
  const { data: utilityAccounts, isLoading: loadingAccounts } = useQuery({
    queryKey: ["utilityAccounts"],
    queryFn: async () => {
      const res = await fetch('/api/utility-accounts');
      if (!res.ok) throw new Error('Failed to fetch utility accounts');
      return res.json() as Promise<UtilityAccount[]>;
    }
  });

  // Fetch utility bills
  const { data: utilityBills, isLoading: loadingBills } = useQuery({
    queryKey: ["utilityBills"],
    queryFn: async () => {
      const res = await fetch('/api/utility-bills');
      if (!res.ok) throw new Error('Failed to fetch utility bills');
      return res.json() as Promise<UtilityBill[]>;
    }
  });

  // Sample data in case API returns empty results
  const sampleAccounts: UtilityAccount[] = [
    {
      id: 1,
      propertyId: 1,
      propertyName: "Sunset Heights",
      type: "electricity",
      provider: "Energy Plus",
      accountNumber: "EP-12345678",
      dueDate: 15,
      status: "active"
    },
    {
      id: 2,
      propertyId: 1,
      propertyName: "Sunset Heights",
      type: "water",
      provider: "City Water",
      accountNumber: "CW-87654321",
      dueDate: 20,
      status: "active"
    },
    {
      id: 3,
      propertyId: 2,
      propertyName: "Maple Gardens",
      type: "internet",
      provider: "Speedy Internet",
      accountNumber: "SI-11223344",
      dueDate: 5,
      status: "active"
    },
    {
      id: 4,
      propertyId: 3,
      propertyName: "Urban Lofts",
      type: "gas",
      provider: "City Gas",
      accountNumber: "CG-99887766",
      dueDate: 10,
      status: "inactive"
    }
  ];

  const sampleBills: UtilityBill[] = [
    {
      id: 1,
      utilityAccountId: 1,
      propertyId: 1,
      amount: 235.67,
      dueDate: new Date("2023-08-15"),
      status: "unpaid"
    },
    {
      id: 2,
      utilityAccountId: 2,
      propertyId: 1,
      amount: 87.35,
      dueDate: new Date("2023-08-20"),
      status: "paid"
    },
    {
      id: 3,
      utilityAccountId: 3,
      propertyId: 2,
      amount: 59.99,
      dueDate: new Date("2023-08-05"),
      status: "paid"
    },
    {
      id: 4,
      utilityAccountId: 1,
      propertyId: 1,
      amount: 243.12,
      dueDate: new Date("2023-07-15"),
      status: "paid"
    }
  ];

  // Use sample data if API returns empty
  const accounts = utilityAccounts?.length ? utilityAccounts : sampleAccounts;
  const bills = utilityBills?.length ? utilityBills : sampleBills;

  // Filter utility accounts based on search term and filters
  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = 
      searchTerm === "" || 
      account.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.accountNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "all" || account.status === selectedStatus;
    const matchesType = selectedType === "all" || account.type === selectedType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Filter utility bills based on search term
  const filteredBills = bills.filter(bill => {
    if (searchTerm === "") return true;
    
    // Find the related account
    const account = accounts.find(acc => acc.id === bill.utilityAccountId);
    
    return account?.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           account?.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
           bill.amount.toString().includes(searchTerm);
  });

  // Get icon for utility type
  const getUtilityIcon = (type: string) => {
    return utilityTypeIcons[type] || utilityTypeIcons.default;
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'unpaid':
        return <Badge className="bg-red-500">Unpaid</Badge>;
      case 'overdue':
        return <Badge className="bg-red-600">Overdue</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Utilities Management</h1>
          <p className="text-muted-foreground">Manage utility accounts and bills</p>
        </div>
        <Button onClick={() => setLocation("/add-utility-account")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Utility Account
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search utilities..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">
              Filters
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filter Utilities</DialogTitle>
              <DialogDescription>
                Select filters to narrow down the utility accounts
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Status</h4>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Utility Type</h4>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select utility type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="electricity">Electricity</SelectItem>
                    <SelectItem value="water">Water</SelectItem>
                    <SelectItem value="gas">Gas</SelectItem>
                    <SelectItem value="internet">Internet</SelectItem>
                    <SelectItem value="trash">Trash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                setSelectedStatus("all");
                setSelectedType("all");
              }}>
                Reset
              </Button>
              <Button type="button" onClick={() => setShowFilterDialog(false)}>
                Apply Filters
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button variant="outline" onClick={() => {
          // Set a state to show a chart modal or navigate to a reporting page
          alert('Utility cost reports feature coming soon!');
        }}>
          <BarChart2 className="mr-2 h-4 w-4" />
          Reports
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="accounts" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Utility Accounts
          </TabsTrigger>
          <TabsTrigger value="bills" className="flex items-center">
            <Zap className="mr-2 h-4 w-4" />
            Utility Bills
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="accounts">
          {loadingAccounts ? (
            <div className="text-center py-8">Loading utility accounts...</div>
          ) : filteredAccounts.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No utility accounts found</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedStatus !== "all" || selectedType !== "all" 
                  ? "Try adjusting your search or filters"
                  : "Add your first utility account to get started"}
              </p>
              {!(searchTerm || selectedStatus !== "all" || selectedType !== "all") && (
                <Button onClick={() => setLocation("/add-utility-account")} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Utility Account
                </Button>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Account Number</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getUtilityIcon(account.type)}
                            <span className="capitalize">{account.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>{account.propertyName}</TableCell>
                        <TableCell>{account.provider}</TableCell>
                        <TableCell>{account.accountNumber}</TableCell>
                        <TableCell>{account.dueDate}th of each month</TableCell>
                        <TableCell>{renderStatusBadge(account.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => alert(`View account ${account.id}`)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="bills">
          {loadingBills ? (
            <div className="text-center py-8">Loading utility bills...</div>
          ) : filteredBills.length === 0 ? (
            <div className="text-center py-8">
              <Zap className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No utility bills found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search" : "Bills will appear here as they're added"}
              </p>
              <Button 
                onClick={() => alert('Add bill feature coming soon!')} 
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Bill Manually
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-0">
                  <CardTitle className="text-lg">Upcoming Bills</CardTitle>
                  <CardDescription>Bills due in the next 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Utility</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBills
                        .filter(bill => bill.status.toLowerCase() !== 'paid')
                        .map((bill) => {
                          const account = accounts.find(acc => acc.id === bill.utilityAccountId);
                          const isOverdue = new Date(bill.dueDate) < new Date();
                          const status = isOverdue ? "overdue" : bill.status;
                          
                          return (
                            <TableRow key={bill.id}>
                              <TableCell>{account?.propertyName || 'Unknown'}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  {getUtilityIcon(account?.type || 'default')}
                                  <span className="capitalize">{account?.type || 'Unknown'}</span>
                                </div>
                              </TableCell>
                              <TableCell>{formatCurrency(bill.amount)}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <span>{formatDate(bill.dueDate)}</span>
                                  {isOverdue && (
                                    <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
                                      <AlertCircle className="h-3 w-3 mr-1" />
                                      Overdue
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{renderStatusBadge(status)}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    // In a real app, this would mark the bill as paid
                                    alert(`Mark bill ${bill.id} as paid`);
                                  }}
                                  disabled={bill.status.toLowerCase() === 'paid'}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Mark Paid
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-0">
                  <CardTitle className="text-lg">Payment History</CardTitle>
                  <CardDescription>Recently paid utility bills</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Utility</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payment Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBills
                        .filter(bill => bill.status.toLowerCase() === 'paid')
                        .map((bill) => {
                          const account = accounts.find(acc => acc.id === bill.utilityAccountId);
                          
                          return (
                            <TableRow key={bill.id}>
                              <TableCell>{account?.propertyName || 'Unknown'}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  {getUtilityIcon(account?.type || 'default')}
                                  <span className="capitalize">{account?.type || 'Unknown'}</span>
                                </div>
                              </TableCell>
                              <TableCell>{formatCurrency(bill.amount)}</TableCell>
                              <TableCell>{formatDate(bill.dueDate)}</TableCell>
                              <TableCell>{renderStatusBadge('paid')}</TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Utilities;
