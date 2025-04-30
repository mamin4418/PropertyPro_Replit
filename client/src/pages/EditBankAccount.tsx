
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Building2 } from "lucide-react";
import { Link, useParams } from "wouter";
import { useState } from "react";

export default function EditBankAccount() {
  const [, params] = useParams();
  const accountId = params?.id;

  // Mock data for bank account (in a real app, you would fetch this from an API)
  const [accountData, setAccountData] = useState({
    id: 1,
    name: "Operating Account",
    accountNumber: "1234567890",
    routingNumber: "021000021",
    bankName: "First National Bank",
    accountType: "checking",
    companyId: "1",
    openDate: "2022-01-15",
    notes: "Main operating account for day-to-day expenses and rent collection"
  });

  // Mock data for companies
  const companies = [
    { id: "1", name: "Sunrise Properties LLC" },
    { id: "2", name: "Sunset Heights Inc." },
    { id: "3", name: "Green Valley Properties" }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAccountData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setAccountData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send the updated data to your API
    console.log("Updating account with data:", accountData);
    // Redirect to account details page after successful update
    // In a real app, you'd only redirect after the API call succeeds
    window.location.href = `/banking/accounts/${accountId}`;
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center">
        <Button variant="ghost" asChild className="mr-4">
          <Link href={`/banking/accounts/${accountId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Account Details
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Edit Bank Account</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Update the details of this bank account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Account Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={accountData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    name="bankName"
                    value={accountData.bankName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    value={accountData.accountNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="routingNumber">Routing Number</Label>
                  <Input
                    id="routingNumber"
                    name="routingNumber"
                    value={accountData.routingNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select
                    value={accountData.accountType}
                    onValueChange={(value) => handleSelectChange("accountType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Checking</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="money_market">Money Market</SelectItem>
                      <SelectItem value="certificate_of_deposit">Certificate of Deposit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyId">Company</Label>
                  <Select
                    value={accountData.companyId}
                    onValueChange={(value) => handleSelectChange("companyId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map(company => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="openDate">Open Date</Label>
                  <Input
                    id="openDate"
                    name="openDate"
                    type="date"
                    value={accountData.openDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={accountData.notes}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" asChild>
                <Link href={`/banking/accounts/${accountId}`}>Cancel</Link>
              </Button>
              <Button type="submit">Update Account</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
