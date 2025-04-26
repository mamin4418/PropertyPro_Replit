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
import { ArrowLeft, Save, Trash2, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Form validation schema
const vendorFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  contactPerson: z.string().min(1, { message: "Contact person is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(6, { message: "Please enter a valid phone number" }),
  website: z.string().url({ message: "Please enter a valid website URL" }).optional().or(z.literal('')),
  category: z.string().min(1, { message: "Category is required" }),
  status: z.string().min(1, { message: "Status is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zipCode: z.string().min(5, { message: "Zip code is required" }),
  taxIdNumber: z.string().optional(),
  licenseNumber: z.string().optional(),
  insuranceInfo: z.string().optional(),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
});

type VendorFormValues = z.infer<typeof vendorFormSchema>;

// Mock data for a vendor
const vendor = {
  id: 1,
  name: "ABC Plumbing Services",
  contactPerson: "John Smith",
  phone: "(555) 123-4567",
  email: "john@abcplumbing.com",
  website: "https://www.abcplumbing.com",
  category: "Plumbing",
  status: "active",
  rating: 4.5,
  address: "456 Service Road",
  city: "New York",
  state: "NY",
  zipCode: "10002",
  taxIdNumber: "12-3456789",
  licenseNumber: "PLB-987654",
  insuranceInfo: "Policy #INS-123456, Expires: 12/31/2023",
  paymentTerms: "Net 30",
  notes: "Responsive service provider. Usually available for emergency calls."
};

// Vendor categories
const categories = [
  "Plumbing",
  "Electrical",
  "HVAC",
  "Cleaning",
  "Landscaping",
  "Carpentry",
  "Painting",
  "Roofing",
  "Pest Control",
  "Handyman",
  "Security",
  "Flooring",
  "Appliance Repair",
  "Windows & Doors",
  "Other"
];

const EditVendor = () => {
  const [, navigate] = useLocation();
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    document: null
  });

  // Initialize form with react-hook-form
  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      name: vendor.name,
      contactPerson: vendor.contactPerson,
      email: vendor.email,
      phone: vendor.phone,
      website: vendor.website,
      category: vendor.category,
      status: vendor.status,
      address: vendor.address,
      city: vendor.city,
      state: vendor.state,
      zipCode: vendor.zipCode,
      taxIdNumber: vendor.taxIdNumber,
      licenseNumber: vendor.licenseNumber,
      insuranceInfo: vendor.insuranceInfo,
      paymentTerms: vendor.paymentTerms,
      notes: vendor.notes,
    },
  });

  // Form submission handler
  const onSubmit = (values: VendorFormValues) => {
    console.log("Form values:", values);
    console.log("Files:", files);
    // Here you would typically send the data to an API
    
    // Navigate back to vendor details page after submission
    navigate(`/view-vendor/${vendor.id}`);
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="p-0 mr-2 h-8 w-8" 
          onClick={() => navigate(`/view-vendor/${vendor.id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">Edit Vendor</h2>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Edit Vendor Information</CardTitle>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Company Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="ABC Plumbing Services" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
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
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://www.abcplumbing.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="contactPerson"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Person</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
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
                    name="email"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john@abcplumbing.com" {...field} />
                        </FormControl>
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
                          <Input placeholder="456 Service Road" {...field} />
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
                          <Input placeholder="10002" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Business Details */}
              <div>
                <h3 className="text-lg font-medium mb-4">Business Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="taxIdNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax ID Number</FormLabel>
                        <FormControl>
                          <Input placeholder="12-3456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="licenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Number</FormLabel>
                        <FormControl>
                          <Input placeholder="PLB-987654" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="insuranceInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Insurance Information</FormLabel>
                        <FormControl>
                          <Input placeholder="Policy #INS-123456, Expires: 12/31/2023" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="paymentTerms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Terms</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment terms" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                            <SelectItem value="Net 15">Net 15</SelectItem>
                            <SelectItem value="Net 30">Net 30</SelectItem>
                            <SelectItem value="Net 45">Net 45</SelectItem>
                            <SelectItem value="Net 60">Net 60</SelectItem>
                          </SelectContent>
                        </Select>
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
                            Upload insurance certificates, licenses, W-9 forms, and contracts
                          </p>
                          <p className="text-xs text-muted-foreground">PDF, PNG, JPG (MAX. 10MB per file)</p>
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
                          placeholder="Enter any additional notes about this vendor"
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
                  Delete Vendor
                </Button>
                
                <div className="flex gap-3">
                  <Button variant="outline" type="button" onClick={() => navigate(`/view-vendor/${vendor.id}`)}>
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

export default EditVendor;