import { useState } from "react";
import { useLocation } from "wouter";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Eye, 
  FileText 
} from "lucide-react";

// Base form schema for the application template
const formSchema = z.object({
  name: z.string().min(1, { message: "Template name is required" }),
  description: z.string().optional(),
  applicationFee: z.string().optional(),
  isDefault: z.boolean().default(false),
  // Fields will be a dynamic JSON structure
  fields: z.record(z.any()).optional(),
  // Form sections array to organize fields
  sections: z.array(z.object({
    title: z.string().min(1, { message: "Section title is required" }),
    description: z.string().optional(),
    fields: z.array(z.object({
      id: z.string(),
      name: z.string().min(1, { message: "Field name is required" }),
      label: z.string().min(1, { message: "Field label is required" }),
      type: z.string().min(1, { message: "Field type is required" }),
      required: z.boolean().default(false),
      placeholder: z.string().optional(),
      helpText: z.string().optional(),
      options: z.array(z.object({
        label: z.string(),
        value: z.string()
      })).optional(),
      validation: z.object({
        min: z.number().optional(),
        max: z.number().optional(),
        pattern: z.string().optional(),
        message: z.string().optional()
      }).optional()
    }))
  }))
});

type FormValues = z.infer<typeof formSchema>;

// Field type options
const fieldTypes = [
  { label: "Single Line Text", value: "text" },
  { label: "Paragraph Text", value: "textarea" },
  { label: "Number", value: "number" },
  { label: "Email", value: "email" },
  { label: "Phone", value: "tel" },
  { label: "Date", value: "date" },
  { label: "Select Dropdown", value: "select" },
  { label: "Radio Button Group", value: "radio" },
  { label: "Checkbox", value: "checkbox" },
  { label: "Checkbox Group", value: "checkbox-group" },
  { label: "File Upload", value: "file" }
];

export default function CreateApplicationTemplate() {
  const [, navigate] = useLocation();
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  // Form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      applicationFee: "",
      isDefault: false,
      fields: {},
      sections: [
        {
          title: "Personal Information",
          description: "Basic applicant information",
          fields: [
            {
              id: "firstName",
              name: "firstName",
              label: "First Name",
              type: "text",
              required: true,
              placeholder: "Enter first name",
              helpText: "Legal first name as it appears on ID"
            },
            {
              id: "lastName",
              name: "lastName",
              label: "Last Name",
              type: "text",
              required: true,
              placeholder: "Enter last name",
              helpText: "Legal last name as it appears on ID"
            },
            {
              id: "email",
              name: "email",
              label: "Email Address",
              type: "email",
              required: true,
              placeholder: "Enter email address",
              helpText: "We'll use this to communicate about your application"
            },
            {
              id: "phone",
              name: "phone",
              label: "Phone Number",
              type: "tel",
              required: true,
              placeholder: "Enter phone number",
              helpText: "Primary contact number"
            }
          ]
        }
      ]
    }
  });

  // Create field arrays for dynamic sections and fields
  const { fields: sections, append: appendSection, remove: removeSection, move: moveSection } = 
    useFieldArray({
      control: form.control,
      name: "sections"
    });

  // Mutation for creating a template
  const createTemplateMutation = useMutation({
    mutationFn: (data: FormValues) => {
      // Convert the form structure to the expected API format
      const apiData = {
        name: data.name,
        description: data.description || null,
        applicationFee: data.applicationFee ? parseFloat(data.applicationFee) : null,
        isDefault: data.isDefault,
        fields: processFormFields(data.sections)
      };
      
      return apiRequest('/api/application-templates', 'POST', apiData);
    },
    onSuccess: () => {
      // Invalidate the templates query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/application-templates'] });
      
      toast({
        title: "Application Template Created",
        description: "Your template has been successfully created.",
        variant: "default",
      });
      
      // Navigate back to templates list
      navigate("/application-templates");
    },
    onError: (error) => {
      toast({
        title: "Failed to Create Template",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Process form data into the structured fields JSON
  function processFormFields(sections: any[]) {
    const fieldsObject: Record<string, any> = {};
    
    sections.forEach((section, sectionIndex) => {
      section.fields.forEach((field: any) => {
        fieldsObject[field.name] = {
          type: field.type,
          label: field.label,
          required: field.required,
          section: section.title,
          sectionIndex,
          placeholder: field.placeholder,
          helpText: field.helpText,
          options: field.options,
          validation: field.validation
        };
      });
    });
    
    return fieldsObject;
  }

  function onSubmit(data: FormValues) {
    createTemplateMutation.mutate(data);
  }

  // Helper function to get a nested field array for a specific section
  function getFieldArray(sectionIndex: number) {
    return useFieldArray({
      control: form.control,
      name: `sections.${sectionIndex}.fields`
    });
  }

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/application-templates")}
          className="mr-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Templates
        </Button>
        <h1 className="text-2xl font-bold">Create Application Template</h1>
      </div>

      <Tabs defaultValue="editor" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="editor">
              <FileText className="mr-2 h-4 w-4" />
              Template Editor
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="mr-2 h-4 w-4" />
              Preview Form
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate("/application-templates")}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={createTemplateMutation.isPending}
              onClick={form.handleSubmit(onSubmit)}
            >
              {createTemplateMutation.isPending ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Template
                </>
              )}
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TabsContent value="editor" className="mt-0">
              {/* Template Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Template Details</CardTitle>
                  <CardDescription>
                    Basic information about your application template
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Template Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Standard Rental Application" {...field} />
                          </FormControl>
                          <FormDescription>
                            A descriptive name for your application template
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="applicationFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Application Fee (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              min="0" 
                              placeholder="0.00" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Fee charged when applicants submit this application
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the purpose of this template..." 
                            className="min-h-[100px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Help you and your team understand when to use this template
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isDefault"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Set as Default Template
                          </FormLabel>
                          <FormDescription>
                            Make this the default template for new applications
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Sections Builder */}
              <Card>
                <CardHeader>
                  <CardTitle>Form Sections</CardTitle>
                  <CardDescription>
                    Organize your application into logical sections
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Accordion type="multiple" defaultValue={sections.map((_, i) => `section-${i}`)}>
                    {sections.map((section, sectionIndex) => {
                      const { fields: sectionFields, append: appendField, remove: removeField, move: moveField } = 
                        getFieldArray(sectionIndex);
                        
                      return (
                        <AccordionItem 
                          key={section.id} 
                          value={`section-${sectionIndex}`}
                          className="border rounded-md px-4"
                        >
                          <div className="flex items-center justify-between py-4">
                            <AccordionTrigger className="flex-1 no-underline">
                              <span className="font-medium">{section.title || `Section ${sectionIndex + 1}`}</span>
                            </AccordionTrigger>
                            <div className="flex items-center gap-1">
                              {sectionIndex > 0 && (
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => moveSection(sectionIndex, sectionIndex - 1)}
                                >
                                  <MoveUp className="h-4 w-4" />
                                </Button>
                              )}
                              {sectionIndex < sections.length - 1 && (
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => moveSection(sectionIndex, sectionIndex + 1)}
                                >
                                  <MoveDown className="h-4 w-4" />
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => removeSection(sectionIndex)}
                                disabled={sections.length <= 1}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <AccordionContent className="pb-4 pt-2">
                            <div className="space-y-6">
                              {/* Section details */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name={`sections.${sectionIndex}.title`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Section Title</FormLabel>
                                      <FormControl>
                                        <Input 
                                          placeholder="e.g., Personal Information" 
                                          {...field} 
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name={`sections.${sectionIndex}.description`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Section Description (Optional)</FormLabel>
                                      <FormControl>
                                        <Input 
                                          placeholder="Brief description of this section" 
                                          {...field} 
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              {/* Fields list */}
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h3 className="text-sm font-medium">Fields</h3>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => appendField({ 
                                      id: `field-${Date.now()}`,
                                      name: `field_${Date.now()}`,
                                      label: "New Field",
                                      type: "text",
                                      required: false,
                                      placeholder: "",
                                      helpText: ""
                                    })}
                                  >
                                    <Plus className="mr-1 h-4 w-4" />
                                    Add Field
                                  </Button>
                                </div>
                                
                                {sectionFields.length === 0 ? (
                                  <div className="text-center p-6 border border-dashed rounded-md">
                                    <p className="text-muted-foreground">No fields yet. Add your first field to this section.</p>
                                  </div>
                                ) : (
                                  <div className="space-y-4">
                                    {sectionFields.map((field, fieldIndex) => (
                                      <Card key={field.id} className="relative">
                                        <div className="absolute top-3 right-3 flex items-center gap-1">
                                          {fieldIndex > 0 && (
                                            <Button 
                                              variant="ghost" 
                                              size="icon"
                                              onClick={() => moveField(fieldIndex, fieldIndex - 1)}
                                            >
                                              <MoveUp className="h-4 w-4" />
                                            </Button>
                                          )}
                                          {fieldIndex < sectionFields.length - 1 && (
                                            <Button 
                                              variant="ghost" 
                                              size="icon"
                                              onClick={() => moveField(fieldIndex, fieldIndex + 1)}
                                            >
                                              <MoveDown className="h-4 w-4" />
                                            </Button>
                                          )}
                                          <Button 
                                            variant="ghost" 
                                            size="icon"
                                            onClick={() => removeField(fieldIndex)}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                        
                                        <CardContent className="pt-6">
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                              control={form.control}
                                              name={`sections.${sectionIndex}.fields.${fieldIndex}.label`}
                                              render={({ field }) => (
                                                <FormItem>
                                                  <FormLabel>Field Label</FormLabel>
                                                  <FormControl>
                                                    <Input 
                                                      placeholder="e.g., First Name" 
                                                      {...field} 
                                                    />
                                                  </FormControl>
                                                  <FormMessage />
                                                </FormItem>
                                              )}
                                            />
                                            
                                            <FormField
                                              control={form.control}
                                              name={`sections.${sectionIndex}.fields.${fieldIndex}.name`}
                                              render={({ field }) => (
                                                <FormItem>
                                                  <FormLabel>Field Name (ID)</FormLabel>
                                                  <FormControl>
                                                    <Input 
                                                      placeholder="e.g., firstName" 
                                                      {...field} 
                                                    />
                                                  </FormControl>
                                                  <FormDescription>
                                                    Used as the field's identifier in the data
                                                  </FormDescription>
                                                  <FormMessage />
                                                </FormItem>
                                              )}
                                            />
                                          </div>
                                          
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <FormField
                                              control={form.control}
                                              name={`sections.${sectionIndex}.fields.${fieldIndex}.type`}
                                              render={({ field }) => (
                                                <FormItem>
                                                  <FormLabel>Field Type</FormLabel>
                                                  <Select 
                                                    onValueChange={field.onChange} 
                                                    defaultValue={field.value}
                                                  >
                                                    <FormControl>
                                                      <SelectTrigger>
                                                        <SelectValue placeholder="Select field type" />
                                                      </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                      {fieldTypes.map(type => (
                                                        <SelectItem key={type.value} value={type.value}>
                                                          {type.label}
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
                                              name={`sections.${sectionIndex}.fields.${fieldIndex}.required`}
                                              render={({ field }) => (
                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-8">
                                                  <FormControl>
                                                    <Checkbox
                                                      checked={field.value}
                                                      onCheckedChange={field.onChange}
                                                    />
                                                  </FormControl>
                                                  <div className="space-y-1 leading-none">
                                                    <FormLabel>
                                                      Required Field
                                                    </FormLabel>
                                                    <FormDescription>
                                                      Applicants must complete this field
                                                    </FormDescription>
                                                  </div>
                                                </FormItem>
                                              )}
                                            />
                                          </div>
                                          
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <FormField
                                              control={form.control}
                                              name={`sections.${sectionIndex}.fields.${fieldIndex}.placeholder`}
                                              render={({ field }) => (
                                                <FormItem>
                                                  <FormLabel>Placeholder (Optional)</FormLabel>
                                                  <FormControl>
                                                    <Input 
                                                      placeholder="e.g., Enter your first name" 
                                                      {...field} 
                                                    />
                                                  </FormControl>
                                                  <FormMessage />
                                                </FormItem>
                                              )}
                                            />
                                            
                                            <FormField
                                              control={form.control}
                                              name={`sections.${sectionIndex}.fields.${fieldIndex}.helpText`}
                                              render={({ field }) => (
                                                <FormItem>
                                                  <FormLabel>Help Text (Optional)</FormLabel>
                                                  <FormControl>
                                                    <Input 
                                                      placeholder="e.g., As shown on your ID" 
                                                      {...field} 
                                                    />
                                                  </FormControl>
                                                  <FormMessage />
                                                </FormItem>
                                              )}
                                            />
                                          </div>
                                          
                                          {/* Additional options based on field type */}
                                          {(form.watch(`sections.${sectionIndex}.fields.${fieldIndex}.type`) === 'select' || 
                                            form.watch(`sections.${sectionIndex}.fields.${fieldIndex}.type`) === 'radio' || 
                                            form.watch(`sections.${sectionIndex}.fields.${fieldIndex}.type`) === 'checkbox-group') && (
                                            <div className="mt-4">
                                              <FormLabel>Options</FormLabel>
                                              <FormDescription className="mb-2">
                                                Define the choices for this field
                                              </FormDescription>
                                              
                                              {/* We would implement a dynamic list of options here */}
                                              <div className="border rounded-md p-3 bg-muted/30">
                                                <p className="text-sm text-muted-foreground">
                                                  Options editor would be implemented here for selects, radios, and checkboxes
                                                </p>
                                              </div>
                                            </div>
                                          )}
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendSection({
                      title: `New Section`,
                      description: "",
                      fields: []
                    })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Section
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preview" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>{form.watch("name") || "Application Form Preview"}</CardTitle>
                  <CardDescription>
                    {form.watch("description") || "This is how your application form will appear to applicants"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {form.watch("sections").map((section, index) => (
                      <div key={index} className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium">{section.title}</h3>
                          {section.description && (
                            <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
                          )}
                        </div>
                        
                        <div className="space-y-6 border-l-2 pl-6 py-2">
                          {section.fields.map((field, fieldIndex) => (
                            <div key={fieldIndex} className="space-y-2">
                              <div className="font-medium">
                                {field.label} 
                                {field.required && <span className="text-destructive ml-1">*</span>}
                              </div>
                              
                              {/* Render different input types based on field type */}
                              {(field.type === 'text' || field.type === 'email' || field.type === 'tel' || field.type === 'number') && (
                                <Input 
                                  type={field.type} 
                                  placeholder={field.placeholder} 
                                  disabled 
                                />
                              )}
                              
                              {field.type === 'textarea' && (
                                <Textarea 
                                  placeholder={field.placeholder} 
                                  disabled 
                                />
                              )}
                              
                              {field.type === 'date' && (
                                <Input 
                                  type="date" 
                                  disabled 
                                />
                              )}
                              
                              {field.type === 'select' && (
                                <Select disabled>
                                  <SelectTrigger>
                                    <SelectValue placeholder={field.placeholder || "Select an option"} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="placeholder">Sample Option</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                              
                              {field.type === 'checkbox' && (
                                <div className="flex items-center space-x-2">
                                  <Checkbox id={`preview-${field.id}`} disabled />
                                  <label htmlFor={`preview-${field.id}`} className="text-sm">
                                    {field.placeholder || "Checkbox option"}
                                  </label>
                                </div>
                              )}
                              
                              {field.helpText && (
                                <p className="text-sm text-muted-foreground">{field.helpText}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                  <Button variant="outline" disabled>Cancel</Button>
                  <Button disabled>Submit Application</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}