
import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Form validation schema
const companyFormSchema = z.object({
  legalName: z.string().min(1, "Legal name is required"),
  companyName: z.string().min(1, "Company name is required"),
  type: z.string().min(1, "Company type is required"),
  ein: z.string().optional(),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phone: z.string().optional(),
  // Address fields
  streetAddress: z.string().min(1, "Street address is required"),
  unit: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipcode: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
  // Additional fields
  businessLicense: z.string().optional(),
  notes: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

const EditCompany = () => {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const [selectedTab, setSelectedTab] = useState("general");

  // Company types options
  const companyTypes = [
    "LLC",
    "S-Corp",
    "C-Corp",
    "Partnership",
    "Sole Proprietorship",
    "Non-Profit",
    "Other",
  ];

  // States and countries for form selection
  const usStates = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
    "DC"
  ];

  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "Germany",
    "France",
    "Spain",
    "Italy",
    "Japan",
    "China",
    "India",
    "Brazil",
    "Mexico",
    "Other",
  ];

  // Initialize form with empty values
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      legalName: "",
      companyName: "",
      type: "",
      ein: "",
      email: "",
      phone: "",
      streetAddress: "",
      unit: "",
      city: "",
      state: "",
      zipcode: "",
      country: "United States",
      businessLicense: "",
      notes: "",
    },
  });

  // Sample company data for development
  const sampleCompany = {
    id: parseInt(id as string),
    companyName: "ABC Properties",
    legalName: "ABC Properties LLC",
    type: "LLC",
    ein: "12-3456789",
    email: "info@abcproperties.com",
    phone: "(555) 123-4567",
    streetAddress: "123 Main Street",
    unit: "Suite 200",
    city: "New York",
    state: "NY",
    zipcode: "10001",
    country: "United States",
    businessLicense: "BL-12345",
    notes: "This is a sample company for property management.",
  };

  // Fetch company data
  const { isLoading, isError } = useQuery({
    queryKey: [`/api/companies/${id}`],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/companies/${id}`);
        if (!response.ok) throw new Error("Failed to fetch company");
        return response.json();
      } catch (error) {
        console.error("Error fetching company:", error);
        // Return mock data for development
        return sampleCompany;
      }
    },
    onSuccess: (data) => {
      // Reset form with fetched data
      form.reset({
        legalName: data.legalName,
        companyName: data.companyName,
        type: data.type,
        ein: data.ein || "",
        email: data.email || "",
        phone: data.phone || "",
        streetAddress: data.streetAddress,
        unit: data.unit || "",
        city: data.city,
        state: data.state,
        zipcode: data.zipcode,
        country: data.country,
        businessLicense: data.businessLicense || "",
        notes: data.notes || "",
      });
    },
  });

  // Mutation for updating a company
  const { mutate: updateCompany, isPending } = useMutation({
    mutationFn: async (data: CompanyFormValues) => {
      return await apiRequest("PUT", `/api/companies/${id}`, data);
    },
    onSuccess: (data) => {
      toast({
        title: "Company updated",
        description: "The company has been successfully updated",
      });
      navigate(`/view-company/${id}`);
    },
    onError: (error) => {
      console.error("Error updating company:", error);
      toast({
        title: "Error",
        description: "Failed to update company. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CompanyFormValues) => {
    updateCompany(data);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mb-2 mx-auto" />
          <p>Loading company information...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load company information. Please try again later.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate("/companies")}>
          Back to Companies
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Company</h1>
        <p className="text-muted-foreground">
          Update company information in the property management system
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs
            defaultValue="general"
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="general">General Information</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="additional">Additional Details</TabsTrigger>
            </TabsList>

            {/* General Information Tab */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>
                    Edit the basic information about the company
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="legalName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Legal Name</FormLabel>
                          <FormControl>
                            <Input placeholder="XYZ Properties LLC" {...field} />
                          </FormControl>
                          <FormDescription>
                            The official legal name of the company
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="XYZ Properties" {...field} />
                          </FormControl>
                          <FormDescription>
                            The name used for branding and display
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select company type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {companyTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            The legal structure of the company
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ein"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>EIN / Tax ID</FormLabel>
                          <FormControl>
                            <Input placeholder="XX-XXXXXXX" {...field} />
                          </FormControl>
                          <FormDescription>
                            Employer Identification Number or Tax ID
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="contact@company.com"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Primary contact email for the company
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormDescription>
                            Primary contact phone for the company
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(`/view-company/${id}`)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setSelectedTab("address")}
                    >
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Address Tab */}
            <TabsContent value="address">
              <Card>
                <CardHeader>
                  <CardTitle>Company Address</CardTitle>
                  <CardDescription>
                    Edit the physical address of the company
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="streetAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit / Suite / Apt (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Suite 100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          <FormLabel>State / Province</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {usStates.map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
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
                      name="zipcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip / Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="10001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedTab("general")}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setSelectedTab("additional")}
                    >
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Additional Details Tab */}
            <TabsContent value="additional">
              <Card>
                <CardHeader>
                  <CardTitle>Additional Details</CardTitle>
                  <CardDescription>
                    Optional information about the company
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="businessLicense"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business License (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="License number" {...field} />
                        </FormControl>
                        <FormDescription>
                          Business license or registration number
                        </FormDescription>
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
                            placeholder="Additional information about this company"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <CardFooter className="flex justify-end gap-2 px-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedTab("address")}
                    >
                      Back
                    </Button>
                    <Button type="submit" disabled={isPending}>
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Company"
                      )}
                    </Button>
                  </CardFooter>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
};

export default EditCompany;
