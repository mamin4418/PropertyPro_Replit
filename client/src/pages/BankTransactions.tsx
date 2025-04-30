import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building, Search, Filter, ArrowUpDown, Download, Calendar, ArrowUp, ArrowDown } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function BankTransactions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [accountFilter, setAccountFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Mock data for bank transactions
  const transactions = [
    {
      id: 1,
      date: "2023-05-01",
      description: "Rent Payment - Unit 303",
      amount: 1850.00,
      type: "income",
      category: "Rent",
      accountId: 1,
      accountName: "Operating Account",
      bankName: "First National Bank",
      reconciled: true,
      tenantId: 12,
      tenantName: "John Smith",
      propertyId: 3,
      propertyName: "Sunset Heights"
    },
    {
      id: 2,
      date: "2023-04-28",
      description: "Water Bill - Sunset Heights",
      amount: -342.15,
      type: "expense",
      category: "Utilities",
      accountId: 1,
      accountName: "Operating Account",
      bankName: "First National Bank",
      reconciled: true,
      tenantId: null,
      tenantName: null,
      propertyId: 3,
      propertyName: "Sunset Heights"
    },
    {
      id: 3,
      date: "2023-04-30",
      description: "Rent Payment - Unit 201",
      amount: 1425.00,
      type: "income",
      category: "Rent",
      accountId: 1,
      accountName: "Operating Account",
      bankName: "First National Bank",
      reconciled: true,
      tenantId: 8,
      tenantName: "Sarah Johnson",
      propertyId: 2,
      propertyName: "Maple Gardens"
    },
    {
      id: 4,
      date: "2023-04-27",
      description: "Security Deposit - New Tenant",
      amount: 1500.00,
      type: "income",
      category: "Security Deposit",
      accountId: 2,
      accountName: "Security Deposits",
      bankName: "First National Bank",
      reconciled: true,
      tenantId: 15,
      tenantName: "Michael Brown",
      propertyId: 3,
      propertyName: "Sunset Heights"
    },
    {
      id: 5,
      date: "2023-04-25",
      description: "Plumbing Repair - Unit 105",
      amount: -275.00,
      type: "expense",
      category: "Repairs & Maintenance",
      accountId: 1,
      accountName: "Operating Account",
      bankName: "First National Bank",
      reconciled: false,
      tenantId: null,
      tenantName: null,
      propertyId: 2,
      propertyName: "Maple Gardens"
    }
  ];

  // Filter transactions based on search query and filters
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (transaction.tenantName && transaction.tenantName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      transaction.propertyName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAccount = accountFilter === "all" || transaction.accountId.toString() === accountFilter;
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;

    return matchesSearch && matchesAccount && matchesType;
  });

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
        <div className="flex items-center gap-2">
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="pl-8 w-full md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={accountFilter} onValueChange={setAccountFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select Account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              <SelectItem value="1">Operating Account</SelectItem>
              <SelectItem value="2">Security Deposits</SelectItem>
              <SelectItem value="3">Maintenance Fund</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Transaction Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filters
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            View all transactions across your bank accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">
                  <div className="flex items-center gap-1">
                    Date
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    Amount
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map(transaction => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{transaction.accountName}</TableCell>
                  <TableCell>{transaction.propertyName}</TableCell>
                  <TableCell>{transaction.tenantName || "-"}</TableCell>
                  <TableCell className={`text-right font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <div className="flex items-center justify-end">
                      {transaction.amount > 0 ? (
                        <ArrowUp className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDown className="h-3 w-3 mr-1" />
                      )}
                      ${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/banking/transactions/${transaction.id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                      <Link href={`/banking/transactions/${transaction.id}/match`}>
                        <Button variant="default" size="sm">Match</Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No transactions found with the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}