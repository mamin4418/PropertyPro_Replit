
import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Users, 
  HomeIcon,
  Mail, 
  Phone, 
  FileText, 
  PenSquare,
  ArrowLeft
} from "lucide-react";

// Sample company data - same as in Companies.tsx
const sampleCompanies = [
  { 
    id: 1, 
    companyName: "ABC Properties", 
    legalName: "ABC Properties LLC", 
    ein: "12-3456789", 
    email: "info@abcproperties.com",
    phone: "(555) 123-4567",
    type: "LLC",
    status: "active",
    properties: 12,
    occupancy: 92,
    address: "123 Main St, Suite 101, Boston, MA 02110",
    description: "ABC Properties is a residential property management company specializing in luxury apartments in downtown Boston.",
    founded: "2012",
    website: "www.abcproperties.com"
  },
  { 
    id: 2, 
    companyName: "XYZ Real Estate", 
    legalName: "XYZ Real Estate Group, Inc.", 
    ein: "98-7654321", 
    email: "contact@xyzrealestate.com",
    phone: "(555) 987-6543",
    type: "Corporation",
    status: "active",
    properties: 8,
    occupancy: 88,
    address: "456 Park Ave, New York, NY 10022",
    description: "XYZ Real Estate specializes in commercial property management throughout the East Coast.",
    founded: "2005",
    website: "www.xyzrealestate.com"
  },
  { 
    id: 3, 
    companyName: "Sunset Heights", 
    legalName: "Sunset Heights Inc.", 
    ein: "45-6789123", 
    email: "hello@sunshineproperties.com",
    phone: "(555) 456-7890",
    type: "C-Corp",
    status: "active",
    properties: 15,
    occupancy: 83,
    address: "789 Sunset Blvd, Los Angeles, CA 90026",
    description: "Sunset Heights manages residential properties across Southern California, focusing on mid-range apartment complexes.",
    founded: "2010",
    website: "www.sunsetheights.com"
  },
  { 
    id: 4, 
    companyName: "Green Properties", 
    legalName: "Green Properties LLC", 
    ein: "56-7891234", 
    email: "info@greenproperties.com",
    phone: "(555) 234-5678",
    type: "LLC",
    status: "active",
    properties: 10,
    occupancy: 94,
    address: "321 Cedar St, Seattle, WA 98102",
    description: "Green Properties specializes in eco-friendly and sustainable apartment buildings in the Pacific Northwest.",
    founded: "2015",
    website: "www.greenproperties.com"
  },
  { 
    id: 5, 
    companyName: "Urban Living", 
    legalName: "Urban Living Management Inc.", 
    ein: "67-8912345", 
    email: "contact@urbanliving.com",
    phone: "(555) 345-6789",
    type: "S-Corp",
    status: "active",
    properties: 6,
    occupancy: 90,
    address: "555 Urban Way, Chicago, IL 60611",
    description: "Urban Living specializes in luxury high-rise apartment buildings in downtown Chicago.",
    founded: "2008",
    website: "www.urbanliving.com"
  }
];

// Sample properties for each company
const sampleProperties = [
  { id: 1, companyId: 1, name: "The Residences at Harbor Point", address: "125 Harbor Drive, Boston, MA", units: 24, occupancy: 92 },
  { id: 2, companyId: 1, name: "Beacon Hill Apartments", address: "210 Beacon St, Boston, MA", units: 18, occupancy: 89 },
  { id: 3, companyId: 1, name: "Commonwealth Towers", address: "300 Commonwealth Ave, Boston, MA", units: 36, occupancy: 95 },
  { id: 4, companyId: 2, name: "Park Plaza Office Complex", address: "477 Park Ave, New York, NY", units: 12, occupancy: 83 },
  { id: 5, companyId: 2, name: "Midtown Business Center", address: "625 5th Ave, New York, NY", units: 8, occupancy: 100 },
  { id: 6, companyId: 3, name: "Sunset Villa Apartments", address: "800 Sunset Blvd, Los Angeles, CA", units: 32, occupancy: 78 },
  { id: 7, companyId: 3, name: "Pacific Heights", address: "921 Ocean View Dr, Los Angeles, CA", units: 45, occupancy: 86 },
  { id: 8, companyId: 4, name: "Evergreen Residences", address: "330 Cedar St, Seattle, WA", units: 28, occupancy: 96 },
  { id: 9, companyId: 4, name: "Cascade Gardens", address: "450 Pine St, Seattle, WA", units: 22, occupancy: 91 },
  { id: 10, companyId: 5, name: "Skyline Tower", address: "570 Michigan Ave, Chicago, IL", units: 40, occupancy: 88 }
];

// Sample contacts for each company
const sampleContacts = [
  { id: 1, companyId: 1, name: "John Smith", role: "CEO", email: "john@abcproperties.com", phone: "(555) 123-1001" },
  { id: 2, companyId: 1, name: "Sarah Johnson", role: "Property Manager", email: "sarah@abcproperties.com", phone: "(555) 123-1002" },
  { id: 3, companyId: 2, name: "Michael Wilson", role: "Director", email: "michael@xyzrealestate.com", phone: "(555) 987-2001" },
  { id: 4, companyId: 3, name: "Lisa Brown", role: "President", email: "lisa@sunsetheights.com", phone: "(555) 456-3001" },
  { id: 5, companyId: 4, name: "David Green", role: "Owner", email: "david@greenproperties.com", phone: "(555) 234-4001" },
  { id: 6, companyId: 5, name: "Jennifer Lee", role: "Managing Director", email: "jennifer@urbanliving.com", phone: "(555) 345-5001" }
];

const ViewCompany = () => {
  const [, navigate] = useLocation();
  const { id } = useParams<{ id: string }>();
  const companyId = parseInt(id);
  const [activeTab, setActiveTab] = useState("overview");

  const { data: company, isLoading } = useQuery({
    queryKey: [`/api/companies/${id}`],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/companies/${id}`);
        if (!response.ok) throw new Error("Failed to fetch company");
        return response.json();
      } catch (error) {
        console.error("Failed to fetch company:", error);
        // Return sample data for the specific company when API fails
        return sampleCompanies.find(c => c.id === companyId) || null;
      }
    }
  });

  // Filter properties and contacts by company ID
  const companyProperties = sampleProperties.filter(prop => prop.companyId === companyId);
  const companyContacts = sampleContacts.filter(contact => contact.companyId === companyId);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-40 bg-muted rounded"></div>
          <div className="h-60 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Company Not Found</h1>
        <Button onClick={() => navigate("/companies")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Companies
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => navigate("/companies")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Companies
        </Button>
        <Button onClick={() => navigate(`/edit-company/${company.id}`)}>
          <PenSquare className="h-4 w-4 mr-2" />
          Edit Company
        </Button>
      </div>

      <div className="flex items-center mb-6">
        <div className="bg-primary h-16 w-16 rounded-lg flex items-center justify-center text-primary-foreground text-xl font-bold mr-4">
          {company.companyName.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{company.companyName}</h1>
          <p className="text-muted-foreground">{company.legalName}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{company.properties}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{company.occupancy}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{company.status}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Details about {company.companyName}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Legal Name</h3>
                  <p>{company.legalName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">EIN</h3>
                  <p>{company.ein}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Company Type</h3>
                  <p>{company.type}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Founded</h3>
                  <p>{company.founded}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </h3>
                  <p>{company.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    Phone
                  </h3>
                  <p>{company.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Website</h3>
                  <p>{company.website}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                    <HomeIcon className="h-4 w-4 mr-1" />
                    Address
                  </h3>
                  <p>{company.address}</p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                  <p>{company.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="properties" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Properties</h2>
            <Button size="sm" onClick={() => navigate("/add-property")}>
              Add Property
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companyProperties.map((property) => (
              <Card key={property.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {property.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">{property.address}</p>
                    <div className="flex justify-between mt-4">
                      <div className="text-center">
                        <div className="font-bold">{property.units}</div>
                        <div className="text-xs text-muted-foreground">Units</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold">{property.occupancy}%</div>
                        <div className="text-xs text-muted-foreground">Occupancy</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Contacts</h2>
            <Button size="sm" onClick={() => navigate("/add-contact")}>
              Add Contact
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companyContacts.map((contact) => (
              <Card key={contact.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {contact.name}
                  </CardTitle>
                  <CardDescription>{contact.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {contact.email}
                    </p>
                    <p className="text-muted-foreground flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {contact.phone}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Documents</h2>
            <Button size="sm">
              Upload Document
            </Button>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No documents found</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Upload company documents to keep track of important files.
                </p>
                <Button className="mt-4">Upload Document</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ViewCompany;
