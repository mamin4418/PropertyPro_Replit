import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CalendarIcon,
  CheckCircle2,
  DollarSign,
  Eye,
  FilePlus,
  Home,
  Image,
  Loader2,
  MapPin,
  MoreHorizontal,
  Search,
  Share2,
  Star,
} from "lucide-react";
import { format } from "date-fns";

// Define the inquiry form schema
const inquirySchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, "Phone number is required"),
  moveInDate: z.date().optional(),
  message: z.string().optional(),
  contactPreference: z.enum(["email", "phone", "either"]).default("either"),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

// Mock data for vacancies until we connect to the API
const mockVacancies = [
  {
    id: 1,
    unitId: 101,
    propertyId: 1,
    propertyName: "Parkside Apartments",
    propertyAddress: "123 Main St, Anytown, CA 91234",
    title: "Modern 1 Bedroom Apartment",
    description:
      "Beautiful renovated 1 bedroom apartment with hardwood floors, stainless steel appliances, and a private balcony. Plenty of natural light and storage space.",
    rentAmount: 1250,
    depositAmount: 1250,
    availableFrom: "2023-06-01",
    leaseDuration: 12,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 750,
    amenities: ["Dishwasher", "A/C", "In-unit Laundry", "Balcony"],
    petPolicy: "Cats only, $500 pet deposit",
    includedUtilities: ["Water", "Trash"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
    ],
    status: "active",
  },
  {
    id: 2,
    unitId: 203,
    propertyId: 1,
    propertyName: "Parkside Apartments",
    propertyAddress: "123 Main St, Anytown, CA 91234",
    title: "Spacious 2 Bedroom Apartment",
    description:
      "Spacious 2 bedroom apartment with modern finishes, open floor plan, and mountain views. Features a chef's kitchen and walk-in closets.",
    rentAmount: 1650,
    depositAmount: 1650,
    availableFrom: "2023-05-15",
    leaseDuration: 12,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1050,
    amenities: [
      "Dishwasher",
      "A/C",
      "In-unit Laundry",
      "Walk-in Closets",
      "Fireplace",
    ],
    petPolicy: "Pet friendly, $750 pet deposit",
    includedUtilities: ["Water", "Trash", "Internet"],
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858",
    ],
    status: "active",
  },
  {
    id: 3,
    unitId: 305,
    propertyId: 2,
    propertyName: "The Willows",
    propertyAddress: "456 Oak Lane, Anytown, CA 91234",
    title: "Luxury Studio Apartment",
    description:
      "Compact but luxurious studio apartment with high-end finishes, full kitchen, and city views. Perfect for professionals.",
    rentAmount: 1050,
    depositAmount: 1050,
    availableFrom: "2023-06-15",
    leaseDuration: 12,
    bedrooms: 0,
    bathrooms: 1,
    sqft: 550,
    amenities: ["Dishwasher", "A/C", "Gym Access", "Rooftop Terrace"],
    petPolicy: "No pets allowed",
    includedUtilities: ["Water", "Trash", "Heat"],
    images: [
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80",
      "https://images.unsplash.com/photo-1518481612222-68bbe828ecd1",
    ],
    status: "active",
  },
];

const VacancyListing = () => {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [bedroomFilter, setBedroomFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("");
  const [selectedVacancy, setSelectedVacancy] = useState<any>(null);
  const [inquiryDialogOpen, setInquiryDialogOpen] = useState(false);

  // Form for the inquiry dialog
  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
      contactPreference: "either",
      agreeToTerms: false,
    },
  });

  // Query for fetching vacancies - will replace mock data when API is ready
  const { data: vacancies, isLoading, isError } = useQuery({
    queryKey: ["/api/vacancies"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/vacancies");
        if (!response.ok) {
          throw new Error("Failed to fetch vacancies");
        }
        return response.json();
      } catch (error) {
        console.error("Error fetching vacancies:", error);
        // Return mock data for now
        return mockVacancies;
      }
    },
  });

  // Mutation for submitting an inquiry
  const { mutate: submitInquiry, isPending: isSubmitting } = useMutation({
    mutationFn: async (data: InquiryFormValues) => {
      // Include the selected vacancy information
      const inquiryData = {
        ...data,
        vacancyId: selectedVacancy?.id,
        unitId: selectedVacancy?.unitId,
        propertyId: selectedVacancy?.propertyId,
        moveInDate: data.moveInDate ? format(data.moveInDate, "yyyy-MM-dd") : null,
      };

      return await apiRequest("POST", "/api/leads/inquiry", inquiryData);
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Submitted",
        description:
          "Thank you for your interest! A property manager will contact you soon.",
      });
      form.reset();
      setInquiryDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
    },
    onError: (error) => {
      console.error("Error submitting inquiry:", error);
      toast({
        title: "Submission Error",
        description:
          "There was a problem submitting your inquiry. Please try again later.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: InquiryFormValues) => {
    submitInquiry(data);
  };

  // Filter vacancies based on search and filter criteria
  const filteredVacancies = vacancies
    ? vacancies.filter((vacancy: any) => {
        // Search filter
        const matchesSearch =
          searchTerm === "" ||
          vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vacancy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vacancy.propertyName.toLowerCase().includes(searchTerm.toLowerCase());

        // Bedroom filter
        const matchesBedrooms =
          bedroomFilter === "all" ||
          (bedroomFilter === "studio" && vacancy.bedrooms === 0) ||
          vacancy.bedrooms.toString() === bedroomFilter;

        // Price filter - implement as needed
        const matchesPrice = true; // For now, no price filtering

        return matchesSearch && matchesBedrooms && matchesPrice;
      })
    : [];

  // Open inquiry dialog
  const openInquiryDialog = (vacancy: any) => {
    setSelectedVacancy(vacancy);
    setInquiryDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading available apartments...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-destructive mb-2">Error</h2>
        <p className="mb-4">
          There was a problem loading the available apartments.
        </p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Available Apartments</h1>
          <p className="text-muted-foreground">
            Browse and manage property listings available for rent
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/manage-vacancies")}
          >
            Manage Listings
          </Button>
          <Button onClick={() => navigate("/create-vacancy")}>
            <FilePlus className="mr-2 h-4 w-4" />
            Create Listing
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by property name, description, or features..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={bedroomFilter} onValueChange={setBedroomFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Bedrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bedrooms</SelectItem>
              <SelectItem value="studio">Studio</SelectItem>
              <SelectItem value="1">1 Bedroom</SelectItem>
              <SelectItem value="2">2 Bedrooms</SelectItem>
              <SelectItem value="3">3+ Bedrooms</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Price</SelectItem>
              <SelectItem value="under-1000">Under $1,000</SelectItem>
              <SelectItem value="1000-1500">$1,000 - $1,500</SelectItem>
              <SelectItem value="1500-2000">$1,500 - $2,000</SelectItem>
              <SelectItem value="over-2000">Over $2,000</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Vacancy Listings */}
      {filteredVacancies.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No vacancies found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or check back later for new listings.
          </p>
          <Button variant="outline" onClick={() => {
            setSearchTerm("");
            setBedroomFilter("all");
          }}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVacancies.map((vacancy: any) => (
            <Card key={vacancy.id} className="overflow-hidden">
              {/* Image carousel - simplified for now */}
              <div className="relative h-48 w-full overflow-hidden bg-muted">
                {vacancy.images && vacancy.images.length > 0 ? (
                  <img
                    src={vacancy.images[0]}
                    alt={vacancy.title}
                    className="h-full w-full object-cover transition-all hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Image className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge className="bg-primary hover:bg-primary">
                    ${vacancy.rentAmount}/mo
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{vacancy.title}</CardTitle>
                <CardDescription className="flex items-center text-sm">
                  <MapPin className="h-3 w-3 mr-1" />
                  {vacancy.propertyName} • {vacancy.propertyAddress}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <div className="text-sm">
                      <span className="font-medium">
                        {vacancy.bedrooms === 0
                          ? "Studio"
                          : `${vacancy.bedrooms} Bed${
                              vacancy.bedrooms > 1 ? "s" : ""
                            }`}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">
                        {vacancy.bathrooms} Bath
                        {vacancy.bathrooms > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{vacancy.sqft} sqft</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span>Available {new Date(vacancy.availableFrom).toLocaleDateString()}</span>
                  </div>
                </div>

                <p className="text-sm line-clamp-2">{vacancy.description}</p>

                <div className="flex flex-wrap gap-1">
                  {vacancy.amenities &&
                    vacancy.amenities.slice(0, 3).map((amenity: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  {vacancy.amenities && vacancy.amenities.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{vacancy.amenities.length - 3} more
                    </Badge>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/view-vacancy/${vacancy.id}`)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
                <Button size="sm" onClick={() => openInquiryDialog(vacancy)}>
                  Inquire Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Inquiry Dialog */}
      <Dialog open={inquiryDialogOpen} onOpenChange={setInquiryDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Inquire About This Apartment</DialogTitle>
            <DialogDescription>
              {selectedVacancy && (
                <div className="mt-2">
                  <p className="font-medium">{selectedVacancy.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedVacancy.propertyName} • ${selectedVacancy.rentAmount}/mo
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john.doe@example.com"
                          {...field}
                        />
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
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="moveInDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Desired Move-in Date</FormLabel>
                    <div className="grid gap-2">
                      <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal ${
                          !field.value ? "text-muted-foreground" : ""
                        }`}
                        type="button"
                        onClick={() => {
                          const now = new Date();
                          const newDate = new Date(
                            now.getFullYear(),
                            now.getMonth() + 1,
                            1
                          );
                          field.onChange(newDate);
                        }}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </div>
                    <FormDescription>
                      When would you like to move in?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Information</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share any specific requirements or questions about the apartment..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPreference"
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
                        <SelectItem value="either">No Preference</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree to the terms and conditions and consent to being
                        contacted about this property
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setInquiryDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Inquiry"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VacancyListing;