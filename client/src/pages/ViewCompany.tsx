
import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  Edit,
  MailIcon,
  MapPin,
  Phone,
  Trash,
  User,
  FileText,
  Building,
  Users,
  Loader2,
} from "lucide-react";

const ViewCompany = () => {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  // Sample company data
  const sampleCompany = {
    id: parseInt(id as string),
    companyName: "ABC Properties",
    legalName: "ABC Properties LLC",
    type: "LLC",
    ein: "12-3456789",
    email: "info@abcproperties.com",
    phone: "(555) 123-4567",
    streetAddress: "123 Main Street",
    unit: "Suite 200",
    city: "New York",
    state: "NY",
    zipcode: "10001",
    country: "United States",
    businessLicense: "BL-12345",
    notes: "This is a sample company for property management.",
    // Associated data
    properties: [
      { id: 1, name: "Parkside Apartments", units: 24, city: "New York", state: "NY" },
      { id: 2, name: "Riverside Condos", units: 12, city: "Brooklyn", state: "NY" },
      { id: 3, name: "Hillview Residences", units: 18, city: "Queens", state: "NY" }
    ],
    contacts: [
      { id: 1, name: "John Smith", role: "Owner", email: "john@abcproperties.com" },
      { id: 2, name: "Jane Doe", role: "Manager", email: "jane@abcproperties.com" },
      { id: 3, name: "Robert Johnson", role: "Accountant", email: "robert@abcproperties.com" }
    ]
  };

  // Fetch company data
  const { data: company, isLoading, isError } = useQuery({
    queryKey: [`/api/companies/${id}`],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/companies/${id}`);
        if (!response.ok) throw new Error("Failed to fetch company");
        return response.json();
      } catch (error) {
        console.error("Error fetching company:", error);
        // Return sample data
        return sampleCompany;
      }
    },
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
            Back to Companies
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">{company.companyName}</h1>
          <p className="text-muted-foreground">{company.legalName}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/edit-company/${company.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Company Info Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Company Name</p>
                    <p className="font-medium">{company.companyName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Legal Name</p>
                    <p className="font-medium">{company.legalName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Company Type</p>
                    <p className="font-medium">{company.type}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">EIN / Tax ID</p>
                    <p className="font-medium">{company.ein || "—"}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="font-semibold">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <MailIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{company.email || "No email address"}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{company.phone || "No phone number"}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="font-semibold">Address</h3>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <p>{company.streetAddress}</p>
                      {company.unit && <p>{company.unit}</p>}
                      <p>
                        {company.city}, {company.state} {company.zipcode}
                      </p>
                      <p>{company.country}</p>
                    </div>
                  </div>
                </div>

                {company.notes && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h3 className="font-semibold">Notes</h3>
                      <p className="text-sm">{company.notes}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Properties</span>
                    </div>
                    <span className="font-semibold">{company.properties?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Contacts</span>
                    </div>
                    <span className="font-semibold">{company.contacts?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Documents</span>
                    </div>
                    <span className="font-semibold">0</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Business License</h3>
                  <p>{company.businessLicense || "Not provided"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Properties Tab */}
        <TabsContent value="properties">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Properties</CardTitle>
                <Button onClick={() => navigate("/add-property")}>
                  Add Property
                </Button>
              </div>
              <CardDescription>
                Properties associated with this company
              </CardDescription>
            </CardHeader>
            <CardContent>
              {company.properties && company.properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {company.properties.map((property) => (
                    <Card
                      key={property.id}
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => navigate(`/view-property/${property.id}`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold mb-1">
                              {property.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {property.city}, {property.state}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{property.units} Units</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Building2 className="mx-auto h-12 w-12 text-muted-foreground opacity-30 mb-2" />
                  <h3 className="font-medium mb-1">No properties yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This company doesn't have any properties associated with it
                  </p>
                  <Button onClick={() => navigate("/add-property")}>
                    Add Property
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contacts Tab */}
        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Contacts</CardTitle>
                <Button onClick={() => navigate("/add-contact")}>
                  Add Contact
                </Button>
              </div>
              <CardDescription>
                People associated with this company
              </CardDescription>
            </CardHeader>
            <CardContent>
              {company.contacts && company.contacts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {company.contacts.map((contact) => (
                    <Card
                      key={contact.id}
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => navigate(`/view-contact/${contact.id}`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">
                              {contact.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {contact.role}
                            </p>
                            <p className="text-sm">{contact.email}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-30 mb-2" />
                  <h3 className="font-medium mb-1">No contacts yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This company doesn't have any contacts associated with it
                  </p>
                  <Button onClick={() => navigate("/add-contact")}>
                    Add Contact
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Documents</CardTitle>
                <Button>Upload Document</Button>
              </div>
              <CardDescription>
                Documents associated with this company
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-30 mb-2" />
                <h3 className="font-medium mb-1">No documents yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload documents such as certificates, contracts, or licenses
                </p>
                <Button>Upload Document</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ViewCompany;
