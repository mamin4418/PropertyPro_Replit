
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Calendar, ReceiptText, Copy, Trash2, Calendar as CalendarIcon, Plus, AlertCircle, MoreVertical } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  property: z.string().min(1, "Property is required"),
  unit: z.string().min(1, "Unit is required"),
  chargeType: z.enum(["lease", "other"]),
  description: z.string().min(1, "Description is required"),
  amount: z.string().min(1, "Amount is required"),
  bookTo: z.string().min(1, "Account is required"),
  dueDate: z.string().min(1, "Due date is required"),
  totalOccurrences: z.string().optional(),
});

const AddCharge = () => {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("lease");
  const [currentStep, setCurrentStep] = useState(1);
  const [charges, setCharges] = useState<Array<{amount: string, description: string, dueDate: string}>>([]);
  
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
      totalOccurrences: "1",
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

  const tenants = [
    { id: 1, name: "Allison Martin", date: "January 31, 2026" }
  ];

  const handleContinueToDetailsStep = () => {
    // Create a sample charge for the preview
    if (currentStep === 3) {
      // When coming from the tenants step
      setCharges([{
        amount: form.getValues("amount") || "200",
        description: form.getValues("description") || "Utilities",
        dueDate: "06/01/2025"
      }]);
    }
    setCurrentStep(prev => prev + 1);
  };
  
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
        <>
          <div className="mb-6">
            <div className="flex border-b">
              <div className="pb-2 px-1 text-muted-foreground">Select unit</div>
              <div className={`pb-2 px-1 ${currentStep === 3 ? "border-b-2 border-primary font-medium text-primary" : ""}`}>Tenants</div>
              <div className="pb-2 px-1 text-muted-foreground">Charge details</div>
              <div className="pb-2 px-1 text-muted-foreground">Edit and save</div>
            </div>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Connect tenants to their charges & request eSignatures</h3>
              <p className="text-muted-foreground mb-4">Only the tenants listed below will be able to view and pay lease charges now or in the future.</p>
              
              <div className="bg-blue-100 rounded-md p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <p className="text-sm text-blue-700">
                  Click "•••" and select 'Exclude from New Charge' for tenants who are not part of this lease.
                </p>
              </div>
              
              <div className="space-y-4 mb-6">
                {tenants.map((tenant) => (
                  <div key={tenant.id} className="border rounded-md p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{tenant.name}</p>
                      <p className="text-sm text-muted-foreground">{tenant.date}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="border border-dashed rounded-md p-4 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 mb-6">
                <Plus className="h-5 w-5 text-blue-600" />
                <span className="text-blue-600">Add a New Tenant to 1 Main Street, unit 1A.</span>
              </div>
              
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(2)}>
                  Go Back
                </Button>
                <Button type="button" onClick={handleContinueToDetailsStep}>
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {currentStep === 4 && (
        <>
          <div className="mb-6">
            <div className="flex border-b">
              <div className="pb-2 px-1 text-muted-foreground">Select unit</div>
              <div className="pb-2 px-1 text-muted-foreground">Tenants</div>
              <div className={`pb-2 px-1 ${currentStep === 4 ? "border-b-2 border-primary font-medium text-primary" : ""}`}>Charge details</div>
              <div className="pb-2 px-1 text-muted-foreground">Edit and save</div>
            </div>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Provide charge details</h3>
              <p className="text-muted-foreground mb-6">Enter the amount due and the number of charges you would like to create.</p>
              
              <div className="max-w-md space-y-4 mb-6">
                <div className="space-y-2">
                  <FormLabel>Amount:</FormLabel>
                  <Input
                    type="number"
                    placeholder="200"
                    value={form.getValues("amount")}
                    onChange={(e) => form.setValue("amount", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <FormLabel>Total Occurrences:</FormLabel>
                  <Input
                    type="number"
                    placeholder="1"
                    value={form.getValues("totalOccurrences") || "1"}
                    onChange={(e) => form.setValue("totalOccurrences", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(3)}>
                  Go Back
                </Button>
                <Button type="button" onClick={() => setCurrentStep(5)}>
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
      
      {currentStep === 5 && (
        <>
          <div className="mb-6">
            <div className="flex border-b">
              <div className="pb-2 px-1 text-muted-foreground">Select unit</div>
              <div className="pb-2 px-1 text-muted-foreground">Tenants</div>
              <div className="pb-2 px-1 text-muted-foreground">Charge details</div>
              <div className={`pb-2 px-1 ${currentStep === 5 ? "border-b-2 border-primary font-medium text-primary" : ""}`}>Edit and save</div>
            </div>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Preview and edit charges</h3>
              <p className="text-muted-foreground mb-6">Edit, delete or duplicate charges if needed.</p>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Amount</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {charges.map((charge, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            type="number"
                            value={charge.amount}
                            onChange={(e) => {
                              const newCharges = [...charges];
                              newCharges[index].amount = e.target.value;
                              setCharges(newCharges);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="text"
                            value={charge.description}
                            onChange={(e) => {
                              const newCharges = [...charges];
                              newCharges[index].description = e.target.value;
                              setCharges(newCharges);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="text"
                              value={charge.dueDate}
                              onChange={(e) => {
                                const newCharges = [...charges];
                                newCharges[index].dueDate = e.target.value;
                                setCharges(newCharges);
                              }}
                            />
                            <Button variant="ghost" size="icon">
                              <CalendarIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="icon">
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-between mt-6">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(4)}>
                  Go Back
                </Button>
                <Button type="button" onClick={() => navigate("/rent/charges")}>
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AddCharge;
