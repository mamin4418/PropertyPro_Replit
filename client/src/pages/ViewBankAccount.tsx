
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Building2, Download, Pencil, Calendar, ArrowUp, ArrowDown } from "lucide-react";
import { Link, useParams } from "wouter";
import { useState } from "react";

export default function ViewBankAccount() {
  const [, params] = useParams();
  const accountId = params?.id;

  // Mock data for bank account (in a real app, you would fetch this from an API)
  const account = {
    id: 1,
    name: "Operating Account",
    accountNumber: "****1234",
    bankName: "First National Bank",
    balance: 24231.89,
    accountType: "Checking",
    companyId: 1,
    companyName: "Sunrise Properties LLC",
    lastUpdated: "2023-05-02T09:30:00Z",
    routingNumber: "021000021",
    openDate: "2022-01-15",
    notes: "Main operating account for day-to-day expenses and rent collection"
  };

  // Mock data for recent transactions
  const recentTransactions = [
    {
      id: 1,
      date: "2023-05-01",
      description: "Rent Payment - Unit 303",
      amount: 1850.00,
      type: "income",
      category: "Rent"
    },
    {
      id: 2,
      date: "2023-04-28",
      description: "Water Bill - Sunset Heights",
      amount: -342.15,
      type: "expense",
      category: "Utilities"
    },
    {
      id: 3,
      date: "2023-04-30",
      description: "Rent Payment - Unit 201",
      amount: 1425.00,
      type: "income",
      category: "Rent"
    },
    {
      id: 5,
      date: "2023-04-25",
      description: "Plumbing Repair - Unit 105",
      amount: -275.00,
      type: "expense",
      category: "Repairs & Maintenance"
    }
  ];

  // Filter for monthly and yearly balance data
  const [timeFilter, setTimeFilter] = useState("3months");

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center">
        <Button variant="ghost" asChild className="mr-4">
          <Link href="/banking/accounts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Accounts
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Bank Account Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Last updated: {new Date(account.lastUpdated).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium flex items-center">
              <Building2 className="h-4 w-4 mr-2" />
              {account.name}
            </div>
            <p className="text-sm text-muted-foreground">{account.bankName}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Account Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">
              {account.accountType}
            </div>
            <p className="text-sm text-muted-foreground">
              Opened: {account.openDate}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Details about this bank account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Account Name</h3>
                  <p>{account.name}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Bank Name</h3>
                  <p>{account.bankName}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Account Number</h3>
                  <p>{account.accountNumber}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Routing Number</h3>
                  <p>{account.routingNumber}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Company</h3>
                  <p>{account.companyName}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Date Opened</h3>
                  <p>{account.openDate}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Notes</h3>
                  <p>{account.notes}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest activity in this account</CardDescription>
          </div>
          <Link href={`/banking/transactions?account=${account.id}`}>
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map(transaction => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
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
                    <Link href={`/banking/transactions/${transaction.id}`}>
                      <Button variant="outline" size="sm">View</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" asChild>
          <Link href={`/banking/accounts/${account.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Account
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/banking/accounts">Cancel</Link>
        </Button>
      </div>
    </div>
  );
}
