
import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ArrowLeft,
  CheckCircle,
  ClipboardList,
  FileText,
  Home,
  User,
  Shield,
  CreditCard,
  DollarSign,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

// Define the form schema
const formSchema = z.object({
  // Application Template Selection
  templateId: z.string().min(1, { message: "Please select a template" }),
  
  // Applicant Information
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(7, { message: "Valid phone number is required" }),
  
  // Property Information
  propertyId: z.string().min(1, { message: "Please select a property" }),
  vacancyId: z.string().optional(),
  desiredMoveInDate: z.string().optional(),
  
  // Additional Fields
  applicationFee: z.boolean().default(true),
  sendEmailToApplicant: z.boolean().default(true),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewApplication() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("application");
  const [applicationId, setApplicationId] = useState<string | null>(null);
  
  // Mock data for templates, properties, etc.
  const mockTemplates = [
    { id: "1", name: "Standard Rental Application" },
    { id: "2", name: "Premium Property Application" },
    { id: "3", name: "Short-term Rental Application" },
  ];
  
  const mockProperties = [
    { id: "1", name: "Sunset Heights Apartments", address: "123 Main St" },
    { id: "2", name: "Lakeside Villas", address: "456 Lake Ave" },
    { id: "3", name: "Urban Living Lofts", address: "789 Downtown Blvd" },
  ];
  
  const mockVacancies = [
    { id: "1", propertyId: "1", unit: "101", rent: 1200 },
    { id: "2", propertyId: "1", unit: "205", rent: 1350 },
    { id: "3", propertyId: "2", unit: "A12", rent: 1650 },
  ];
  
  // Setup form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      templateId: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      propertyId: "",
      vacancyId: "",
      desiredMoveInDate: "",
      applicationFee: true,
      sendEmailToApplicant: true,
      notes: "",
    },
  });
  
  // Filter vacancies based on selected property
  const selectedPropertyId = form.watch("propertyId");
  const availableVacancies = mockVacancies.filter(v => v.propertyId === selectedPropertyId);

  // Submit handler
  const createApplicationMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      // In a real app, this would be an API call
      console.log("Creating application with data:", data);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Return a mock application ID
      return { id: "app_" + Math.floor(Math.random() * 10000) };
    },
    onSuccess: (data) => {
      toast({
        title: "Application Created",
        description: `Application #${data.id} has been created successfully.`,
      });
      setApplicationId(data.id);
      setCurrentTab("screening");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create application. Please try again.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: FormValues) {
    createApplicationMutation.mutate(data);
  }

  // Background check mutation
  const startBackgroundCheckMutation = useMutation({
    mutationFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { status: "pending" };
    },
    onSuccess: () => {
      toast({
        title: "Background Check Initiated",
        description: "The background screening process has been started.",
      });
    },
  });

  // Credit check mutation
  const startCreditCheckMutation = useMutation({
    mutationFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { status: "pending" };
    },
    onSuccess: () => {
      toast({
        title: "Credit Check Initiated",
        description: "The credit check process has been started.",
      });
    },
  });

  return (
    <div className="container py-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/applications")}
          className="mr-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Applications
        </Button>
        <h1 className="text-2xl font-bold">Create New Application</h1>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="application" disabled={applicationId !== null && currentTab === "screening"}>
            <ClipboardList className="mr-2 h-4 w-4" />
            Application Details
          </TabsTrigger>
          <TabsTrigger value="screening" disabled={!applicationId}>
            <Shield className="mr-2 h-4 w-4" />
            Screening & Verification
          </TabsTrigger>
        </TabsList>

        <TabsContent value="application" className="space-y-4 mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Application Template
                  </CardTitle>
                  <CardDescription>
                    Select the template to use for this application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
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
                            {mockTemplates.map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          This will determine the questions and sections in the application
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Applicant Information
                  </CardTitle>
                  <CardDescription>
                    Enter the applicant's personal details
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john.doe@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Used for application notifications
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
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="(555) 123-4567"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Home className="mr-2 h-5 w-5" />
                    Property Information
                  </CardTitle>
                  <CardDescription>
                    Select the property and unit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="propertyId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a property" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockProperties.map((property) => (
                                <SelectItem key={property.id} value={property.id}>
                                  {property.name} - {property.address}
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
                      name="vacancyId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit/Vacancy</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!selectedPropertyId}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={selectedPropertyId ? "Select a unit" : "Select a property first"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableVacancies.map((vacancy) => (
                                <SelectItem key={vacancy.id} value={vacancy.id}>
                                  Unit {vacancy.unit} - ${vacancy.rent}/month
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
                      name="desiredMoveInDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Desired Move-in Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="mr-2 h-5 w-5" />
                    Application Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="applicationFee"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Charge Application Fee
                            </FormLabel>
                            <FormDescription>
                              Applicant will be required to pay the standard fee
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sendEmailToApplicant"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Send Email to Applicant
                            </FormLabel>
                            <FormDescription>
                              Notify the applicant about this application
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Internal Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Add any additional notes about this application"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            These notes are only visible to staff
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/applications")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createApplicationMutation.isPending}
                  >
                    {createApplicationMutation.isPending ? "Creating..." : "Create Application"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="screening" className="space-y-4 mt-4">
          {applicationId && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BadgeCheck className="mr-2 h-5 w-5" />
                    Screening Information
                  </CardTitle>
                  <CardDescription>
                    Application #{applicationId} - Perform screening and verification checks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-medium flex items-center">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Credit Check
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="text-sm text-muted-foreground mb-4">
                          Verify credit history, score, and financial responsibility.
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Checkbox id="transunion" />
                            <label htmlFor="transunion" className="text-sm font-medium">
                              TransUnion Credit Report ($24.99)
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox id="experian" />
                            <label htmlFor="experian" className="text-sm font-medium">
                              Experian Credit Report ($19.99)
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox id="equifax" />
                            <label htmlFor="equifax" className="text-sm font-medium">
                              Equifax Credit Report ($19.99)
                            </label>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full" 
                          onClick={() => startCreditCheckMutation.mutate()}
                          disabled={startCreditCheckMutation.isPending}
                        >
                          {startCreditCheckMutation.isPending ? 
                            "Initiating..." : 
                            "Start Credit Check"
                          }
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-medium flex items-center">
                          <Shield className="mr-2 h-4 w-4" />
                          Background Screening
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="text-sm text-muted-foreground mb-4">
                          Verify identity, criminal history, and rental history.
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Checkbox id="identity" />
                            <label htmlFor="identity" className="text-sm font-medium">
                              Identity Verification ($9.99)
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox id="criminal" />
                            <label htmlFor="criminal" className="text-sm font-medium">
                              Criminal Background Check ($29.99)
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox id="rental" />
                            <label htmlFor="rental" className="text-sm font-medium">
                              Rental History Verification ($14.99)
                            </label>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full"
                          onClick={() => startBackgroundCheckMutation.mutate()}
                          disabled={startBackgroundCheckMutation.isPending}
                        >
                          {startBackgroundCheckMutation.isPending ? 
                            "Initiating..." : 
                            "Start Background Check"
                          }
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>

                  <div className="mt-6">
                    <Card className="bg-muted/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-medium flex items-center">
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Important Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-sm">
                          <li>Applicant must provide consent for all background and credit checks.</li>
                          <li>All screening and verification follows the Fair Credit Reporting Act (FCRA) regulations.</li>
                          <li>You should have a consistent screening policy to avoid fair housing violations.</li>
                          <li>Credit and background checks are performed by third-party providers and may take 1-3 business days to complete.</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/applications")}
                  >
                    Return to Applications
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => navigate(`/view-application/${applicationId}`)}
                  >
                    View Full Application
                  </Button>
                </CardFooter>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
