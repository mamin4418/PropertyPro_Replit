
import { useState } from "react";
import { useLocation } from "wouter";
import { 
  ArrowLeft, 
  FileText, 
  Send, 
  Plus, 
  Trash2, 
  Calendar, 
  User,
  Upload,
  Download,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

// Mock data for templates
const templates = [
  { id: 1, name: "Standard Lease Agreement", type: "lease" },
  { id: 2, name: "Month-to-Month Lease", type: "lease" },
  { id: 3, name: "Commercial Lease", type: "lease" },
  { id: 4, name: "Vendor Service Contract", type: "vendor" },
  { id: 5, name: "Maintenance Agreement", type: "maintenance" },
];

// Mock data for properties
const properties = [
  { id: 1, name: "Sunset Heights" },
  { id: 2, name: "Maple Gardens" },
  { id: 3, name: "Urban Lofts" },
  { id: 4, name: "Riverfront Condos" },
];

// Mock data for tenants
const tenants = [
  { id: 1, name: "John Doe", email: "john.doe@example.com" },
  { id: 2, name: "Sarah Johnson", email: "sarah.j@example.com" },
  { id: 3, name: "Mike Smith", email: "mike.smith@example.com" },
  { id: 4, name: "Jennifer Lee", email: "jennifer.lee@example.com" },
];

// Mock data for vendors
const vendors = [
  { id: 1, name: "ABC Plumbing", email: "service@abcplumbing.com" },
  { id: 2, name: "CleanPro Services", email: "contracts@cleanpro.com" },
  { id: 3, name: "Green Landscaping", email: "info@greenlandscaping.com" },
  { id: 4, name: "QuickFix Maintenance", email: "jobs@quickfix.com" },
];

const CreateDocument = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    templateId: "",
    documentType: "lease",
    propertyId: "",
    recipientType: "tenant",
    recipientId: "",
    recipientEmail: "",
    message: "",
    expirationDays: "14",
    allowDownload: true,
    requestInitials: true,
    reminderDays: "3",
  });

  const [fields, setFields] = useState([
    { id: 1, name: "Tenant Name", required: true },
    { id: 2, name: "Property Address", required: true },
    { id: 3, name: "Lease Term", required: true },
    { id: 4, name: "Monthly Rent", required: true },
    { id: 5, name: "Security Deposit", required: true },
  ]);

  const [files, setFiles] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-fill recipient email if selecting from dropdown
    if (name === "recipientId" && value) {
      const recipientType = formData.recipientType;
      const recipients = recipientType === "tenant" ? tenants : vendors;
      const recipient = recipients.find(r => r.id === parseInt(value));
      if (recipient) {
        setFormData(prev => ({ ...prev, recipientEmail: recipient.email }));
      }
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset recipient when recipient type changes
    if (name === "recipientType") {
      setFormData(prev => ({ ...prev, recipientId: "", recipientEmail: "" }));
    }
    
    // Update fields when template changes
    if (name === "templateId") {
      // In a real app, we would fetch the template fields from the API
      // For now, we'll just use the default fields
    }
  };

  const handleAddField = () => {
    const newId = Math.max(0, ...fields.map(f => f.id)) + 1;
    setFields([...fields, { id: newId, name: "", required: false }]);
  };

  const handleRemoveField = (id: number) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const handleUpdateField = (id: number, name: string, value: any) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, [name]: value } : field
    ));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFiles(prev => [...prev, ...fileArray]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.templateId || !formData.recipientEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, we would send the form data to the server
    console.log("Form submitted:", { formData, fields, files });
    
    toast({
      title: "Document Sent",
      description: "The document has been sent for signature."
    });
    
    navigate("/document-signing");
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-4" onClick={() => navigate("/document-signing")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documents
        </Button>
        <h2 className="text-2xl font-bold">Create Document for Signature</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Document Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter a title for this document"
                    className="mt-1"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="documentType">Document Type</Label>
                    <Select
                      value={formData.documentType}
                      onValueChange={(value) => handleSelectChange("documentType", value)}
                    >
                      <SelectTrigger id="documentType" className="mt-1">
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lease">Lease Agreement</SelectItem>
                        <SelectItem value="vendor">Vendor Contract</SelectItem>
                        <SelectItem value="maintenance">Maintenance Agreement</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="templateId">Template</Label>
                    <Select
                      value={formData.templateId}
                      onValueChange={(value) => handleSelectChange("templateId", value)}
                    >
                      <SelectTrigger id="templateId" className="mt-1">
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates
                          .filter(t => t.type === formData.documentType || formData.documentType === "other")
                          .map(template => (
                            <SelectItem key={template.id} value={template.id.toString()}>
                              {template.name}
                            </SelectItem>
                          ))}
                        <SelectItem value="custom">Custom Document</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="propertyId">Related Property (Optional)</Label>
                  <Select
                    value={formData.propertyId}
                    onValueChange={(value) => handleSelectChange("propertyId", value)}
                  >
                    <SelectTrigger id="propertyId" className="mt-1">
                      <SelectValue placeholder="Select property" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {properties.map(property => (
                        <SelectItem key={property.id} value={property.id.toString()}>
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-2">Document Content</h3>
                  <Separator className="mb-4" />
                  
                  <div className="space-y-4">
                    {fields.map((field) => (
                      <div key={field.id} className="flex items-center space-x-2">
                        <Input
                          value={field.name}
                          onChange={(e) => handleUpdateField(field.id, "name", e.target.value)}
                          placeholder="Field name"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleRemoveField(field.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddField}
                      className="w-full mt-2"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Field
                    </Button>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-2">Attachments</h3>
                  <Separator className="mb-4" />
                  
                  <div className="space-y-4">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between py-2 px-3 border rounded-md">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-blue-500" />
                          <span>{file.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive h-8 w-8"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <div className="mt-1">
                      <Label htmlFor="file" className="sr-only">Choose file</Label>
                      <Input
                        id="file"
                        type="file"
                        onChange={handleFileChange}
                        className="mt-1"
                        multiple
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recipient Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="recipientType">Recipient Type</Label>
                  <Select
                    value={formData.recipientType}
                    onValueChange={(value) => handleSelectChange("recipientType", value)}
                  >
                    <SelectTrigger id="recipientType" className="mt-1">
                      <SelectValue placeholder="Select recipient type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tenant">Tenant</SelectItem>
                      <SelectItem value="vendor">Vendor</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="recipientId">Select Recipient</Label>
                  <Select
                    value={formData.recipientId}
                    onValueChange={(value) => handleSelectChange("recipientId", value)}
                  >
                    <SelectTrigger id="recipientId" className="mt-1">
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.recipientType === "tenant" ? (
                        tenants.map(tenant => (
                          <SelectItem key={tenant.id} value={tenant.id.toString()}>
                            {tenant.name}
                          </SelectItem>
                        ))
                      ) : formData.recipientType === "vendor" ? (
                        vendors.map(vendor => (
                          <SelectItem key={vendor.id} value={vendor.id.toString()}>
                            {vendor.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="custom">Custom Recipient</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="recipientEmail">Recipient Email</Label>
                  <Input
                    id="recipientEmail"
                    name="recipientEmail"
                    type="email"
                    value={formData.recipientEmail}
                    onChange={handleChange}
                    placeholder="Email address"
                    className="mt-1"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Message to Recipient</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Enter a message for the recipient"
                    className="mt-1"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Signing Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="expirationDays">Document Expires After</Label>
                  <Select
                    value={formData.expirationDays}
                    onValueChange={(value) => handleSelectChange("expirationDays", value)}
                  >
                    <SelectTrigger id="expirationDays" className="mt-1">
                      <SelectValue placeholder="Select expiration period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="reminderDays">Send Reminder After</Label>
                  <Select
                    value={formData.reminderDays}
                    onValueChange={(value) => handleSelectChange("reminderDays", value)}
                  >
                    <SelectTrigger id="reminderDays" className="mt-1">
                      <SelectValue placeholder="Select reminder period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="5">5 days</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="never">No reminders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end mt-6 gap-3">
              <Button variant="outline" type="button" onClick={() => navigate("/document-signing")}>
                Cancel
              </Button>
              <Button type="submit">
                <Send className="mr-2 h-4 w-4" />
                Send for Signature
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateDocument;
