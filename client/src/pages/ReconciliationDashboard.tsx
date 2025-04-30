
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle2, AlertCircle, Clock, ArrowUp, ArrowDown, Filter, Download, FileCheck, Layers, ArrowRightLeft } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function ReconciliationDashboard() {
  const [timeframe, setTimeframe] = useState("30days");
  const [accountFilter, setAccountFilter] = useState("all");

  // Mock data for reconciliation stats
  const reconciliationStats = {
    totalTransactions: 245,
    matchedTransactions: 189,
    unmatchedTransactions: 56,
    automaticallyMatched: 142,
    manuallyMatched: 47,
    matchPercentage: 77,
    reconciliationDate: "2023-05-15",
    accounts: [
      { id: 1, name: "Operating Account", balance: 24687.42, reconciledBalance: 24187.42, difference: 500.00, reconciliationStatus: "inProgress" },
      { id: 2, name: "Security Deposits", balance: 12500.00, reconciledBalance: 12500.00, difference: 0.00, reconciliationStatus: "reconciled" },
      { id: 3, name: "Maintenance Fund", balance: 8350.75, reconciledBalance: 8350.75, difference: 0.00, reconciliationStatus: "reconciled" }
    ]
  };

  // Mock data for unmatched transactions
  const unmatchedTransactions = [
    {
      id: 1,
      date: "2023-05-05",
      description: "Transfer from Acct #4567",
      amount: 500.00,
      type: "income",
      accountId: 1,
      accountName: "Operating Account",
      suggestedCategory: "Transfer",
      suggestedMatch: "Internal Transfer",
      confidence: 78
    },
    {
      id: 2,
      date: "2023-05-03",
      description: "Home Depot Purchase",
      amount: -127.85,
      type: "expense",
      accountId: 1,
      accountName: "Operating Account",
      suggestedCategory: "Repairs & Maintenance",
      suggestedMatch: "Sunset Heights - Unit 105 Repair",
      confidence: 92
    },
    {
      id: 3,
      date: "2023-05-01",
      description: "ACH Deposit - JAMES WILSON",
      amount: 1675.00,
      type: "income",
      accountId: 1,
      accountName: "Operating Account",
      suggestedCategory: "Rent",
      suggestedMatch: "James Wilson - Unit 202 Rent",
      confidence: 95
    },
    {
      id: 4,
      date: "2023-04-30",
      description: "Check #1254",
      amount: -350.00,
      type: "expense",
      accountId: 1,
      accountName: "Operating Account",
      suggestedCategory: "Landscaping",
      suggestedMatch: "Green Thumb Landscaping - Monthly Service",
      confidence: 85
    },
    {
      id: 5,
      date: "2023-04-28",
      description: "Deposit",
      amount: 1200.00,
      type: "income",
      accountId: 3,
      accountName: "Maintenance Fund",
      suggestedCategory: "Owner Contribution",
      suggestedMatch: "Monthly Maintenance Fund Contribution",
      confidence: 75
    }
  ];

  // Get account status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "reconciled":
        return <Badge className="bg-green-500">Reconciled</Badge>;
      case "inProgress":
        return <Badge className="bg-amber-500">In Progress</Badge>;
      default:
        return <Badge className="bg-gray-500">Not Started</Badge>;
    }
  };
  
  // Get confidence badge
  const getConfidenceBadge = (confidence) => {
    if (confidence >= 90) {
      return <Badge className="bg-green-500">{confidence}% Match</Badge>;
    } else if (confidence >= 70) {
      return <Badge className="bg-amber-500">{confidence}% Match</Badge>;
    } else {
      return <Badge className="bg-red-500">{confidence}% Match</Badge>;
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" asChild className="mr-4">
            <Link href="/banking/transactions">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Transactions
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Reconciliation Dashboard</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <FileCheck className="mr-2 h-4 w-4" />
            Start New Reconciliation
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reconciliationStats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">During selected period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-Matched</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reconciliationStats.automaticallyMatched}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((reconciliationStats.automaticallyMatched / reconciliationStats.totalTransactions) * 100)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manually Matched</CardTitle>
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reconciliationStats.manuallyMatched}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((reconciliationStats.manuallyMatched / reconciliationStats.totalTransactions) * 100)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unmatched</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reconciliationStats.unmatchedTransactions}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((reconciliationStats.unmatchedTransactions / reconciliationStats.totalTransactions) * 100)}% of total
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Reconciliation Progress</CardTitle>
            <CardDescription>Overall matching status for all accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div>Progress</div>
                  <div className="font-medium">{reconciliationStats.matchPercentage}%</div>
                </div>
                <Progress value={reconciliationStats.matchPercentage} className="h-2" />
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Difference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reconciliationStats.accounts.map(account => (
                    <TableRow key={account.id}>
                      <TableCell>{account.name}</TableCell>
                      <TableCell>{getStatusBadge(account.reconciliationStatus)}</TableCell>
                      <TableCell className="text-right">
                        ${account.difference.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Account Balances</CardTitle>
            <CardDescription>Reconciled vs. actual balances</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Bank Balance</TableHead>
                  <TableHead className="text-right">Book Balance</TableHead>
                  <TableHead className="text-right">Difference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reconciliationStats.accounts.map(account => (
                  <TableRow key={account.id}>
                    <TableCell>{account.name}</TableCell>
                    <TableCell className="text-right">${account.balance.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${account.reconciledBalance.toFixed(2)}</TableCell>
                    <TableCell className={`text-right font-medium ${account.difference > 0 ? 'text-red-600' : account.difference < 0 ? 'text-amber-600' : 'text-green-600'}`}>
                      ${account.difference.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Unmatched Transactions</CardTitle>
            <CardDescription>Transactions that need to be matched or categorized</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={accountFilter} onValueChange={setAccountFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                <SelectItem value="1">Operating Account</SelectItem>
                <SelectItem value="2">Security Deposits</SelectItem>
                <SelectItem value="3">Maintenance Fund</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Suggested Category</TableHead>
                <TableHead>Suggested Match</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unmatchedTransactions
                .filter(t => accountFilter === 'all' || t.accountId.toString() === accountFilter)
                .map(transaction => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell className="font-medium">{transaction.description}</TableCell>
                    <TableCell>{transaction.accountName}</TableCell>
                    <TableCell>{transaction.suggestedCategory}</TableCell>
                    <TableCell>{transaction.suggestedMatch}</TableCell>
                    <TableCell>{getConfidenceBadge(transaction.confidence)}</TableCell>
                    <TableCell className={`text-right font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <div className="flex items-center justify-end">
                        {transaction.amount > 0 ? (
                          <ArrowUp className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDown className="h-3 w-3 mr-1" />
                        )}
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/banking/transactions/${transaction.id}/match`}>
                        <Button variant="default" size="sm">Match</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              {unmatchedTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    No unmatched transactions found with the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Auto-Categorization Rules</CardTitle>
          <CardDescription>Current rules for automatic transaction matching</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <p className="text-sm text-muted-foreground">You have 8 active rules for transaction categorization</p>
            <Link href="/banking/transactions/rules">
              <Button variant="outline" size="sm">
                Manage Rules
              </Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Rule Performance</AlertTitle>
              <AlertDescription>
                Your current rules automatically matched 142 out of 245 transactions (58%) in the last 30 days.
                Consider adding more rules to improve auto-matching.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm">Top Performing Rule</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <p className="font-medium">Rent Payments</p>
                  <p className="text-sm text-muted-foreground">Matched 47 transactions</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm">Recently Added Rule</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <p className="font-medium">Utility Payments</p>
                  <p className="text-sm text-muted-foreground">Added on May 10, 2023</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm">Suggested Rule</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <p className="font-medium">Landscaping Services</p>
                  <p className="text-sm text-muted-foreground">Could match 12 more transactions</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
