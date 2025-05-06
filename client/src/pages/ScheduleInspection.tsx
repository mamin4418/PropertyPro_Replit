
import React, { useState } from "react";
import { useLocation } from "wouter";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Home, 
  Users, 
  ClipboardCheck, 
  ChevronLeft,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useQuery } from "@tanstack/react-query";

const ScheduleInspection = () => {
  const [location, setLocation] = useLocation();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [inspectionType, setInspectionType] = useState("Routine");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [selectedInspector, setSelectedInspector] = useState("");
  const [notes, setNotes] = useState("");
  const [notifyTenants, setNotifyTenants] = useState(true);
  const [timeSlot, setTimeSlot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Mock property data query - replace with actual API call
  const { data: properties, isLoading: loadingProperties } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      // Simulated API call - replace with actual API
      return [
        { id: 1, name: "Sunset Heights", units: ["101", "102", "103", "201", "202", "203"] },
        { id: 2, name: "Maple Gardens", units: ["A1", "A2", "B1", "B2", "C1", "C2"] },
        { id: 3, name: "Urban Lofts", units: ["1A", "1B", "2A", "2B", "3A", "3B"] }
      ];
    }
  });

  // Mock inspectors data query
  const { data: inspectors } = useQuery({
    queryKey: ["inspectors"],
    queryFn: async () => {
      // Simulated API call - replace with actual API
      return [
        { id: 1, name: "David Johnson" },
        { id: 2, name: "Sarah Williams" },
        { id: 3, name: "Michael Chen" }
      ];
    }
  });

  // Find the selected property data
  const selectedPropertyData = properties?.find(p => p.id.toString() === selectedProperty);

  // Toggle unit selection
  const toggleUnit = (unit: string) => {
    if (selectedUnits.includes(unit)) {
      setSelectedUnits(selectedUnits.filter(u => u !== unit));
    } else {
      setSelectedUnits([...selectedUnits, unit]);
    }
  };

  // Select all units
  const selectAllUnits = () => {
    if (selectedPropertyData) {
      setSelectedUnits([...selectedPropertyData.units]);
    }
  };

  // Clear all units
  const clearAllUnits = () => {
    setSelectedUnits([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !selectedProperty || selectedUnits.length === 0 || !selectedInspector || !timeSlot) {
      alert("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, make an API call to create the inspection
      // For now, simulate a successful API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setLocation("/property-inspections");
      }, 1500);
      
    } catch (error) {
      console.error("Error scheduling inspection:", error);
      alert("Failed to schedule inspection. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="text-2xl font-bold mt-4">Inspection Scheduled!</h2>
            <p className="mt-2 text-muted-foreground">
              Your inspection has been successfully scheduled.
            </p>
            <Button className="mt-6" onClick={() => setLocation("/property-inspections")}>
              Return to Inspections
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-2" 
          onClick={() => setLocation("/property-inspections")}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Schedule Inspection</h1>
          <p className="text-muted-foreground">Create a new property inspection</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Inspection Details</CardTitle>
                <CardDescription>
                  Provide details about the inspection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="inspectionType">Inspection Type *</Label>
                    <Select 
                      value={inspectionType} 
                      onValueChange={setInspectionType}
                      required
                    >
                      <SelectTrigger id="inspectionType">
                        <SelectValue placeholder="Select inspection type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Routine">Routine Inspection</SelectItem>
                        <SelectItem value="Move-in">Move-in Inspection</SelectItem>
                        <SelectItem value="Move-out">Move-out Inspection</SelectItem>
                        <SelectItem value="Annual">Annual Inspection</SelectItem>
                        <SelectItem value="Maintenance">Maintenance Inspection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="property">Property *</Label>
                    <Select 
                      value={selectedProperty} 
                      onValueChange={(val) => {
                        setSelectedProperty(val);
                        setSelectedUnits([]);
                      }}
                      disabled={loadingProperties}
                      required
                    >
                      <SelectTrigger id="property">
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
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Units to Inspect *</Label>
                    <div className="space-x-2 text-sm">
                      <Button 
                        type="button" 
                        variant="link" 
                        className="p-0 h-auto text-sm"
                        onClick={selectAllUnits}
                        disabled={!selectedPropertyData}
                      >
                        Select All
                      </Button>
                      <span>|</span>
                      <Button 
                        type="button" 
                        variant="link" 
                        className="p-0 h-auto text-sm"
                        onClick={clearAllUnits}
                        disabled={selectedUnits.length === 0}
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                  
                  {!selectedPropertyData ? (
                    <div className="border rounded-md p-4 text-center text-muted-foreground">
                      <Home className="h-8 w-8 mx-auto mb-2" />
                      Please select a property
                    </div>
                  ) : (
                    <div className="border rounded-md p-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {selectedPropertyData.units.map(unit => (
                          <div key={unit} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`unit-${unit}`} 
                              checked={selectedUnits.includes(unit)}
                              onCheckedChange={() => toggleUnit(unit)}
                            />
                            <Label htmlFor={`unit-${unit}`} className="cursor-pointer">
                              Unit {unit}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {selectedUnits.length === 0 && (
                        <p className="text-sm text-red-500 mt-2">Please select at least one unit</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="inspector">Inspector *</Label>
                    <Select 
                      value={selectedInspector} 
                      onValueChange={setSelectedInspector}
                      required
                    >
                      <SelectTrigger id="inspector">
                        <SelectValue placeholder="Assign inspector" />
                      </SelectTrigger>
                      <SelectContent>
                        {inspectors?.map(inspector => (
                          <SelectItem key={inspector.id} value={inspector.id.toString()}>
                            {inspector.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Inspection Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Time Slot *</Label>
                  <RadioGroup value={timeSlot} onValueChange={setTimeSlot} className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="9:00 AM" id="time-1" />
                      <Label htmlFor="time-1">9:00 AM</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="11:00 AM" id="time-2" />
                      <Label htmlFor="time-2">11:00 AM</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1:00 PM" id="time-3" />
                      <Label htmlFor="time-3">1:00 PM</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3:00 PM" id="time-4" />
                      <Label htmlFor="time-4">3:00 PM</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any special instructions or notes here"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure notifications for this inspection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="notifyTenants" 
                    checked={notifyTenants} 
                    onCheckedChange={(checked) => {
                      if (typeof checked === 'boolean') setNotifyTenants(checked);
                    }}
                  />
                  <div>
                    <Label htmlFor="notifyTenants" className="cursor-pointer">
                      Notify Tenants
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Send email notifications to affected tenants
                    </p>
                  </div>
                </div>
                
                {/* More notification options could be added here */}
              </CardContent>
              <CardFooter className="flex-col gap-4">
                <div className="w-full p-4 bg-blue-50 dark:bg-blue-950 rounded-md text-sm">
                  <h4 className="font-medium mb-2">Inspection Summary</h4>
                  {selectedProperty && (
                    <p><span className="font-medium">Property:</span> {selectedPropertyData?.name}</p>
                  )}
                  {selectedUnits.length > 0 && (
                    <p><span className="font-medium">Units:</span> {selectedUnits.length} selected</p>
                  )}
                  {date && (
                    <p><span className="font-medium">Date:</span> {format(date, "PPP")}</p>
                  )}
                  {timeSlot && (
                    <p><span className="font-medium">Time:</span> {timeSlot}</p>
                  )}
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Scheduling..." : "Schedule Inspection"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ScheduleInspection;
