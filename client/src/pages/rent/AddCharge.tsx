
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
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
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  property: z.string().min(1, "Property is required"),
  unit: z.string().min(1, "Unit is required"),
  chargeType: z.enum(["lease", "other"]),
  description: z.string().min(1, "Description is required"),
  amount: z.string().min(1, "Amount is required").refine(val => !isNaN(Number(val)), {
    message: "Amount must be a valid number",
  }),
  bookTo: z.string().min(1, "Account is required"),
  dueDate: z.string().min(1, "Due date is required"),
  totalOccurrences: z.string().optional(),
});

const AddCharge = () => {
  const [, navigate] = useLocation();
  const [chargeType, setChargeType] = useState("lease");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [charges, setCharges] = useState<Array<{amount: string, description: string, dueDate: string}>>([]);
  const [tenantList, setTenantList] = useState<Array<{id: number, name: string, date: string, selected: boolean}>>([]);
  
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

  // Mock data collections
  const properties = [
    { value: "1main", label: "1 Main Street", tenants: [{ id: 1, name: "Allison Martin", date: "January 31, 2026" }] },
    { value: "320jay", label: "320 Jay St", tenants: [{ id: 2, name: "Michael Johnson", date: "December 15, 2025" }] },
    { value: "7marne", label: "7 Marne St", tenants: [{ id: 3, name: "Sarah Davis", date: "March 20, 2026" }] },
    { value: "431main", label: "431 Main Street", tenants: [{ id: 4, name: "Robert Williams", date: "October 5, 2025" }] },
  ];

  const units = [
    { value: "main", label: "Main", propertyId: "1main" },
    { value: "1a", label: "1A", propertyId: "320jay" },
    { value: "2b", label: "2B", propertyId: "7marne" },
    { value: "3c", label: "3C", propertyId: "431main" },
  ];

  // Update tenant list when property and unit change
  useEffect(() => {
    if (selectedProperty) {
      const property = properties.find(p => p.value === selectedProperty);
      if (property) {
        setTenantList(property.tenants.map(tenant => ({ ...tenant, selected: true })));
      }
    }
  }, [selectedProperty, selectedUnit]);

  // Update charges list based on form values
  useEffect(() => {
    const amount = form.getValues("amount");
    const description = form.getValues("description");
    
    if (amount && description) {
      setCharges([{
        amount,
        description,
        dueDate: form.getValues("dueDate") || "06/01/2025"
      }]);
    }
  }, [form.watch("amount"), form.watch("description"), form.watch("dueDate")]);

  // Filter units based on selected property
  const filteredUnits = selectedProperty 
    ? units.filter(unit => unit.propertyId === selectedProperty) 
    : units;

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    console.log("Selected tenants:", tenantList.filter(t => t.selected));
    // In a real app, this would create the charge in the database
    navigate("/rent/charges");
  }

  const toggleTenantSelection = (tenantId: number) => {
    setTenantList(prevTenants => 
      prevTenants.map(tenant => 
        tenant.id === tenantId 
          ? { ...tenant, selected: !tenant.selected } 
          : tenant
      )
    );
  };

  const addCharge = () => {
    setCharges([...charges, {
      amount: form.getValues("amount") || "",
      description: form.getValues("description") || "",
      dueDate: form.getValues("dueDate") || "06/01/2025"
    }]);
  };

  const removeCharge = (index: number) => {
    const newCharges = [...charges];
    newCharges.splice(index, 1);
    setCharges(newCharges);
  };

  const duplicateCharge = (index: number) => {
    const chargeToClone = charges[index];
    setCharges([...charges, {...chargeToClone}]);
  };
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Add New Charge</h2>
        <p className="text-muted-foreground">Create a new rent charge or other fee</p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Charge Type Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Select the charge type</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div 
                    className={`border rounded-lg p-6 cursor-pointer transition-colors ${chargeType === "lease" ? "border-primary bg-primary/5" : "hover:border-gray-400"}`}
                    onClick={() => {
                      setChargeType("lease");
                      form.setValue("chargeType", "lease");
                    }}
                  >
                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className="text-center text-lg font-medium mb-1">Lease/Rent</h4>
                    <p className="text-center text-sm text-muted-foreground">for rent collection</p>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-6 cursor-pointer transition-colors ${chargeType === "other" ? "border-primary bg-primary/5" : "hover:border-gray-400"}`}
                    onClick={() => {
                      setChargeType("other");
                      form.setValue("chargeType", "other");
                    }}
                  >
                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <ReceiptText className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className="text-center text-lg font-medium mb-1">Other charges</h4>
                    <p className="text-center text-sm text-muted-foreground">for security deposits, utilities, fees etc.</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Property and Unit Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {chargeType === "lease" 
                    ? "Select property and unit for rent collection" 
                    : "Select property and unit for the charge"}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="property"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address:</FormLabel>
                        <Select 
                          onValueChange={(val) => {
                            field.onChange(val);
                            setSelectedProperty(val);
                            form.setValue("unit", "");
                            setSelectedUnit("");
                          }} 
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
                          onValueChange={(val) => {
                            field.onChange(val);
                            setSelectedUnit(val);
                          }} 
                          defaultValue={field.value}
                          disabled={!selectedProperty}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={selectedProperty ? "Select Unit" : "Select a property first"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filteredUnits.map((unit) => (
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
              </div>
              
              {selectedProperty && selectedUnit && (
                <>
                  <Separator />
                  
                  {/* Tenant Selection */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Tenants for this charge</h3>
                    
                    {tenantList.length > 0 ? (
                      <div className="space-y-3 mb-4">
                        {tenantList.map((tenant) => (
                          <div key={tenant.id} className="border rounded-md p-3 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={tenant.selected}
                                onCheckedChange={() => toggleTenantSelection(tenant.id)}
                                id={`tenant-${tenant.id}`}
                              />
                              <div>
                                <label 
                                  htmlFor={`tenant-${tenant.id}`} 
                                  className="font-medium cursor-pointer"
                                >
                                  {tenant.name}
                                </label>
                                <p className="text-sm text-muted-foreground">Lease ends: {tenant.date}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-muted-foreground mb-4">No tenants found for this unit.</div>
                    )}
                    
                    <div className="border border-dashed rounded-md p-3 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 mb-4">
                      <Plus className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-600">Add a New Tenant to this unit</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Charge Details */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Charge Details</h3>
                    
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
                                placeholder={chargeType === "lease" ? "Rent" : "Utilities"} 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount:</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <span className="text-muted-foreground">$</span>
                                </div>
                                <Input 
                                  type="number" 
                                  className="pl-7" 
                                  placeholder="0.00" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Due Date:</FormLabel>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <Input 
                                  type="text" 
                                  placeholder="MM/DD/YYYY" 
                                  {...field} 
                                />
                                <Button type="button" variant="ghost" size="icon">
                                  <CalendarIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="mt-4">
                      <FormField
                        control={form.control}
                        name="totalOccurrences"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Occurrences:</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="1" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* Preview Charges */}
                  {charges.length > 0 && (
                    <>
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Preview Charges</h3>
                        
                        <div className="rounded-md border mb-4">
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
                                    <div className="relative">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-muted-foreground">$</span>
                                      </div>
                                      <Input
                                        type="number"
                                        className="pl-7"
                                        value={charge.amount}
                                        onChange={(e) => {
                                          const newCharges = [...charges];
                                          newCharges[index].amount = e.target.value;
                                          setCharges(newCharges);
                                        }}
                                      />
                                    </div>
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
                                      <Button type="button" variant="ghost" size="icon">
                                        <CalendarIcon className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center space-x-1">
                                      <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon"
                                        onClick={() => duplicateCharge(index)}
                                      >
                                        <Copy className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon"
                                        onClick={() => removeCharge(index)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                        
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addCharge}
                          className="mb-4"
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add Another Charge
                        </Button>
                      </div>
                    </>
                  )}
                </>
              )}
              
              <div className="flex justify-between mt-6">
                <Button type="button" variant="outline" onClick={() => navigate("/rent/charges")}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Charges
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCharge;
