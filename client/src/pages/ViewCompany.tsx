import { useState } from "react";
import { Link, useParams } from "wouter";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Building2, Mail, Phone, FileText, Clock } from "lucide-react";

// Sample company data - matching IDs with Companies.tsx
const sampleCompanies = [
  {
    id: 1,
    legalName: "ABC Property Management LLC",
    companyName: "ABC Properties",
    ein: "12-3456789",
    email: "info@abcproperties.com",
    phone: "(555) 123-4567",
    type: "LLC",
    status: "active",
    createdAt: "2023-05-15",
    properties: [
      { id: 101, name: "Riverside Apartments", units: 24, address: "123 Riverside Dr" },
      { id: 102, name: "Oakwood Townhomes", units: 12, address: "456 Oak Street" }
    ],
    notes: "Premier property management company specializing in residential rentals."
  },
  {
    id: 2,
    legalName: "XYZ Real Estate Holdings Inc",
    companyName: "XYZ Realty",
    ein: "98-7654321",
    email: "contact@xyzrealty.com",
    phone: "(555) 987-6543",
    type: "Corporation",
    status: "active",
    createdAt: "2022-11-30",
    properties: [
      { id: 201, name: "Marina Towers", units: 50, address: "789 Harbor Blvd" }
    ],
    notes: "Corporate housing and commercial real estate specialists."
  },
  {
    id: 3,
    legalName: "Sunset Apartments Group LLC",
    companyName: "Sunset Living",
    ein: "45-6789123",
    email: "leasing@sunsetliving.com",
    phone: "(555) 456-7890",
    type: "LLC",
    status: "inactive",
    createdAt: "2021-08-22",
    properties: [],
    notes: "Luxury apartment company. Currently inactive due to reorganization."
  },
  {
    id: 4,
    legalName: "Metro Property Investments Ltd",
    companyName: "Metro Properties",
    ein: "78-9123456",
    email: "info@metroproperties.com",
    phone: "(555) 789-0123",
    type: "Limited Company",
    status: "active",
    createdAt: "2023-02-10",
    properties: [
      { id: 301, name: "Downtown Lofts", units: 18, address: "123 Main Street" },
      { id: 302, name: "Park Place Condos", units: 32, address: "555 Park Avenue" },
      { id: 303, name: "Hillside Homes", units: 15, address: "777 Hill Road" }
    ],
    notes: "Urban property development and management company focusing on mixed-use buildings."
  },
  {
    id: 5,
    legalName: "Urban Home Rentals Inc",
    companyName: "Urban Homes",
    ein: "23-4567891",
    email: "rentals@urbanhomes.com",
    phone: "(555) 234-5678",
    type: "Corporation",
    status: "active",
    createdAt: "2022-06-15",
    properties: [
      { id: 401, name: "City View Apartments", units: 40, address: "888 Skyline Drive" }
    ],
    notes: "Affordable housing solutions in metropolitan areas."
  }
];

export default function ViewCompany() {
  const { id } = useParams();
  const companyId = parseInt(id || "0");
  const [activeTab, setActiveTab] = useState("overview");

  // Find the company with the matching ID
  const company = sampleCompanies.find(company => company.id === companyId);

  if (!company) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Company Not Found</h1>
          <p className="mb-4">The company you're looking for doesn't exist or has been removed.</p>
          <Link href="/companies">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Companies
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/companies">Companies</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{company.companyName}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">{company.companyName}</h1>
          <p className="text-muted-foreground">{company.legalName}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/companies">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </Link>
          <Link href={`/edit-company/${company.id}`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" /> Edit Company
            </Button>
          </Link>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Company Details</CardTitle>
                <CardDescription>Basic information about the company</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Type</p>
                    <p>{company.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">EIN</p>
                    <p>{company.ein}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Created on</p>
                    <p>{company.createdAt}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="font-medium mb-1">Status</p>
                  <Badge variant={company.status === "active" ? "success" : "destructive"}>
                    {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Contact Information</CardTitle>
                <CardDescription>Ways to reach the company</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p>{company.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p>{company.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{company.notes || "No notes available for this company."}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="properties" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Properties Managed</CardTitle>
              <CardDescription>
                Properties managed by {company.companyName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {company.properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {company.properties.map(property => (
                    <Card key={property.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{property.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p><span className="font-medium">Address:</span> {property.address}</p>
                        <p><span className="font-medium">Units:</span> {property.units}</p>
                        <div className="mt-3">
                          <Link href={`/view-property/${property.id}`}>
                            <Button variant="outline" size="sm">View Property</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No properties associated with this company yet.</p>
                  <Button variant="outline" className="mt-2">
                    <Link href="/add-property">Add Property</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Documents</CardTitle>
              <CardDescription>
                Important documents related to {company.companyName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-muted-foreground">No documents uploaded yet.</p>
                <Button variant="outline" className="mt-2">
                  Upload Document
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}