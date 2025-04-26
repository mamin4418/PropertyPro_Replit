import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  CalendarIcon,
  ChevronRight,
  Clock,
  Edit,
  HomeIcon,
  Loader2,
  Mail,
  MapPin,
  Phone,
  PlusCircle,
  Share2,
  Waves,
  Star,
  User,
  Users,
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

// Define the SendApplication form schema
const sendApplicationSchema = z.object({
  applicantEmail: z.string().email("Invalid email address"),
  message: z.string().optional(),
  templateId: z.string().min(1, "Please select an application template"),
  dueDate: z.date().optional(),
});

type SendApplicationFormValues = z.infer<typeof sendApplicationSchema>;

const ViewVacancy = () => {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [inquiryDialogOpen, setInquiryDialogOpen] = useState(false);
  const [sendApplicationDialogOpen, setSendApplicationDialogOpen] = useState(false);
  const [isPublicView] = useState(window.location.pathname.includes("/vacancy/"));

  // Query for fetching vacancy details
  const { data: vacancy, isLoading, isError } = useQuery({
    queryKey: [`/api/vacancies/${id}`],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/vacancies/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch vacancy");
        }
        return response.json();
      } catch (error) {
        console.error("Error fetching vacancy:", error);
        // Simulate data for now
        return {
          id: parseInt(id as string),
          title: "Modern 1 Bedroom Apartment",
          propertyId: 1,
          propertyName: "Parkside Apartments",
          propertyAddress: "123 Main St, Anytown, CA 91234",
          unitId: 101,
          description:
            "Beautiful renovated 1 bedroom apartment with hardwood floors, stainless steel appliances, and a private balcony. Plenty of natural light and storage space. Located in a quiet neighborhood with easy access to shopping, restaurants, and public transportation.",
          rentAmount: 1250,
          depositAmount: 1250,
          availableFrom: "2023-06-01",
          leaseDuration: 12,
          bedrooms: 1,
          bathrooms: 1,
          sqft: 750,
          minimumIncome: 3000,
          creditScoreRequirement: 650,
          petPolicy: "Cats only, $500 pet deposit",
          petDeposit: 500,
          smokingAllowed: false,
          includedUtilities: ["Water", "Trash"],
          advertisingChannels: ["Website", "Zillow"],
          amenities: [
            "Dishwasher",
            "A/C",
            "In-unit Laundry",
            "Balcony",
            "Hardwood Floors",
            "Stainless Steel Appliances",
          ],
          images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
            "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
          ],
          status: "active",
          inquiries: 7,
          applications: 3,
          createdAt: "2023-04-15T10:30:00Z",
          updatedAt: "2023-04-20T15:45:00Z",
        };
      }
    },
  });

  // Query for application templates - used in send application dialog
  const { data: applicationTemplates = [] } = useQuery({
    queryKey: ["/api/application-templates"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/application-templates");
        if (!response.ok) {
          throw new Error("Failed to fetch application templates");
        }
        return response.json();
      } catch (error) {
        console.error("Error fetching application templates:", error);
        // Return sample data for now
        return [
          { id: 1, name: "Standard Rental Application" },
          { id: 2, name: "Premium Property Application" },
          { id: 3, name: "Basic Tenant Screening" },
        ];
      }
    },
    enabled: !isPublicView, // Only fetch if in admin view
  });

  // Inquiry form
  const inquiryForm = useForm<InquiryFormValues>({
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

  // Send application form
  const sendApplicationForm = useForm<SendApplicationFormValues>({
    resolver: zodResolver(sendApplicationSchema),
    defaultValues: {
      applicantEmail: "",
      message: "",
      templateId: "",
      dueDate: undefined,
    },
  });

  // Mutation for submitting an inquiry
  const { mutate: submitInquiry, isPending: isSubmittingInquiry } = useMutation({
    mutationFn: async (data: InquiryFormValues) => {
      // Include the selected vacancy information
      const inquiryData = {
        ...data,
        vacancyId: vacancy?.id,
        unitId: vacancy?.unitId,
        propertyId: vacancy?.propertyId,
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
      inquiryForm.reset();
      setInquiryDialogOpen(false);
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

  // Mutation for sending application
  const { mutate: sendApplication, isPending: isSendingApplication } = useMutation({
    mutationFn: async (data: SendApplicationFormValues) => {
      const applicationData = {
        ...data,
        vacancyId: vacancy?.id,
        unitId: vacancy?.unitId,
        propertyId: vacancy?.propertyId,
        dueDate: data.dueDate ? format(data.dueDate, "yyyy-MM-dd") : null,
      };

      return await apiRequest("POST", "/api/applications/send", applicationData);
    },
    onSuccess: () => {
      toast({
        title: "Application Sent",
        description:
          "The application has been sent to the applicant's email.",
      });
      sendApplicationForm.reset();
      setSendApplicationDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: [`/api/vacancies/${id}`] });
    },
    onError: (error) => {
      console.error("Error sending application:", error);
      toast({
        title: "Error",
        description:
          "There was a problem sending the application. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle inquiry form submission
  const onSubmitInquiry = (data: InquiryFormValues) => {
    submitInquiry(data);
  };

  // Handle send application form submission
  const onSubmitSendApplication = (data: SendApplicationFormValues) => {
    sendApplication(data);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading vacancy details...</span>
      </div>
    );
  }

  if (isError || !vacancy) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-destructive mb-2">Error</h2>
        <p className="mb-4">
          There was a problem loading this vacancy listing.
        </p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  // Generate list items for amenities
  const renderAmenityList = (amenities: string[]) => {
    if (!amenities?.length) return "None listed";

    return (
      <div className="grid grid-cols-2 gap-2">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-primary" />
            <span>{amenity}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`p-6 ${isPublicView ? "max-w-5xl mx-auto" : ""}`}>
      {/* Admin header (only visible in admin view) */}
      {!isPublicView && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">{vacancy.title}</h1>
            <p className="text-muted-foreground">
              {vacancy.propertyName} • Unit {vacancy.unitId}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/edit-vacancy/${vacancy.id}`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Listing
            </Button>
            {vacancy.status === "active" && (
              <Button onClick={() => setSendApplicationDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Send Application
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Public view header (only visible in public view) */}
      {isPublicView && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{vacancy.title}</h1>
          <div className="flex items-center text-muted-foreground mt-2">
            <MapPin className="h-4 w-4 mr-1" />
            <p>{vacancy.propertyAddress}</p>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image carousel */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {vacancy.images && vacancy.images.length > 0 ? (
                <Carousel className="w-full">
                  <CarouselContent>
                    {vacancy.images.map((image: string, index: number) => (
                      <CarouselItem key={index}>
                        <div className="relative h-[300px] md:h-[400px] w-full">
                          <img
                            src={image}
                            alt={`Property image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
              ) : (
                <div className="h-[300px] flex items-center justify-center bg-muted">
                  <HomeIcon className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About This Property</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{vacancy.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {vacancy.amenities &&
                  vacancy.amenities.slice(0, 6).map((amenity, index) => (
                    <Badge key={index} variant="secondary">
                      {amenity}
                    </Badge>
                  ))}
                {vacancy.amenities && vacancy.amenities.length > 6 && (
                  <Badge variant="outline">
                    +{vacancy.amenities.length - 6} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Features & Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Features & Amenities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Unit Amenities</h3>
                {renderAmenityList(vacancy.amenities || [])}
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Utilities Included</h3>
                {vacancy.includedUtilities && vacancy.includedUtilities.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {vacancy.includedUtilities.map((utility, index) => (
                      <Badge key={index} variant="outline">
                        {utility}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No utilities included in rent</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Policies */}
          <Card>
            <CardHeader>
              <CardTitle>Policies & Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-1">Pet Policy</h3>
                  <p>
                    {vacancy.petPolicy
                      ? vacancy.petPolicy
                      : "No pet policy specified"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Smoking</h3>
                  <p>
                    {vacancy.smokingAllowed
                      ? "Smoking allowed"
                      : "No smoking allowed"}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-1">Income Requirement</h3>
                  <p>
                    {vacancy.minimumIncome
                      ? `Minimum $${vacancy.minimumIncome.toLocaleString()}/month`
                      : "No minimum income specified"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Credit Score</h3>
                  <p>
                    {vacancy.creditScoreRequirement
                      ? `Minimum score: ${vacancy.creditScoreRequirement}`
                      : "No minimum credit score specified"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column (1/3 width) */}
        <div className="space-y-6">
          {/* Pricing & Availability Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                ${vacancy.rentAmount}/month
              </CardTitle>
              {!isPublicView && (
                <CardDescription>
                  Status: {vacancy.status.charAt(0).toUpperCase() + vacancy.status.slice(1)}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Bedrooms</span>
                  <span className="font-medium">
                    {vacancy.bedrooms === 0 ? "Studio" : vacancy.bedrooms}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Bathrooms</span>
                  <span className="font-medium">{vacancy.bathrooms}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Square Feet</span>
                  <span className="font-medium">{vacancy.sqft}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Deposit</span>
                  <span className="font-medium">${vacancy.depositAmount}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>
                    Available: {new Date(vacancy.availableFrom).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{vacancy.leaseDuration} month lease</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => setInquiryDialogOpen(true)}>
                Request More Information
              </Button>
            </CardFooter>
          </Card>

          {/* Admin stats (only visible in admin view) */}
          {!isPublicView && (
            <Card>
              <CardHeader>
                <CardTitle>Listing Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Inquiries</span>
                  </div>
                  <Badge variant="secondary">{vacancy.inquiries || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Applications</span>
                  </div>
                  <Badge variant="secondary">{vacancy.applications || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Listed Since</span>
                  </div>
                  <span className="text-sm">
                    {new Date(vacancy.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const url = `/vacancy/${vacancy.id}`;
                    navigator.clipboard.writeText(window.location.origin + url);
                    toast({
                      title: "Link copied",
                      description: "Public listing URL has been copied to clipboard",
                    });
                  }}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Copy Public Link
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Property manager contact (only visible in public view) */}
          {isPublicView && (
            <Card>
              <CardHeader>
                <CardTitle>Contact Property Manager</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>leasing@parkside-apts.com</span>
                </div>
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Leasing Office Hours: Mon-Fri 9am-5pm, Sat 10am-3pm</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Inquiry Dialog */}
      <Dialog open={inquiryDialogOpen} onOpenChange={setInquiryDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Inquire About This Apartment</DialogTitle>
            <DialogDescription>
              <div className="mt-2">
                <p className="font-medium">{vacancy.title}</p>
                <p className="text-sm text-muted-foreground">
                  {vacancy.propertyName} • ${vacancy.rentAmount}/mo
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>

          <Form {...inquiryForm}>
            <form onSubmit={inquiryForm.handleSubmit(onSubmitInquiry)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={inquiryForm.control}
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
                  control={inquiryForm.control}
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
                  control={inquiryForm.control}
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
                  control={inquiryForm.control}
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
                control={inquiryForm.control}
                name="moveInDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Desired Move-in Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={
                              !field.value ? "text-muted-foreground" : ""
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
                          disabled={(date) =>
                            date <
                            new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When would you like to move in?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={inquiryForm.control}
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
                control={inquiryForm.control}
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
                control={inquiryForm.control}
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
                <Button type="submit" disabled={isSubmittingInquiry}>
                  {isSubmittingInquiry ? (
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

      {/* Send Application Dialog (admin only) */}
      {!isPublicView && (
        <Dialog
          open={sendApplicationDialogOpen}
          onOpenChange={setSendApplicationDialogOpen}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Send Application</DialogTitle>
              <DialogDescription>
                Send a rental application to a potential tenant for this unit.
              </DialogDescription>
            </DialogHeader>

            <Form {...sendApplicationForm}>
              <form
                onSubmit={sendApplicationForm.handleSubmit(onSubmitSendApplication)}
                className="space-y-4"
              >
                <FormField
                  control={sendApplicationForm.control}
                  name="applicantEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Applicant Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="applicant@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The application link will be sent to this email address.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={sendApplicationForm.control}
                  name="templateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Application Template</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a template" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {applicationTemplates.map((template: any) => (
                            <SelectItem
                              key={template.id}
                              value={template.id.toString()}
                            >
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose which application form to send.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={sendApplicationForm.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={
                                !field.value ? "text-muted-foreground" : ""
                              }
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Set a deadline</span>
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
                            disabled={(date) =>
                              date <
                              new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        When should the application be completed by?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={sendApplicationForm.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Message (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add a personalized message to the applicant..."
                          className="resize-none"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSendApplicationDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSendingApplication}>
                    {isSendingApplication ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Application"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ViewVacancy;