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
import { ArrowLeft, Save, Trash2, Upload, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Form validation schema
const tenantFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(6, { message: "Please enter a valid phone number" }),
  status: z.string(),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zipCode: z.string().min(5, { message: "Zip code is required" }),
  emergencyContactName: z.string().min(1, { message: "Emergency contact name is required" }),
  emergencyContactRelationship: z.string().min(1, { message: "Relationship is required" }),
  emergencyContactPhone: z.string().min(6, { message: "Please enter a valid phone number" }),
  notes: z.string().optional(),
  property: z.string(),
  unit: z.string(),
  rentAmount: z.coerce.number().positive({ message: "Rent amount must be positive" }),
  securityDeposit: z.coerce.number().nonnegative({ message: "Security deposit must be positive or zero" }),
  petDeposit: z.coerce.number().nonnegative({ message: "Pet deposit must be positive or zero" }),
  moveInDate: z.string(),
  leaseEndDate: z.string(),
  preferredContact: z.string(),
});

type TenantFormValues = z.infer<typeof tenantFormSchema>;

// Mock data for a tenant
const tenant = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "(555) 123-4567",
  status: "active",
  unit: "Apt 101",
  property: "Sunset Heights",
  moveInDate: "2022-06-15",
  leaseEndDate: "2023-06-14",
  rentAmount: 1200,
  securityDeposit: 1200,
  petDeposit: 300,
  address: "123 Main St, Apt 101",
  city: "New York",
  state: "NY",
  zipCode: "10001",
  emergencyContactName: "Jane Doe",
  emergencyContactRelationship: "Sister",
  emergencyContactPhone: "(555) 987-6543",
  preferredContact: "email",
  notes: "Tenant has a small dog. Prefers to be contacted by email."
};

// Mock data for properties
const properties = [
  { id: 1, name: "Sunset Heights", units: ["Apt 101", "Apt 102", "Apt 103"] },
  { id: 2, name: "Riverside Apartments", units: ["Unit 1A", "Unit 1B", "Unit 2A"] },
  { id: 3, name: "Parkview Residences", units: ["PH1", "PH2", "101"] }
];

const EditTenant = () => {
  const [, navigate] = useLocation();
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    photo: null,
    document: null
  });
  const [selectedProperty, setSelectedProperty] = useState<string>(tenant.property);
  const [availableUnits, setAvailableUnits] = useState<string[]>([]);

  // Initialize form with react-hook-form
  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: {
      firstName: tenant.firstName,
      lastName: tenant.lastName,
      email: tenant.email,
      phone: tenant.phone,
      status: tenant.status,
      address: tenant.address,
      city: tenant.city,
      state: tenant.state,
      zipCode: tenant.zipCode,
      emergencyContactName: tenant.emergencyContactName,
      emergencyContactRelationship: tenant.emergencyContactRelationship,
      emergencyContactPhone: tenant.emergencyContactPhone,
      notes: tenant.notes,
      property: tenant.property,
      unit: tenant.unit,
      rentAmount: tenant.rentAmount,
      securityDeposit: tenant.securityDeposit,
      petDeposit: tenant.petDeposit,
      moveInDate: tenant.moveInDate,
      leaseEndDate: tenant.leaseEndDate,
      preferredContact: tenant.preferredContact,
    },
  });

  // Update available units when property changes
  useEffect(() => {
    const property = properties.find(p => p.name === selectedProperty);
    if (property) {
      setAvailableUnits(property.units);
    } else {
      setAvailableUnits([]);
    }
  }, [selectedProperty]);

  // Form submission handler
  const onSubmit = (values: TenantFormValues) => {
    console.log("Form values:", values);
    console.log("Files:", files);
    // Here you would typically send the data to an API
    
    // Navigate back to tenant details page after submission
    navigate(`/view-tenant/${tenant.id}`);
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="p-0 mr-2 h-8 w-8" 
          onClick={() => navigate(`/view-tenant/${tenant.id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">Edit Tenant</h2>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Edit Tenant Information</CardTitle>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john.doe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="preferredContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Contact Method</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select contact method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="text">Text Message</SelectItem>
                            <SelectItem value="mail">Mail</SelectItem>
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
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="terminated">Terminated</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Address Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St, Apt 101" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="New York" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province</FormLabel>
                        <FormControl>
                          <Input placeholder="NY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip/Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="10001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Emergency Contact */}
              <div>
                <h3 className="text-lg font-medium mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="emergencyContactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="emergencyContactRelationship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship</FormLabel>
                        <FormControl>
                          <Input placeholder="Sister" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="emergencyContactPhone"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 987-6543" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Lease Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Lease Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="property"
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
                              <SelectItem key={property.id} value={property.name}>
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
                  
                  <FormField
                    control={form.control}
                    name="moveInDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Move-in Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="leaseEndDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lease End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
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
                            Upload ID documents, tenant photos, proof of income and background checks
                          </p>
                          <p className="text-xs text-muted-foreground">PDF, PNG, JPG (MAX. 10MB per file)</p>
                          <p className="text-xs font-medium text-primary-foreground mt-1">Multiple files allowed</p>
                          {Object.values(files).some(file => file !== null) && (
                            <div className="mt-2 text-xs text-primary">
                              {Object.entries(files).map(([key, file]) => (
                                file && <p key={key}>File: {file.name}</p>
                              ))}
                            </div>
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
                          placeholder="Enter any additional notes about this tenant"
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
                  Delete Tenant
                </Button>
                
                <div className="flex gap-3">
                  <Button variant="outline" type="button" onClick={() => navigate(`/view-tenant/${tenant.id}`)}>
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

export default EditTenant;