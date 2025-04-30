
import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

const ScheduleInspection = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  const [formData, setFormData] = useState({
    propertyId: "",
    inspectionType: "",
    inspector: "",
    scheduledTime: "",
    notifyTenants: true,
    notificationMethod: "email",
    notes: "",
    units: [] as string[]
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
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };
  
  const handleUnitToggle = (unitNumber: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        units: [...formData.units, unitNumber]
      });
    } else {
      setFormData({
        ...formData,
        units: formData.units.filter(unit => unit !== unitNumber)
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast({
        title: "Error",
        description: "Please select an inspection date.",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.units.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one unit to inspect.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real application, you would send this data to your API
    console.log("Scheduling inspection:", {
      ...formData,
      scheduledDate: date
    });
    
    toast({
      title: "Inspection Scheduled",
      description: "The property inspection has been successfully scheduled.",
    });
    
    navigate("/property-inspections");
  };
  
  // Mock properties and units
  const properties = [
    { id: 1, name: "Sunset Heights" },
    { id: 2, name: "Maple Gardens" },
    { id: 3, name: "Urban Lofts" },
  ];
  
  const propertyUnits = {
    "1": [
      { number: "101", tenant: "John Doe" },
      { number: "102", tenant: "Jane Smith" },
      { number: "103", tenant: "Michael Brown" },
      { number: "201", tenant: "Sarah Johnson" },
      { number: "202", tenant: "Robert Wilson" },
      { number: "203", tenant: "Emily Davis" },
      { number: "301", tenant: "David Miller" },
      { number: "302", tenant: "Jennifer Taylor" },
      { number: "303", tenant: "Christopher Anderson" },
    ],
    "2": [
      { number: "A1", tenant: "Thomas Martinez" },
      { number: "A2", tenant: "Lisa Garcia" },
      { number: "B1", tenant: "Daniel Rodriguez" },
      { number: "B2", tenant: "Michelle Lee" },
      { number: "C1", tenant: "James Wilson" },
      { number: "C2", tenant: "Kimberly Moore" },
    ],
    "3": [
      { number: "1A", tenant: "Patricia White" },
      { number: "1B", tenant: "William Clark" },
      { number: "2A", tenant: "Elizabeth Lewis" },
      { number: "2B", tenant: "Richard Hall" },
    ],
  };
  
  const inspectors = [
    "David Johnson",
    "Sarah Williams",
    "Michael Chen",
    "Jessica Thompson",
    "Robert Anderson"
  ];
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="icon" 
          className="mr-4"
          onClick={() => navigate("/property-inspections")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Schedule Property Inspection</h1>
          <p className="text-muted-foreground">Set up a new property inspection</p>
        </div>
      </div>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Inspection Details</h2>
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
            
            {/* Inspection Type */}
            <div>
              <Label htmlFor="inspectionType">Inspection Type</Label>
              <Select 
                onValueChange={(value) => handleSelectChange("inspectionType", value)}
                value={formData.inspectionType}
              >
                <SelectTrigger id="inspectionType" className="mt-1">
                  <SelectValue placeholder="Select inspection type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">Routine Inspection</SelectItem>
                  <SelectItem value="move-in">Move-in Inspection</SelectItem>
                  <SelectItem value="move-out">Move-out Inspection</SelectItem>
                  <SelectItem value="maintenance">Maintenance Follow-up</SelectItem>
                  <SelectItem value="annual">Annual Inspection</SelectItem>
                  <SelectItem value="custom">Custom Inspection</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Inspector Assignment */}
            <div>
              <Label htmlFor="inspector">Assign Inspector</Label>
              <Select 
                onValueChange={(value) => handleSelectChange("inspector", value)}
                value={formData.inspector}
              >
                <SelectTrigger id="inspector" className="mt-1">
                  <SelectValue placeholder="Select inspector" />
                </SelectTrigger>
                <SelectContent>
                  {inspectors.map((inspector, index) => (
                    <SelectItem key={index} value={inspector}>
                      {inspector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Date Picker */}
            <div>
              <Label htmlFor="scheduledDate">Inspection Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full mt-1 justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Select a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Time */}
            <div>
              <Label htmlFor="scheduledTime">Inspection Time</Label>
              <Select 
                onValueChange={(value) => handleSelectChange("scheduledTime", value)}
                value={formData.scheduledTime}
              >
                <SelectTrigger id="scheduledTime" className="mt-1">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00 AM">9:00 AM</SelectItem>
                  <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                  <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                  <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                  <SelectItem value="01:00 PM">1:00 PM</SelectItem>
                  <SelectItem value="02:00 PM">2:00 PM</SelectItem>
                  <SelectItem value="03:00 PM">3:00 PM</SelectItem>
                  <SelectItem value="04:00 PM">4:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Notification Options */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold mb-4 pt-2">Notifications</h2>
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox 
                  id="notifyTenants" 
                  checked={formData.notifyTenants} 
                  onCheckedChange={(checked) => handleCheckboxChange("notifyTenants", checked as boolean)}
                />
                <Label htmlFor="notifyTenants">Notify tenants about the scheduled inspection</Label>
              </div>
              
              {formData.notifyTenants && (
                <div>
                  <Label htmlFor="notificationMethod">Notification Method</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange("notificationMethod", value)}
                    value={formData.notificationMethod}
                  >
                    <SelectTrigger id="notificationMethod" className="mt-1">
                      <SelectValue placeholder="Select notification method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="both">Both Email & SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            {/* Unit Selection */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold mb-4 pt-2">Units to Inspect</h2>
              {!formData.propertyId ? (
                <p className="text-muted-foreground italic">Please select a property first</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {propertyUnits[formData.propertyId as keyof typeof propertyUnits]?.map((unit, index) => (
                    <div key={index} className="flex items-center space-x-2 border rounded-md p-3">
                      <Checkbox 
                        id={`unit-${unit.number}`} 
                        checked={formData.units.includes(unit.number)} 
                        onCheckedChange={(checked) => handleUnitToggle(unit.number, checked as boolean)}
                      />
                      <Label htmlFor={`unit-${unit.number}`} className="flex flex-col">
                        <span className="font-medium">Unit {unit.number}</span>
                        <span className="text-xs text-muted-foreground">{unit.tenant}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Notes */}
            <div className="md:col-span-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Enter any additional notes about this inspection"
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
              onClick={() => navigate("/property-inspections")}
            >
              Cancel
            </Button>
            <Button type="submit">
              Schedule Inspection
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ScheduleInspection;
