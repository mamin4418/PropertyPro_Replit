import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { CommunicationTemplate } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditCommunicationTemplate() {
  const { id } = useParams<{ id: string }>();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [template, setTemplate] = useState<Partial<CommunicationTemplate>>({
    name: "",
    subject: "",
    body: "",
    category: "general",
    tags: []
  });

  // Fetch template data
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/communication/templates", id],
    queryFn: async () => {
      const response = await fetch(`/api/communication/templates/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch template");
      }
      return response.json();
    },
    enabled: !!id
  });

  // Update template with fetched data once available
  useEffect(() => {
    if (data) {
      setTemplate(data);
    }
  }, [data]);

  // Update template mutation
  const updateTemplateMutation = useMutation({
    mutationFn: async (updatedTemplate: Partial<CommunicationTemplate>) => {
      const response = await fetch(`/api/communication/templates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTemplate),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update template");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/communication/templates"] });
      queryClient.invalidateQueries({ queryKey: ["/api/communication/templates", id] });
      toast({
        title: "Success",
        description: "Template updated successfully",
      });
      setLocation("/communication-templates");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTemplate({ ...template, [name]: value });
  };

  const handleSelectChange = (value: string) => {
    setTemplate({ ...template, category: value });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTemplateMutation.mutate(template);
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => setLocation("/communication-templates")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
        <div className="p-6 text-center">
          <p className="text-red-500">Error loading template: {(error as Error).message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => setLocation("/communication-templates")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold ml-4">Edit Communication Template</h1>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div className="space-y-2">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              name="name"
              value={template.name || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={template.category || "general"} 
              onValueChange={handleSelectChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="tenant">Tenant</SelectItem>
                <SelectItem value="property">Property</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="rental">Rental</SelectItem>
                <SelectItem value="application">Application</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              name="subject"
              value={template.subject || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="body">Template Body</Label>
            <Textarea
              id="body"
              name="body"
              value={template.body || ""}
              onChange={handleInputChange}
              rows={10}
              required
            />
            <p className="text-sm text-muted-foreground">
              Use placeholders like {'{firstName}'}, {'{propertyName}'}, etc. for dynamic content
            </p>
          </div>
          
          <div className="flex space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/communication-templates")}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={updateTemplateMutation.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              {updateTemplateMutation.isPending ? "Saving..." : "Save Template"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}