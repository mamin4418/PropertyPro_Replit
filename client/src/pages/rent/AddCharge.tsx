
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Calendar, ReceiptText } from "lucide-react";

const formSchema = z.object({
  property: z.string().min(1, "Property is required"),
  unit: z.string().min(1, "Unit is required"),
  chargeType: z.enum(["lease", "other"]),
  description: z.string().min(1, "Description is required"),
  amount: z.string().min(1, "Amount is required"),
  bookTo: z.string().min(1, "Account is required"),
  dueDate: z.string().min(1, "Due date is required"),
});

const AddCharge = () => {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("lease");
  const [currentStep, setCurrentStep] = useState(1);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      property: "",
      unit: "",
      chargeType: "lease",
      description: "",
      amount: "",
      bookTo: "Rental Income",
      dueDate: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // In a real app, this would create the charge in the database
    navigate("/rent/charges");
  }

  const properties = [
    { value: "1main", label: "1 Main Street" },
    { value: "320jay", label: "320 Jay St" },
    { value: "7marne", label: "7 Marne St" },
    { value: "431main", label: "431 Main Street" },
  ];

  const units = [
    { value: "main", label: "Main" },
    { value: "1a", label: "1A" },
    { value: "2b", label: "2B" },
    { value: "3c", label: "3C" },
  ];
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Add New Charge</h2>
        <p className="text-muted-foreground">Create a new rent charge or other fee</p>
      </div>
      
      {currentStep === 1 && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-6">Select the charge type</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                className={`border rounded-lg p-6 cursor-pointer transition-colors ${activeTab === "lease" ? "border-primary bg-primary/5" : "hover:border-gray-400"}`}
                onClick={() => setActiveTab("lease")}
              >
                <div className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-12 w-12 text-blue-600" />
                </div>
                <h4 className="text-center text-lg font-medium mb-1">Lease/Rent</h4>
                <p className="text-center text-sm text-muted-foreground">for rent collection</p>
              </div>
              
              <div 
                className={`border rounded-lg p-6 cursor-pointer transition-colors ${activeTab === "other" ? "border-primary bg-primary/5" : "hover:border-gray-400"}`}
                onClick={() => setActiveTab("other")}
              >
                <div className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                  <ReceiptText className="h-12 w-12 text-blue-600" />
                </div>
                <h4 className="text-center text-lg font-medium mb-1">Other charges</h4>
                <p className="text-center text-sm text-muted-foreground">for security deposits, utilities, fees etc.</p>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button type="button" onClick={() => setCurrentStep(2)}>
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {currentStep === 2 && (
        <>
          <div className="mb-6">
            <div className="flex border-b">
              <div className={`pb-2 px-1 ${currentStep === 2 ? "border-b-2 border-primary font-medium text-primary" : ""}`}>Select unit</div>
              <div className="pb-2 px-1 text-muted-foreground">Tenants</div>
              <div className="pb-2 px-1 text-muted-foreground">Charge details</div>
              <div className="pb-2 px-1 text-muted-foreground">Edit and save</div>
            </div>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-6">
                {activeTab === "lease" 
                  ? "Start collecting rent from the unit" 
                  : "Add a new charge for the unit"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {activeTab === "lease"
                  ? "Select the property and unit from which you would like to start collecting rent"
                  : "Choose the property and unit for which you would like to create the charge"}
              </p>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="property"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address:</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Property" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {properties.map((property) => (
                                <SelectItem key={property.value} value={property.value}>
                                  {property.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit:</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Unit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {units.map((unit) => (
                                <SelectItem key={unit.value} value={unit.value}>
                                  {unit.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="bookTo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Book to:</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Account" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Rental Income">Rental Income</SelectItem>
                              <SelectItem value="Utilities Income">Utilities Income</SelectItem>
                              <SelectItem value="Deposits">Deposits</SelectItem>
                              <SelectItem value="Fees">Fees</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description:</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={activeTab === "lease" ? "Rent" : "Utilities"} 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                      Back
                    </Button>
                    <Button type="button" onClick={() => setCurrentStep(3)}>
                      Continue
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </>
      )}
      
      {currentStep === 3 && (
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => setCurrentStep(2)}>Back</Button>
          <Button onClick={() => navigate("/rent/charges")}>Save Charge</Button>
        </div>
      )}
    </div>
  );
};

export default AddCharge;
