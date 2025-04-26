import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  FileText, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Copy,
  Trash2, 
  FileCheck,
  CheckCircle,
  FileQuestion
} from "lucide-react";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import type { ApplicationTemplate } from "@shared/schema";

const ApplicationTemplates = () => {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<ApplicationTemplate | null>(null);
  const [viewTemplateDialog, setViewTemplateDialog] = useState(false);
  const [deleteTemplateDialog, setDeleteTemplateDialog] = useState(false);

  // Fetch application templates
  const { data: templates, isLoading, isError } = useQuery({
    queryKey: ['/api/application-templates'],
    queryFn: async () => {
      const response = await fetch('/api/application-templates');
      if (!response.ok) {
        throw new Error("Failed to fetch application templates");
      }
      return response.json() as Promise<ApplicationTemplate[]>;
    },
  });

  // Filter templates based on search query
  const filteredTemplates = templates ? templates
    .filter(template => 
      searchQuery === "" || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

  // Handle template view
  const handleViewTemplate = (template: ApplicationTemplate) => {
    setSelectedTemplate(template);
    setViewTemplateDialog(true);
  };

  // Handle template delete
  const handleDeleteTemplate = (template: ApplicationTemplate) => {
    setSelectedTemplate(template);
    setDeleteTemplateDialog(true);
  };

  // Format template fields for display
  const formatTemplateFields = (fields: any) => {
    if (!fields) return "No fields defined";
    
    try {
      const fieldCount = Object.keys(fields).length;
      return `${fieldCount} ${fieldCount === 1 ? 'field' : 'fields'} defined`;
    } catch (error) {
      return "Invalid field structure";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mb-2 mx-auto" />
          <p>Loading application templates...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center p-10">
          <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
          <p className="mb-6">Failed to load application templates</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Application Templates</h1>
          <p className="text-muted-foreground">
            Create and manage customizable application forms
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/custom-fields")}>
            <FileQuestion className="mr-2 h-4 w-4" />
            Custom Fields
          </Button>
          <Button onClick={() => navigate("/create-template")} variant="default">
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>All Templates</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search templates..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <CardDescription>
            A list of all application templates in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Template Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Fields</TableHead>
                <TableHead>Default</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-32">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <FileText className="h-8 w-8 mb-2" />
                      <p>No templates found. Start by creating a new template.</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => navigate("/create-template")}
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        New Template
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.name}</TableCell>
                    <TableCell>
                      {template.description 
                        ? template.description.length > 50 
                            ? template.description.substring(0, 50) + '...' 
                            : template.description 
                        : "—"}
                    </TableCell>
                    <TableCell>{formatTemplateFields(template.fields)}</TableCell>
                    <TableCell>
                      {template.isDefault ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Default
                        </Badge>
                      ) : "—"}
                    </TableCell>
                    <TableCell>
                      {template.applicationFee 
                        ? `$${template.applicationFee}` 
                        : "No fee"}
                    </TableCell>
                    <TableCell>
                      {template.updatedAt 
                        ? format(new Date(template.updatedAt), "MMM d, yyyy") 
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewTemplate(template)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/edit-template/${template.id}`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Template
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          {!template.isDefault && (
                            <DropdownMenuItem>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Set as Default
                            </DropdownMenuItem>
                          )}
                          {!template.isDefault && (
                            <DropdownMenuItem onClick={() => handleDeleteTemplate(template)} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Template Dialog */}
      <Dialog open={viewTemplateDialog} onOpenChange={setViewTemplateDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              {selectedTemplate?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Template ID</h3>
                <p>{selectedTemplate?.id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Application Fee</h3>
                <p>{selectedTemplate?.applicationFee ? `$${selectedTemplate.applicationFee}` : "No fee"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Default Template</h3>
                <p>{selectedTemplate?.isDefault ? "Yes" : "No"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Created By</h3>
                <p>{selectedTemplate?.createdBy || "System"}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Form Fields</h3>
              {selectedTemplate?.fields ? (
                <div className="border rounded-lg p-4 bg-muted/50">
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(selectedTemplate.fields, null, 2)}
                  </pre>
                </div>
              ) : (
                <p className="text-muted-foreground">No fields defined</p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewTemplateDialog(false)}>Close</Button>
            <Button onClick={() => {
              setViewTemplateDialog(false);
              navigate(`/edit-template/${selectedTemplate?.id}`);
            }}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Template Confirmation Dialog */}
      <Dialog open={deleteTemplateDialog} onOpenChange={setDeleteTemplateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the template "{selectedTemplate?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTemplateDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => {
              // Delete template logic would go here
              setDeleteTemplateDialog(false);
            }}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationTemplates;