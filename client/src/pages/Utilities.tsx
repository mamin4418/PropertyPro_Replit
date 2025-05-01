import React, { useState, useEffect } from 'react';
import { useLocation, NavigateFunction } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash, FileText } from "lucide-react";

export default function Utilities() {
  const [location, navigate] = useLocation<string>();
  const [utilityAccounts, setUtilityAccounts] = useState<any[]>([]);
  const [utilityBills, setUtilityBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUtilityData() {
      try {
        setLoading(true);
        // Fetch utility accounts
        const accountsResponse = await fetch('/api/utility-accounts');
        if (!accountsResponse.ok) {
          throw new Error('Failed to fetch utility accounts');
        }
        const accountsData = await accountsResponse.json();
        setUtilityAccounts(accountsData);

        // Fetch utility bills
        const billsResponse = await fetch('/api/utility-bills');
        if (!billsResponse.ok) {
          throw new Error('Failed to fetch utility bills');
        }
        const billsData = await billsResponse.json();
        setUtilityBills(billsData);

        setError(null);
      } catch (err) {
        console.error('Error fetching utility data:', err);
        setError((err as Error).message || 'Failed to load utility data');
      } finally {
        setLoading(false);
      }
    }

    fetchUtilityData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">Inactive</Badge>;
      case 'paid':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Paid</Badge>;
      case 'unpaid':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Unpaid</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Overdue</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Utilities Management</h1>
        <Button onClick={() => navigate('/add-utility-account')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Utility Account
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <Tabs defaultValue="accounts" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="accounts">Utility Accounts</TabsTrigger>
          <TabsTrigger value="bills">Utility Bills</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts">
          {loading ? (
            <p className="text-center py-8">Loading utility accounts...</p>
          ) : utilityAccounts.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No utility accounts found.</p>
              </CardContent>
            </Card>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead>Account Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {utilityAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.utilityProvider || account.provider}</TableCell>
                    <TableCell>{account.accountNumber}</TableCell>
                    <TableCell>{account.utilityType || 'Utility'}</TableCell>
                    <TableCell>{account.propertyName || `Property ID: ${account.propertyId}`}</TableCell>
                    <TableCell>{getStatusBadge(account.status || 'active')}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="bills">
          {loading ? (
            <p className="text-center py-8">Loading utility bills...</p>
          ) : utilityBills.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No utility bills found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {utilityBills.map((bill) => (
                <Card key={bill.id}>
                  <CardHeader>
                    <CardTitle>{bill.utilityAccountId ? `Account #${bill.utilityAccountId}` : 'Utility Bill'}</CardTitle>
                    <CardDescription>
                      Due: {bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : 'Not specified'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Amount:</span>
                        <span className="font-medium">{formatCurrency(bill.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <span>{getStatusBadge(bill.status || 'unpaid')}</span>
                      </div>
                      {bill.propertyId && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Property:</span>
                          <span>ID: {bill.propertyId}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button size="sm">
                      Mark as Paid
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}