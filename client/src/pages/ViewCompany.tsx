
import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Building2, Edit, HomeIcon, Mail, MapPin, Phone, Trash2 } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription, 
  DialogFooter, 
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

// Sample company data - in a real app this would come from an API
const companies = [
  {
    id: 1,
    companyName: "Parkside Properties LLC",
    legalName: "Parkside Properties LLC",
    email: "info@parksideproperties.com",
    phone: "(555) 123-4567",
    type: "LLC",
    ein: "12-3456789",
    address: "123 Main St",
    city: "Anytown",
    state: "CA",
    zipcode: "94088",
    country: "United States",
    properties: [
      { id: 1, name: "Parkside Apartments", units: 16, occupancy: "94%" },
      { id: 2, name: "Riverside Villas", units: 8, occupancy: "88%" }
    ],
    stats: {
      totalProperties: 4,
      totalUnits: 24,
      occupancyRate: "92%",
      monthlyRevenue: "$32,400",
      yearToDateRevenue: "$278,000"
    }
  },
  {
    id: 2,
    companyName: "Sunset Heights Inc.",
    legalName: "Sunset Heights Investment Corporation",
    email: "contact@sunsetheights.com",
    phone: "(555) 987-6543",
    type: "C-Corp",
    ein: "98-7654321",
    address: "456 Park Ave",
    city: "Othertown",
    state: "NY",
    zipcode: "10001",
    country: "United States",
    properties: [
      { id: 3, name: "Heights Tower", units: 8, occupancy: "75%" },
      { id: 4, name: "Sunset Plaza", units: 4, occupancy: "100%" }
    ],
    stats: {
      totalProperties: 2,
      totalUnits: 12,
      occupancyRate: "83%",
      monthlyRevenue: "$18,500",
      yearToDateRevenue: "$165,000"
    }
  },
  {
    id: 3,
    companyName: "Green Properties LLC",
    legalName: "Green Environmental Properties LLC",
    email: "leasing@greenprops.com",
    phone: "(555) 456-7890",
    type: "LLC",
    ein: "45-6789123",
    address: "789 Green St",
    city: "Ecovile",
    state: "WA",
    zipcode: "98001",
    country: "United States",
    properties: [
      { id: 5, name: "Eco Apartments", units: 12, occupancy: "92%" },
      { id: 6, name: "Green Living Center", units: 6, occupancy: "100%" }
    ],
    stats: {
      totalProperties: 3,
      totalUnits: 18,
      occupancyRate: "95%",
      monthlyRevenue: "$26,800",
      yearToDateRevenue: "$240,000"
    }
  }
];

const ViewCompany = () => {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Find the company from our sample data
  const company = companies.find(c => c.id === parseInt(id));
  
  if (!company) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Company Not Found</h2>
        <p className="mb-4">The company you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/companies")}>
          Return to Companies
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/companies")} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">{company.companyName}</h1>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center">
          <Building2 className="h-6 w-6 mr-2 text-primary" />
          <div>
            <p className="text-muted-foreground">{company.type} • {company.ein}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/edit-company/${company.id}`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Company</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete {company.companyName}? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    // In a real app this would call an API
                    console.log(`Deleting company ${company.id}`);
                    navigate("/companies");
                  }}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{company.stats.totalProperties}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Units
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{company.stats.totalUnits}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Occupancy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{company.stats.occupancyRate}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{company.stats.monthlyRevenue}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              YTD Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{company.stats.yearToDateRevenue}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Building2 className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Legal Name</p>
                    <p className="text-muted-foreground">{company.legalName}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">{company.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">{company.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    <p>{company.address}</p>
                    <p>{company.city}, {company.state} {company.zipcode}</p>
                    <p>{company.country}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="properties" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {company.properties.map(property => (
              <Card 
                key={property.id} 
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => navigate(`/view-property/${property.id}`)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HomeIcon className="h-5 w-5" />
                    {property.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <div className="text-center">
                      <p className="font-medium">{property.units}</p>
                      <p className="text-xs text-muted-foreground">Units</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{property.occupancy}</p>
                      <p className="text-xs text-muted-foreground">Occupancy</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Card className="border-dashed border-2 hover:border-primary/50 hover:bg-accent/50 transition-colors cursor-pointer flex items-center justify-center h-[180px]" onClick={() => navigate("/add-property")}>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="rounded-full bg-primary/10 p-2 mb-2">
                  <HomeIcon className="h-6 w-6 text-primary" />
                </div>
                <p className="font-medium">Add New Property</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="contacts">
          <div className="p-6 text-center text-muted-foreground">
            <p>No contacts associated with this company yet.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="documents">
          <div className="p-6 text-center text-muted-foreground">
            <p>No documents associated with this company yet.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="notes">
          <div className="p-6 text-center text-muted-foreground">
            <p>No notes associated with this company yet.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ViewCompany;
