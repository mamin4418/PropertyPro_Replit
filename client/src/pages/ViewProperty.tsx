import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
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
import { ArrowLeft, Edit, Building2, MapPin, User, Home, Clock, Calendar, FileText, Upload, Download } from "lucide-react";

const ViewProperty = () => {
  const { id } = useParams();
  const [, navigate] = useLocation();
  
  // Mock data for a single property
  const property = {
    id: id,
    name: "Sunset Heights",
    address: "123 Main St, Anytown, USA",
    type: "Apartment Complex",
    status: "active",
    description: "A beautiful apartment complex with modern amenities including a swimming pool, fitness center, and landscaped gardens.",
    units: {
      total: 24,
      occupied: 24,
      vacant: 0
    },
    amenities: ["Swimming Pool", "Fitness Center", "Playground", "Pet Friendly", "Covered Parking", "On-site Laundry"],
    yearBuilt: 2010,
    squareFeet: 35000,
    purchaseDate: "2015-06-15",
    purchasePrice: 4500000,
    currentValue: 5800000,
    annualTaxes: 65000,
    insurancePolicy: "POL-12345-ABC",
    insuranceCost: 24000,
    documents: [
      { name: "Purchase Agreement.pdf", size: "2.4 MB", date: "2015-06-15" },
      { name: "Insurance Policy.pdf", size: "1.2 MB", date: "2023-01-10" },
      { name: "Property Survey.pdf", size: "4.5 MB", date: "2015-05-20" },
      { name: "Tax Records 2023.pdf", size: "0.8 MB", date: "2023-04-15" }
    ],
    images: [
      { url: "https://example.com/property1.jpg", alt: "Front view" },
      { url: "https://example.com/property2.jpg", alt: "Pool area" },
      { url: "https://example.com/property3.jpg", alt: "Lobby" }
    ],
    tenants: 42,
    maintenanceRequests: {
      open: 3,
      inProgress: 2,
      completed: 15
    }
  };
  
  // Calculate occupancy percentage
  const occupancyRate = Math.round((property.units.occupied / property.units.total) * 100);
  
  // Generate status badge based on property status
  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <Badge className="bg-green-500">Active</Badge>;
    } else if (status === "maintenance") {
      return <Badge className="bg-yellow-500">Maintenance</Badge>;
    } else {
      return <Badge className="bg-gray-500">Inactive</Badge>;
    }
  };
  
  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/properties">Properties</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{property.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="icon" 
            className="mr-4"
            onClick={() => navigate("/properties")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{property.name}</h1>
            <div className="flex items-center text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{property.address}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {getStatusBadge(property.status)}
          <Button 
            variant="outline" 
            onClick={() => navigate(`/edit-property/${id}`)}
          >
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button onClick={() => navigate(`/manage-units/${id}`)}>
            Manage Units
          </Button>
        </div>
      </div>
      
      {/* Property overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                Property Type
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{property.type}</div>
            <p className="text-sm text-muted-foreground">
              Built in {property.yearBuilt}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                Units
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{property.units.total} Units</div>
            <div className="text-sm text-muted-foreground">
              <span className="text-green-600">{property.units.occupied} Occupied</span> · 
              <span className="text-red-600 ml-1">{property.units.vacant} Vacant</span> · 
              <span className="font-medium ml-1">{occupancyRate}% Occupancy</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                Tenants
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{property.tenants} People</div>
            <p className="text-sm text-muted-foreground">
              Across {property.units.occupied} units
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for property details */}
      <Tabs defaultValue="details">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="units">Units</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>
        
        {/* Details Tab */}
        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Information</CardTitle>
                <CardDescription>Basic details about the property</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Property Type</h4>
                    <p className="text-muted-foreground">{property.type}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Year Built</h4>
                    <p className="text-muted-foreground">{property.yearBuilt}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Square Footage</h4>
                    <p className="text-muted-foreground">{property.squareFeet.toLocaleString()} sq ft</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Purchase Date</h4>
                    <p className="text-muted-foreground">{new Date(property.purchaseDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Address</h4>
                  <p className="text-muted-foreground">{property.address}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Description</h4>
                  <p className="text-muted-foreground">{property.description}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
                <CardDescription>Features available at this property</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center rounded-md bg-muted p-2">
                      <div className="ml-2">{amenity}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Units Tab */}
        <TabsContent value="units">
          <Card>
            <CardHeader>
              <CardTitle>Unit Information</CardTitle>
              <CardDescription>Details of all units in this property</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-2 font-medium">Manage Units</h3>
                <p className="text-muted-foreground mb-4">View and manage all units in this property</p>
                <Button onClick={() => navigate(`/manage-units/${id}`)}>
                  Go to Units Manager
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Financials Tab */}
        <TabsContent value="financials">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>Property value and purchase information</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Purchase Price</h4>
                    <p className="text-muted-foreground">${property.purchasePrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Current Value</h4>
                    <p className="text-muted-foreground">${property.currentValue.toLocaleString()}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Annual Taxes</h4>
                    <p className="text-muted-foreground">${property.annualTaxes.toLocaleString()}/year</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Insurance Cost</h4>
                    <p className="text-muted-foreground">${property.insuranceCost.toLocaleString()}/year</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Insurance Information</CardTitle>
                <CardDescription>Insurance policy details</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div>
                  <h4 className="font-medium mb-1">Policy Number</h4>
                  <p className="text-muted-foreground">{property.insurancePolicy}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Annual Premium</h4>
                  <p className="text-muted-foreground">${property.insuranceCost.toLocaleString()}</p>
                </div>
                <div>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Policy Documents
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Property Documents</CardTitle>
                <CardDescription>Important files related to this property</CardDescription>
              </div>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload Documents
              </Button>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <div className="grid grid-cols-1 divide-y">
                  {property.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-4">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.size} · Uploaded on {new Date(doc.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Maintenance Tab */}
        <TabsContent value="maintenance">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Maintenance Requests</CardTitle>
                <CardDescription>All maintenance requests for this property</CardDescription>
              </div>
              <Button onClick={() => navigate("/add-maintenance")}>
                Add Maintenance Request
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-yellow-600">Open</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{property.maintenanceRequests.open}</div>
                    <p className="text-sm text-muted-foreground">Awaiting action</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-blue-600">In Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{property.maintenanceRequests.inProgress}</div>
                    <p className="text-sm text-muted-foreground">Currently being addressed</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-green-600">Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{property.maintenanceRequests.completed}</div>
                    <p className="text-sm text-muted-foreground">Within last 30 days</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="text-center p-4">
                <Button variant="outline" onClick={() => navigate("/maintenance")}>
                  View All Maintenance Requests
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ViewProperty;