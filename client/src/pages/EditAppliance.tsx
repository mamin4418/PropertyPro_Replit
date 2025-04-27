
import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { insertApplianceSchema } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Skeleton } from '@/components/ui/skeleton';
import type { Appliance } from '@shared/schema';

// Extend the schema with validations
const formSchema = z.object({
  unitId: z.number({
    required_error: "Unit ID is required",
  }),
  type: z.string().min(1, { message: "Type is required" }),
  make: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  purchaseDate: z.date().optional().nullable(),
  installDate: z.date().optional().nullable(),
  lastServiceDate: z.date().optional().nullable(),
  warranty: z.string().optional(),
  notes: z.string().optional(),
  images: z.array(z.string()).optional(),
  status: z.enum(["active", "repair-needed", "inactive"]).default("active"),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditAppliance() {
  const [, params] = useRoute('/edit-appliance/:id');
  const [location, setLocation] = useLocation();
  const applianceId = params?.id ? parseInt(params.id) : null;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch appliance data
  const { 
    data: appliance, 
    isLoading: isLoadingAppliance, 
    error 
  } = useQuery({
    queryKey: ['/api/appliances', applianceId],
    queryFn: async () => {
      console.log(`Fetching appliance ID: ${applianceId}`);
      const data = await apiRequest<Appliance>(`/api/appliances/${applianceId}`);
      console.log(`Appliance data received:`, data);
      return data;
    },
    enabled: !!applianceId,
    retry: 2,
  });

  // Fetch units for selection
  const { data: units, isLoading: isLoadingUnits } = useQuery({
    queryKey: ['/api/units'],
    retry: 1,
  });

  // Form definition
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      unitId: undefined,
      type: '',
      make: '',
      model: '',
      serialNumber: '',
      purchaseDate: undefined,
      installDate: undefined,
      lastServiceDate: undefined,
      warranty: '',
      notes: '',
      images: undefined,
      status: 'active',
    },
  });

  // Update form values once appliance data is loaded
  useEffect(() => {
    if (appliance && !isLoadingAppliance) {
      form.reset({
        unitId: appliance.unitId,
        type: appliance.type,
        make: appliance.make || '',
        model: appliance.model || '',
        serialNumber: appliance.serialNumber || '',
        purchaseDate: appliance.purchaseDate ? new Date(appliance.purchaseDate) : null,
        installDate: appliance.installDate ? new Date(appliance.installDate) : null,
        lastServiceDate: appliance.lastServiceDate ? new Date(appliance.lastServiceDate) : null,
        warranty: appliance.warranty || '',
        notes: appliance.notes || '',
        images: appliance.images || [],
        status: appliance.status || 'active',
      });
    }
  }, [appliance, isLoadingAppliance, form]);

  // Handle form submission
  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      return apiRequest<FormValues>(`/api/appliances/${applianceId}`, {
        method: 'PUT',
        data: values,
      });
    },
    onSuccess: () => {
      toast({
        title: "Appliance Updated",
        description: "The appliance has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/appliances'] });
      queryClient.invalidateQueries({ queryKey: ['/api/units'] });
      setLocation(`/view-appliance/${applianceId}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update appliance. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Appliance type options
  const applianceTypes = [
    "Refrigerator",
    "Stove",
    "Oven",
    "Microwave",
    "Dishwasher",
    "Washer",
    "Dryer",
    "Water Heater",
    "HVAC System",
    "Garbage Disposal",
    "Range Hood",
    "Air Conditioner",
    "Furnace",
    "Other"
  ];

  // Status options
  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "repair-needed", label: "Needs Repair" },
    { value: "inactive", label: "Inactive" }
  ];

  function onSubmit(values: FormValues) {
    mutation.mutate(values);
  }

  if (isLoadingAppliance) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Skeleton className="h-10 w-1/4 mb-2" />
          <Skeleton className="h-6 w-1/3" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
              <Skeleton className="h-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!appliance || error) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold">Appliance Not Found</h3>
            <p className="text-muted-foreground">The appliance you are trying to edit doesn't exist or was removed.</p>
            <Button 
              className="mt-4" 
              onClick={() => setLocation('/appliances')}
            >
              Back to Appliances
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => setLocation(`/view-appliance/${applianceId}`)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Appliance
        </Button>
        <h1 className="text-3xl font-bold">Edit Appliance</h1>
        <p className="text-muted-foreground">
          Update the details for {appliance.type}
          {appliance.make ? ` (${appliance.make}${appliance.model ? ` ${appliance.model}` : ''})` : ''}
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Appliance Information</CardTitle>
          <CardDescription>
            Make changes to the appliance details below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Unit ID */}
                <FormField
                  control={form.control}
                  name="unitId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <Select 
                        disabled={isLoadingUnits} 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {units?.map((unit: any) => (
                            <SelectItem key={unit.id} value={unit.id.toString()}>
                              Unit {unit.unitNumber} ({unit.propertyId ? `Property #${unit.propertyId}` : 'Unassigned'})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The unit where this appliance is installed
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select appliance type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {applianceTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The category of the appliance
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Make */}
                <FormField
                  control={form.control}
                  name="make"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Make</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. GE, Whirlpool, Samsung" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormDescription>
                        The manufacturer of the appliance
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Model */}
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. XYZ-1234" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormDescription>
                        The model number or name
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Serial Number */}
                <FormField
                  control={form.control}
                  name="serialNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serial Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. SN123456789" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormDescription>
                        The unique serial number of the appliance
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Purchase Date */}
                <FormField
                  control={form.control}
                  name="purchaseDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Purchase Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className="w-full pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span className="text-muted-foreground">Select date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        When the appliance was purchased
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Installation Date */}
                <FormField
                  control={form.control}
                  name="installDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Installation Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className="w-full pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span className="text-muted-foreground">Select date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        When the appliance was installed in the unit
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Last Service Date */}
                <FormField
                  control={form.control}
                  name="lastServiceDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Last Service Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className="w-full pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span className="text-muted-foreground">Select date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        When the appliance was last serviced
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Warranty */}
                <FormField
                  control={form.control}
                  name="warranty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warranty</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 2 years parts and labor" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormDescription>
                        Warranty details for the appliance
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Current operational status of the appliance
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional notes or information about the appliance" 
                        className="min-h-[120px]" 
                        {...field}
                        value={field.value || ''} 
                      />
                    </FormControl>
                    <FormDescription>
                      Any additional details or special instructions
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation(`/view-appliance/${applianceId}`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Appliance
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
