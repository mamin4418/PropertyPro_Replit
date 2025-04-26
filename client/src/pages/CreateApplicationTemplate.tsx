import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, FileCheck, Loader2 } from 'lucide-react';

import FormBuilder from '@/components/forms/FormBuilder';

interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  options?: { id: string; label: string; value: string }[];
  section?: string;
  validation?: any;
}

interface FormSection {
  id: string;
  title: string;
  description?: string;
}

const CreateApplicationTemplate = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Template details state
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [applicationFee, setApplicationFee] = useState<string>('');
  const [isDefault, setIsDefault] = useState<boolean>(false);
  
  // Form builder state
  const [fields, setFields] = useState<FormField[]>([]);
  const [sections, setSections] = useState<FormSection[]>([
    { id: 'default', title: 'General Information' }
  ]);
  
  // Template creation mutation
  const { mutate: createTemplate, isPending } = useMutation({
    mutationFn: async (templateData: any) => {
      return apiRequest('POST', '/api/application-templates', templateData);
    },
    onSuccess: async (response) => {
      toast({
        title: 'Success',
        description: 'Application template has been created',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/application-templates'] });
      
      try {
        const data = await response.json();
        navigate('/application-templates');
      } catch (error) {
        navigate('/application-templates');
      }
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create template. Please try again.',
        variant: 'destructive',
      });
      console.error('Failed to create template:', error);
    },
  });
  
  // Handle form fields update from the FormBuilder
  const handleFormUpdate = (updatedFields: FormField[], updatedSections: FormSection[]) => {
    setFields(updatedFields);
    setSections(updatedSections);
  };
  
  // Handle template save
  const handleSave = () => {
    // Validate required fields
    if (!name.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please provide a template name.',
        variant: 'destructive',
      });
      return;
    }
    
    // Create the template data structure
    const templateData = {
      name,
      description,
      applicationFee: applicationFee ? parseFloat(applicationFee) : null,
      isDefault,
      fields: {
        sections: sections.map(section => ({
          id: section.id,
          title: section.title,
          description: section.description || '',
        })),
        formFields: fields.map(field => ({
          id: field.id,
          type: field.type,
          label: field.label,
          placeholder: field.placeholder || '',
          helpText: field.helpText || '',
          required: field.required,
          options: field.options || [],
          section: field.section || 'default',
          validation: field.validation || {},
        })),
      },
    };
    
    // Submit the template
    createTemplate(templateData);
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/application-templates')}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Templates
          </Button>
          <h1 className="text-2xl font-bold">Create Application Template</h1>
          <p className="text-muted-foreground">
            Design a custom application form for your tenant screening process
          </p>
        </div>
        <div>
          <Button 
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Template
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="details">
        <TabsList className="w-full justify-start mb-6">
          <TabsTrigger value="details">Template Details</TabsTrigger>
          <TabsTrigger value="form">Form Builder</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Template Information</CardTitle>
              <CardDescription>
                Basic information about the application template
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="template-name">Template Name <span className="text-destructive">*</span></Label>
                <Input
                  id="template-name"
                  placeholder="e.g., Standard Rental Application"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  A descriptive name to identify this template
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-description">Description</Label>
                <Textarea
                  id="template-description"
                  placeholder="Detailed description of this application template"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Explain the purpose of this template and when it should be used
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="application-fee">Application Fee ($)</Label>
                <Input
                  id="application-fee"
                  placeholder="0.00"
                  type="number"
                  min="0"
                  step="0.01"
                  value={applicationFee}
                  onChange={(e) => setApplicationFee(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Fee charged to applicants using this application form (leave blank for no fee)
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is-default"
                  checked={isDefault}
                  onCheckedChange={setIsDefault}
                />
                <Label htmlFor="is-default">Set as Default Template</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="form">
          <FormBuilder 
            initialFields={fields}
            initialSections={sections}
            onChange={handleFormUpdate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateApplicationTemplate;