import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { 
  User, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Briefcase, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

import type { Contact } from "@shared/schema";

const ViewContact = () => {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Get contact ID from URL params
  const contactId = params?.id ? parseInt(params.id) : null;

  // Fetch contact data
  const { 
    data: contact, 
    isLoading, 
    isError,
    error
  } = useQuery({
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
      return apiRequest('DELETE', `/api/contacts/${contactId}`);
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

  // Function to handle delete confirmation
  const handleDelete = () => {
    deleteContact();
    setDeleteDialogOpen(false);
  };

  // Function to get appropriate icon based on contact type
  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case "tenant":
        return <User className="h-4 w-4" />;
      case "owner":
        return <Building2 className="h-4 w-4" />;
      case "vendor":
        return <Briefcase className="h-4 w-4" />;
      case "employee":
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

  if (isError) {
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

  if (!contact) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center p-10">
          <h2 className="text-2xl font-bold mb-4">Contact Not Found</h2>
          <p className="mb-6">The requested contact could not be found</p>
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
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => navigate(`/edit-contact/${contactId}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Contact</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this contact? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{contact.firstName} {contact.lastName}</h1>
          <div className="flex items-center gap-3">
            <Badge 
              variant="outline"
              className={`flex items-center space-x-1 ${getContactTypeBadgeStyle(contact.contactType)}`}
            >
              {getContactTypeIcon(contact.contactType)}
              <span>
                {contact.contactType.charAt(0).toUpperCase() + contact.contactType.slice(1)}
              </span>
            </Badge>
            <Badge 
              variant={contact.status === "active" ? "default" : 
                     contact.status === "inactive" ? "secondary" : "outline"}
            >
              {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contact.email && (
                <div className="flex items-start gap-2">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">{contact.email}</p>
                  </div>
                </div>
              )}
              
              {contact.phone && (
                <div className="flex items-start gap-2">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">{contact.phone}</p>
                  </div>
                </div>
              )}
              
              {contact.alternatePhone && (
                <div className="flex items-start gap-2">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Alternate Phone</p>
                    <p className="text-muted-foreground">{contact.alternatePhone}</p>
                  </div>
                </div>
              )}
              
              {(contact.address || contact.city || contact.state || contact.zipcode || contact.country) && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <div className="text-muted-foreground">
                      {contact.address && <p>{contact.address}</p>}
                      {(contact.city || contact.state || contact.zipcode) && (
                        <p>
                          {contact.city}{contact.city && contact.state ? ", " : ""}
                          {contact.state} {contact.zipcode}
                        </p>
                      )}
                      {contact.country && <p>{contact.country}</p>}
                    </div>
                  </div>
                </div>
              )}
              
              {contact.website && (
                <div className="flex items-start gap-2">
                  <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Website</p>
                    <a 
                      href={contact.website.startsWith('http') ? contact.website : `https://${contact.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {contact.website}
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contact.companyName && (
                <div className="flex items-start gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Company</p>
                    <p className="text-muted-foreground">{contact.companyName}</p>
                  </div>
                </div>
              )}
              
              {contact.title && (
                <div className="flex items-start gap-2">
                  <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Job Title</p>
                    <p className="text-muted-foreground">{contact.title}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Notes */}
        {contact.notes && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{contact.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ViewContact;