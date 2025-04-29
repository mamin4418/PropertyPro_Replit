
import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, FileText, PlusCircle, Edit, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Mock data for templates
const mockTemplates = [
  {
    id: 1,
    name: "Standard Lease Agreement",
    type: "lease",
    description: "Default lease agreement for residential properties",
    created: "2023-01-15",
    lastUsed: "2023-05-10",
    usageCount: 24
  },
  {
    id: 2,
    name: "Month-to-Month Lease",
    type: "lease",
    description: "Short-term lease agreement with monthly renewal",
    created: "2023-02-03",
    lastUsed: "2023-05-01",
    usageCount: 8
  },
  {
    id: 3,
    name: "Commercial Lease",
    type: "lease",
    description: "Lease agreement for commercial properties",
    created: "2023-01-20",
    lastUsed: "2023-04-15",
    usageCount: 5
  },
  {
    id: 4,
    name: "Vendor Service Contract",
    type: "vendor",
    description: "Standard contract for service vendors",
    created: "2023-03-05",
    lastUsed: "2023-05-12",
    usageCount: 12
  },
  {
    id: 5,
    name: "Maintenance Agreement",
    type: "maintenance",
    description: "Agreement for recurring property maintenance",
    created: "2023-03-10",
    lastUsed: "2023-04-20",
    usageCount: 7
  }
];

const DocumentTemplates = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [templates, setTemplates] = useState(mockTemplates);
  const [searchTerm, setSearchTerm] = useState("");
  const [templateType, setTemplateType] = useState("all");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<number | null>(null);
  
  // Filter templates based on search term and template type
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = templateType === "all" || template.type === templateType;
    return matchesSearch && matchesType;
  });
  
  const handleCreateTemplate = () => {
    navigate("/generate-lease-template");
  };
  
  const handleEditTemplate = (templateId: number) => {
    navigate(`/generate-lease-template?templateId=${templateId}`);
  };
  
  const handleDeleteTemplate = (templateId: number) => {
    setTemplateToDelete(templateId);
    setShowDeleteDialog(true);
  };
  
  const confirmDeleteTemplate = () => {
    if (templateToDelete !== null) {
      setTemplates(templates.filter(t => t.id !== templateToDelete));
      toast({
        title: "Template Deleted",
        description: "The template has been deleted successfully."
      });
      setShowDeleteDialog(false);
      setTemplateToDelete(null);
    }
  };
  
  const handleDuplicateTemplate = (templateId: number) => {
    const templateToDuplicate = templates.find(t => t.id === templateId);
    if (templateToDuplicate) {
      const newTemplate = {
        ...templateToDuplicate,
        id: Math.max(...templates.map(t => t.id)) + 1,
        name: `${templateToDuplicate.name} (Copy)`,
        created: new Date().toISOString().split('T')[0],
        lastUsed: "",
        usageCount: 0
      };
      setTemplates([...templates, newTemplate]);
      toast({
        title: "Template Duplicated",
        description: "The template has been duplicated successfully."
      });
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-4" onClick={() => navigate("/document-signing")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documents
        </Button>
        <h2 className="text-2xl font-bold">Document Templates</h2>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Button onClick={handleCreateTemplate}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Template
        </Button>
        
        <div className="flex gap-3">
          <Select
            value={templateType}
            onValueChange={setTemplateType}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="lease">Lease Agreements</SelectItem>
              <SelectItem value="vendor">Vendor Contracts</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[250px]"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Usage Count</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>
                    {template.type === "lease" ? "Lease Agreement" : 
                     template.type === "vendor" ? "Vendor Contract" : 
                     template.type === "maintenance" ? "Maintenance" : template.type}
                  </TableCell>
                  <TableCell>{template.description}</TableCell>
                  <TableCell>{template.created}</TableCell>
                  <TableCell>{template.lastUsed || "Never"}</TableCell>
                  <TableCell>{template.usageCount}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditTemplate(template.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDuplicateTemplate(template.id)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteTemplate(template.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredTemplates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No templates found. Create your first template to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteTemplate}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentTemplates;
