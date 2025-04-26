import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  AlertCircle,
  CalendarIcon,
  Check,
  Home,
  Info,
  Loader2,
  Minus,
  Plus,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { format } from "date-fns";

// Define the form schema
const vacancyFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  propertyId: z.string().min(1, "Property is required"),
  unitId: z.string().min(1, "Unit is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  rentAmount: z.coerce.number().min(1, "Rent amount is required"),
  depositAmount: z.coerce.number().min(0, "Deposit amount is required"),
  availableFrom: z.date(),
  leaseDuration: z.coerce.number().min(1, "Lease duration is required"),
  minimumIncome: z.coerce.number().optional(),
  creditScoreRequirement: z.coerce.number().optional(),
  petPolicy: z.string().optional(),
  petDeposit: z.coerce.number().optional(),
  smokingAllowed: z.boolean().default(false),
  includedUtilities: z.array(z.string()).optional(),
  advertisingChannels: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  status: z.enum(["active", "inactive", "rented"]).default("active"),
});

type VacancyFormValues = z.infer<typeof vacancyFormSchema>;

// Utility options for form select fields
const propertyOptions = [
  { id: "1", name: "Parkside Apartments" },
  { id: "2", name: "The Willows" },
];

const unitOptions = [
  { id: "101", number: "101", propertyId: "1", bedrooms: 1, bathrooms: 1, sqft: 750, status: "vacant" },
  { id: "102", number: "102", propertyId: "1", bedrooms: 2, bathrooms: 1, sqft: 950, status: "vacant" },
  { id: "203", number: "203", propertyId: "1", bedrooms: 2, bathrooms: 2, sqft: 1050, status: "vacant" },
  { id: "305", number: "305", propertyId: "2", bedrooms: 0, bathrooms: 1, sqft: 550, status: "vacant" },
  { id: "306", number: "306", propertyId: "2", bedrooms: 1, bathrooms: 1, sqft: 720, status: "vacant" },
];

const utilityOptions = [
  "Water",
  "Electricity",
  "Gas",
  "Trash",
  "Internet",
  "Cable TV",
  "Heat",
  "Air Conditioning",
];

const channelOptions = [
  "Website",
  "Zillow",
  "Apartments.com",
  "Craigslist",
  "Realtor.com",
  "Social Media",
  "Print Ads",
  "Referrals",
];

const amenityOptions = [
  "Dishwasher",
  "In-unit Laundry",
  "Balcony/Patio",
  "Walk-in Closets",
  "Fireplace",
  "Hardwood Floors",
  "Stainless Steel Appliances",
  "Granite Countertops",
  "Central AC",
  "Pet Friendly",
  "Fitness Center",
  "Pool",
  "Hot Tub",
  "Clubhouse",
  "Business Center",
  "Gated Community",
  "Covered Parking",
  "Garage",
  "Storage Unit",
  "24/7 Maintenance",
];

const CreateVacancy = () => {
  const [, navigate] = useLocation();
  const params = useParams();
  const isEditing = !!params.id;
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("details");
  const [filteredUnits, setFilteredUnits] = useState(unitOptions);
  const [images, setImages] = useState<string[]>([]);

  // Form setup
  const form = useForm<VacancyFormValues>({
    resolver: zodResolver(vacancyFormSchema),
    defaultValues: {
      title: "",
      propertyId: "",
      unitId: "",
      description: "",
      rentAmount: 0,
      depositAmount: 0,
      availableFrom: new Date(),
      leaseDuration: 12,
      minimumIncome: 0,
      creditScoreRequirement: 0,
      petPolicy: "",
      petDeposit: 0,
      smokingAllowed: false,
      includedUtilities: [],
      advertisingChannels: ["Website"],
      amenities: [],
      images: [],
      status: "active",
    },
  });

  // Query for fetching vacancy details when editing
  const { data: vacancyData, isLoading: isLoadingVacancy } = useQuery({
    queryKey: [`/api/vacancies/${params.id}`],
    queryFn: async () => {
      if (!isEditing) return null;
      try {
        const response = await fetch(`/api/vacancies/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch vacancy");
        }
        return response.json();
      } catch (error) {
        console.error("Error fetching vacancy:", error);
        // Simulate data for now
        return isEditing
          ? {
              id: parseInt(params.id as string),
              title: "Modern 1 Bedroom Apartment",
              propertyId: "1",
              unitId: "101",
              description:
                "Beautiful renovated 1 bedroom apartment with hardwood floors, stainless steel appliances, and a private balcony.",
              rentAmount: 1250,
              depositAmount: 1250,
              availableFrom: "2023-06-01",
              leaseDuration: 12,
              minimumIncome: 3000,
              creditScoreRequirement: 650,
              petPolicy: "Cats only, $500 pet deposit",
              petDeposit: 500,
              smokingAllowed: false,
              includedUtilities: ["Water", "Trash"],
              advertisingChannels: ["Website", "Zillow"],
              amenities: ["Dishwasher", "A/C", "In-unit Laundry", "Balcony"],
              images: [
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
              ],
              status: "active",
            }
          : null;
      }
    },
    enabled: isEditing,
  });

  // Filter available units based on selected property
  useEffect(() => {
    const propertyId = form.watch("propertyId");
    if (propertyId) {
      setFilteredUnits(
        unitOptions.filter(
          (unit) => unit.propertyId === propertyId && unit.status === "vacant"
        )
      );
    } else {
      setFilteredUnits([]);
    }
  }, [form.watch("propertyId")]);

  // Set form values when editing and data is loaded
  useEffect(() => {
    if (isEditing && vacancyData) {
      // Convert date string to Date object
      const availableFrom = new Date(vacancyData.availableFrom);
      
      // Set form values
      form.reset({
        ...vacancyData,
        availableFrom,
        // Convert numbers to strings for select fields
        propertyId: vacancyData.propertyId.toString(),
        unitId: vacancyData.unitId.toString(),
      });
      
      // Set images
      setImages(vacancyData.images || []);
    }
  }, [isEditing, vacancyData, form]);

  // Mutation for creating/updating vacancy
  const { mutate: saveVacancy, isPending: isSaving } = useMutation({
    mutationFn: async (data: VacancyFormValues) => {
      // Add images to the data
      const vacancyData = {
        ...data,
        images,
      };
      
      if (isEditing) {
        return await apiRequest(
          "PUT",
          `/api/vacancies/${params.id}`,
          vacancyData
        );
      } else {
        return await apiRequest("POST", "/api/vacancies", vacancyData);
      }
    },
    onSuccess: () => {
      toast({
        title: isEditing ? "Vacancy updated" : "Vacancy created",
        description: isEditing
          ? "The vacancy listing has been updated successfully."
          : "The vacancy listing has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/vacancies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/vacancies/manage"] });
      navigate("/manage-vacancies");
    },
    onError: (error) => {
      console.error("Error saving vacancy:", error);
      toast({
        title: "Error",
        description: "There was a problem saving the vacancy. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle image uploads (simulated)
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // This is a simplified implementation for demo purposes
    // In a real app, you would handle file uploads to a server
    const files = event.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).map((file) => {
        const url = URL.createObjectURL(file);
        return url;
      });
      setImages([...images, ...newImages]);
    }
  };

  // Remove an image
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // Handle form submission
  const onSubmit = (data: VacancyFormValues) => {
    saveVacancy(data);
  };

  if (isEditing && isLoadingVacancy) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading vacancy details...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {isEditing ? "Edit Vacancy Listing" : "Create New Vacancy Listing"}
        </h1>
        <p className="text-muted-foreground">
          {isEditing
            ? "Update details for this apartment listing"
            : "List a new apartment unit for rent"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="details">Basic Details</TabsTrigger>
              <TabsTrigger value="features">Features & Amenities</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="policies">Policies & Requirements</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
            </TabsList>

            {/* Basic Details Tab */}
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Enter the core details about this vacancy
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Listing Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Spacious 2 Bedroom Apartment with Balcony"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Create a descriptive title that highlights key
                          features.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="propertyId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              // Reset unit selection when property changes
                              form.setValue("unitId", "");
                            }}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Property" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {propertyOptions.map((property) => (
                                <SelectItem
                                  key={property.id}
                                  value={property.id}
                                >
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
                      name="unitId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!form.watch("propertyId")}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Unit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {filteredUnits.length === 0 ? (
                                <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                                  {form.watch("propertyId")
                                    ? "No vacant units available"
                                    : "Select a property first"}
                                </div>
                              ) : (
                                filteredUnits.map((unit) => (
                                  <SelectItem key={unit.id} value={unit.id}>
                                    Unit {unit.number} ({unit.bedrooms} bed /{" "}
                                    {unit.bathrooms} bath)
                                  </SelectItem>
                                ))
                              )}
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
                            placeholder="Describe the apartment, its features, and the surrounding area..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a detailed description highlighting the key
                          selling points.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="rentAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Rent ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              step={50}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="depositAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Security Deposit ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              step={50}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="leaseDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lease Duration (months)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              step={1}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="availableFrom"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Available From</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={
                                  !field.value
                                    ? "text-muted-foreground"
                                    : ""
                                }
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          When will this unit be available for move-in?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Listing Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">
                              Active (Publicly Visible)
                            </SelectItem>
                            <SelectItem value="inactive">
                              Inactive (Hidden)
                            </SelectItem>
                            <SelectItem value="rented">Rented</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Set to "Active" to make this listing visible to the
                          public.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/manage-vacancies")}
                  >
                    Cancel
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("features")}>
                    Next: Features & Amenities
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Features & Amenities Tab */}
            <TabsContent value="features">
              <Card>
                <CardHeader>
                  <CardTitle>Features & Amenities</CardTitle>
                  <CardDescription>
                    Select the amenities and features available with this unit
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="amenities"
                    render={({ field }) => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Amenities</FormLabel>
                          <FormDescription>
                            Select all amenities that apply to this unit or
                            property.
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2 mt-2">
                          {amenityOptions.map((amenity) => (
                            <FormItem
                              key={amenity}
                              className="flex items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(amenity)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([
                                        ...(field.value || []),
                                        amenity,
                                      ]);
                                    } else {
                                      field.onChange(
                                        field.value?.filter(
                                          (value) => value !== amenity
                                        ) || []
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                {amenity}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={form.control}
                    name="includedUtilities"
                    render={({ field }) => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">
                            Included Utilities
                          </FormLabel>
                          <FormDescription>
                            Select all utilities that are included in the rent.
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2 mt-2">
                          {utilityOptions.map((utility) => (
                            <FormItem
                              key={utility}
                              className="flex items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(utility)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([
                                        ...(field.value || []),
                                        utility,
                                      ]);
                                    } else {
                                      field.onChange(
                                        field.value?.filter(
                                          (value) => value !== utility
                                        ) || []
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                {utility}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("details")}
                  >
                    Back
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("photos")}>
                    Next: Photos
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Photos Tab */}
            <TabsContent value="photos">
              <Card>
                <CardHeader>
                  <CardTitle>Property Photos</CardTitle>
                  <CardDescription>
                    Upload photos of the apartment and property
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Upload Images
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                        Drag and drop your images here, or click to select files.
                        High quality images increase interest in your listing.
                      </p>
                      <Input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          document.getElementById("images")?.click();
                        }}
                      >
                        Select Files
                      </Button>
                    </div>

                    {images.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">
                          Uploaded Images
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {images.map((image, index) => (
                            <div
                              key={index}
                              className="relative group rounded-md overflow-hidden"
                            >
                              <img
                                src={image}
                                alt={`Property image ${index + 1}`}
                                className="w-full h-32 object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Important</AlertTitle>
                      <AlertDescription>
                        Include diverse photos showing the interior, exterior,
                        amenities, and common areas. Aim for 5-10 high-quality
                        images.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("features")}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveTab("policies")}
                  >
                    Next: Policies & Requirements
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Policies Tab */}
            <TabsContent value="policies">
              <Card>
                <CardHeader>
                  <CardTitle>Policies & Requirements</CardTitle>
                  <CardDescription>
                    Set tenant requirements and property policies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="minimumIncome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Minimum Monthly Income Requirement ($)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              step={100}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Recommended: 2.5-3x the monthly rent
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="creditScoreRequirement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Credit Score</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={300}
                              max={850}
                              step={10}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Typical range: 600-700
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="petPolicy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pet Policy</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g. No pets allowed, or Cats only, $500 pet deposit"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription>
                            Describe any pet restrictions or deposits
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="petDeposit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pet Deposit ($)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                step={50}
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="smokingAllowed"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1">
                              <FormLabel>Smoking Allowed</FormLabel>
                              <FormDescription>
                                Check if smoking is permitted on the premises
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("photos")}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveTab("marketing")}
                  >
                    Next: Marketing
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Marketing Tab */}
            <TabsContent value="marketing">
              <Card>
                <CardHeader>
                  <CardTitle>Marketing Information</CardTitle>
                  <CardDescription>
                    Select advertising channels and provide additional marketing
                    details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="advertisingChannels"
                    render={({ field }) => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">
                            Advertising Channels
                          </FormLabel>
                          <FormDescription>
                            Where would you like to advertise this vacancy?
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2 mt-2">
                          {channelOptions.map((channel) => (
                            <FormItem
                              key={channel}
                              className="flex items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(channel)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([
                                        ...(field.value || []),
                                        channel,
                                      ]);
                                    } else {
                                      field.onChange(
                                        field.value?.filter(
                                          (value) => value !== channel
                                        ) || []
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                {channel}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Ready to publish?</AlertTitle>
                    <AlertDescription>
                      Make sure to review all details before submitting. When
                      ready, click "Save Listing" below to create your vacancy
                      listing.
                    </AlertDescription>
                  </Alert>
                </CardContent>

                <CardFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("policies")}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/manage-vacancies")}
                    >
                      Cancel
                    </Button>
                  </div>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Listing"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
};

export default CreateVacancy;