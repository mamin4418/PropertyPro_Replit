
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Building, Home } from "lucide-react";

const formSchema = z.object({
  property: z.string(),
  unit: z.string(),
  gracePeriod: z.string().min(1, "Grace period is required"),
  firstLateFee: z.string().min(1, "First late fee is required"),
  recurringLateFee: z.string().min(1, "Recurring late fee is required"),
  recurringPeriod: z.string().min(1, "Recurring period is required"),
  maxLateFee: z.string().min(1, "Maximum late fee is required"),
  maxType: z.string().min(1, "Fee type is required"),
  applyTo: z.string().min(1, "Apply to is required"),
  saveAs: z.string().min(1, "Save as is required"),
});

const AddLateFeeRule = () => {
  const [, navigate] = useLocation();
  const [applyToAll, setApplyToAll] = useState(true);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      property: "all",
      unit: "all",
      gracePeriod: "5",
      firstLateFee: "10",
      recurringLateFee: "5",
      recurringPeriod: "Day",
      maxLateFee: "25",
      maxType: "%",
      applyTo: "Rental Income",
      saveAs: "Add to existing",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // In a real app, this would create the late fee rule in the database
    navigate("/rent/late-fee-rules");
  }

  const properties = [
    { value: "all", label: "All Properties" },
    { value: "1main", label: "1 Main Street" },
    { value: "320jay", label: "320 Jay St" },
    { value: "7marne", label: "7 Marne St" },
    { value: "431main", label: "431 Main Street" },
  ];

  const units = [
    { value: "all", label: "All Units" },
    { value: "main", label: "Main" },
    { value: "1a", label: "1A" },
    { value: "2b", label: "2B" },
    { value: "3c", label: "3C" },
  ];
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Create Late Fee Rule</h2>
        <p className="text-muted-foreground">Set up penalties for overdue rent payments</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="border rounded-lg p-3 mb-4 flex flex-col items-center">
              {applyToAll ? (
                <>
                  <div className="bg-blue-100 p-3 rounded-full mb-3">
                    <Building className="h-8 w-8 text-blue-700" />
                  </div>
                  <Select
                    value={form.getValues("property")}
                    onValueChange={(value) => form.setValue("property", value)}
                  >
                    <SelectTrigger className="w-full mb-2">
                      <SelectValue placeholder="All Properties" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((property) => (
                        <SelectItem key={property.value} value={property.value}>
                          {property.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={form.getValues("unit")}
                    onValueChange={(value) => form.setValue("unit", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Units" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              ) : (
                <>
                  <div className="bg-blue-100 p-3 rounded-full mb-3">
                    <Home className="h-8 w-8 text-blue-700" />
                  </div>
                  <p className="font-medium">320 Jay St</p>
                  <p className="text-sm text-muted-foreground">Unit main</p>
                </>
              )}
            </div>
            
            <p className="text-center font-medium text-blue-600">Late Fee Rule</p>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="gracePeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Days rent is late:</FormLabel>
                        <div className="flex">
                          <FormControl>
                            <Input type="number" {...field} className="rounded-r-none" />
                          </FormControl>
                          <div className="px-3 inline-flex items-center bg-muted border border-l-0 border-input rounded-r-md">
                            Days
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="firstLateFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Late Fee (1st time):</FormLabel>
                        <div className="flex">
                          <FormControl>
                            <Input type="number" {...field} className="rounded-r-none" />
                          </FormControl>
                          <div className="px-3 inline-flex items-center bg-muted border border-l-0 border-input rounded-r-md">
                            $
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="recurringLateFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Late Fee (recurring):</FormLabel>
                        <div className="flex">
                          <FormControl>
                            <Input type="number" {...field} className="rounded-r-none" />
                          </FormControl>
                          <div className="px-3 inline-flex items-center bg-muted border border-l-0 border-input rounded-r-md">
                            $
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-end">
                    <FormField
                      control={form.control}
                      name="recurringPeriod"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="invisible">Every:</FormLabel>
                          <FormControl>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Period" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Day">Day</SelectItem>
                                <SelectItem value="Week">Week</SelectItem>
                                <SelectItem value="Month">Month</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="ml-2 mb-2">every:</div>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="maxLateFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Late Fee:</FormLabel>
                        <div className="flex">
                          <FormControl>
                            <Input type="number" {...field} className="rounded-r-none" />
                          </FormControl>
                          <div className="px-3 inline-flex items-center bg-muted border border-l-0 border-input rounded-r-md">
                            %
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="applyTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apply for:</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Rental Income">Rental Income</SelectItem>
                            <SelectItem value="All Income">All Income</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="saveAs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Save as:</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Action" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Add to existing">Add to existing</SelectItem>
                            <SelectItem value="Replace existing">Replace existing</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="pt-4">
                  <h3 className="font-medium mb-2">
                    {applyToAll 
                      ? "Summary for all properties (all units)"
                      : "Summary for 320 Jay St, Unit main"}
                  </h3>
                  <p className="text-sm mb-1">
                    First late fee 10 dollar amount will be applied 5 days after rent is due.
                  </p>
                  <p className="text-sm mb-4">
                    After that, an additional 5 dollar amount will be applied each following day.
                  </p>
                  
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <span className="mr-2">Sample charge amount: $</span>
                      <Input 
                        type="number" 
                        value="1200"
                        className="w-32 h-8" 
                      />
                    </div>
                    
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="px-4 py-2 text-left font-medium">Days Late</th>
                            <th className="px-4 py-2 text-left font-medium">Late Fee Applied This Day</th>
                            <th className="px-4 py-2 text-left font-medium">Total Late Fee</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[0, 1, 2, 3, 4, 5, 6, 7].map((day) => (
                            <tr key={day} className="border-t">
                              <td className="px-4 py-2">{day}</td>
                              <td className="px-4 py-2">
                                {day === 5 ? "$10.00" : day > 5 ? "$5.00" : "-"}
                              </td>
                              <td className="px-4 py-2">
                                {day >= 5 ? `$${10 + (day - 5) * 5}.00` : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => navigate("/rent/late-fee-rules")}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Rule
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddLateFeeRule;
