import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Building2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Form schema
const propertyFormSchema = z.object({
  name: z.string().min(1, "Property name is required"),
  type: z.string().min(1, "Property type is required"),
  description: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  status: z.string().min(1, "Status is required"),
  yearBuilt: z.string().min(1, "Year built is required"),
  squareFeet: z.string().min(1, "Square footage is required"),
  purchaseDate: z.string().optional(),
  purchasePrice: z.string().optional(),
  currentValue: z.string().optional(),
  annualTaxes: z.string().optional(),
  insurancePolicy: z.string().optional(),
  insuranceCost: z.string().optional(),
  amenities: z.array(z.string()).optional(),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

const EditProperty = () => {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock property data - in a real app, this would be fetched from an API
  const property = {
    id: id,
    name: "Sunset Heights",
    type: "Apartment Complex",
    description: "A beautiful apartment complex with modern amenities including a swimming pool, fitness center, and landscaped gardens.",
    address: "123 Main St",
    city: "Anytown",
    state: "CA",
    zipCode: "12345",
    status: "active",
    yearBuilt: "2010",
    squareFeet: "35000",
    purchaseDate: "2015-06-15",
    purchasePrice: "4500000",
    currentValue: "5800000",
    annualTaxes: "65000",
    insurancePolicy: "POL-12345-ABC",
    insuranceCost: "24000",
    amenities: ["Swimming Pool", "Fitness Center", "Playground", "Pet Friendly"]
  };
  
  // Define available amenities for checkboxes
  const availableAmenities = [
    { id: "pool", label: "Swimming Pool" },
    { id: "gym", label: "Fitness Center" },
    { id: "playground", label: "Playground" },
    { id: "petFriendly", label: "Pet Friendly" },
    { id: "parking", label: "Covered Parking" },
    { id: "laundry", label: "On-site Laundry" },
    { id: "security", label: "24/7 Security" },
    { id: "elevator", label: "Elevator" },
    { id: "storage", label: "Storage Units" },
    { id: "clubhouse", label: "Community Clubhouse" }
  ];
  
  // Initialize form with property data
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      name: property.name,
      type: property.type,
      description: property.description,
      address: property.address,
      city: property.city,
      state: property.state,
      zipCode: property.zipCode,
      status: property.status,
      yearBuilt: property.yearBuilt,
      squareFeet: property.squareFeet,
      purchaseDate: property.purchaseDate,
      purchasePrice: property.purchasePrice,
      currentValue: property.currentValue,
      annualTaxes: property.annualTaxes,
      insurancePolicy: property.insurancePolicy,
      insuranceCost: property.insuranceCost,
      amenities: property.amenities
    }
  });
  
  const onSubmit = (values: PropertyFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Form values:", values);
      
      toast({
        title: "Property Updated",
        description: "Property details have been updated successfully."
      });
      
      setIsSubmitting(false);
      
      // Redirect to property detail view
      navigate(`/view-property/${id}`);
    }, 1000);
  };
  
  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/properties">Properties</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/view-property/${id}`}>{property.name}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Edit</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="icon" 
            className="mr-4"
            onClick={() => navigate(`/view-property/${id}`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Property</h1>
            <p className="text-muted-foreground">Update property details and information</p>
          </div>
        </div>
      </div>
      
      {/* Edit Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential property details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter property name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Apartment Complex">Apartment Complex</SelectItem>
                          <SelectItem value="Single Family Home">Single Family Home</SelectItem>
                          <SelectItem value="Duplex">Duplex</SelectItem>
                          <SelectItem value="Triplex">Triplex</SelectItem>
                          <SelectItem value="Fourplex">Fourplex</SelectItem>
                          <SelectItem value="Condominium">Condominium</SelectItem>
                          <SelectItem value="Townhouse">Townhouse</SelectItem>
                          <SelectItem value="Commercial Building">Commercial Building</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter property description" 
                        className="resize-none min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
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
                          <SelectValue placeholder="Select property status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="maintenance">Under Maintenance</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
              <CardDescription>Property location details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter street address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
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
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
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
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Zip code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
              <CardDescription>Additional information about the property</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="yearBuilt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year Built</FormLabel>
                      <FormControl>
                        <Input placeholder="Year built" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="squareFeet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Square Footage</FormLabel>
                      <FormControl>
                        <Input placeholder="Square footage" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="purchaseDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Property Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {availableAmenities.map((amenity) => (
                    <div key={amenity.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={amenity.id} 
                        checked={property.amenities.includes(amenity.label)}
                        // onChange would update the form value in a real app
                      />
                      <Label htmlFor={amenity.id}>{amenity.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Information</CardTitle>
              <CardDescription>Financial details about the property</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="purchasePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Price ($)</FormLabel>
                      <FormControl>
                        <Input placeholder="Purchase price" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="currentValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Value ($)</FormLabel>
                      <FormControl>
                        <Input placeholder="Current value" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="annualTaxes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Taxes ($)</FormLabel>
                      <FormControl>
                        <Input placeholder="Annual taxes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="insuranceCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Insurance ($)</FormLabel>
                      <FormControl>
                        <Input placeholder="Annual insurance cost" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="insurancePolicy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insurance Policy Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Insurance policy number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <h3 className="font-medium mb-2">Property Documents</h3>
                <div className="border border-dashed rounded-md p-6 text-center">
                  <Building2 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="mb-2">Drag and drop files here or click to browse</p>
                  <Button type="button" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Documents
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate(`/view-property/${id}`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-current rounded-full" />
                  Saving...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditProperty;