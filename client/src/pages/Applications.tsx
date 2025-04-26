import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  ClipboardCheck, 
  Search, 
  PlusCircle, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  FileCheck,
  XCircle,
  CheckCircle,
  Clock,
  ArrowUpDown,
  Filter,
  AlertCircle
} from "lucide-react";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import type { RentalApplication } from "@shared/schema";

const Applications = () => {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("submissionDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Fetch application data
  const { data: applications, isLoading, isError } = useQuery({
    queryKey: ['/api/applications'],
    queryFn: async () => {
      const response = await fetch('/api/applications');
      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }
      return response.json() as Promise<RentalApplication[]>;
    },
  });

  // Sort and filter applications
  const filteredApplications = applications ? applications
    .filter(app => 
      (statusFilter === "all" || app.status === statusFilter) &&
      (searchQuery === "" || 
        `${app.contactId}`.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      // Basic sorting - in a real implementation, this would be more sophisticated
      const aValue = a[sortField as keyof RentalApplication];
      const bValue = b[sortField as keyof RentalApplication];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === 'asc' 
          ? aValue.getTime() - bValue.getTime() 
          : bValue.getTime() - aValue.getTime();
      }
      
      return 0;
    }) : [];

  // Handle sort change
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Function to get appropriate status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Submitted</Badge>;
      case "under review":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Under Review</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>;
      case "denied":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Denied</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Calculate screening progress percentage
  const calculateProgress = (application: RentalApplication) => {
    let completedSteps = 0;
    let totalSteps = 5; // Adjust based on your screening steps
    
    if (application.applicationFeePaid) completedSteps++;
    if (application.backgroundCheckComplete) completedSteps++;
    if (application.creditCheckComplete) completedSteps++;
    if (application.incomeVerified) completedSteps++;
    if (application.rentalHistoryVerified) completedSteps++;
    
    return (completedSteps / totalSteps) * 100;
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mb-2 mx-auto" />
          <p>Loading application information...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center p-10">
          <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
          <p className="mb-6">Failed to load application information</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Rental Applications</h1>
          <p className="text-muted-foreground">
            Review and process tenant applications
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/application-templates")}>
            <FileCheck className="mr-2 h-4 w-4" />
            Application Templates
          </Button>
          <Button onClick={() => navigate("/applications/new")} variant="default">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Application
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Applications</TabsTrigger>
            <TabsTrigger value="submitted">Submitted</TabsTrigger>
            <TabsTrigger value="under review">Under Review</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="denied">Denied</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search applications..."
                className="pl-8 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>All Applications</CardTitle>
              <CardDescription>
                View and manage all tenant applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">
                      <button 
                        className="flex items-center"
                        onClick={() => handleSort('contactId')}
                      >
                        Applicant
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead>
                      <button 
                        className="flex items-center"
                        onClick={() => handleSort('status')}
                      >
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead>
                      <button 
                        className="flex items-center"
                        onClick={() => handleSort('propertyId')}
                      >
                        Property/Unit
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead>
                      <button 
                        className="flex items-center"
                        onClick={() => handleSort('submissionDate')}
                      >
                        Submission Date
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead>Screening Progress</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-32">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <ClipboardCheck className="h-8 w-8 mb-2" />
                          <p>No applications found. Start by creating a new application.</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => navigate("/applications/new")}
                          >
                            <PlusCircle className="mr-1 h-4 w-4" />
                            New Application
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApplications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">
                          {/* In a real app, you would join with contacts table */}
                          Contact #{application.contactId}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(application.status)}
                        </TableCell>
                        <TableCell>
                          {/* In a real app, this would be the property/unit info */}
                          {application.vacancyId ? `Vacancy #${application.vacancyId}` : "—"}
                        </TableCell>
                        <TableCell>
                          {application.submissionDate ? (
                            format(new Date(application.submissionDate), "MMM d, yyyy")
                          ) : "—"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={calculateProgress(application)} className="h-2" />
                            <span className="text-sm text-muted-foreground">
                              {Math.round(calculateProgress(application))}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/view-application/${application.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              {application.status === "submitted" && (
                                <DropdownMenuItem onClick={() => navigate(`/screen-application/${application.id}`)}>
                                  <Clock className="mr-2 h-4 w-4" />
                                  Begin Review
                                </DropdownMenuItem>
                              )}
                              {application.status === "under review" && (
                                <>
                                  <DropdownMenuItem onClick={() => navigate(`/screen-application/${application.id}`)}>
                                    <Clock className="mr-2 h-4 w-4" />
                                    Continue Review
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {/* Approval action */}}>
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {/* Denial action */}}>
                                    <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                    Deny
                                  </DropdownMenuItem>
                                </>
                              )}
                              {application.status === "approved" && (
                                <DropdownMenuItem onClick={() => navigate(`/create-lease/${application.id}`)}>
                                  <FileCheck className="mr-2 h-4 w-4" />
                                  Create Lease
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab content for other tabs would follow the same pattern */}
        <TabsContent value="submitted" className="mt-0">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Submitted Applications</CardTitle>
              <CardDescription>
                Recently submitted applications awaiting initial review
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar table with filtered data for submitted applications */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="under review" className="mt-0">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Applications Under Review</CardTitle>
              <CardDescription>
                Applications currently in the screening process
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar table with filtered data for applications under review */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="mt-0">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Approved Applications</CardTitle>
              <CardDescription>
                Applications that have been approved and are ready for lease generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar table with filtered data for approved applications */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="denied" className="mt-0">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Denied Applications</CardTitle>
              <CardDescription>
                Applications that have been denied
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar table with filtered data for denied applications */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Applications;