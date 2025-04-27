
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
import { insertMortgageSchema } from "@shared/schema";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { queryClient } from "@/lib/queryClient";

// Create a form schema with validation based on the insertMortgageSchema
const formSchema = insertMortgageSchema.extend({
  originalAmount: z.string().min(1, "Original loan amount is required"),
  currentBalance: z.string().min(1, "Current balance is required"),
  interestRate: z.string().min(1, "Interest rate is required"),
  monthlyPayment: z.string().min(1, "Monthly payment is required"),
  originationDate: z.date({
    required_error: "Origination date is required",
  }),
  maturityDate: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditMortgage() {
  const [_, setLocation] = useLocation();
  const { id } = useParams();
  
  const mortgageId = id ? parseInt(id) : undefined;
  
  // Fetch the mortgage data
  const { data: mortgage, isLoading } = useQuery({
    queryKey: ['/api/mortgages', mortgageId],
    queryFn: async () => {
      if (!mortgageId) return null;
      const res = await fetch(`/api/mortgages/${mortgageId}`);
      if (!res.ok) throw new Error('Failed to fetch mortgage');
      return res.json();
    },
    enabled: !!mortgageId
  });
  
  // Fetch property data for the mortgage
  const { data: property } = useQuery({
    queryKey: ['/api/properties', mortgage?.propertyId],
    queryFn: async () => {
      if (!mortgage?.propertyId) return null;
      const res = await fetch(`/api/properties/${mortgage.propertyId}`);
      if (!res.ok) throw new Error('Failed to fetch property');
      return res.json();
    },
    enabled: !!mortgage?.propertyId
  });
  
  // Setup the form with default values from the fetched mortgage
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: async () => {
      if (!mortgage) return {
        propertyId: 0,
        lender: "",
        loanNumber: "",
        loanType: "conventional",
        originalAmount: "",
        currentBalance: "",
        interestRate: "",
        monthlyPayment: "",
        originationDate: new Date(),
        isActive: true,
      };
      
      return {
        propertyId: mortgage.propertyId,
        lender: mortgage.lender,
        loanNumber: mortgage.loanNumber,
        loanType: mortgage.loanType,
        originalAmount: mortgage.originalAmount.toString(),
        currentBalance: mortgage.currentBalance.toString(),
        interestRate: mortgage.interestRate.toString(),
        monthlyPayment: mortgage.monthlyPayment.toString(),
        originationDate: new Date(mortgage.startDate),
        maturityDate: mortgage.maturityDate ? new Date(mortgage.maturityDate) : undefined,
        isActive: mortgage.isActive,
        notes: mortgage.notes || "",
      };
    },
  });
  
  // Reset form values when mortgage data is loaded
  React.useEffect(() => {
    if (mortgage) {
      form.reset({
        propertyId: mortgage.propertyId,
        lender: mortgage.lender,
        loanNumber: mortgage.loanNumber,
        loanType: mortgage.loanType,
        originalAmount: mortgage.originalAmount.toString(),
        currentBalance: mortgage.currentBalance.toString(),
        interestRate: mortgage.interestRate.toString(),
        monthlyPayment: mortgage.monthlyPayment.toString(),
        originationDate: new Date(mortgage.startDate),
        maturityDate: mortgage.maturityDate ? new Date(mortgage.maturityDate) : undefined,
        isActive: mortgage.isActive,
        notes: mortgage.notes || "",
      });
    }
  }, [form, mortgage]);
  
  const updateMortgageMutation = useMutation({
    mutationFn: async (data: any) => {
      // Convert string values to numeric for the API
      const numericData = {
        ...data,
        originalAmount: parseFloat(data.originalAmount),
        currentBalance: parseFloat(data.currentBalance),
        interestRate: parseFloat(data.interestRate),
        monthlyPayment: parseFloat(data.monthlyPayment),
      };
      
      return await apiRequest(`/api/mortgages/${mortgageId}`, "PUT", numericData);
    },
    onSuccess: () => {
      toast({
        title: "Mortgage updated",
        description: "The mortgage has been updated successfully.",
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/mortgages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/mortgages', mortgageId] });
      
      if (mortgage?.propertyId) {
        queryClient.invalidateQueries({ queryKey: ['/api/mortgages', `/property/${mortgage.propertyId}`] });
      }
      
      // Redirect to mortgages page
      setLocation(mortgage?.propertyId ? `/mortgages/${mortgage.propertyId}` : '/mortgages');
    },
    onError: (error) => {
      toast({
        title: "Failed to update mortgage",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: FormValues) => {
    updateMortgageMutation.mutate(data);
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
  
  if (!mortgage && !isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-lg mx-auto mt-10 p-6 bg-destructive/10 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-destructive">Mortgage Not Found</h2>
          <p className="mb-4">The mortgage you are looking for does not exist or has been deleted.</p>
          <Button onClick={() => setLocation('/mortgages')}>
            Back to Mortgages
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
        onClick={() => setLocation(mortgage?.propertyId ? `/mortgages/${mortgage.propertyId}` : '/mortgages')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Mortgages
      </Button>
      
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Mortgage</CardTitle>
          <CardDescription>
            {property 
              ? `Edit mortgage details for ${property.name}` 
              : "Edit mortgage details"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="lender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lender</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Bank of America" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="loanNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. L-12345678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="loanType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select loan type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="conventional">Conventional</SelectItem>
                        <SelectItem value="fha">FHA</SelectItem>
                        <SelectItem value="va">VA</SelectItem>
                        <SelectItem value="usda">USDA</SelectItem>
                        <SelectItem value="jumbo">Jumbo</SelectItem>
                        <SelectItem value="fixedRate">Fixed Rate</SelectItem>
                        <SelectItem value="adjustableRate">Adjustable Rate</SelectItem>
                        <SelectItem value="heloc">HELOC</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="originalAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Loan Amount ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="currentBalance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Balance ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="interestRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interest Rate (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0"
                          max="100"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="monthlyPayment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Payment ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="originationDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Origination Date</FormLabel>
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
                  name="maturityDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Maturity Date</FormLabel>
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
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any additional details about the mortgage..." 
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
                      <FormLabel>Active Mortgage</FormLabel>
                      <FormDescription>
                        Mark this mortgage as active
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
                  onClick={() => setLocation(mortgage?.propertyId ? `/mortgages/${mortgage.propertyId}` : '/mortgages')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={updateMortgageMutation.isPending}
                >
                  {updateMortgageMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
