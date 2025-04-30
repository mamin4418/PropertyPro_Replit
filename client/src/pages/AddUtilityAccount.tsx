
import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const AddUtilityAccount = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    propertyId: "",
    utilityType: "",
    provider: "",
    accountNumber: "",
    meterNumber: "",
    billingCycle: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    website: "",
    autoPayEnabled: false,
    notes: ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, you would send this data to your API
    console.log("Submitting utility account:", formData);
    
    toast({
      title: "Utility Account Created",
      description: "The utility account has been successfully added.",
    });
    
    navigate("/utilities");
  };
  
  // Mock properties for selection
  const properties = [
    { id: 1, name: "Sunset Heights" },
    { id: 2, name: "Maple Gardens" },
    { id: 3, name: "Urban Lofts" },
  ];
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="icon" 
          className="mr-4"
          onClick={() => navigate("/utilities")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Add Utility Account</h1>
          <p className="text-muted-foreground">Create a new utility account for tracking</p>
        </div>
      </div>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Account Information</h2>
            </div>
            
            {/* Property Selection */}
            <div>
              <Label htmlFor="propertyId">Property</Label>
              <Select 
                onValueChange={(value) => handleSelectChange("propertyId", value)}
                value={formData.propertyId}
              >
                <SelectTrigger id="propertyId" className="mt-1">
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id.toString()}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Utility Type */}
            <div>
              <Label htmlFor="utilityType">Utility Type</Label>
              <Select 
                onValueChange={(value) => handleSelectChange("utilityType", value)}
                value={formData.utilityType}
              >
                <SelectTrigger id="utilityType" className="mt-1">
                  <SelectValue placeholder="Select utility type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electricity">Electricity</SelectItem>
                  <SelectItem value="water">Water</SelectItem>
                  <SelectItem value="gas">Gas</SelectItem>
                  <SelectItem value="internet">Internet</SelectItem>
                  <SelectItem value="trash">Trash</SelectItem>
                  <SelectItem value="sewer">Sewer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Provider */}
            <div>
              <Label htmlFor="provider">Service Provider</Label>
              <Input
                id="provider"
                name="provider"
                placeholder="e.g. PowerCo Energy"
                className="mt-1"
                value={formData.provider}
                onChange={handleChange}
              />
            </div>
            
            {/* Account Number */}
            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                name="accountNumber"
                placeholder="e.g. AC-12345-789"
                className="mt-1"
                value={formData.accountNumber}
                onChange={handleChange}
              />
            </div>
            
            {/* Meter Number */}
            <div>
              <Label htmlFor="meterNumber">Meter Number (if applicable)</Label>
              <Input
                id="meterNumber"
                name="meterNumber"
                placeholder="e.g. MT-98765"
                className="mt-1"
                value={formData.meterNumber}
                onChange={handleChange}
              />
            </div>
            
            {/* Billing Cycle */}
            <div>
              <Label htmlFor="billingCycle">Billing Cycle</Label>
              <Select 
                onValueChange={(value) => handleSelectChange("billingCycle", value)}
                value={formData.billingCycle}
              >
                <SelectTrigger id="billingCycle" className="mt-1">
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
            
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold mb-4 pt-4">Contact Information</h2>
            </div>
            
            {/* Contact Name */}
            <div>
              <Label htmlFor="contactName">Contact Name</Label>
              <Input
                id="contactName"
                name="contactName"
                placeholder="e.g. John Smith"
                className="mt-1"
                value={formData.contactName}
                onChange={handleChange}
              />
            </div>
            
            {/* Contact Phone */}
            <div>
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                placeholder="e.g. (555) 123-4567"
                className="mt-1"
                value={formData.contactPhone}
                onChange={handleChange}
              />
            </div>
            
            {/* Contact Email */}
            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                placeholder="e.g. contact@example.com"
                className="mt-1"
                value={formData.contactEmail}
                onChange={handleChange}
              />
            </div>
            
            {/* Website */}
            <div>
              <Label htmlFor="website">Provider Website</Label>
              <Input
                id="website"
                name="website"
                placeholder="e.g. https://provider.com"
                className="mt-1"
                value={formData.website}
                onChange={handleChange}
              />
            </div>
            
            {/* Notes */}
            <div className="md:col-span-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Enter any additional notes about this utility account"
                className="mt-1"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate("/utilities")}
            >
              Cancel
            </Button>
            <Button type="submit">
              Add Utility Account
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddUtilityAccount;
