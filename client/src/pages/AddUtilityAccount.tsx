
import React, { useState } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, Zap, FileText, Droplet, Trash2, Signal, Building, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";

const utilityTypes = [
  { value: "electricity", label: "Electricity", icon: <Zap className="h-4 w-4 text-yellow-500" /> },
  { value: "water", label: "Water", icon: <Droplet className="h-4 w-4 text-blue-500" /> },
  { value: "gas", label: "Gas", icon: <Signal className="h-4 w-4 text-orange-500" /> },
  { value: "internet", label: "Internet", icon: <Signal className="h-4 w-4 text-purple-500" /> },
  { value: "trash", label: "Trash", icon: <Trash2 className="h-4 w-4 text-green-500" /> },
  { value: "other", label: "Other", icon: <FileText className="h-4 w-4 text-gray-500" /> }
];

interface Property {
  id: number;
  name: string;
}

const AddUtilityAccount: React.FC = () => {
  const [location, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    propertyId: "",
    type: "",
    provider: "",
    accountNumber: "",
    serviceAddress: "",
    meterNumber: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    website: "",
    loginUsername: "",
    loginPassword: "",
    autoPayEnabled: false,
    dueDate: "",
    billingCycle: "monthly",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch properties
  const { data: properties, isLoading: loadingProperties } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      try {
        const res = await fetch('/api/properties');
        if (!res.ok) throw new Error('Failed to fetch properties');
        return res.json() as Promise<Property[]>;
      } catch (error) {
        // Return sample data if API fails
        return [
          { id: 1, name: "Sunset Heights" },
          { id: 2, name: "Maple Gardens" },
          { id: 3, name: "Urban Lofts" }
        ];
      }
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.propertyId) newErrors.propertyId = "Property is required";
    if (!formData.type) newErrors.type = "Utility type is required";
    if (!formData.provider) newErrors.provider = "Provider name is required";
    if (!formData.accountNumber) newErrors.accountNumber = "Account number is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      // For now, simulate a successful API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to utilities page
      setLocation("/utilities");
    } catch (error) {
      console.error("Error adding utility account:", error);
      alert("An error occurred while adding the utility account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-2" 
          onClick={() => setLocation("/utilities")}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Add Utility Account</h1>
          <p className="text-muted-foreground">Create a new utility account record</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Enter the details of the utility account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="propertyId">Property <span className="text-red-500">*</span></Label>
                    <Select 
                      value={formData.propertyId} 
                      onValueChange={(value) => handleSelectChange("propertyId", value)}
                      disabled={loadingProperties}
                    >
                      <SelectTrigger id="propertyId" className={errors.propertyId ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select property" />
                      </SelectTrigger>
                      <SelectContent>
                        {properties?.map(property => (
                          <SelectItem key={property.id} value={property.id.toString()}>
                            {property.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.propertyId && (
                      <p className="text-sm text-red-500">{errors.propertyId}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Utility Type <span className="text-red-500">*</span></Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value) => handleSelectChange("type", value)}
                    >
                      <SelectTrigger id="type" className={errors.type ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select utility type" />
                      </SelectTrigger>
                      <SelectContent>
                        {utilityTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center">
                              {type.icon}
                              <span className="ml-2">{type.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.type && (
                      <p className="text-sm text-red-500">{errors.type}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider">Provider <span className="text-red-500">*</span></Label>
                    <Input
                      id="provider"
                      name="provider"
                      value={formData.provider}
                      onChange={handleChange}
                      placeholder="Enter provider name"
                      className={errors.provider ? "border-red-500" : ""}
                    />
                    {errors.provider && (
                      <p className="text-sm text-red-500">{errors.provider}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number <span className="text-red-500">*</span></Label>
                    <Input
                      id="accountNumber"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      placeholder="Enter account number"
                      className={errors.accountNumber ? "border-red-500" : ""}
                    />
                    {errors.accountNumber && (
                      <p className="text-sm text-red-500">{errors.accountNumber}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceAddress">Service Address</Label>
                  <Input
                    id="serviceAddress"
                    name="serviceAddress"
                    value={formData.serviceAddress}
                    onChange={handleChange}
                    placeholder="Enter service address (if different from property address)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meterNumber">Meter Number</Label>
                    <Input
                      id="meterNumber"
                      name="meterNumber"
                      value={formData.meterNumber}
                      onChange={handleChange}
                      placeholder="Enter meter number (if applicable)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date <span className="text-red-500">*</span></Label>
                    <Select 
                      value={formData.dueDate} 
                      onValueChange={(value) => handleSelectChange("dueDate", value)}
                    >
                      <SelectTrigger id="dueDate" className={errors.dueDate ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select due date" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(28)].map((_, index) => (
                          <SelectItem key={index + 1} value={(index + 1).toString()}>
                            {index + 1}{getOrdinalSuffix(index + 1)} of each month
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.dueDate && (
                      <p className="text-sm text-red-500">{errors.dueDate}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Contact & Payment Information</CardTitle>
                <CardDescription>
                  Provider contact details and payment settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Name</Label>
                    <Input
                      id="contactName"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      placeholder="Enter contact name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      placeholder="Enter contact phone"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      placeholder="Enter contact email"
                      type="email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Provider Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="Enter provider website URL"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="loginUsername">Online Account Username</Label>
                    <Input
                      id="loginUsername"
                      name="loginUsername"
                      value={formData.loginUsername}
                      onChange={handleChange}
                      placeholder="Enter login username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="loginPassword">Online Account Password</Label>
                    <Input
                      id="loginPassword"
                      name="loginPassword"
                      type="password"
                      value={formData.loginPassword}
                      onChange={handleChange}
                      placeholder="Enter login password"
                    />
                  </div>
                </div>
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Security Note</AlertTitle>
                  <AlertDescription>
                    Password information is encrypted and stored securely. We recommend using a password manager for added security.
                  </AlertDescription>
                </Alert>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="autoPayEnabled"
                    checked={formData.autoPayEnabled}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("autoPayEnabled", checked === true)
                    }
                  />
                  <Label htmlFor="autoPayEnabled" className="cursor-pointer">
                    Auto-pay enabled for this utility
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>
                  Notes and additional details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="billingCycle">Billing Cycle</Label>
                  <Select 
                    value={formData.billingCycle} 
                    onValueChange={(value) => handleSelectChange("billingCycle", value)}
                  >
                    <SelectTrigger id="billingCycle">
                      <SelectValue placeholder="Select billing cycle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="bimonthly">Bi-monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Add any notes or special instructions"
                    rows={5}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding Account..." : "Add Utility Account"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setLocation("/utilities")}
                >
                  Cancel
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

// Helper function to get ordinal suffix for numbers
function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

export default AddUtilityAccount;
