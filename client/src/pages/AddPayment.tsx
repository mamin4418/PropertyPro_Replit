import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  DollarSign, 
  ArrowLeft,
  Calendar,
  CreditCard,
  Receipt,
  ArrowUpRight,
  ArrowDownLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AddPayment = () => {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("income");
  
  const [formData, setFormData] = useState({
    type: "income",
    category: "",
    property: "",
    unit: "",
    amount: "",
    date: "",
    method: "bank-transfer",
    description: "",
    tenant: "",
    vendor: "",
    notes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would save the data to the backend
    console.log("Form submitted:", formData);
    navigate("/payments");
  };

  // Update form type when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setFormData(prev => ({ ...prev, type: value }));
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/payments")} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Payments
        </Button>
        <h2 className="text-2xl font-bold">Record New Transaction</h2>
      </div>

      <Tabs defaultValue="income" onValueChange={handleTabChange} className="mb-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="income" className="flex items-center">
            <ArrowUpRight className="mr-2 h-4 w-4" />
            <span>Income</span>
          </TabsTrigger>
          <TabsTrigger value="expense" className="flex items-center">
            <ArrowDownLeft className="mr-2 h-4 w-4" />
            <span>Expense</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger id="category" className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeTab === "income" ? (
                      <>
                        <SelectItem value="rent">Rent</SelectItem>
                        <SelectItem value="security-deposit">Security Deposit</SelectItem>
                        <SelectItem value="application-fee">Application Fee</SelectItem>
                        <SelectItem value="late-fee">Late Fee</SelectItem>
                        <SelectItem value="other-income">Other Income</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="insurance">Insurance</SelectItem>
                        <SelectItem value="taxes">Property Taxes</SelectItem>
                        <SelectItem value="mortgage">Mortgage</SelectItem>
                        <SelectItem value="other-expense">Other Expense</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="amount">Amount</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-10"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  className="mt-1"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="method">Payment Method</Label>
                <Select 
                  value={formData.method} 
                  onValueChange={(value) => handleSelectChange("method", value)}
                >
                  <SelectTrigger id="method" className="mt-1">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="credit-card">Credit Card</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="property">Property</Label>
                <Select 
                  value={formData.property} 
                  onValueChange={(value) => handleSelectChange("property", value)}
                >
                  <SelectTrigger id="property" className="mt-1">
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunset">Sunset Heights</SelectItem>
                    <SelectItem value="maple">Maple Gardens</SelectItem>
                    <SelectItem value="urban">Urban Lofts</SelectItem>
                    <SelectItem value="riverfront">Riverfront Condos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {activeTab === "income" && (
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Select 
                    value={formData.unit} 
                    onValueChange={(value) => handleSelectChange("unit", value)}
                  >
                    <SelectTrigger id="unit" className="mt-1">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apt101">Apt 101</SelectItem>
                      <SelectItem value="apt102">Apt 102</SelectItem>
                      <SelectItem value="apt201">Apt 201</SelectItem>
                      <SelectItem value="apt202">Apt 202</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {activeTab === "income" ? (
                <div>
                  <Label htmlFor="tenant">Tenant</Label>
                  <Select 
                    value={formData.tenant} 
                    onValueChange={(value) => handleSelectChange("tenant", value)}
                  >
                    <SelectTrigger id="tenant" className="mt-1">
                      <SelectValue placeholder="Select tenant" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john-smith">John Smith</SelectItem>
                      <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                      <SelectItem value="mike-smith">Mike Smith</SelectItem>
                      <SelectItem value="jennifer-lee">Jennifer Lee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div>
                  <Label htmlFor="vendor">Vendor/Payee</Label>
                  <Select 
                    value={formData.vendor} 
                    onValueChange={(value) => handleSelectChange("vendor", value)}
                  >
                    <SelectTrigger id="vendor" className="mt-1">
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="abc-plumbing">ABC Plumbing</SelectItem>
                      <SelectItem value="city-water">City Water Services</SelectItem>
                      <SelectItem value="all-electric">All Electric Services</SelectItem>
                      <SelectItem value="tax-dept">Tax Department</SelectItem>
                      <SelectItem value="add-new">+ Add New Vendor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Brief description of transaction"
                  className="mt-1"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Any additional details or notes"
                  className="mt-1"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <Button variant="outline" onClick={() => navigate("/payments")}>
                Cancel
              </Button>
              <Button type="submit" className={activeTab === "income" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}>
                {activeTab === "income" ? (
                  <>
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Record Income
                  </>
                ) : (
                  <>
                    <ArrowDownLeft className="mr-2 h-4 w-4" />
                    Record Expense
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPayment;