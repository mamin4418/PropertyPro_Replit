
import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Building2, ArrowLeft, Edit, Trash2, Loader2, BuildingIcon, MapPin, Phone, Mail, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const ViewCompany = () => {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: company, isLoading, isError } = useQuery({
    queryKey: [`/api/companies/${id}`],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      return {
        id: parseInt(id),
        legalName: "Cornerstone Properties LLC",
        companyName: "Cornerstone Properties",
        ein: "12-3456789",
        email: "info@cornerstoneproperties.com",
        phone: "(555) 123-4567",
        type: "LLC",
        status: "active",
        createdAt: "2023-04-15T12:00:00Z",
        properties: [
          { id: 1, name: "Oakwood Apartments", address: "123 Main St, Anytown, CA", units: 12 },
          { id: 2, name: "Sunset Heights", address: "456 Park Ave, Anytown, CA", units: 8 }
        ],
        notes: "Established in 2018. Primary focus on residential apartment buildings."
      };
    }
  });

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mb-2 mx-auto" />
          <p>Loading company information...</p>
        </div>
      </div>
    );
  }

  if (isError || !company) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center p-10">
          <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
          <p className="mb-6">Failed to load company information</p>
          <Button onClick={() => navigate("/companies")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Companies
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/companies")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">{company.companyName}</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => navigate(`/edit-company/${id}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete {company.companyName} and remove all associated properties and data.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Legal Name</p>
                  <p>{company.legalName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Company Type</p>
                  <p>{company.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">EIN (Tax ID)</p>
                  <p>{company.ein || "Not specified"}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p>{company.email || "Not specified"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p>{company.phone || "Not specified"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    company.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {company.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{company.notes}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="properties" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Properties</h2>
            <Button onClick={() => navigate("/add-property")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </div>
          
          {company.properties && company.properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {company.properties.map((property) => (
                <Card 
                  key={property.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => navigate(`/view-property/${property.id}`)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{property.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                      <span className="text-sm">{property.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{property.units} units</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-4">No properties associated with this company yet.</p>
                <Button onClick={() => navigate("/add-property")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Property
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Contacts</h2>
            <Button onClick={() => navigate("/add-contact")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">No contacts associated with this company yet.</p>
              <Button onClick={() => navigate("/add-contact")}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Contact
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Documents</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center justify-center">
                <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground mb-4">No documents uploaded for this company yet.</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ViewCompany;
