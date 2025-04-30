
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useParams, useLocation } from "wouter";
import { useState } from "react";
import { ArrowLeft, ArrowUp, ArrowDown, Search, CheckCircle2 } from "lucide-react";

export default function MatchTransaction() {
  const [, params] = useParams();
  const [, navigate] = useLocation();
  const transactionId = params?.id;
  const [matchType, setMatchType] = useState("rentPayment");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  // Mock transaction data (in a real app, you would fetch this from an API)
  const transaction = {
    id: 1,
    date: "2023-05-01",
    description: "Rent Payment - Unit 303",
    amount: 1850.00,
    type: "income",
    category: "Rent",
    accountId: 1,
    accountName: "Operating Account",
    bankName: "First National Bank"
  };

  // Mock rent payments data
  const rentPayments = [
    { id: 1, tenant: "John Smith", unit: "Unit 303", property: "Sunset Heights", dueDate: "2023-05-01", amount: 1850.00, status: "Due" },
    { id: 2, tenant: "Sarah Johnson", unit: "Unit 201", property: "Maple Gardens", dueDate: "2023-05-01", amount: 1425.00, status: "Due" },
    { id: 3, tenant: "Michael Brown", unit: "Unit 105", property: "Sunset Heights", dueDate: "2023-05-01", amount: 1500.00, status: "Due" }
  ];

  // Mock expenses data
  const expenses = [
    { id: 1, vendor: "City Water & Sewer", property: "Sunset Heights", category: "Utilities", dueDate: "2023-05-10", amount: 342.15, status: "Pending" },
    { id: 2, vendor: "ABC Plumbing", property: "Maple Gardens", category: "Repairs & Maintenance", dueDate: "2023-05-05", amount: 275.00, status: "Pending" },
    { id: 3, vendor: "Premium Insurance", property: "All Properties", category: "Insurance", dueDate: "2023-05-15", amount: 825.50, status: "Pending" }
  ];

  // Mock security deposits data
  const securityDeposits = [
    { id: 1, tenant: "Michael Brown", unit: "Unit 105", property: "Sunset Heights", date: "2023-04-27", amount: 1500.00, status: "Pending" },
    { id: 2, tenant: "Lisa Wilson", unit: "Unit 202", property: "Maple Gardens", date: "2023-05-02", amount: 1200.00, status: "Pending" }
  ];

  // Mock other income data
  const otherIncome = [
    { id: 1, description: "Laundry Income", property: "Sunset Heights", category: "Laundry", date: "2023-05-01", amount: 320.00 },
    { id: 2, description: "Late Fee - Unit 104", property: "Maple Gardens", category: "Late Fees", date: "2023-04-10", amount: 50.00 }
  ];

  // Filter items based on search query and transaction type (income/expense)
  let filteredItems = [];
  
  if (matchType === "rentPayment") {
    filteredItems = rentPayments.filter(item =>
      item.tenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.unit.toLowerCase().includes(searchQuery.toLowerCase())
    );
  } else if (matchType === "expense") {
    filteredItems = expenses.filter(item =>
      item.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  } else if (matchType === "securityDeposit") {
    filteredItems = securityDeposits.filter(item =>
      item.tenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.unit.toLowerCase().includes(searchQuery.toLowerCase())
    );
  } else if (matchType === "otherIncome") {
    filteredItems = otherIncome.filter(item =>
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Handle match confirmation
  const handleMatchConfirm = () => {
    if (!selectedItem) return;
    
    // In a real app, this would send the match data to the server
    console.log("Matching transaction", transaction.id, "with", matchType, "item", selectedItem);
    
    // Navigate back to transaction details
    navigate(`/banking/transactions/${transaction.id}`);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center">
        <Button variant="ghost" asChild className="mr-4">
          <Link href={`/banking/transactions/${transaction.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Transaction
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Match Transaction</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
          <CardDescription>Select what this transaction should be matched with</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-muted rounded-lg mb-6">
            <div>
              <h3 className="font-medium">{transaction.description}</h3>
              <p className="text-sm text-muted-foreground">{transaction.date} • {transaction.accountName}</p>
            </div>
            <div className={`text-xl font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
              {transaction.amount > 0 ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              ${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">What type of transaction is this?</h3>
              <RadioGroup value={matchType} onValueChange={setMatchType} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="rentPayment" id="rentPayment" />
                  <Label htmlFor="rentPayment" className="cursor-pointer">Rent Payment</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="expense" id="expense" />
                  <Label htmlFor="expense" className="cursor-pointer">Expense</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="securityDeposit" id="securityDeposit" />
                  <Label htmlFor="securityDeposit" className="cursor-pointer">Security Deposit</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="otherIncome" id="otherIncome" />
                  <Label htmlFor="otherIncome" className="cursor-pointer">Other Income</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full md:w-[350px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {matchType === "rentPayment" && (
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by Property" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Properties</SelectItem>
                      <SelectItem value="sunset">Sunset Heights</SelectItem>
                      <SelectItem value="maple">Maple Gardens</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              {matchType === "rentPayment" && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item: any) => (
                        <TableRow key={item.id} className={selectedItem === item.id ? "bg-primary/5" : ""}>
                          <TableCell>
                            <Button
                              variant={selectedItem === item.id ? "default" : "ghost"}
                              size="icon"
                              onClick={() => setSelectedItem(item.id)}
                              className="h-8 w-8"
                            >
                              <CheckCircle2 className={`h-5 w-5 ${selectedItem === item.id ? "text-white" : "text-muted-foreground"}`} />
                            </Button>
                          </TableCell>
                          <TableCell>{item.tenant}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell>{item.property}</TableCell>
                          <TableCell>{item.dueDate}</TableCell>
                          <TableCell className="text-right">${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No matching rent payments found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}

              {matchType === "expense" && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item: any) => (
                        <TableRow key={item.id} className={selectedItem === item.id ? "bg-primary/5" : ""}>
                          <TableCell>
                            <Button
                              variant={selectedItem === item.id ? "default" : "ghost"}
                              size="icon"
                              onClick={() => setSelectedItem(item.id)}
                              className="h-8 w-8"
                            >
                              <CheckCircle2 className={`h-5 w-5 ${selectedItem === item.id ? "text-white" : "text-muted-foreground"}`} />
                            </Button>
                          </TableCell>
                          <TableCell>{item.vendor}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.property}</TableCell>
                          <TableCell>{item.dueDate}</TableCell>
                          <TableCell className="text-right">${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No matching expenses found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}

              {matchType === "securityDeposit" && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item: any) => (
                        <TableRow key={item.id} className={selectedItem === item.id ? "bg-primary/5" : ""}>
                          <TableCell>
                            <Button
                              variant={selectedItem === item.id ? "default" : "ghost"}
                              size="icon"
                              onClick={() => setSelectedItem(item.id)}
                              className="h-8 w-8"
                            >
                              <CheckCircle2 className={`h-5 w-5 ${selectedItem === item.id ? "text-white" : "text-muted-foreground"}`} />
                            </Button>
                          </TableCell>
                          <TableCell>{item.tenant}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell>{item.property}</TableCell>
                          <TableCell>{item.date}</TableCell>
                          <TableCell className="text-right">${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No matching security deposits found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}

              {matchType === "otherIncome" && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item: any) => (
                        <TableRow key={item.id} className={selectedItem === item.id ? "bg-primary/5" : ""}>
                          <TableCell>
                            <Button
                              variant={selectedItem === item.id ? "default" : "ghost"}
                              size="icon"
                              onClick={() => setSelectedItem(item.id)}
                              className="h-8 w-8"
                            >
                              <CheckCircle2 className={`h-5 w-5 ${selectedItem === item.id ? "text-white" : "text-muted-foreground"}`} />
                            </Button>
                          </TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.property}</TableCell>
                          <TableCell>{item.date}</TableCell>
                          <TableCell className="text-right">${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No matching income entries found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-8">
            <Button variant="outline" asChild>
              <Link href={`/banking/transactions/${transaction.id}`}>Cancel</Link>
            </Button>
            <Button 
              onClick={handleMatchConfirm} 
              disabled={!selectedItem}
            >
              Confirm Match
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
