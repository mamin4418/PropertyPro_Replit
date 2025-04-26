import { useState } from "react";
import { useLocation } from "wouter";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  Building,
  Save,
  Trash2,
  Upload,
  User
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Form validation schema
const paymentFormSchema = z.object({
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, { message: "Category is required" }),
  amount: z.coerce.number().positive({ message: "Amount must be positive" }),
  date: z.string().min(1, { message: "Date is required" }),
  paymentMethod: z.string().min(1, { message: "Payment method is required" }),
  referenceNumber: z.string().optional(),
  status: z.string().min(1, { message: "Status is required" }),
  propertyId: z.string().min(1, { message: "Property is required" }),
  unit: z.string().optional(),
  tenantId: z.string().optional(),
  leaseId: z.string().optional(),
  description: z.string().min(1, { message: "Description is required" }),
  notes: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

// Mock data for a payment
const payment = {
  id: 201,
  type: "income",
  category: "Rent",
  amount: 1200,
  date: "2023-04-05",
  paymentMethod: "Bank Transfer",
  referenceNumber: "REF-123456",
  status: "completed",
  propertyId: "1",
  unit: "Apt 101",
  tenantId: "1",
  leaseId: "101",
  description: "April 2023 rent payment",
  receiptUrl: "/receipts/receipt-123456.pdf",
  createdBy: "Admin User",
  createdAt: "2023-04-05T10:30:00Z",
  notes: "Payment received on time"
};

// Mock data for properties
const properties = [
  { id: "1", name: "Sunset Heights", units: ["Apt 101", "Apt 102", "Apt 103"] },
  { id: "2", name: "Riverside Apartments", units: ["Unit 1A", "Unit 1B", "Unit 2A"] }
];

// Mock data for tenants
const tenants = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Michael Johnson" }
];

// Mock data for leases
const leases = [
  { id: "101", property: "Sunset Heights", unit: "Apt 101", tenant: "John Doe" },
  { id: "102", property: "Riverside Apartments", unit: "Unit 1A", tenant: "Jane Smith" }
];

// Payment categories
const incomeCategories = [
  "Rent",
  "Security Deposit",
  "Late Fee",
  "Application Fee",
  "Other Income"
];

const expenseCategories = [
  "Maintenance",
  "Utilities",
  "Insurance",
  "Property Tax",
  "Management Fee",
  "Other Expense"
];

const EditPayment = () => {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"income" | "expense">(payment.type as "income" | "expense");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(payment.propertyId);
  const [availableUnits, setAvailableUnits] = useState<string[]>([]);
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    receipt: null
  });

  // Initialize form with react-hook-form
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      type: payment.type as "income" | "expense",
      category: payment.category,
      amount: payment.amount,
      date: payment.date,
      paymentMethod: payment.paymentMethod,
      referenceNumber: payment.referenceNumber,
      status: payment.status,
      propertyId: payment.propertyId,
      unit: payment.unit,
      tenantId: payment.tenantId,
      leaseId: payment.leaseId,
      description: payment.description,
      notes: payment.notes,
    },
  });

  // Update form values when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value as "income" | "expense");
    form.setValue("type", value as "income" | "expense");
    form.setValue("category", ""); // Reset category when switching tabs
  };

  // Form submission handler
  const onSubmit = (values: PaymentFormValues) => {
    console.log("Form values:", values);
    console.log("Files:", files);
    // Here you would typically send the data to an API
    
    // Navigate back to payment details page after submission
    navigate(`/view-payment/${payment.id}`);
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="p-0 mr-2 h-8 w-8" 
          onClick={() => navigate(`/view-payment/${payment.id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">Edit Payment</h2>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Edit Payment Information</CardTitle>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Payment Type Selection */}
              <Tabs 
                value={activeTab} 
                onValueChange={handleTabChange} 
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="income" className="flex items-center">
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Income
                  </TabsTrigger>
                  <TabsTrigger value="expense" className="flex items-center">
                    <ArrowDownLeft className="mr-2 h-4 w-4" />
                    Expense
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="income" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Income Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select income category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {incomeCategories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
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
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-muted-foreground">$</span>
                              </div>
                              <Input type="number" className="pl-7" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select payment method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Cash">Cash</SelectItem>
                              <SelectItem value="Check">Check</SelectItem>
                              <SelectItem value="Credit Card">Credit Card</SelectItem>
                              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                              <SelectItem value="Money Order">Money Order</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="failed">Failed</SelectItem>
                              <SelectItem value="refunded">Refunded</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="referenceNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reference Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Check #1234" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="expense" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expense Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select expense category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {expenseCategories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
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
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-muted-foreground">$</span>
                              </div>
                              <Input type="number" className="pl-7" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select payment method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Cash">Cash</SelectItem>
                              <SelectItem value="Check">Check</SelectItem>
                              <SelectItem value="Credit Card">Credit Card</SelectItem>
                              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                              <SelectItem value="Money Order">Money Order</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="failed">Failed</SelectItem>
                              <SelectItem value="refunded">Refunded</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="referenceNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reference Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Invoice #5678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              </Tabs>
              
              {/* Related Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Related Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="propertyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedPropertyId(value);
                            const property = properties.find(p => p.id === value);
                            if (property) {
                              setAvailableUnits(property.units);
                            } else {
                              setAvailableUnits([]);
                            }
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select property" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {properties.map((property) => (
                              <SelectItem key={property.id} value={property.id}>
                                {property.name}
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
                        <FormLabel>Unit</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableUnits.map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {activeTab === "income" && (
                    <>
                      <FormField
                        control={form.control}
                        name="tenantId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tenant</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select tenant" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {tenants.map((tenant) => (
                                  <SelectItem key={tenant.id} value={tenant.id}>
                                    {tenant.name}
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
                        name="leaseId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lease</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select lease" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {leases.map((lease) => (
                                  <SelectItem key={lease.id} value={lease.id}>
                                    Lease #{lease.id} - {lease.property}, {lease.unit}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              </div>
              
              {/* Description and Notes */}
              <div>
                <h3 className="text-lg font-medium mb-4">Details</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter payment description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter any additional notes"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Documents & Attachments */}
              <div>
                <h3 className="text-lg font-medium mb-4">Documents & Receipts</h3>
                <div className="w-full">
                  <div className="mt-1">
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="documents" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Upload receipts, invoices, and payment confirmations
                          </p>
                          <p className="text-xs text-muted-foreground">PDF, PNG, JPG (MAX. 10MB per file)</p>
                          <p className="text-xs font-medium text-primary-foreground mt-1">Multiple files allowed</p>
                          {files.receipt && (
                            <p className="mt-2 text-xs text-primary">File: {files.receipt.name}</p>
                          )}
                        </div>
                        <input 
                          id="documents" 
                          name="documents" 
                          type="file" 
                          className="hidden" 
                          accept="image/png,image/jpeg,image/jpg,application/pdf"
                          multiple
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              setFiles(prev => ({
                                ...prev,
                                receipt: e.target.files![0]
                              }));
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <Button variant="destructive" type="button" className="flex items-center">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Payment
                </Button>
                
                <div className="flex gap-3">
                  <Button variant="outline" type="button" onClick={() => navigate(`/view-payment/${payment.id}`)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditPayment;