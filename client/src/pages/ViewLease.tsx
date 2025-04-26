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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, RefreshCw, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  ArrowLeft,
  Building,
  Calendar,
  Check,
  Clock,
  CreditCard,
  Download,
  Edit,
  FileText,
  Home,
  Mail,
  MapPin,
  Phone,
  Receipt,
  Trash2,
  User,
  Users
} from "lucide-react";

// Mock data for a lease
const lease = {
  id: 101,
  status: "active",
  type: "Fixed Term",
  property: {
    id: 1,
    name: "Sunset Heights",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001"
  },
  unit: "Apt 101",
  startDate: "2022-06-15",
  endDate: "2023-06-14",
  term: "12 months",
  rentAmount: 1200,
  lateFee: 50,
  securityDeposit: 1200,
  petDeposit: 300,
  tenants: [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "(555) 123-4567"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "(555) 987-6543"
    }
  ],
  documents: [
    { id: 1, name: "Lease Agreement.pdf", type: "lease", date: "2022-06-01", size: "1.2 MB" },
    { id: 2, name: "Property Inventory.pdf", type: "inventory", date: "2022-06-15", size: "850 KB" },
    { id: 3, name: "Security Deposit Receipt.pdf", type: "receipt", date: "2022-06-01", size: "540 KB" }
  ],
  payments: [
    { id: 201, date: "2023-04-05", amount: 1200, type: "Rent", status: "paid" },
    { id: 202, date: "2023-03-03", amount: 1200, type: "Rent", status: "paid" },
    { id: 203, date: "2023-02-02", amount: 1200, type: "Rent", status: "paid" },
    { id: 204, date: "2023-01-05", amount: 1200, type: "Rent", status: "paid" }
  ],
  notes: "Tenants have one cat. Lease renewable upon mutual agreement."
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const ViewLease = () => {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("details");
  const { toast } = useToast();

  const handleRenewLease = () => {
    // Implement lease renewal logic
    toast({
      title: "Lease Renewal",
      description: "Lease renewal process initiated"
    });
  };

  const handleDownloadLease = () => {
    // Implement lease download logic
    toast({
      title: "Download Started",
      description: "Your lease document is being downloaded"
    });
  };

  const handleAddNote = () => {
    // Implement note adding logic
    toast({
      title: "Add Note",
      description: "Note added to lease successfully"
    });
  };

  const handleCreateDamageReport = () => {
    // Implement damage report creation logic
    toast({
      title: "Damage Report",
      description: "New damage report created"
    });
  };

  const handleTerminateLease = () => {
    // Implement lease termination logic
    toast({
      title: "Lease Termination",
      description: "Lease termination process initiated"
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "expired":
        return <Badge className="bg-gray-500">Expired</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "terminated":
        return <Badge className="bg-red-500">Terminated</Badge>;
      default:
        return <Badge className="bg-blue-500">{status}</Badge>;
    }
  };
  
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "late":
        return <Badge className="bg-red-500">Late</Badge>;
      default:
        return <Badge className="bg-blue-500">{status}</Badge>;
    }
  };
  
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "lease":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "inventory":
        return <Check className="h-4 w-4 text-amber-500" />;
      case "receipt":
        return <Receipt className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <div className="flex items-center mb-2">
            <Button 
              variant="ghost" 
              className="p-0 mr-2 h-8 w-8" 
              onClick={() => navigate("/leases")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold">
              Lease #{lease.id}
            </h2>
            <div className="ml-3">
              {getStatusBadge(lease.status)}
            </div>
          </div>
          <p className="text-muted-foreground">{lease.property.name}, {lease.unit} • {formatDate(lease.startDate)} to {formatDate(lease.endDate)}</p>
        </div>
        
        <div className="flex mt-4 sm:mt-0 gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Actions
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href={`/edit-lease/${lease.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Lease
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRenewLease()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Renew Lease
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownloadLease()}>
                <Download className="mr-2 h-4 w-4" />
                Download Lease
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddNote()}>
                <FileText className="mr-2 h-4 w-4" />
                Add Note
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCreateDamageReport()}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Damage Report
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleTerminateLease()} className="text-destructive">
                <X className="mr-2 h-4 w-4" />
                Terminate Lease
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href={`/edit-tenant/${lease.tenants[0].id}`}>
            <Button variant="outline" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Edit Tenants
            </Button>
          </Link>
        </div>
      </div>
      
      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Lease Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <FileText className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Lease #{lease.id}</div>
                      <div className="text-sm text-muted-foreground">{lease.type}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Calendar className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <div>{formatDate(lease.startDate)} to {formatDate(lease.endDate)}</div>
                      <div className="text-sm text-muted-foreground">{lease.term} term</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Monthly Rent</div>
                      <div className="font-medium">${lease.rentAmount}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Late Fee</div>
                      <div className="font-medium">${lease.lateFee}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Security Deposit</div>
                      <div className="font-medium">${lease.securityDeposit}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Pet Deposit</div>
                      <div className="font-medium">${lease.petDeposit}</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="font-medium mb-1">Lease Documents</div>
                    {lease.documents.slice(0, 2).map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between py-1">
                        <div className="flex items-center">
                          {getDocumentIcon(doc.type)}
                          <span className="ml-2">{doc.name}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <Button variant="link" className="p-0 h-8 text-sm" onClick={() => setActiveTab("documents")}>
                      View all documents
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="font-medium mb-1">Notes</div>
                    <div className="text-sm">{lease.notes}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Property Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Building className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{lease.property.name}</div>
                      <div className="text-sm text-muted-foreground">Property</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Home className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{lease.unit}</div>
                      <div className="text-sm text-muted-foreground">Unit</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <div>{lease.property.address}</div>
                      <div>{lease.property.city}, {lease.property.state} {lease.property.zipCode}</div>
                      <div className="text-sm text-muted-foreground">Address</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="font-medium mb-1">Tenants</div>
                    {lease.tenants.map((tenant) => (
                      <div key={tenant.id} className="flex items-center justify-between py-1">
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-blue-500 mr-2" />
                          <span>{tenant.name}</span>
                        </div>
                        <Link href={`/view-tenant/${tenant.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    ))}
                    
                    <Button variant="link" className="p-0 h-8 text-sm" onClick={() => setActiveTab("tenants")}>
                      View all tenants
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="font-medium mb-1">Recent Payments</div>
                    {lease.payments.slice(0, 2).map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between py-1">
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 text-green-500 mr-2" />
                          <span>${payment.amount} • {formatDate(payment.date)}</span>
                        </div>
                        <div>
                          {getPaymentStatusBadge(payment.status)}
                        </div>
                      </div>
                    ))}
                    
                    <Button variant="link" className="p-0 h-8 text-sm" onClick={() => setActiveTab("payments")}>
                      View all payments
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tenants" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>Lease Tenants</span>
                <Button size="sm">
                  <Users className="mr-2 h-4 w-4" />
                  Add Tenant
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lease.tenants.map((tenant) => (
                  <div key={tenant.id} className="flex items-start justify-between border p-4 rounded-md">
                    <div className="flex items-start space-x-4">
                      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">{tenant.name}</div>
                        <div className="text-sm text-muted-foreground flex flex-col sm:flex-row sm:space-x-4">
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            <span>{tenant.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            <span>{tenant.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/view-tenant/${tenant.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
                <span>Lease Documents</span>
                <Button size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lease.documents.map((doc) => (
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
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>Payment History</span>
                <Link href={`/add-payment?lease=${lease.id}`}>
                  <Button size="sm">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Record Payment
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted">
                    <tr>
                      <th scope="col" className="px-4 py-3">ID</th>
                      <th scope="col" className="px-4 py-3">Date</th>
                      <th scope="col" className="px-4 py-3">Type</th>
                      <th scope="col" className="px-4 py-3">Amount</th>
                      <th scope="col" className="px-4 py-3">Status</th>
                      <th scope="col" className="px-4 py-3">Receipt</th>
                      <th scope="col" className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lease.payments.map((payment) => (
                      <tr key={payment.id} className="border-b">
                        <td className="px-4 py-3 font-medium">#{payment.id}</td>
                        <td className="px-4 py-3">{formatDate(payment.date)}</td>
                        <td className="px-4 py-3">{payment.type}</td>
                        <td className="px-4 py-3">${payment.amount}</td>
                        <td className="px-4 py-3">{getPaymentStatusBadge(payment.status)}</td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Download className="h-4 w-4" />
                          </Button>
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="link" className="h-8 p-0">
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ViewLease;