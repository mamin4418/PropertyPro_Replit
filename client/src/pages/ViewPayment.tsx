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
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  Building,
  Calendar,
  Check,
  CreditCard,
  Download,
  Edit,
  FileText,
  Home,
  Info,
  User
} from "lucide-react";

// Mock data for a payment
const payment = {
  id: 201,
  type: "income",
  category: "Rent",
  amount: 1200,
  date: "2023-04-05",
  paymentMethod: "Bank Transfer",
  referenceNumber: "REF-123456",
  status: "completed",
  property: {
    id: 1,
    name: "Sunset Heights",
    unit: "Apt 101"
  },
  tenant: {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com"
  },
  lease: {
    id: 101,
    startDate: "2022-06-15",
    endDate: "2023-06-14"
  },
  description: "April 2023 rent payment",
  receiptUrl: "/receipts/receipt-123456.pdf",
  createdBy: "Admin User",
  createdAt: "2023-04-05T10:30:00Z",
  notes: "Payment received on time"
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatDateTime = (dateTimeString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateTimeString).toLocaleString(undefined, options);
};

const ViewPayment = () => {
  const [, navigate] = useLocation();
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>;
      case "refunded":
        return <Badge className="bg-blue-500">Refunded</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
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
              onClick={() => navigate("/payments")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold">
              Payment #{payment.id}
            </h2>
            <div className="ml-3">
              {getStatusBadge(payment.status)}
            </div>
          </div>
          <p className="text-muted-foreground">
            {payment.category} payment • {formatDate(payment.date)} • ${payment.amount}
          </p>
        </div>
        
        <div className="flex mt-4 sm:mt-0 gap-2">
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => window.open(payment.receiptUrl, '_blank')}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Receipt
          </Button>
          <Link href={`/edit-payment/${payment.id}`}>
            <Button className="flex items-center">
              <Edit className="mr-2 h-4 w-4" />
              Edit Payment
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Payment ID</span>
                <span className="font-medium">#{payment.id}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Type</span>
                <div className="flex items-center">
                  {payment.type === "income" ? (
                    <>
                      <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                      <span className="font-medium">Income</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownLeft className="h-4 w-4 text-red-500 mr-1" />
                      <span className="font-medium">Expense</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{payment.category}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">${payment.amount}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{formatDate(payment.date)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Status</span>
                <div>{getStatusBadge(payment.status)}</div>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Payment Method</span>
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="font-medium">{payment.paymentMethod}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Reference Number</span>
                <span className="font-medium">{payment.referenceNumber}</span>
              </div>
              
              <div className="py-2">
                <span className="text-muted-foreground">Description</span>
                <p className="font-medium mt-1">{payment.description}</p>
              </div>
              
              <Separator />
              
              <div className="py-2">
                <span className="text-muted-foreground">Notes</span>
                <p className="mt-1">{payment.notes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Related Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm text-muted-foreground mb-2">Property</h4>
                  <div className="flex items-start space-x-3 p-3 border rounded-md">
                    <Building className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <div className="font-medium">{payment.property.name}</div>
                      <div className="text-sm text-muted-foreground">Unit: {payment.property.unit}</div>
                      <Link href={`/properties/${payment.property.id}`}>
                        <Button variant="link" className="h-auto p-0 text-sm">View Property</Button>
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm text-muted-foreground mb-2">Tenant</h4>
                  <div className="flex items-start space-x-3 p-3 border rounded-md">
                    <User className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <div className="font-medium">{payment.tenant.name}</div>
                      <div className="text-sm text-muted-foreground">{payment.tenant.email}</div>
                      <Link href={`/view-tenant/${payment.tenant.id}`}>
                        <Button variant="link" className="h-auto p-0 text-sm">View Tenant</Button>
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm text-muted-foreground mb-2">Lease Information</h4>
                  <div className="flex items-start space-x-3 p-3 border rounded-md">
                    <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Lease #{payment.lease.id}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(payment.lease.startDate)} to {formatDate(payment.lease.endDate)}
                      </div>
                      <Link href={`/view-lease/${payment.lease.id}`}>
                        <Button variant="link" className="h-auto p-0 text-sm">View Lease</Button>
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm text-muted-foreground mb-2">Receipt</h4>
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-500 mr-2" />
                      <span>Payment Receipt</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center"
                      onClick={() => window.open(payment.receiptUrl, '_blank')}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Payment Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="h-7 w-7 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Payment completed</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDateTime(payment.createdAt)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="h-7 w-7 rounded-full bg-blue-500 flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Payment recorded</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDateTime(payment.createdAt)}
                    </div>
                    <div className="text-sm text-muted-foreground">By: {payment.createdBy}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewPayment;