
import { useCallback, useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Drill, Plus, Search, Eye, Edit, Trash2, 
  ChevronLeft, ChevronRight, CircleAlert, 
  CheckCircle, CalendarClock, Home 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

interface MaintenanceRequest {
  id: number;
  title: string;
  propertyId: number;
  unitId: number;
  priority: string;
  reportedDate: string;
  status: string;
  reportedBy: string;
  assignedTo: string | null;
  description: string;
  propertyName?: string;
}

const Maintenance = () => {
  const [_, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // Options: all, open, inProgress, completed
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assignedFilter, setAssignedFilter] = useState("all");
  
  const { data: maintenanceRequests = [], isLoading } = useQuery<MaintenanceRequest[]>({
    queryKey: ['/api/maintenance-requests'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/maintenance-requests');
        if (!res.ok) throw new Error('Failed to fetch maintenance requests');
        return res.json();
      } catch (err) {
        console.error('Error fetching maintenance requests:', err);
        throw err;
      }
    },
  });

  const { data: properties = [] } = useQuery({
    queryKey: ['/api/properties'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/properties');
        if (!res.ok) throw new Error('Failed to fetch properties');
        return res.json();
      } catch (err) {
        console.error('Error fetching properties:', err);
        throw err;
      }
    },
  });
  
  // Get status badge color and title
  const getStatusBadge = useCallback((status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Open</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">In Progress</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      default:
        return <Badge variant="outline">{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
    }
  }, []);
  
  // Get priority badge
  const getPriorityBadge = useCallback((priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge className="bg-red-500 hover:bg-red-600">Urgent</Badge>;
      case "normal":
        return <Badge variant="secondary">Normal</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{priority.charAt(0).toUpperCase() + priority.slice(1)}</Badge>;
    }
  }, []);
  
  // Format date to human readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleResetFilters = () => {
    setPropertyFilter("all");
    setPriorityFilter("all");
    setAssignedFilter("all");
    setSearchQuery("");
  };
  
  // Apply filters to the maintenance requests
  const filteredRequests = maintenanceRequests.filter(request => {
    // Apply status filter based on tab
    if (activeTab === "open" && request.status !== "open") return false;
    if (activeTab === "inProgress" && request.status !== "in-progress") return false;
    if (activeTab === "completed" && request.status !== "completed") return false;
    
    // Apply property filter
    if (propertyFilter !== "all" && request.propertyId !== parseInt(propertyFilter)) return false;
    
    // Apply priority filter
    if (priorityFilter !== "all" && request.priority !== priorityFilter) return false;
    
    // Apply assigned filter
    if (assignedFilter === "assigned" && !request.assignedTo) return false;
    if (assignedFilter === "unassigned" && request.assignedTo) return false;
    if (assignedFilter !== "all" && assignedFilter !== "assigned" && assignedFilter !== "unassigned" && 
        request.assignedTo !== assignedFilter) return false;
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        request.title.toLowerCase().includes(query) ||
        request.description?.toLowerCase().includes(query) ||
        request.reportedBy?.toLowerCase().includes(query) ||
        (request.assignedTo && request.assignedTo.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  // Get counts for summary cards
  const openCount = maintenanceRequests.filter(req => req.status === "open").length;
  const urgentCount = maintenanceRequests.filter(req => req.priority === "urgent").length;
  const completedThisMonthCount = maintenanceRequests.filter(req => {
    if (req.status !== "completed") return false;
    const completedDate = new Date(req.reportedDate);
    const now = new Date();
    return completedDate.getMonth() === now.getMonth() && 
           completedDate.getFullYear() === now.getFullYear();
  }).length;
  
  // Get property name by id
  const getPropertyName = (propertyId: number) => {
    const property = properties.find(p => p.id === propertyId);
    return property?.name || `Property #${propertyId}`;
  };

  // List of staff for the assignee filter
  const staffList = [
    { id: "james", name: "James Wilson" },
    { id: "maria", name: "Maria Garcia" },
    { id: "david", name: "David Chen" }
  ];
  
  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Maintenance Requests</h2>
          <p className="text-muted-foreground">Track and manage property maintenance issues</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => navigate("/add-maintenance")}>
            <Plus className="mr-2 h-4 w-4" /> New Request
          </Button>
        </div>
      </div>
      
      {/* Maintenance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Open Requests</p>
                <h3 className="text-3xl font-bold">{openCount}</h3>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <Drill className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Urgent Issues</p>
                <h3 className="text-3xl font-bold">{urgentCount}</h3>
              </div>
              <div className="bg-red-100 p-2 rounded-full">
                <CircleAlert className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Resolved This Month</p>
                <h3 className="text-3xl font-bold">{completedThisMonthCount}</h3>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="w-full sm:w-auto">
              <Label className="mb-1 block">Property</Label>
              <Select 
                value={propertyFilter} 
                onValueChange={(value) => setPropertyFilter(value)}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Properties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  {properties.map(property => (
                    <SelectItem key={property.id} value={property.id.toString()}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-auto">
              <Label className="mb-1 block">Priority</Label>
              <Select 
                value={priorityFilter} 
                onValueChange={(value) => setPriorityFilter(value)}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-auto">
              <Label className="mb-1 block">Assigned To</Label>
              <Select 
                value={assignedFilter} 
                onValueChange={(value) => setAssignedFilter(value)}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Staff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Staff</SelectItem>
                  {staffList.map(staff => (
                    <SelectItem key={staff.id} value={staff.id}>{staff.name}</SelectItem>
                  ))}
                  <SelectItem value="assigned">Any Assigned</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-auto sm:ml-auto sm:self-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleResetFilters}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Maintenance Requests Tabs */}
      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="inProgress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="pt-4">
          <MaintenanceTable 
            requests={filteredRequests}
            getStatusBadge={getStatusBadge}
            getPriorityBadge={getPriorityBadge}
            formatDate={formatDate}
            isLoading={isLoading}
            getPropertyName={getPropertyName}
          />
        </TabsContent>
        
        <TabsContent value="open" className="pt-4">
          <MaintenanceTable 
            requests={filteredRequests}
            getStatusBadge={getStatusBadge}
            getPriorityBadge={getPriorityBadge}
            formatDate={formatDate}
            isLoading={isLoading}
            getPropertyName={getPropertyName}
          />
        </TabsContent>
        
        <TabsContent value="inProgress" className="pt-4">
          <MaintenanceTable 
            requests={filteredRequests}
            getStatusBadge={getStatusBadge}
            getPriorityBadge={getPriorityBadge}
            formatDate={formatDate}
            isLoading={isLoading}
            getPropertyName={getPropertyName}
          />
        </TabsContent>
        
        <TabsContent value="completed" className="pt-4">
          <MaintenanceTable 
            requests={filteredRequests}
            getStatusBadge={getStatusBadge}
            getPriorityBadge={getPriorityBadge}
            formatDate={formatDate}
            isLoading={isLoading}
            getPropertyName={getPropertyName}
          />
        </TabsContent>
      </Tabs>
      
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredRequests.length}</span> of <span className="font-medium">{maintenanceRequests.length}</span> results
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button variant="outline" size="sm" className="bg-primary/5">1</Button>
          <Button variant="outline" size="sm">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

interface MaintenanceTableProps {
  requests: MaintenanceRequest[];
  getStatusBadge: (status: string) => JSX.Element;
  getPriorityBadge: (priority: string) => JSX.Element;
  formatDate: (date: string) => string;
  isLoading: boolean;
  getPropertyName: (id: number) => string;
}

const MaintenanceTable = ({ 
  requests, 
  getStatusBadge, 
  getPriorityBadge, 
  formatDate,
  isLoading,
  getPropertyName
}: MaintenanceTableProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-md bg-muted"></div>
                <div className="space-y-2">
                  <div className="h-4 w-[250px] rounded bg-muted"></div>
                  <div className="h-4 w-[200px] rounded bg-muted"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <CalendarClock className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <h3 className="text-xl font-semibold">No Maintenance Requests Found</h3>
          <p className="text-muted-foreground">
            There are no maintenance requests matching your filters.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Reported</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.title}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Home className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span>{getPropertyName(request.propertyId)}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Unit #{request.unitId}</div>
                </TableCell>
                <TableCell>
                  <div>{formatDate(request.reportedDate)}</div>
                  <div className="text-sm text-muted-foreground">by {request.reportedBy}</div>
                </TableCell>
                <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/view-maintenance/${request.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/edit-maintenance/${request.id}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Maintenance;
