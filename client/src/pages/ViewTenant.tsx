import { useState } from "react";
import { useLocation, Link } from "wouter";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Building,
  Calendar,
  Check,
  FileCheck,
  FileText,
  Mail,
  MapPin,
  Phone,
  User,
  Download,
  Edit,
  FilePlus2,
  DollarSign,
  ClipboardList
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast"; // Added import


// Mock data for a tenant
const tenant = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "(555) 123-4567",
  status: "active",
  unit: "Apt 101",
  property: "Sunset Heights",
  moveinDate: "2022-06-15",
  leaseEnd: "2023-06-14",
  rentAmount: 1200,
  securityDeposit: 1200,
  petDeposit: 300,
  lastPayment: {
    date: "2023-04-05",
    amount: 1200,
    status: "paid"
  },
  address: "123 Main St, Apt 101",
  city: "New York",
  state: "NY",
  zipCode: "10001",
  emergencyContact: {
    name: "Jane Doe",
    relationship: "Sister",
    phone: "(555) 987-6543"
  },
  documents: [
    { name: "Lease Agreement.pdf", type: "lease", date: "2022-06-01", size: "1.2 MB" },
    { name: "Tenant Photo.jpg", type: "photo", date: "2022-06-01", size: "850 KB" },
    { name: "ID Document.pdf", type: "id", date: "2022-06-01", size: "1.5 MB" },
    { name: "Proof of Income.pdf", type: "income", date: "2022-05-28", size: "980 KB" },
    { name: "Background Check.pdf", type: "background", date: "2022-05-25", size: "1.1 MB" }
  ],
  maintenanceRequests: [
    { id: 101, title: "Leaky Faucet", date: "2023-02-10", status: "completed" },
    { id: 102, title: "Broken AC", date: "2023-03-15", status: "in-progress" }
  ],
  paymentHistory: [
    { id: 201, date: "2023-04-05", amount: 1200, status: "paid" },
    { id: 202, date: "2023-03-03", amount: 1200, status: "paid" },
    { id: 203, date: "2023-02-02", amount: 1200, status: "paid" },
    { id: 204, date: "2023-01-05", amount: 1200, status: "paid" }
  ],
  notes: "Tenant has a small dog. Prefers to be contacted by email."
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const CommunicationForm = ({ recipientEmail, recipientPhone, onSend }) => {
  const [message, setMessage] = useState("");
  const [type, setType] = useState("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSend(type, message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="email">Email</option>
        <option value="sms">SMS</option>
        <option value="whatsapp">WhatsApp</option>
      </select>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      <button type="submit">Send</button>
    </form>
  );
};


const CommunicationHistory = ({ communications }) => {
  return (
    <ul>
      {communications.map((comm) => (
        <li key={comm.id}>
          {comm.type}: {comm.content} ({comm.timestamp})
        </li>
      ))}
    </ul>
  );
};

const ViewTenant = () => {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("details");
  const { toast } = useToast(); //Added this line

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-500">Inactive</Badge>;
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

  const getRequestStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "urgent":
        return <Badge className="bg-red-500">Urgent</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "lease":
        return <FileCheck className="h-4 w-4 text-blue-500" />;
      case "id":
        return <User className="h-4 w-4 text-amber-500" />;
      case "income":
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case "background":
        return <ClipboardList className="h-4 w-4 text-purple-500" />;
      case "photo":
        return <User className="h-4 w-4 text-cyan-500" />;
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
              onClick={() => navigate("/tenants")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold">
              {tenant.firstName} {tenant.lastName}
            </h2>
            <div className="ml-3">
              {getStatusBadge(tenant.status)}
            </div>
          </div>
          <p className="text-muted-foreground">Tenant ID: #{tenant.id} • {tenant.property}, {tenant.unit}</p>
        </div>

        <div className="flex mt-4 sm:mt-0 gap-2">
          <Link href={`/edit-tenant/${tenant.id}`}>
            <Button variant="outline" className="flex items-center">
              <Edit className="mr-2 h-4 w-4" />
              Edit Tenant
            </Button>
          </Link>
          <Link href={`/add-lease?tenant=${tenant.id}`}>
            <Button className="flex items-center">
              <FilePlus2 className="mr-2 h-4 w-4" />
              New Lease
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <User className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{tenant.firstName} {tenant.lastName}</div>
                      <div className="text-sm text-muted-foreground">Primary Tenant</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <div>{tenant.email}</div>
                      <div className="text-sm text-muted-foreground">Email</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <div>{tenant.phone}</div>
                      <div className="text-sm text-muted-foreground">Phone</div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <div>{tenant.address}</div>
                      <div>{tenant.city}, {tenant.state} {tenant.zipCode}</div>
                      <div className="text-sm text-muted-foreground">Address</div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="font-medium mb-1">Emergency Contact</div>
                    <div>{tenant.emergencyContact.name} ({tenant.emergencyContact.relationship})</div>
                    <div>{tenant.emergencyContact.phone}</div>
                  </div>

                  <Separator />

                  <div>
                    <div className="font-medium mb-1">Notes</div>
                    <div className="text-sm">{tenant.notes}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Lease Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Building className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{tenant.property}</div>
                      <div>{tenant.unit}</div>
                      <div className="text-sm text-muted-foreground">Property & Unit</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <div>{formatDate(tenant.moveinDate)} to {formatDate(tenant.leaseEnd)}</div>
                      <div className="text-sm text-muted-foreground">Lease Term</div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Monthly Rent</div>
                      <div className="font-medium">${tenant.rentAmount}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Security Deposit</div>
                      <div className="font-medium">${tenant.securityDeposit}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Pet Deposit</div>
                      <div className="font-medium">${tenant.petDeposit}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Last Payment</div>
                      <div className="font-medium">${tenant.lastPayment.amount}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(tenant.lastPayment.date)}</div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center mb-2">
                      <div className="font-medium">Lease Documents</div>
                      <span className="text-xs text-muted-foreground ml-2">{tenant.documents.filter(d => d.type === "lease").length} documents</span>
                    </div>

                    {tenant.documents.filter(d => d.type === "lease").map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between py-1">
                        <div className="flex items-center">
                          <FileCheck className="h-4 w-4 text-blue-500 mr-2" />
                          <span>{doc.name}</span>
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
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>Tenant Documents</span>
                <Button size="sm">
                  <FilePlus2 className="mr-2 h-4 w-4" />
                  Add Document
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tenant.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between border p-3 rounded-md">
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

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>Payment History</span>
                <Link href={`/add-payment?tenant=${tenant.id}`}>
                  <Button size="sm">
                    <FilePlus2 className="mr-2 h-4 w-4" />
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
                      <th scope="col" className="px-4 py-3">Amount</th>
                      <th scope="col" className="px-4 py-3">Status</th>
                      <th scope="col" className="px-4 py-3">Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenant.paymentHistory.map((payment) => (
                      <tr key={payment.id} className="border-b">
                        <td className="px-4 py-3 font-medium">#{payment.id}</td>
                        <td className="px-4 py-3">{formatDate(payment.date)}</td>
                        <td className="px-4 py-3">${payment.amount}</td>
                        <td className="px-4 py-3">{getPaymentStatusBadge(payment.status)}</td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Download className="h-4 w-4" />
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

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>Maintenance Requests</span>
                <Link href={`/add-maintenance?tenant=${tenant.id}`}>
                  <Button size="sm">
                    <FilePlus2 className="mr-2 h-4 w-4" />
                    Add Request
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
                      <th scope="col" className="px-4 py-3">Request</th>
                      <th scope="col" className="px-4 py-3">Date</th>
                      <th scope="col" className="px-4 py-3">Status</th>
                      <th scope="col" className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenant.maintenanceRequests.map((request) => (
                      <tr key={request.id} className="border-b">
                        <td className="px-4 py-3 font-medium">#{request.id}</td>
                        <td className="px-4 py-3">{request.title}</td>
                        <td className="px-4 py-3">{formatDate(request.date)}</td>
                        <td className="px-4 py-3">{getRequestStatusBadge(request.status)}</td>
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
        <TabsContent value="communications">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Send Message</CardTitle>
                <CardDescription>Send an email, SMS, or WhatsApp message to the tenant</CardDescription>
              </CardHeader>
              <CardContent>
                <CommunicationForm
                  recipientEmail={tenant.email}
                  recipientPhone={tenant.phone}
                  onSend={async (type, message) => {
                    try {
                      await fetch("/api/communications", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          type,
                          message,
                          tenantId: tenant.id,
                        }),
                      });
                      const { toast } = useToast(); //Corrected this line
                      toast({
                        title: "Message sent successfully",
                        description: "The message has been sent to the tenant.",
                      });
                    } catch (error) {
                      const { toast } = useToast(); //Corrected this line
                      toast({
                        title: "Failed to send message",
                        description: "There was an error sending the message.",
                        variant: "destructive",
                      });
                    }
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Communication History</CardTitle>
                <CardDescription>View all previous communications with this tenant</CardDescription>
              </CardHeader>
              <CardContent>
                <CommunicationHistory
                  communications={[
                    {
                      id: 1,
                      type: "email",
                      content: "Your rent payment is due in 5 days",
                      timestamp: new Date().toISOString(),
                      sender: "System",
                      recipient: tenant.email,
                    },
                    // Add more sample communications here
                  ]}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ViewTenant;