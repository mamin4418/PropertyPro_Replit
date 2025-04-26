import { useState } from "react";
import { Link, useParams } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample company data - matching IDs with Companies.tsx
const sampleCompanies = [
  {
    id: 1,
    legalName: "ABC Property Management LLC",
    companyName: "ABC Properties",
    ein: "12-3456789",
    email: "info@abcproperties.com",
    phone: "(555) 123-4567",
    type: "LLC",
    status: "active",
    notes: "Premier property management company specializing in residential rentals."
  },
  {
    id: 2,
    legalName: "XYZ Real Estate Holdings Inc",
    companyName: "XYZ Realty",
    ein: "98-7654321",
    email: "contact@xyzrealty.com",
    phone: "(555) 987-6543",
    type: "Corporation",
    status: "active",
    notes: "Corporate housing and commercial real estate specialists."
  },
  {
    id: 3,
    legalName: "Sunset Apartments Group LLC",
    companyName: "Sunset Living",
    ein: "45-6789123",
    email: "leasing@sunsetliving.com",
    phone: "(555) 456-7890",
    type: "LLC",
    status: "inactive",
    notes: "Luxury apartment company. Currently inactive due to reorganization."
  },
  {
    id: 4,
    legalName: "Metro Property Investments Ltd",
    companyName: "Metro Properties",
    ein: "78-9123456",
    email: "info@metroproperties.com",
    phone: "(555) 789-0123",
    type: "Limited Company",
    status: "active",
    notes: "Urban property development and management company focusing on mixed-use buildings."
  },
  {
    id: 5,
    legalName: "Urban Home Rentals Inc",
    companyName: "Urban Homes",
    ein: "23-4567891",
    email: "rentals@urbanhomes.com",
    phone: "(555) 234-5678",
    type: "Corporation",
    status: "active",
    notes: "Affordable housing solutions in metropolitan areas."
  }
];

// Form schema
const companyFormSchema = z.object({
  legalName: z.string().min(2, {
    message: "Legal name must be at least 2 characters.",
  }),
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  ein: z.string().optional(),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  type: z.string({
    required_error: "Please select a company type.",
  }),
  status: z.string({
    required_error: "Please select a status.",
  }),
  notes: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

export default function EditCompany() {
  const { id } = useParams();
  const companyId = parseInt(id || "0");
  const { toast } = useToast();

  // Find the company with the matching ID
  const company = sampleCompanies.find(company => company.id === companyId);

  if (!company) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Company Not Found</h1>
          <p className="mb-4">The company you're looking for doesn't exist or has been removed.</p>
          <Link href="/companies">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Companies
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Initialize form with existing company data
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      legalName: company.legalName,
      companyName: company.companyName,
      ein: company.ein,
      email: company.email,
      phone: company.phone,
      type: company.type,
      status: company.status,
      notes: company.notes,
    },
  });

  function onSubmit(data: CompanyFormValues) {
    // In a real app, we would update the company here
    console.log(data);

    toast({
      title: "Company Updated",
      description: `${data.companyName} has been updated successfully.`,
    });

    // Redirect to company view page
    window.location.href = `/view-company/${companyId}`;
  }

  return (
    <div className="container mx-auto p-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/companies">Companies</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/view-company/${company.id}`}>{company.companyName}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Edit</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Company</h1>
        <Link href={`/view-company/${company.id}`}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Company
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Update the company's details.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company name" {...field} />
                      </FormControl>
                      <FormDescription>
                        The name your company is known by.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="legalName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Legal Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter legal name" {...field} />
                      </FormControl>
                      <FormDescription>
                        The registered legal name of the company.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a company type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="LLC">LLC</SelectItem>
                          <SelectItem value="Corporation">Corporation</SelectItem>
                          <SelectItem value="Partnership">Partnership</SelectItem>
                          <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                          <SelectItem value="Limited Company">Limited Company</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The legal structure of the company.
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
                      <FormLabel>EIN</FormLabel>
                      <FormControl>
                        <Input placeholder="XX-XXXXXXX" {...field} />
                      </FormControl>
                      <FormDescription>
                        Employer Identification Number (optional).
                      </FormDescription>
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
                        <Input type="email" placeholder="company@example.com" {...field} />
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
                        <Input placeholder="(XXX) XXX-XXXX" {...field} />
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
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional information about the company" 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}