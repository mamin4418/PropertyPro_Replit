import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

function UtilitiesPage() {
  const [accounts, setAccounts] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch utility accounts
    fetch('/api/utility-accounts')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch utility accounts');
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched utility accounts:', data);
        setAccounts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching accounts:', err);
        setError(err.message);
        setLoading(false);
      });

    // Fetch utility bills
    fetch('/api/utility-bills')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch utility bills');
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched utility bills:', data);
        setBills(data);
      })
      .catch(err => {
        console.error('Error fetching bills:', err);
      });
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading utilities data...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error Loading Utilities</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  const upcomingBills = bills.filter(bill => bill.status === 'unpaid');

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Utilities Management</h1>
        <Link to="/add-utility-account">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Utility Account
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Accounts</CardTitle>
            <CardDescription>Active utility accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{accounts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Upcoming Bills</CardTitle>
            <CardDescription>Bills due in the next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingBills.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>AutoPay Enabled</CardTitle>
            <CardDescription>Accounts with automatic payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{accounts.filter(account => account.autopayEnabled).length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="accounts">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="accounts">Utility Accounts</TabsTrigger>
          <TabsTrigger value="bills">Utility Bills</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Utility Accounts</CardTitle>
              <CardDescription>Manage your property utility services</CardDescription>
            </CardHeader>
            <CardContent>
              {accounts.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">No utility accounts found.</p>
                  <Link to="/add-utility-account">
                    <Button variant="outline" className="mt-2">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Your First Utility Account
                    </Button>
                  </Link>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Account Number</TableHead>
                      <TableHead>Billing Cycle</TableHead>
                      <TableHead>AutoPay</TableHead>
                      <TableHead>Responsible</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium">{account.propertyName || 'Property ' + account.propertyId}</TableCell>
                        <TableCell>{account.utilityType || account.type}</TableCell>
                        <TableCell>{account.provider || account.utilityProvider}</TableCell>
                        <TableCell>{account.accountNumber}</TableCell>
                        <TableCell>{account.billingCycle || 'Monthly'}</TableCell>
                        <TableCell>
                          {account.autopayEnabled ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                              Enabled
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                              Disabled
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="capitalize">{account.responsibleParty || 'Owner'}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bills" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Utility Bills</CardTitle>
              <CardDescription>Track and manage utility payments</CardDescription>
            </CardHeader>
            <CardContent>
              {bills.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">No utility bills found.</p>
                  <Button variant="outline" className="mt-2">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Utility Bill
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bills.map((bill) => {
                      // Find the associated account
                      const account = accounts.find(a => a.id === bill.utilityAccountId);
                      return (
                        <TableRow key={bill.id}>
                          <TableCell className="font-medium">Property {bill.propertyId || account?.propertyId}</TableCell>
                          <TableCell>${typeof bill.amount === 'number' ? bill.amount.toFixed(2) : bill.amount}</TableCell>
                          <TableCell>{bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : 'Unknown'}</TableCell>
                          <TableCell>
                            {bill.status === 'paid' ? (
                              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Paid
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                                Unpaid
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default UtilitiesPage;