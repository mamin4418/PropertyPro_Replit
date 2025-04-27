
import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { 
  Building, 
  ArrowLeft, 
  Home, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin,
  Briefcase,
  FileText,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

const sampleCompany = {
  id: 1,
  companyName: "Skyline Properties",
  legalName: "Skyline Properties LLC",
  type: "LLC",
  ein: "12-3456789",
  email: "info@skylineproperties.com",
  phone: "(555) 123-4567",
  address: "123 Business St, Suite 100",
  city: "New York",
  state: "NY",
  zipcode: "10001",
  country: "USA",
  status: "active",
  createdAt: "2022-06-15T10:30:00Z",
  updatedAt: "2023-03-22T14:45:00Z",
  properties: [
    { id: 1, name: "Oceanview Apartments", address: "500 Beach Blvd, Miami, FL", units: 24, type: "Apartment" },
    { id: 2, name: "Pine Ridge Townhomes", address: "123 Pine Ave, Portland, OR", units: 16, type: "Townhouse" },
    { id: 3, name: "Lakeview Condos", address: "789 Lake Dr, Chicago, IL", units: 32, type: "Condo" }
  ],
  notes: "One of our oldest clients. They specialize in upscale residential properties in urban areas."
};

const ViewCompany = () => {
  const [, navigate] = useLocation();
  const [match, params] = useRoute<{ id: string }>("/companies/:id");
  const company = sampleCompany; // In a real app, you'd fetch based on params.id

  if (!match) {
    return <div>Company not found</div>;
  }

  return (
    <div className="container py-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-4"
            onClick={() => navigate("/companies")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{company.companyName}</h1>
                <Badge variant={company.status === "active" ? "default" : "secondary"}>
                  {company.status}
                </Badge>
              </div>
              <p className="text-muted-foreground">{company.legalName}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/companies/${company.id}/edit`)}
            className="flex items-center gap-1"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
          <Button
            variant="destructive"
            className="flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{company.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{company.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div>{company.address}</div>
                    <div>{company.city}, {company.state} {company.zipcode}</div>
                    <div>{company.country}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Company Type</div>
                    <div>{company.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">EIN / Tax ID</div>
                    <div>{company.ein}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Created</div>
                    <div>{new Date(company.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Portfolio Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center py-1">
                  <div className="text-sm">Total Properties</div>
                  <div className="font-medium">{company.properties.length}</div>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-1">
                  <div className="text-sm">Total Units</div>
                  <div className="font-medium">
                    {company.properties.reduce((sum, prop) => sum + prop.units, 0)}
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-1">
                  <div className="text-sm">Property Types</div>
                  <div className="flex gap-1">
                    {Array.from(new Set(company.properties.map(p => p.type))).map(type => (
                      <Badge key={type} variant="outline">{type}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

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

        <TabsContent value="properties" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Properties</CardTitle>
                <CardDescription>
                  Properties managed by {company.companyName}
                </CardDescription>
              </div>
              <Button className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                <span>Add Property</span>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {company.properties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">{property.name}</TableCell>
                      <TableCell>{property.address}</TableCell>
                      <TableCell>{property.type}</TableCell>
                      <TableCell>{property.units}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm"
                          onClick={() => navigate(`/properties/${property.id}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                Company documents and files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40 border rounded-md bg-muted/40">
                <p className="text-muted-foreground">No documents available</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>History & Activity</CardTitle>
              <CardDescription>
                Recent changes and activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Edit className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Company information updated</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(company.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Building className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Company created</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(company.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ViewCompany;
