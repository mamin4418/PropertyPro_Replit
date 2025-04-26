import { useState } from "react";
import { useLocation } from "wouter";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { ArrowLeft, Save, Trash2, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Form validation schema
const maintenanceFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  status: z.string().min(1, { message: "Status is required" }),
  priority: z.string().min(1, { message: "Priority is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  propertyId: z.string().min(1, { message: "Property is required" }),
  unit: z.string().min(1, { message: "Unit is required" }),
  tenantId: z.string().min(1, { message: "Tenant is required" }),
  assignedToId: z.string().optional(),
  scheduledDate: z.string().optional(),
  estimatedCost: z.coerce.number().nonnegative().optional(),
  notes: z.string().optional(),
});

type MaintenanceFormValues = z.infer<typeof maintenanceFormSchema>;

// Mock data for a maintenance request
const maintenance = {
  id: 101,
  title: "Leaking Faucet in Kitchen",
  description: "The kitchen faucet has been leaking steadily for two days. Water is pooling in the sink and cabinet below.",
  status: "in-progress",
  priority: "medium",
  category: "Plumbing",
  requestDate: "2023-03-15T10:30:00Z",
  scheduledDate: "2023-03-17T14:00:00Z",
  completedDate: null,
  estimatedCost: 150,
  actualCost: null,
  propertyId: "1",
  unit: "Apt 101",
  tenantId: "1",
  assignedToId: "1",
  notes: "Parts might need to be ordered."
};

// Mock data for properties
const properties = [
  { id: "1", name: "Sunset Heights", units: ["Apt 101", "Apt 102", "Apt 103"] },
  { id: "2", name: "Riverside Apartments", units: ["Unit 1A", "Unit 1B", "Unit 2A"] }
];

// Mock data for tenants
const tenants = [
  { id: "1", name: "John Doe", property: "Sunset Heights", unit: "Apt 101" },
  { id: "2", name: "Jane Smith", property: "Riverside Apartments", unit: "Unit 1A" },
  { id: "3", name: "Michael Johnson", property: "Sunset Heights", unit: "Apt 102" }
];

// Mock data for vendors/staff
const assignees = [
  { id: "1", name: "Mike's Plumbing", type: "vendor" },
  { id: "2", name: "Elite Electrical", type: "vendor" },
  { id: "3", name: "Alex Thompson", type: "staff" },
  { id: "4", name: "Sarah Garcia", type: "staff" }
];

// Maintenance categories
const categories = [
  "Plumbing",
  "Electrical",
  "HVAC",
  "Appliance",
  "Structural",
  "Pest Control",
  "Cleaning",
  "Landscaping",
  "Other"
];

const EditMaintenance = () => {
  const [, navigate] = useLocation();
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(maintenance.propertyId);
  const [availableUnits, setAvailableUnits] = useState<string[]>([]);
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    image: null
  });

  // Initialize form with react-hook-form
  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: {
      title: maintenance.title,
      description: maintenance.description,
      status: maintenance.status,
      priority: maintenance.priority,
      category: maintenance.category,
      propertyId: maintenance.propertyId,
      unit: maintenance.unit,
      tenantId: maintenance.tenantId,
      assignedToId: maintenance.assignedToId,
      scheduledDate: maintenance.scheduledDate ? new Date(maintenance.scheduledDate).toISOString().split('T')[0] : undefined,
      estimatedCost: maintenance.estimatedCost,
      notes: maintenance.notes,
    },
  });

  // Update available units when property changes
  const handlePropertyChange = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      setAvailableUnits(property.units);
    } else {
      setAvailableUnits([]);
    }
    form.setValue("unit", ""); // Reset unit when property changes
  };

  // Form submission handler
  const onSubmit = (values: MaintenanceFormValues) => {
    console.log("Form values:", values);
    console.log("Files:", files);
    // Here you would typically send the data to an API
    
    // Navigate back to maintenance details page after submission
    navigate(`/view-maintenance/${maintenance.id}`);
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="p-0 mr-2 h-8 w-8" 
          onClick={() => navigate(`/view-maintenance/${maintenance.id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">Edit Maintenance Request</h2>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Edit Maintenance Information</CardTitle>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Request Details */}
              <div>
                <h3 className="text-lg font-medium mb-4">Request Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Issue Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Leaking Faucet in Kitchen" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the maintenance issue in detail" 
                            rows={4} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
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
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Status and Schedule */}
              <div>
                <h3 className="text-lg font-medium mb-4">Status and Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="scheduledDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Scheduled Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="assignedToId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assigned To</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select assignee" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Not Assigned</SelectItem>
                            {assignees.map((assignee) => (
                              <SelectItem key={assignee.id} value={assignee.id}>
                                {assignee.name} ({assignee.type})
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
                    name="estimatedCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Cost</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-muted-foreground">$</span>
                            </div>
                            <Input type="number" className="pl-7" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Location and Tenant */}
              <div>
                <h3 className="text-lg font-medium mb-4">Location and Tenant</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="propertyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            handlePropertyChange(value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select property" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {properties.map((property) => (
                              <SelectItem key={property.id} value={property.id}>
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
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableUnits.map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                {unit}
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
                    name="tenantId"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Tenant</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select tenant" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tenants.map((tenant) => (
                              <SelectItem key={tenant.id} value={tenant.id}>
                                {tenant.name} ({tenant.property}, {tenant.unit})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Photos & Attachments */}
              <div>
                <h3 className="text-lg font-medium mb-4">Photos & Documents</h3>
                <div className="w-full">
                  <div className="mt-1">
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="documents" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Upload photos of the issue, repair quotes, or other relevant documents
                          </p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, PDF (MAX. 10MB per file)</p>
                          <p className="text-xs font-medium text-primary-foreground mt-1">Multiple files allowed</p>
                          {files.image && (
                            <p className="mt-2 text-xs text-primary">File: {files.image.name}</p>
                          )}
                        </div>
                        <input 
                          id="documents" 
                          name="documents" 
                          type="file" 
                          className="hidden" 
                          accept="image/png,image/jpeg,image/jpg,application/pdf"
                          multiple
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              setFiles(prev => ({
                                ...prev,
                                image: e.target.files![0]
                              }));
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Additional Notes */}
              <div>
                <h3 className="text-lg font-medium mb-4">Additional Notes</h3>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any additional notes about this maintenance request"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-between mt-6">
                <Button variant="destructive" type="button" className="flex items-center">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Request
                </Button>
                
                <div className="flex gap-3">
                  <Button variant="outline" type="button" onClick={() => navigate(`/view-maintenance/${maintenance.id}`)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditMaintenance;