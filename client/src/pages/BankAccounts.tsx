import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {  Plus, Search, Filter, Download, ArrowUpDown, } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function BankAccounts() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for bank accounts
  const accounts = [
    {
      id: 1,
      name: "Operating Account",
      accountNumber: "****1234",
      bankName: "First National Bank",
      balance: 24231.89,
      accountType: "Checking",
      companyId: 1,
      companyName: "Sunrise Properties LLC",
      lastUpdated: "2023-05-02T09:30:00Z"
    },
    {
      id: 2,
      name: "Security Deposits",
      accountNumber: "****5678",
      bankName: "First National Bank",
      balance: 18500.00,
      accountType: "Savings",
      companyId: 1,
      companyName: "Sunrise Properties LLC",
      lastUpdated: "2023-05-02T09:30:00Z"
    },
    {
      id: 3,
      name: "Maintenance Fund",
      accountNumber: "****9012",
      bankName: "Chase Bank",
      balance: 8750.45,
      accountType: "Checking",
      companyId: 1,
      companyName: "Sunrise Properties LLC",
      lastUpdated: "2023-05-01T14:15:00Z"
    },
    {
      id: 4,
      name: "Operating Account",
      accountNumber: "****3456",
      bankName: "Bank of America",
      balance: 32145.78,
      accountType: "Checking",
      companyId: 2,
      companyName: "Sunset Heights Inc.",
      lastUpdated: "2023-05-02T10:20:00Z"
    }
  ];

  // Filter accounts based on search query
  const filteredAccounts = accounts.filter(account => 
    account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Bank Accounts</h2>
        <div className="flex items-center gap-2">
          <Link href="/banking/accounts/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Bank Account
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search accounts..."
              className="pl-8 w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Bank Accounts</CardTitle>
          <CardDescription>
            Manage your company and property bank accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">
                  <div className="flex items-center gap-1">
                    Account Name
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Bank</TableHead>
                <TableHead>Account #</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    Balance
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map(account => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.name}</TableCell>
                  <TableCell>{account.bankName}</TableCell>
                  <TableCell>{account.accountNumber}</TableCell>
                  <TableCell>{account.accountType}</TableCell>
                  <TableCell>{account.companyName}</TableCell>
                  <TableCell className="text-right font-medium">
                    ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/banking/accounts/${account.id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                      <Link href={`/banking/accounts/${account.id}/edit`}>
                        <Button variant="outline" size="sm">Edit</Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAccounts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No bank accounts found. Add a new account to get started.
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