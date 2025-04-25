import { useCallback, useState } from "react";
import { Link } from "wouter";
import { 
  DollarSign, Plus, Search, Eye, Edit, Trash2, 
  ChevronLeft, ChevronRight, CreditCard, Receipt, 
  Calendar, ArrowUpRight, ArrowDownLeft 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for demonstration
const payments = [
  {
    id: 1,
    type: "income",
    category: "rent",
    property: "Sunset Heights",
    unit: "Apt 101",
    tenant: "John Smith",
    amount: 1200,
    date: "2023-04-15",
    method: "bank-transfer",
    status: "completed"
  },
  {
    id: 2,
    type: "income",
    category: "rent",
    property: "Maple Gardens",
    unit: "Unit 3B",
    tenant: "Sarah Johnson",
    amount: 950,
    date: "2023-04-10",
    method: "credit-card",
    status: "completed"
  },
  {
    id: 3,
    type: "income",
    category: "security-deposit",
    property: "Urban Lofts",
    unit: "Unit 2A",
    tenant: "Mike Smith",
    amount: 1450,
    date: "2023-03-01",
    method: "check",
    status: "completed"
  },
  {
    id: 4,
    type: "expense",
    category: "maintenance",
    property: "Sunset Heights",
    description: "Plumbing repair",
    amount: 450,
    date: "2023-04-08",
    vendor: "ABC Plumbing",
    method: "credit-card",
    status: "completed"
  },
  {
    id: 5,
    type: "expense",
    category: "utilities",
    property: "All Properties",
    description: "Water bill",
    amount: 350,
    date: "2023-04-05",
    vendor: "City Water Services",
    method: "bank-transfer",
    status: "pending"
  }
];

const Payments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // Options: all, income, expense
  
  // Get status badge color and title
  const getStatusBadge = useCallback((status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case "failed":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Failed</Badge>;
      case "refunded":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
    }
  }, []);
  
  // Get payment method icon and text
  const getPaymentMethod = useCallback((method: string) => {
    switch (method) {
      case "credit-card":
        return (
          <div className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Credit Card</span>
          </div>
        );
      case "bank-transfer":
        return (
          <div className="flex items-center">
            <Receipt className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Bank Transfer</span>
          </div>
        );
      case "check":
        return (
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Check</span>
          </div>
        );
      default:
        return <span>{method.replace('-', ' ')}</span>;
    }
  }, []);
  
  // Get transaction type icon
  const getTransactionTypeIcon = useCallback((type: string) => {
    switch (type) {
      case "income":
        return <ArrowUpRight className="h-4 w-4 mr-1 text-green-500" />;
      case "expense":
        return <ArrowDownLeft className="h-4 w-4 mr-1 text-red-500" />;
      default:
        return null;
    }
  }, []);
  
  // Format date to human readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleResetFilters = () => {
    // Reset filter state
    console.log("Filters reset");
  };
  
  // Filter payments based on the selected tab
  const filteredPayments = payments.filter(payment => {
    if (activeTab === "all") return true;
    if (activeTab === "income") return payment.type === "income";
    if (activeTab === "expense") return payment.type === "expense";
    return true;
  });
  
  // Calculate totals
  const totalIncome = payments
    .filter(p => p.type === "income" && p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);
    
  const totalExpenses = payments
    .filter(p => p.type === "expense" && p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);
    
  const netCashflow = totalIncome - totalExpenses;
  
  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Payment Management</h2>
          <p className="text-muted-foreground">Track income, expenses, and financial transactions</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search payments..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link href="/add-payment">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Record Payment
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Income</p>
                <h3 className="text-3xl font-bold text-green-600">${totalIncome.toLocaleString()}</h3>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <ArrowUpRight className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
                <h3 className="text-3xl font-bold text-red-600">${totalExpenses.toLocaleString()}</h3>
              </div>
              <div className="bg-red-100 p-2 rounded-full">
                <ArrowDownLeft className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Net Cashflow</p>
                <h3 className={`text-3xl font-bold ${netCashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${netCashflow.toLocaleString()}
                </h3>
              </div>
              <div className={`p-2 rounded-full ${netCashflow >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <DollarSign className={`h-5 w-5 ${netCashflow >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="w-full sm:w-auto">
              <Label className="mb-1 block">Property</Label>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Properties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  <SelectItem value="sunset">Sunset Heights</SelectItem>
                  <SelectItem value="maple">Maple Gardens</SelectItem>
                  <SelectItem value="urban">Urban Lofts</SelectItem>
                  <SelectItem value="riverfront">Riverfront Condos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-auto">
              <Label className="mb-1 block">Date Range</Label>
              <Select defaultValue="current-month">
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-month">Current Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                  <SelectItem value="current-year">Current Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-auto">
              <Label className="mb-1 block">Category</Label>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="security-deposit">Security Deposit</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="taxes">Taxes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-auto sm:ml-auto sm:self-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleResetFilters}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Payment Tabs */}
      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expense">Expenses</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="pt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{formatDate(payment.date)}</TableCell>
                      <TableCell>
                        <div className="flex items-center font-medium">
                          {getTransactionTypeIcon(payment.type)}
                          <span>
                            {payment.type === 'income' 
                              ? `${payment.tenant} - ${payment.category === 'rent' ? 'Rent Payment' : 'Security Deposit'}`
                              : payment.description}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {payment.type === 'expense' && payment.vendor}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{payment.property}</div>
                        {payment.unit && <div className="text-sm text-muted-foreground">{payment.unit}</div>}
                      </TableCell>
                      <TableCell>{getPaymentMethod(payment.method)}</TableCell>
                      <TableCell className={`font-medium ${payment.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {payment.type === 'income' ? '+' : '-'}${payment.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/payments/${payment.id}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/payments/${payment.id}/edit`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="income" className="pt-4">
          {/* Same content as "all" but filtered for income */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{formatDate(payment.date)}</TableCell>
                      <TableCell>
                        <div className="flex items-center font-medium">
                          {getTransactionTypeIcon(payment.type)}
                          <span>
                            {payment.type === 'income' 
                              ? `${payment.tenant} - ${payment.category === 'rent' ? 'Rent Payment' : 'Security Deposit'}`
                              : payment.description}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {payment.type === 'expense' && payment.vendor}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{payment.property}</div>
                        {payment.unit && <div className="text-sm text-muted-foreground">{payment.unit}</div>}
                      </TableCell>
                      <TableCell>{getPaymentMethod(payment.method)}</TableCell>
                      <TableCell className={`font-medium ${payment.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {payment.type === 'income' ? '+' : '-'}${payment.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/payments/${payment.id}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/payments/${payment.id}/edit`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expense" className="pt-4">
          {/* Same content as "all" but filtered for expenses */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{formatDate(payment.date)}</TableCell>
                      <TableCell>
                        <div className="flex items-center font-medium">
                          {getTransactionTypeIcon(payment.type)}
                          <span>
                            {payment.type === 'income' 
                              ? `${payment.tenant} - ${payment.category === 'rent' ? 'Rent Payment' : 'Security Deposit'}`
                              : payment.description}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {payment.type === 'expense' && payment.vendor}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{payment.property}</div>
                        {payment.unit && <div className="text-sm text-muted-foreground">{payment.unit}</div>}
                      </TableCell>
                      <TableCell>{getPaymentMethod(payment.method)}</TableCell>
                      <TableCell className={`font-medium ${payment.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {payment.type === 'income' ? '+' : '-'}${payment.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/payments/${payment.id}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/payments/${payment.id}/edit`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">24</span> results
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button variant="outline" size="sm" className="bg-primary/5">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Payments;
