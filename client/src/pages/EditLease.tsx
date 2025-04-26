import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { ArrowLeft, Save, Trash2, Upload, Users, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Form validation schema
const leaseFormSchema = z.object({
  status: z.string(),
  type: z.string(),
  propertyId: z.string(),
  unit: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  term: z.string(),
  rentAmount: z.coerce.number().positive({ message: "Rent amount must be positive" }),
  lateFee: z.coerce.number().nonnegative({ message: "Late fee must be positive or zero" }),
  securityDeposit: z.coerce.number().nonnegative({ message: "Security deposit must be positive or zero" }),
  petDeposit: z.coerce.number().nonnegative({ message: "Pet deposit must be positive or zero" }),
  tenantIds: z.array(z.string()),
  notes: z.string().optional(),
  includeUtilities: z.boolean().default(false),
  renewalOption: z.boolean().default(false),
  earlyTerminationFee: z.coerce.number().nonnegative().optional(),
});

type LeaseFormValues = z.infer<typeof leaseFormSchema>;

// Mock data for a lease
const lease = {
  id: 101,
  status: "active",
  type: "Fixed Term",
  propertyId: "1",
  property: {
    id: 1,
    name: "Sunset Heights",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001"
  },
  unit: "Apt 101",
  startDate: "2022-06-15",
  endDate: "2023-06-14",
  term: "12 months",
  rentAmount: 1200,
  lateFee: 50,
  securityDeposit: 1200,
  petDeposit: 300,
  includeUtilities: false,
  renewalOption: true,
  earlyTerminationFee: 2400,
  tenantIds: ["1", "2"],
  tenants: [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "(555) 123-4567"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "(555) 987-6543"
    }
  ],
  notes: "Tenants have one cat. Lease renewable upon mutual agreement."
};

// Mock data for properties
const properties = [
  { id: 1, name: "Sunset Heights", units: ["Apt 101", "Apt 102", "Apt 103"] },
  { id: 2, name: "Riverside Apartments", units: ["Unit 1A", "Unit 1B", "Unit 2A"] },
  { id: 3, name: "Parkview Residences", units: ["PH1", "PH2", "101"] }
];

// Mock data for tenants
const tenants = [
  { id: 1, name: "John Doe", email: "john.doe@example.com" },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
  { id: 3, name: "Michael Johnson", email: "michael.johnson@example.com" },
  { id: 4, name: "Emily Williams", email: "emily.williams@example.com" }
];

const EditLease = () => {
  const [, navigate] = useLocation();
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    document: null
  });
  const [selectedProperty, setSelectedProperty] = useState<string>(lease.propertyId);
  const [availableUnits, setAvailableUnits] = useState<string[]>([]);

  // Initialize form with react-hook-form
  const form = useForm<LeaseFormValues>({
    resolver: zodResolver(leaseFormSchema),
    defaultValues: {
      status: lease.status,
      type: lease.type,
      propertyId: lease.propertyId,
      unit: lease.unit,
      startDate: lease.startDate,
      endDate: lease.endDate,
      term: lease.term,
      rentAmount: lease.rentAmount,
      lateFee: lease.lateFee,
      securityDeposit: lease.securityDeposit,
      petDeposit: lease.petDeposit,
      tenantIds: lease.tenantIds,
      notes: lease.notes,
      includeUtilities: lease.includeUtilities,
      renewalOption: lease.renewalOption,
      earlyTerminationFee: lease.earlyTerminationFee,
    },
  });

  // Update available units when property changes
  useEffect(() => {
    const property = properties.find(p => p.id.toString() === selectedProperty);
    if (property) {
      setAvailableUnits(property.units);
    } else {
      setAvailableUnits([]);
    }
  }, [selectedProperty]);

  // Form submission handler
  const onSubmit = (values: LeaseFormValues) => {
    console.log("Form values:", values);
    console.log("Files:", files);
    // Here you would typically send the data to an API
    
    // Navigate back to lease details page after submission
    navigate(`/view-lease/${lease.id}`);
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="p-0 mr-2 h-8 w-8" 
          onClick={() => navigate(`/view-lease/${lease.id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">Edit Lease</h2>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Edit Lease Information</CardTitle>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Lease Details */}
              <div>
                <h3 className="text-lg font-medium mb-4">Lease Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lease Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select lease type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Fixed Term">Fixed Term</SelectItem>
                            <SelectItem value="Month-to-Month">Month-to-Month</SelectItem>
                            <SelectItem value="Weekly">Weekly</SelectItem>
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
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="terminated">Terminated</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="term"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lease Term</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select term length" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1 month">1 Month</SelectItem>
                            <SelectItem value="3 months">3 Months</SelectItem>
                            <SelectItem value="6 months">6 Months</SelectItem>
                            <SelectItem value="12 months">12 Months</SelectItem>
                            <SelectItem value="18 months">18 Months</SelectItem>
                            <SelectItem value="24 months">24 Months</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Property Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Property Information</h3>
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
                            setSelectedProperty(value);
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
                              <SelectItem key={property.id} value={property.id.toString()}>
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
                </div>
              </div>
              
              <Separator />
              
              {/* Tenant Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Tenant Information</h3>
                <FormField
                  control={form.control}
                  name="tenantIds"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Tenants on Lease</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Select all tenants that should be included on this lease
                        </div>
                      </div>
                      
                      {tenants.map((tenant) => (
                        <FormField
                          key={tenant.id}
                          control={form.control}
                          name="tenantIds"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={tenant.id}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mb-2"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(tenant.id.toString())}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, tenant.id.toString()])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== tenant.id.toString()
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="font-normal">{tenant.name}</FormLabel>
                                  <p className="text-sm text-muted-foreground">{tenant.email}</p>
                                </div>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Separator />
              
              {/* Lease Dates */}
              <div>
                <h3 className="text-lg font-medium mb-4">Lease Dates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Financial Terms */}
              <div>
                <h3 className="text-lg font-medium mb-4">Financial Terms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="rentAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Rent</FormLabel>
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
                    name="securityDeposit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Security Deposit</FormLabel>
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
                    name="lateFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Late Fee</FormLabel>
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
                    name="petDeposit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pet Deposit</FormLabel>
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
                    name="earlyTerminationFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Early Termination Fee</FormLabel>
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
                </div>
              </div>
              
              <Separator />
              
              {/* Lease Terms */}
              <div>
                <h3 className="text-lg font-medium mb-4">Lease Terms</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="includeUtilities"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Utilities Included
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Check if rent includes basic utilities
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="renewalOption"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Renewal Option
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Allows tenant to renew the lease under the same terms
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Documents & Attachments */}
              <div>
                <h3 className="text-lg font-medium mb-4">Documents & Attachments</h3>
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
                            Upload lease agreements, addendums, and other relevant documents
                          </p>
                          <p className="text-xs text-muted-foreground">PDF, DOCX, JPG (MAX. 10MB per file)</p>
                          <p className="text-xs font-medium text-primary-foreground mt-1">Multiple files allowed</p>
                          {files.document && (
                            <p className="mt-2 text-xs text-primary">File: {files.document.name}</p>
                          )}
                        </div>
                        <input 
                          id="documents" 
                          name="documents" 
                          type="file" 
                          className="hidden" 
                          accept="image/png,image/jpeg,image/jpg,application/pdf,.doc,.docx"
                          multiple
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              setFiles(prev => ({
                                ...prev,
                                document: e.target.files![0]
                              }));
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Additional Notes */}
              <div>
                <h3 className="text-lg font-medium mb-4">Additional Notes</h3>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any additional notes about this lease"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-between mt-6">
                <Button variant="destructive" type="button" className="flex items-center">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Lease
                </Button>
                
                <div className="flex gap-3">
                  <Button variant="outline" type="button" onClick={() => navigate(`/view-lease/${lease.id}`)}>
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

export default EditLease;