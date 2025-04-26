
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
  const sampleCompanies = {
    1: {
      id: 1,
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
        { id: 2, name: "Riverside Condos", units: 12, city: "Brooklyn", state: "NY" }
      ],
      contacts: [
        { id: 1, name: "John Smith", role: "Owner", email: "john@abcproperties.com" },
        { id: 2, name: "Jane Doe", role: "Manager", email: "jane@abcproperties.com" }
      ]
    },
    2: {
      id: 2,
      companyName: "XYZ Real Estate",
      legalName: "XYZ Real Estate Group, Inc.",
      type: "Corporation",
      ein: "98-7654321",
      email: "contact@xyzrealestate.com",
      phone: "(555) 987-6543",
      streetAddress: "456 Park Avenue",
      unit: "Floor 10",
      city: "New York",
      state: "NY",
      zipcode: "10022",
      country: "United States",
      businessLicense: "BL-67890",
      notes: "Premier real estate management company specializing in luxury properties.",
      properties: [
        { id: 3, name: "Luxury Towers", units: 50, city: "New York", state: "NY" },
        { id: 4, name: "Park View Residences", units: 30, city: "Manhattan", state: "NY" }
      ],
      contacts: [
        { id: 3, name: "Robert Johnson", role: "CEO", email: "robert@xyzrealestate.com" },
        { id: 4, name: "Sarah Williams", role: "Operations Manager", email: "sarah@xyzrealestate.com" }
      ]
    },
    3: {
      id: 3,
      companyName: "Sunshine Properties",
      legalName: "Sunshine Properties Management LLC",
      type: "LLC",
      ein: "45-6789123",
      email: "hello@sunshineproperties.com",
      phone: "(555) 456-7890",
      streetAddress: "789 Beach Road",
      unit: "Unit 5",
      city: "Miami",
      state: "FL",
      zipcode: "33139",
      country: "United States",
      businessLicense: "BL-45678",
      notes: "Specializing in beach-front and vacation rental properties.",
      properties: [
        { id: 5, name: "Ocean View Condos", units: 18, city: "Miami", state: "FL" },
        { id: 6, name: "Palm Beach Villas", units: 10, city: "Palm Beach", state: "FL" }
      ],
      contacts: [
        { id: 5, name: "Michael Brown", role: "Owner", email: "michael@sunshineproperties.com" }
      ]
    },
    4: {
      id: 4,
      companyName: "Urban Living",
      legalName: "Urban Living Apartments Inc.",
      type: "Corporation",
      ein: "56-7891234",
      email: "support@urbanliving.com",
      phone: "(555) 789-0123",
      streetAddress: "101 Downtown Avenue",
      unit: "",
      city: "Chicago",
      state: "IL",
      zipcode: "60601",
      country: "United States",
      businessLicense: "BL-89012",
      notes: "Modern apartment management focused on downtown areas.",
      properties: [
        { id: 7, name: "Downtown Lofts", units: 40, city: "Chicago", state: "IL" },
        { id: 8, name: "City Center Apartments", units: 60, city: "Chicago", state: "IL" }
      ],
      contacts: [
        { id: 6, name: "David Wilson", role: "President", email: "david@urbanliving.com" },
        { id: 7, name: "Emma Garcia", role: "Property Manager", email: "emma@urbanliving.com" }
      ]
    },
    5: {
      id: 5,
      companyName: "Coastal Rentals",
      legalName: "Coastal Rentals & Management Co.",
      type: "Partnership",
      ein: "67-8912345",
      email: "info@coastalrentals.com",
      phone: "(555) 234-5678",
      streetAddress: "500 Coastal Highway",
      unit: "Suite 300",
      city: "San Diego",
      state: "CA",
      zipcode: "92101",
      country: "United States",
      businessLicense: "BL-34567",
      notes: "Family-owned business managing coastal properties for over 20 years.",
      properties: [
        { id: 9, name: "Harbor View Apartments", units: 15, city: "San Diego", state: "CA" },
        { id: 10, name: "Sunset Beach Houses", units: 8, city: "La Jolla", state: "CA" }
      ],
      contacts: [
        { id: 8, name: "Thomas Clark", role: "Partner", email: "thomas@coastalrentals.com" },
        { id: 9, name: "Linda Martinez", role: "Partner", email: "linda@coastalrentals.com" }
      ]
    }
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
        // Return sample company data based on id
        return sampleCompanies[parseInt(id as string) as keyof typeof sampleCompanies] || sampleCompanies[1];
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
