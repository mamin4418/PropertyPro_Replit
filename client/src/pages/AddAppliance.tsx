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

// Predefined lists
const applianceTypes = [
  "Refrigerator",
  "Dishwasher",
  "Oven",
  "Stove",
  "Washer",
  "Dryer",
  "Water Heater",
  "HVAC System",
  "Microwave",
  "Garbage Disposal",
  "Range Hood",
  "Other"
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "repair-needed", label: "Needs Repair" },
  { value: "inactive", label: "Inactive" }
];

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

  // Fetch properties data
  const { data: properties, isLoading: isLoadingProperties } = useQuery({
    queryKey: ['/api/properties'],
    retry: 1,
  });

  // State for property filter
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);

  // Fetch units data
  const { data: units, isLoading: isLoadingUnits } = useQuery({
    queryKey: ['/api/units'],
    retry: 1,
  });

  // Filter units by property
  const filteredUnits = units?.filter(unit => 
    !selectedPropertyId || unit.propertyId === selectedPropertyId
  );

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
      setLocation('/appliances');
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem adding the appliance. Please try again.",
      });
      console.error('Error adding appliance:', error);
    }
  });

  function onSubmit(values: FormValues) {
    mutation.mutate(values);
  }

  return (
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
              {/* Property Selection Filter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FormLabel>Filter by Property</FormLabel>
                  <Select
                    disabled={isLoadingProperties}
                    value={selectedPropertyId?.toString() || ''}
                    onValueChange={(value) => {
                      setSelectedPropertyId(value ? parseInt(value) : null);
                      // Reset unitId field when property changes
                      form.setValue('unitId', undefined as any);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Properties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Properties</SelectItem>
                      {isLoadingProperties ? (
                        <SelectItem value="loading" disabled>Loading properties...</SelectItem>
                      ) : !properties || properties.length === 0 ? (
                        <SelectItem value="none" disabled>No properties available</SelectItem>
                      ) : (
                        properties.map((property) => (
                          <SelectItem key={property.id} value={property.id.toString()}>
                            {property.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Select a property to filter units
                  </p>
                </div>
              </div>
              
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
                        value={field.value?.toString() || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingUnits ? (
                            <SelectItem value="loading" disabled>Loading units...</SelectItem>
                          ) : !filteredUnits || filteredUnits.length === 0 ? (
                            <SelectItem value="none" disabled>No units available</SelectItem>
                          ) : (
                            filteredUnits.map((unit) => (
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
                        value={field.value || ''}
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
                        <Input placeholder="e.g. Whirlpool, GE, Samsung" {...field} value={field.value || ''} />
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
                        <Input placeholder="Model number" {...field} value={field.value || ''} />
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
                        <Input placeholder="Serial number" {...field} value={field.value || ''} />
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
                        value={field.value || ''}
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
                        Last time the appliance was serviced
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
                        <Input placeholder="Warranty information" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormDescription>
                        Warranty details and expiration
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

              <div className="flex justify-end space-x-4 pt-4">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => setLocation('/appliances')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Add Appliance
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}