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
  AlertCircle,
  ArrowLeft,
  Building,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Download,
  Edit,
  FileText,
  Home,
  Image,
  MapPin,
  MessageCircle,
  MessagesSquare,
  Phone,
  Wrench,
  User,
  X
} from "lucide-react";

// Mock data for a maintenance request
const maintenance = {
  id: 101,
  title: "Leaking Faucet in Kitchen",
  description: "The kitchen faucet has been leaking steadily for two days. Water is pooling in the sink and cabinet below.",
  status: "in-progress",
  priority: "medium",
  category: "Plumbing",
  requestDate: "2023-03-15T10:30:00Z",
  scheduledDate: "2023-03-17T14:00:00Z",
  completedDate: null,
  estimatedCost: 150,
  actualCost: null,
  property: {
    id: 1,
    name: "Sunset Heights",
    address: "123 Main St, New York, NY 10001"
  },
  unit: "Apt 101",
  tenant: {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567"
  },
  assignedTo: {
    id: 1,
    name: "Mike's Plumbing",
    type: "vendor",
    phone: "(555) 987-6543"
  },
  images: [
    { id: 1, url: "/maintenance/image1.jpg", thumbnail: "/maintenance/thumb1.jpg" },
    { id: 2, url: "/maintenance/image2.jpg", thumbnail: "/maintenance/thumb2.jpg" }
  ],
  comments: [
    { 
      id: 1, 
      author: "John Doe", 
      role: "tenant",
      content: "Water is now leaking faster and causing damage to the cabinet.", 
      date: "2023-03-16T09:15:00Z" 
    },
    { 
      id: 2, 
      author: "Admin User", 
      role: "admin",
      content: "Contacted Mike's Plumbing. They will visit tomorrow at 2 PM.", 
      date: "2023-03-16T10:30:00Z" 
    },
    { 
      id: 3, 
      author: "Mike's Plumbing", 
      role: "vendor",
      content: "Will need to replace the faucet. Will bring parts tomorrow.", 
      date: "2023-03-16T11:45:00Z" 
    }
  ],
  history: [
    { id: 1, action: "Request created", by: "John Doe", date: "2023-03-15T10:30:00Z" },
    { id: 2, action: "Status changed to 'in-progress'", by: "Admin User", date: "2023-03-16T10:30:00Z" },
    { id: 3, action: "Assigned to Mike's Plumbing", by: "Admin User", date: "2023-03-16T10:35:00Z" }
  ]
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

const ViewMaintenance = () => {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("details");
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-500">Open</Badge>;
      case "in-progress":
        return <Badge className="bg-yellow-500">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-gray-500">Cancelled</Badge>;
      default:
        return <Badge className="bg-blue-500">{status}</Badge>;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return <Badge className="bg-blue-500">Low</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case "high":
        return <Badge className="bg-orange-500">High</Badge>;
      case "urgent":
        return <Badge className="bg-red-500">Urgent</Badge>;
      default:
        return <Badge className="bg-gray-500">{priority}</Badge>;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case "in-progress":
        <Clock className="h-5 w-5 text-yellow-500" />;
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <X className="h-5 w-5 text-gray-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const getCommentIcon = (role: string) => {
    switch (role) {
      case "tenant":
        return <User className="h-5 w-5 text-blue-500" />;
      case "admin":
        return <ClipboardCheck className="h-5 w-5 text-purple-500" />;
      case "vendor":
        return <Wrench className="h-5 w-5 text-amber-500" />;
      default:
        return <MessageCircle className="h-5 w-5 text-gray-500" />;
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
              onClick={() => navigate("/maintenance")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold">
              Maintenance Request #{maintenance.id}
            </h2>
            <div className="ml-3">
              {getStatusBadge(maintenance.status)}
            </div>
          </div>
          <p className="text-muted-foreground">
            {maintenance.property.name}, {maintenance.unit} • Created on {formatDate(maintenance.requestDate)}
          </p>
        </div>
        
        <div className="flex mt-4 sm:mt-0 gap-2">
          <Link href={`/edit-maintenance/${maintenance.id}`}>
            <Button variant="outline" className="flex items-center">
              <Edit className="mr-2 h-4 w-4" />
              Edit Request
            </Button>
          </Link>
          <Button className="flex items-center">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Mark as Complete
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Request Information</CardTitle>
                <CardDescription>
                  {maintenance.title}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                    <p>{maintenance.description}</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex flex-col space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <div>{getStatusBadge(maintenance.status)}</div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Priority</span>
                      <div>{getPriorityBadge(maintenance.priority)}</div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium">{maintenance.category}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex flex-col space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date Requested</span>
                      <span className="font-medium">{formatDateTime(maintenance.requestDate)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Scheduled Date</span>
                      <span className="font-medium">{formatDateTime(maintenance.scheduledDate)}</span>
                    </div>
                    
                    {maintenance.completedDate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Completed Date</span>
                        <span className="font-medium">{formatDateTime(maintenance.completedDate)}</span>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex flex-col space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated Cost</span>
                      <span className="font-medium">${maintenance.estimatedCost}</span>
                    </div>
                    
                    {maintenance.actualCost && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Actual Cost</span>
                        <span className="font-medium">${maintenance.actualCost}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Property Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Building className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <div className="font-medium">{maintenance.property.name}</div>
                        <div className="text-sm text-muted-foreground">Property</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Home className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <div className="font-medium">{maintenance.unit}</div>
                        <div className="text-sm text-muted-foreground">Unit</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <div className="font-medium">{maintenance.property.address}</div>
                        <div className="text-sm text-muted-foreground">Address</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Tenant</h4>
                      <div className="flex items-start space-x-3 p-3 border rounded-md">
                        <User className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                          <div className="font-medium">{maintenance.tenant.name}</div>
                          <div className="text-sm text-muted-foreground flex flex-col sm:flex-row sm:space-x-4">
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              <span>{maintenance.tenant.email}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              <span>{maintenance.tenant.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Assigned To</h4>
                      <div className="flex items-start space-x-3 p-3 border rounded-md">
                        <Tool className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <div className="font-medium">{maintenance.assignedTo.name}</div>
                          <div className="text-sm text-muted-foreground">{maintenance.assignedTo.type}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            <span>{maintenance.assignedTo.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>Images & Photos</span>
                <Button size="sm">
                  <Image className="mr-2 h-4 w-4" />
                  Add Images
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {maintenance.images.map((image) => (
                  <div key={image.id} className="border rounded-md overflow-hidden">
                    <div className="aspect-video bg-secondary/50 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Image className="h-10 w-10 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <span className="text-sm">Maintenance Photo {image.id}</span>
                      <Button variant="outline" size="sm" className="h-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comments" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>Comments & Updates</span>
                <Button size="sm">
                  <MessagesSquare className="mr-2 h-4 w-4" />
                  Add Comment
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenance.comments.map((comment) => (
                  <div key={comment.id} className="p-4 border rounded-md">
                    <div className="flex items-start space-x-3">
                      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                        {getCommentIcon(comment.role)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <div className="font-medium">{comment.author}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDateTime(comment.date)}
                          </div>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Activity History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenance.history.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3">
                    <div className="flex flex-col items-center">
                      <div className="h-6 w-6 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center">
                      </div>
                      {item.id !== maintenance.history.length && (
                        <div className="w-0.5 h-10 bg-blue-200"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{item.action}</div>
                      <div className="text-sm text-muted-foreground flex items-center space-x-2">
                        <span>{formatDateTime(item.date)}</span>
                        <span>•</span>
                        <span>By: {item.by}</span>
                      </div>
                    </div>
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

export default ViewMaintenance;