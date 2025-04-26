import { useState } from "react";
import { useLocation, Link } from "wouter";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Building,
  CalendarClock,
  DollarSign,
  Download,
  Edit,
  FileText,
  Globe,
  Mail,
  MapPin,
  Phone,
  Star,
  Tool
} from "lucide-react";

// Mock data for a vendor
const vendor = {
  id: 1,
  name: "ABC Plumbing Services",
  contactPerson: "John Smith",
  phone: "(555) 123-4567",
  email: "john@abcplumbing.com",
  website: "https://www.abcplumbing.com",
  category: "Plumbing",
  status: "active",
  rating: 4.5,
  address: "456 Service Road",
  city: "New York",
  state: "NY",
  zipCode: "10002",
  taxIdNumber: "12-3456789",
  licenseNumber: "PLB-987654",
  insuranceInfo: "Policy #INS-123456, Expires: 12/31/2023",
  paymentTerms: "Net 30",
  propertiesServed: [
    { id: 1, name: "Sunset Heights", address: "123 Main St, New York, NY 10001" },
    { id: 2, name: "Riverside Apartments", address: "789 River Road, New York, NY 10003" }
  ],
  maintenanceRequests: [
    { 
      id: 101, 
      title: "Leaking Faucet", 
      property: "Sunset Heights", 
      unit: "Apt 101", 
      date: "2023-03-17", 
      status: "completed",
      cost: 150
    },
    { 
      id: 102, 
      title: "Clogged Drain", 
      property: "Riverside Apartments", 
      unit: "Unit 2A", 
      date: "2023-04-05", 
      status: "in-progress",
      cost: 200
    },
    { 
      id: 103, 
      title: "Water Heater Replacement", 
      property: "Sunset Heights", 
      unit: "Apt 202", 
      date: "2023-02-15", 
      status: "completed",
      cost: 850
    }
  ],
  documents: [
    { id: 1, name: "Insurance Certificate.pdf", type: "insurance", date: "2023-01-15", size: "1.2 MB" },
    { id: 2, name: "Plumbing License.pdf", type: "license", date: "2023-01-15", size: "950 KB" },
    { id: 3, name: "W-9 Form.pdf", type: "tax", date: "2023-01-15", size: "750 KB" },
    { id: 4, name: "Service Contract.pdf", type: "contract", date: "2023-01-20", size: "1.5 MB" }
  ],
  notes: "Responsive service provider. Usually available for emergency calls."
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const ViewVendor = () => {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("details");
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-500">Inactive</Badge>;
      default:
        return <Badge className="bg-blue-500">{status}</Badge>;
    }
  };
  
  const getRequestStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-yellow-500">In Progress</Badge>;
      case "pending":
        return <Badge className="bg-blue-500">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-gray-500">Cancelled</Badge>;
      default:
        return <Badge className="bg-blue-500">{status}</Badge>;
    }
  };
  
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "insurance":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "license":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "tax":
        return <DollarSign className="h-4 w-4 text-amber-500" />;
      case "contract":
        return <FileText className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
        <span className="ml-1 font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <div className="flex items-center mb-2">
            <Button 
              variant="ghost" 
              className="p-0 mr-2 h-8 w-8" 
              onClick={() => navigate("/vendors")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold">
              {vendor.name}
            </h2>
            <div className="ml-3">
              {getStatusBadge(vendor.status)}
            </div>
          </div>
          <p className="text-muted-foreground">{vendor.category} • {vendor.propertiesServed.length} properties served</p>
        </div>
        
        <div className="flex mt-4 sm:mt-0 gap-2">
          <Link href={`/edit-vendor/${vendor.id}`}>
            <Button variant="outline" className="flex items-center">
              <Edit className="mr-2 h-4 w-4" />
              Edit Vendor
            </Button>
          </Link>
          <Link href={`/add-maintenance?vendor=${vendor.id}`}>
            <Button className="flex items-center">
              <Tool className="mr-2 h-4 w-4" />
              Assign Work
            </Button>
          </Link>
        </div>
      </div>
      
      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="work">Work History</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Company Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Tool className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{vendor.name}</div>
                      <div className="text-sm text-muted-foreground">{vendor.category}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <div>{vendor.address}</div>
                      <div>{vendor.city}, {vendor.state} {vendor.zipCode}</div>
                      <div className="text-sm text-muted-foreground">Address</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Star className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <div>{renderStarRating(vendor.rating)}</div>
                      <div className="text-sm text-muted-foreground">Rating</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-start">
                    <Globe className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {vendor.website}
                      </a>
                      <div className="text-sm text-muted-foreground">Website</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="font-medium mb-1">Notes</div>
                    <div className="text-sm">{vendor.notes}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <User className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{vendor.contactPerson}</div>
                      <div className="text-sm text-muted-foreground">Primary Contact</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <div>
                        <a href={`mailto:${vendor.email}`} className="text-primary hover:underline">
                          {vendor.email}
                        </a>
                      </div>
                      <div className="text-sm text-muted-foreground">Email</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <div>
                        <a href={`tel:${vendor.phone}`} className="text-primary hover:underline">
                          {vendor.phone}
                        </a>
                      </div>
                      <div className="text-sm text-muted-foreground">Phone</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-1">
                    <div className="font-medium">Business Details</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-sm text-muted-foreground">License #</div>
                        <div>{vendor.licenseNumber}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Tax ID</div>
                        <div>{vendor.taxIdNumber}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-1">
                    <div className="text-sm text-muted-foreground">Insurance</div>
                    <div>{vendor.insuranceInfo}</div>
                  </div>
                  
                  <div className="pt-1">
                    <div className="text-sm text-muted-foreground">Payment Terms</div>
                    <div>{vendor.paymentTerms}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="work" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>Work History</span>
                <Button size="sm">
                  <Tool className="mr-2 h-4 w-4" />
                  Assign New Work
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted">
                    <tr>
                      <th scope="col" className="px-4 py-3">Request #</th>
                      <th scope="col" className="px-4 py-3">Description</th>
                      <th scope="col" className="px-4 py-3">Property / Unit</th>
                      <th scope="col" className="px-4 py-3">Date</th>
                      <th scope="col" className="px-4 py-3">Status</th>
                      <th scope="col" className="px-4 py-3">Cost</th>
                      <th scope="col" className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendor.maintenanceRequests.map((request) => (
                      <tr key={request.id} className="border-b">
                        <td className="px-4 py-3 font-medium">#{request.id}</td>
                        <td className="px-4 py-3">{request.title}</td>
                        <td className="px-4 py-3">
                          {request.property}<br />
                          <span className="text-xs text-muted-foreground">{request.unit}</span>
                        </td>
                        <td className="px-4 py-3">{formatDate(request.date)}</td>
                        <td className="px-4 py-3">{getRequestStatusBadge(request.status)}</td>
                        <td className="px-4 py-3">${request.cost}</td>
                        <td className="px-4 py-3">
                          <Link href={`/view-maintenance/${request.id}`}>
                            <Button variant="link" className="h-8 p-0">
                              View Details
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="properties" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Properties Served</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vendor.propertiesServed.map((property) => (
                  <div key={property.id} className="border rounded-md p-4">
                    <div className="flex items-start space-x-3">
                      <Building className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <div className="font-medium">{property.name}</div>
                        <div className="text-sm text-muted-foreground">{property.address}</div>
                        <div className="mt-3">
                          <Link href={`/properties/${property.id}`}>
                            <Button variant="outline" size="sm">
                              View Property
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>Vendor Documents</span>
                <Button size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {vendor.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between border p-3 rounded-md">
                    <div className="flex items-center">
                      {getDocumentIcon(doc.type)}
                      <div className="ml-3">
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <span>Added {formatDate(doc.date)}</span>
                          <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                          <span>{doc.size}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ViewVendor;