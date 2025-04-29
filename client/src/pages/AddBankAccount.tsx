
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Link, useLocation } from "wouter";

export default function AddBankAccount() {
  const [location, navigate] = useLocation();
  const [accountType, setAccountType] = useState("checking");
  
  // Mock company data
  const companies = [
    { id: 1, name: "Sunrise Properties LLC" },
    { id: 2, name: "Sunset Heights Inc." },
    { id: 3, name: "Urban Living Management" }
  ];
  
  // Mock form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would save the data via API
    console.log("Form submitted");
    // Navigate back to accounts list
    navigate("/banking/accounts");
  };
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Add Bank Account</h2>
      </div>
      
      <Tabs defaultValue="manual" className="space-y-4">
        <TabsList>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="connect">Connect via Plaid</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Manual Account Entry</CardTitle>
              <CardDescription>
                Enter your bank account details manually
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="accountName">Account Name</Label>
                    <Input id="accountName" placeholder="e.g., Operating Account" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input id="bankName" placeholder="e.g., First National Bank" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input id="accountNumber" placeholder="Last 4 digits only" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="routingNumber">Routing Number</Label>
                    <Input id="routingNumber" placeholder="9 digits" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accountType">Account Type</Label>
                    <Select value={accountType} onValueChange={setAccountType} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checking">Checking</SelectItem>
                        <SelectItem value="savings">Savings</SelectItem>
                        <SelectItem value="money_market">Money Market</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Associated Company</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map(company => (
                          <SelectItem key={company.id} value={company.id.toString()}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="initialBalance">Initial Balance</Label>
                    <Input id="initialBalance" type="number" step="0.01" min="0" placeholder="0.00" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input id="description" placeholder="Additional notes about this account" />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Link href="/banking/accounts">
                    <Button variant="outline" type="button">Cancel</Button>
                  </Link>
                  <Button type="submit">Add Account</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="connect">
          <Card>
            <CardHeader>
              <CardTitle>Connect with Plaid</CardTitle>
              <CardDescription>
                Securely connect your bank account using Plaid integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg text-center">
                <h3 className="text-lg font-medium mb-2">Bank Integration</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect your bank account securely using Plaid. This will allow read-only access to your transaction data.
                </p>
                <Button>Connect Bank Account</Button>
              </div>
              
              <div className="text-sm text-muted-foreground border-t pt-4">
                <h4 className="font-medium mb-1">About Plaid Integration</h4>
                <p>
                  Plaid is a secure financial service that allows you to connect your bank accounts to PropManager
                  without sharing your banking credentials. We only receive read-only access to your transaction data.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
