import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  FileText, 
  ArrowLeft,
  Calendar,
  Home,
  User,
  Check
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
  Checkbox
} from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

const AddLease = () => {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    property: "",
    unit: "",
    tenant: "",
    leaseTerm: "",
    startDate: "",
    endDate: "",
    rentAmount: "",
    securityDeposit: "",
    leaseNickname: "",
    rentDueDay: "1",
    lateFee: "",
    gracePeriod: "3",
    utilities: {
      water: false,
      electricity: false,
      gas: false,
      internet: false,
      trash: false
    },
    petDeposit: "",
    petRent: "",
    parkingFee: "",
    notes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (field: keyof typeof formData.utilities, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      utilities: {
        ...prev.utilities,
        [field]: checked
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would save the data to the backend
    console.log("Form submitted:", formData);
    navigate("/leases");
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/leases")} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Leases
        </Button>
        <h2 className="text-2xl font-bold">Create New Lease</h2>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Property Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Property Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>
              </div>

              <Separator />

              {/* Tenant Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Tenant Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <SelectItem value="add-new">+ Add New Tenant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="leaseNickname">Lease Nickname (Optional)</Label>
                    <Input
                      id="leaseNickname"
                      name="leaseNickname"
                      placeholder="e.g. Smith Family Lease"
                      className="mt-1"
                      value={formData.leaseNickname}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Lease Terms */}
              <div>
                <h3 className="text-lg font-medium mb-4">Lease Terms</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="leaseTerm">Lease Term</Label>
                    <Select 
                      value={formData.leaseTerm} 
                      onValueChange={(value) => handleSelectChange("leaseTerm", value)}
                    >
                      <SelectTrigger id="leaseTerm" className="mt-1">
                        <SelectValue placeholder="Select lease term" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month-to-month">Month to Month</SelectItem>
                        <SelectItem value="6-month">6 Months</SelectItem>
                        <SelectItem value="1-year">1 Year</SelectItem>
                        <SelectItem value="2-year">2 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      className="mt-1"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      className="mt-1"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="rentAmount">Monthly Rent</Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="rentAmount"
                        name="rentAmount"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="pl-8"
                        value={formData.rentAmount}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="securityDeposit">Security Deposit</Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="securityDeposit"
                        name="securityDeposit"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="pl-8"
                        value={formData.securityDeposit}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="rentDueDay">Rent Due Day</Label>
                    <Select 
                      value={formData.rentDueDay} 
                      onValueChange={(value) => handleSelectChange("rentDueDay", value)}
                    >
                      <SelectTrigger id="rentDueDay" className="mt-1">
                        <SelectValue placeholder="Select due day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st of month</SelectItem>
                        <SelectItem value="5">5th of month</SelectItem>
                        <SelectItem value="10">10th of month</SelectItem>
                        <SelectItem value="15">15th of month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <Label htmlFor="lateFee">Late Fee Amount</Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="lateFee"
                        name="lateFee"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="pl-8"
                        value={formData.lateFee}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="gracePeriod">Grace Period (Days)</Label>
                    <Input
                      id="gracePeriod"
                      name="gracePeriod"
                      type="number"
                      min="0"
                      placeholder="0"
                      className="mt-1"
                      value={formData.gracePeriod}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Additional Details */}
              <div>
                <h3 className="text-lg font-medium mb-4">Additional Details</h3>
                
                <div className="mb-4">
                  <Label className="mb-2 block">Utilities Included</Label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="water" 
                        checked={formData.utilities.water}
                        onCheckedChange={(checked) => handleCheckboxChange('water', checked as boolean)} 
                      />
                      <Label htmlFor="water" className="font-normal">Water</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="electricity" 
                        checked={formData.utilities.electricity}
                        onCheckedChange={(checked) => handleCheckboxChange('electricity', checked as boolean)} 
                      />
                      <Label htmlFor="electricity" className="font-normal">Electricity</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="gas" 
                        checked={formData.utilities.gas}
                        onCheckedChange={(checked) => handleCheckboxChange('gas', checked as boolean)} 
                      />
                      <Label htmlFor="gas" className="font-normal">Gas</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="internet" 
                        checked={formData.utilities.internet}
                        onCheckedChange={(checked) => handleCheckboxChange('internet', checked as boolean)} 
                      />
                      <Label htmlFor="internet" className="font-normal">Internet</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="trash" 
                        checked={formData.utilities.trash}
                        onCheckedChange={(checked) => handleCheckboxChange('trash', checked as boolean)} 
                      />
                      <Label htmlFor="trash" className="font-normal">Trash</Label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <div>
                    <Label htmlFor="petDeposit">Pet Deposit</Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="petDeposit"
                        name="petDeposit"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="pl-8"
                        value={formData.petDeposit}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="petRent">Pet Rent (Monthly)</Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="petRent"
                        name="petRent"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="pl-8"
                        value={formData.petRent}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="parkingFee">Parking Fee (Monthly)</Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="parkingFee"
                        name="parkingFee"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="pl-8"
                        value={formData.parkingFee}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Enter any additional notes or special conditions"
                    className="mt-1"
                    rows={4}
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <Button variant="outline" onClick={() => navigate("/leases")}>
                Cancel
              </Button>
              <Button type="submit">
                <FileText className="mr-2 h-4 w-4" />
                Create Lease
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddLease;