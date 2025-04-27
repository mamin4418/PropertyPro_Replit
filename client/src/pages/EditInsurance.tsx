
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, ArrowLeft } from "lucide-react";
import { cn, apiRequest, formatDate } from "@/lib/utils";
import { insertInsuranceSchema } from "@shared/schema";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { queryClient } from "@/lib/queryClient";

// Create a form schema with validation based on the insertInsuranceSchema
const formSchema = insertInsuranceSchema.extend({
  coverageAmount: z.string().min(1, "Coverage amount is required"),
  premium: z.string().min(1, "Premium is required"),
  deductible: z.string().optional(),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditInsurance() {
  const [_, setLocation] = useLocation();
  const { id } = useParams();
  
  const insuranceId = id ? parseInt(id) : undefined;
  
  // Fetch the insurance data
  const { data: insurance, isLoading } = useQuery({
    queryKey: ['/api/insurances', insuranceId],
    queryFn: async () => {
      if (!insuranceId) return null;
      const res = await fetch(`/api/insurances/${insuranceId}`);
      if (!res.ok) throw new Error('Failed to fetch insurance');
      return res.json();
    },
    enabled: !!insuranceId
  });
  
  // Fetch property data for the insurance
  const { data: property } = useQuery({
    queryKey: ['/api/properties', insurance?.propertyId],
    queryFn: async () => {
      if (!insurance?.propertyId) return null;
      const res = await fetch(`/api/properties/${insurance.propertyId}`);
      if (!res.ok) throw new Error('Failed to fetch property');
      return res.json();
    },
    enabled: !!insurance?.propertyId
  });
  
  // Setup the form with default values from the fetched insurance
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: async () => {
      if (!insurance) return {
        propertyId: 0,
        insuranceProvider: "",
        policyNumber: "",
        policyType: "homeowner",
        coverageAmount: "",
        premium: "",
        deductible: "",
        startDate: new Date(),
        isActive: true,
      };
      
      return {
        propertyId: insurance.propertyId,
        insuranceProvider: insurance.insuranceProvider,
        policyNumber: insurance.policyNumber,
        policyType: insurance.policyType,
        coverageAmount: insurance.coverageAmount.toString(),
        premium: insurance.premium.toString(),
        deductible: insurance.deductible ? insurance.deductible.toString() : "",
        startDate: new Date(insurance.startDate),
        endDate: insurance.endDate ? new Date(insurance.endDate) : undefined,
        contactName: insurance.contactName || "",
        contactPhone: insurance.contactPhone || "",
        contactEmail: insurance.contactEmail || "",
        coverageDetails: insurance.coverageDetails || "",
        isActive: insurance.isActive,
        notes: insurance.notes || "",
      };
    },
  });
  
  // Reset form values when insurance data is loaded
  React.useEffect(() => {
    if (insurance) {
      form.reset({
        propertyId: insurance.propertyId,
        insuranceProvider: insurance.insuranceProvider,
        policyNumber: insurance.policyNumber,
        policyType: insurance.policyType,
        coverageAmount: insurance.coverageAmount.toString(),
        premium: insurance.premium.toString(),
        deductible: insurance.deductible ? insurance.deductible.toString() : "",
        startDate: new Date(insurance.startDate),
        endDate: insurance.endDate ? new Date(insurance.endDate) : undefined,
        contactName: insurance.contactName || "",
        contactPhone: insurance.contactPhone || "",
        contactEmail: insurance.contactEmail || "",
        coverageDetails: insurance.coverageDetails || "",
        isActive: insurance.isActive,
        notes: insurance.notes || "",
      });
    }
  }, [form, insurance]);
  
  const updateInsuranceMutation = useMutation({
    mutationFn: async (data: any) => {
      // Convert string values to numeric for the API
      const numericData = {
        ...data,
        coverageAmount: parseFloat(data.coverageAmount),
        premium: parseFloat(data.premium),
        deductible: data.deductible ? parseFloat(data.deductible) : null,
      };
      
      return await apiRequest(`/api/insurances/${insuranceId}`, "PUT", numericData);
    },
    onSuccess: () => {
      toast({
        title: "Insurance policy updated",
        description: "The insurance policy has been updated successfully.",
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/insurances'] });
      queryClient.invalidateQueries({ queryKey: ['/api/insurances', insuranceId] });
      
      if (insurance?.propertyId) {
        queryClient.invalidateQueries({ queryKey: ['/api/insurances', `/property/${insurance.propertyId}`] });
      }
      
      // Redirect to insurances page
      setLocation(insurance?.propertyId ? `/insurances/${insurance.propertyId}` : '/insurances');
    },
    onError: (error) => {
      toast({
        title: "Failed to update insurance policy",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: FormValues) => {
    updateInsuranceMutation.mutate(data);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (!insurance && !isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-lg mx-auto mt-10 p-6 bg-destructive/10 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-destructive">Insurance Not Found</h2>
          <p className="mb-4">The insurance policy you are looking for does not exist or has been deleted.</p>
          <Button onClick={() => setLocation('/insurances')}>
            Back to Insurance Policies
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => setLocation(insurance?.propertyId ? `/insurances/${insurance.propertyId}` : '/insurances')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Insurance Policies
      </Button>
      
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Insurance Policy</CardTitle>
          <CardDescription>
            {property 
              ? `Edit insurance policy details for ${property.name}` 
              : "Edit insurance policy details"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="insuranceProvider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance Provider</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. State Farm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="policyNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Policy Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. POL-12345678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="policyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Policy Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select policy type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="homeowner">Homeowner's Insurance</SelectItem>
                        <SelectItem value="landlord">Landlord Insurance</SelectItem>
                        <SelectItem value="flood">Flood Insurance</SelectItem>
                        <SelectItem value="fire">Fire Insurance</SelectItem>
                        <SelectItem value="liability">Liability Insurance</SelectItem>
                        <SelectItem value="umbrella">Umbrella Insurance</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="coverageAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coverage Amount ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="premium"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Premium ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="deductible"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deductible ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0" 
                          {...field} 
                          value={field.value || ''} 
                          onChange={(e) => field.onChange(e.target.value || undefined)}
                        />
                      </FormControl>
                      <FormDescription>Optional</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date (optional)</span>
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
                      <FormDescription>Optional</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. John Smith" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormDescription>Optional</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. (555) 123-4567" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormDescription>Optional</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="e.g. agent@insurance.com" 
                          {...field} 
                          value={field.value || ''} 
                        />
                      </FormControl>
                      <FormDescription>Optional</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="coverageDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coverage Details</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter details about the coverage..." 
                        {...field} 
                        value={field.value || ''} 
                      />
                    </FormControl>
                    <FormDescription>Optional</FormDescription>
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
                        placeholder="Any additional notes..." 
                        {...field} 
                        value={field.value || ''} 
                      />
                    </FormControl>
                    <FormDescription>Optional</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value === true}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active Policy</FormLabel>
                      <FormDescription>
                        Mark this insurance policy as active
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="mr-2"
                  onClick={() => setLocation(insurance?.propertyId ? `/insurances/${insurance.propertyId}` : '/insurances')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={updateInsuranceMutation.isPending}
                >
                  {updateInsuranceMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
