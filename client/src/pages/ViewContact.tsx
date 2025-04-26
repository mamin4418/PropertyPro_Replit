import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Globe, 
  Briefcase, 
  FileText, 
  Trash2, 
  Edit, 
  ArrowLeft, 
  Loader2 
} from "lucide-react";

import type { Contact } from "@shared/schema";

const ViewContact = () => {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Get contact ID from URL params
  const contactId = params?.id ? parseInt(params.id) : null;
  
  // Fetch contact data
  const { data: contact, isLoading, isError } = useQuery({
    queryKey: ['/api/contacts', contactId],
    queryFn: async () => {
      if (!contactId) throw new Error("No contact ID provided");
      const response = await fetch(`/api/contacts/${contactId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch contact");
      }
      return response.json() as Promise<Contact>;
    },
    enabled: !!contactId,
  });

  // Delete contact mutation
  const { mutate: deleteContact, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      if (!contactId) throw new Error("No contact ID provided");
      return apiRequest(`/api/contacts/${contactId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      toast({
        title: "Contact deleted",
        description: "The contact has been deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
      navigate("/contacts");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete contact. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to delete contact:", error);
    },
  });

  // Function to format the contact type with proper capitalization
  const formatContactType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Function to get appropriate icon based on contact type
  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case "tenant":
        return <User className="h-4 w-4" />;
      case "owner":
        return <Building className="h-4 w-4" />;
      case "vendor":
        return <Briefcase className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  // Function to get appropriate badge color based on contact type
  const getContactTypeBadgeStyle = (type: string) => {
    switch (type) {
      case "tenant":
        return "bg-blue-100 text-blue-800";
      case "owner":
        return "bg-purple-100 text-purple-800";
      case "vendor":
        return "bg-orange-100 text-orange-800";
      case "employee":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mb-2 mx-auto" />
          <p>Loading contact information...</p>
        </div>
      </div>
    );
  }

  if (isError || !contact) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center p-10">
          <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
          <p className="mb-6">Failed to load contact information</p>
          <Button onClick={() => navigate("/contacts")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contacts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate("/contacts")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Contacts
        </Button>
        <div className="space-x-2">
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the contact 
                  "{contact.firstName} {contact.lastName}" and remove their data from the server.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => deleteContact()}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button 
            variant="outline" 
            onClick={() => navigate(`/edit-contact/${contact.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 gap-6">
        {/* Contact Header */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">
                  {contact.firstName} {contact.lastName}
                </CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <Badge 
                    variant="outline"
                    className={`flex items-center space-x-1 ${getContactTypeBadgeStyle(contact.contactType)}`}
                  >
                    {getContactTypeIcon(contact.contactType)}
                    <span>{formatContactType(contact.contactType)}</span>
                  </Badge>
                  
                  {contact.title && (
                    <span className="ml-2 text-muted-foreground">
                      • {contact.title}
                    </span>
                  )}
                  
                  {contact.companyName && (
                    <span className="ml-2 text-muted-foreground">
                      • {contact.companyName}
                    </span>
                  )}
                </CardDescription>
              </div>
              <Badge
                variant={contact.status === "active" ? "default" : 
                      contact.status === "inactive" ? "secondary" : "outline"}
              >
                {formatContactType(contact.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-medium mb-3">Contact Information</h3>
                <div className="space-y-3">
                  {contact.email && (
                    <div className="flex items-start space-x-3">
                      <Mail className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm">{contact.email}</p>
                      </div>
                    </div>
                  )}
                  
                  {contact.phone && (
                    <div className="flex items-start space-x-3">
                      <Phone className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Primary Phone</p>
                        <p className="text-sm">{contact.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {contact.alternatePhone && (
                    <div className="flex items-start space-x-3">
                      <Phone className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Alternate Phone</p>
                        <p className="text-sm">{contact.alternatePhone}</p>
                      </div>
                    </div>
                  )}
                  
                  {contact.website && (
                    <div className="flex items-start space-x-3">
                      <Globe className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Website</p>
                        <p className="text-sm">
                          <a 
                            href={contact.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {contact.website}
                          </a>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Address Information */}
              <div>
                <h3 className="text-lg font-medium mb-3">Address</h3>
                {(contact.address || contact.city || contact.state) ? (
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      {contact.address && <p className="text-sm">{contact.address}</p>}
                      {(contact.city || contact.state || contact.zipcode) && (
                        <p className="text-sm">
                          {[
                            contact.city, 
                            contact.state, 
                            contact.zipcode
                          ].filter(Boolean).join(", ")}
                        </p>
                      )}
                      {contact.country && <p className="text-sm">{contact.country}</p>}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No address information provided</p>
                )}
              </div>
            </div>
            
            {/* Notes Section */}
            {contact.notes && (
              <>
                <Separator className="my-6" />
                <div>
                  <h3 className="text-lg font-medium mb-3">Notes</h3>
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <p className="text-sm whitespace-pre-wrap">{contact.notes}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewContact;