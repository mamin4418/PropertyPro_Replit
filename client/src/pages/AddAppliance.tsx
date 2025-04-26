import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { insertApplianceSchema } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Loader2 } from 'lucide-react';
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
import DashboardLayout from '@/components/layout/DashboardLayout';

// Extend the insertApplianceSchema with validations
const formSchema = insertApplianceSchema.extend({
  unitId: z.number({
    required_error: "Unit ID is required",
    invalid_type_error: "Unit ID must be a number",
  }),
  type: z.string().min(2, {
    message: "Type must be at least 2 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddAppliance() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
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

  // Fetch units for selection
  const { data: units, isLoading: isLoadingUnits } = useQuery({
    queryKey: ['/api/units'],
    retry: 1,
  });

  // Handle form submission
  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      return apiRequest<FormValues>('/api/appliances', {
        method: 'POST',
        data: values,
      });
    },
    onSuccess: () => {
      toast({
        title: "Appliance Added",
        description: "The appliance has been successfully added.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/appliances'] });
      queryClient.invalidateQueries({ queryKey: ['/api/units'] });
      setLocation('/appliances');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add appliance. Please try again.",
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

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Add New Appliance</h1>
          <p className="text-muted-foreground">
            Add a new appliance to your property inventory
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Appliance Details</CardTitle>
            <CardDescription>
              Enter the details for the new appliance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Unit Selection */}
                  <FormField
                    control={form.control}
                    name="unitId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <Select
                          disabled={isLoadingUnits}
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isLoadingUnits ? (
                              <SelectItem value="loading" disabled>Loading units...</SelectItem>
                            ) : !units || units.length === 0 ? (
                              <SelectItem value="none" disabled>No units available</SelectItem>
                            ) : (
                              units.map((unit) => (
                                <SelectItem key={unit.id} value={unit.id.toString()}>
                                  Unit #{unit.unitNumber} - {unit.propertyName || 'Property'}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the unit where this appliance is installed
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Appliance Type */}
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Appliance Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a type" />
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
                          The type of appliance
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
                          <Input placeholder="e.g. Whirlpool, GE, Samsung" {...field} />
                        </FormControl>
                        <FormDescription>
                          The brand or manufacturer of the appliance
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
                          <Input placeholder="Model number" {...field} />
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
                          <Input placeholder="Serial number" {...field} />
                        </FormControl>
                        <FormDescription>
                          The unique serial number of the appliance
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
                            {statusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Current operational status
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
                                className={`pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                              >
                                {field.value ? (
                                  format(new Date(field.value), "PPP")
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
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date) => field.onChange(date?.toISOString().split('T')[0])}
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

                  {/* Install Date */}
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
                                className={`pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                              >
                                {field.value ? (
                                  format(new Date(field.value), "PPP")
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
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date) => field.onChange(date?.toISOString().split('T')[0])}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          When the appliance was installed
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
                                className={`pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                              >
                                {field.value ? (
                                  format(new Date(field.value), "PPP")
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
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date) => field.onChange(date?.toISOString().split('T')[0])}
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
                        <FormLabel>Warranty Information</FormLabel>
                        <FormControl>
                          <Input placeholder="Warranty details" {...field} />
                        </FormControl>
                        <FormDescription>
                          Any warranty details or expiration date
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
                          placeholder="Add any additional notes or details about the appliance"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include any special instructions or maintenance notes
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation('/appliances')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Appliance
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}