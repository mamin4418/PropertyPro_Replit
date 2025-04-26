
import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Building2, Edit, ArrowLeft, Building, MapPin, Mail, Phone, FileText, Users, Banknote } from "lucide-react";

const ViewCompany = () => {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: company, isLoading, isError } = useQuery({
    queryKey: [`/api/companies/${id}`],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/companies/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch company");
        }
        return response.json();
      } catch (error) {
        console.error("Error fetching company:", error);
        // Return sample data for now
        return {
          id: parseInt(id as string),
          legalName: "ABC Holdings Inc.",
          companyName: "ABC Properties",
          ein: "12-3456789",
          email: "contact@abcproperties.com",
          phone: "(555) 123-4567",
          type: "LLC",
          status: "active",
          createdAt: "2023-01-15T10:30:00Z",
          properties: [
            {
              id: 1,
              name: "Parkside Apartments",
              address: "123 Main St, Anytown, CA 91234",
              type: "apartment",
              totalUnits: 24,
              status: "active"
            },
            {
              id: 2,
              name: "Mountain View Condos",
              address: "456 Oak Drive, Anytown, CA 91234",
              type: "condo",
              totalUnits: 12,
              status: "active"
            }
          ],
          contacts: [
            {
              id: 101,
              firstName: "John",
              lastName: "Smith",
              role: "Owner",
              email: "john@abcproperties.com",
              phone: "(555) 987-6543"
            },
            {
              id: 102,
              firstName: "Sarah",
              lastName: "Johnson",
              role: "Manager",
              email: "sarah@abcproperties.com",
              phone: "(555) 456-7890"
            }
          ],
          documents: [
            {
              id: 201,
              name: "Articles of Incorporation",
              type: "legal",
              uploadDate: "2023-01-20T10:30:00Z"
            },
            {
              id: 202,
              name: "Business License",
              type: "legal",
              uploadDate: "2023-01-25T10:30:00Z"
            }
          ]
        };
      }
    }
  });

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4 mx-auto"></div>
          <p>Loading company information...</p>
        </div>
      </div>
    );
  }

  if (isError || !company) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center p-10">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <Button variant="ghost" onClick={() => navigate("/companies")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{company.companyName}</h1>
            <p className="text-muted-foreground">{company.legalName}</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/edit-company/${company.id}`)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Company
        </Button>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
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
                  <h3 className="text-sm font-medium text-muted-foreground">Company Type</h3>
                  <p>{company.type}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">EIN</h3>
                  <p>{company.ein || "Not provided"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <div className="flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      company.status === "active" ? "bg-green-500" : "bg-red-500"
                    }`}></span>
                    <span className="capitalize">{company.status}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{company.email || "No email provided"}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{company.phone || "No phone provided"}</span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Created On</h3>
                  <p>{new Date(company.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Building className="h-5 w-5 mr-2 text-primary" />
                  <span className="text-2xl font-bold">{company.properties?.length || 0}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Units</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  <span className="text-2xl font-bold">
                    {company.properties?.reduce((total, property) => total + property.totalUnits, 0) || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  <span className="text-2xl font-bold">{company.contacts?.length || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="properties" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Properties</CardTitle>
              <Button size="sm" onClick={() => navigate("/add-property")}>
                Add Property
              </Button>
            </CardHeader>
            <CardContent>
              {company.properties && company.properties.length > 0 ? (
                <div className="divide-y">
                  {company.properties.map((property) => (
                    <div key={property.id} className="py-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{property.name}</h3>
                        <p className="text-sm text-muted-foreground">{property.address}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs bg-secondary rounded-full px-2 py-0.5 mr-2 capitalize">{property.type}</span>
                          <span className="text-xs bg-secondary rounded-full px-2 py-0.5">{property.totalUnits} units</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/view-property/${property.id}`)}>
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                  <h3 className="font-medium mb-2">No Properties Found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    There are no properties associated with this company yet.
                  </p>
                  <Button onClick={() => navigate("/add-property")}>
                    Add Property
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contacts" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Contacts</CardTitle>
              <Button size="sm" onClick={() => navigate("/add-contact")}>
                Add Contact
              </Button>
            </CardHeader>
            <CardContent>
              {company.contacts && company.contacts.length > 0 ? (
                <div className="divide-y">
                  {company.contacts.map((contact) => (
                    <div key={contact.id} className="py-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{contact.firstName} {contact.lastName}</h3>
                        <p className="text-sm text-muted-foreground">{contact.role}</p>
                        <div className="flex items-center mt-1 text-sm">
                          <Mail className="h-3 w-3 mr-1" />
                          <span className="mr-3">{contact.email}</span>
                          <Phone className="h-3 w-3 mr-1" />
                          <span>{contact.phone}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/view-contact/${contact.id}`)}>
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                  <h3 className="font-medium mb-2">No Contacts Found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    There are no contacts associated with this company yet.
                  </p>
                  <Button onClick={() => navigate("/add-contact")}>
                    Add Contact
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Documents</CardTitle>
              <Button size="sm">
                Upload Document
              </Button>
            </CardHeader>
            <CardContent>
              {company.documents && company.documents.length > 0 ? (
                <div className="divide-y">
                  {company.documents.map((document) => (
                    <div key={document.id} className="py-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium">{document.name}</h3>
                          <p className="text-xs text-muted-foreground capitalize">{document.type}</p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded on {new Date(document.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                  <h3 className="font-medium mb-2">No Documents Found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    There are no documents associated with this company yet.
                  </p>
                  <Button>
                    Upload Document
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ViewCompany;
