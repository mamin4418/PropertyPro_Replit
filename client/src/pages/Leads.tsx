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
import { 
  UserPlus, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  MessageSquare, 
  UserCheck,
  Filter,
  ArrowUpDown
} from "lucide-react";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import type { Lead } from "@shared/schema";

const Leads = () => {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("lastContactDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Fetch leads data
  const { data: leads, isLoading, isError } = useQuery({
    queryKey: ['/api/leads'],
    queryFn: async () => {
      const response = await fetch('/api/leads');
      if (!response.ok) {
        throw new Error("Failed to fetch leads");
      }
      return response.json() as Promise<Lead[]>;
    },
  });

  // Sort and filter leads
  const filteredLeads = leads ? leads
    .filter(lead => 
      (statusFilter === "all" || lead.status === statusFilter) &&
      (searchQuery === "" || 
        `${lead.contactId}`.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      // Basic sorting - in a real implementation, this would be more sophisticated
      const aValue = a[sortField as keyof Lead];
      const bValue = b[sortField as keyof Lead];
      
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
      case "new":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">New</Badge>;
      case "contacted":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Contacted</Badge>;
      case "qualified":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Qualified</Badge>;
      case "disqualified":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Disqualified</Badge>;
      case "converted":
        return <Badge variant="outline" className="bg-emerald-100 text-emerald-800">Converted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Function to get interest level badge
  const getInterestBadge = (interest: string) => {
    switch (interest) {
      case "high":
        return <Badge className="bg-green-600">High</Badge>;
      case "medium":
        return <Badge variant="secondary">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mb-2 mx-auto" />
          <p>Loading leads information...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center p-10">
          <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
          <p className="mb-6">Failed to load leads information</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Lead Management</h1>
          <p className="text-muted-foreground">
            Track and manage potential tenants from initial contact to application
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/add-lead")}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Leads</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="contacted">Contacted</TabsTrigger>
            <TabsTrigger value="qualified">Qualified</TabsTrigger>
            <TabsTrigger value="follow-up">Need Follow-up</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search leads..."
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
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="disqualified">Disqualified</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>All Leads</CardTitle>
              <CardDescription>
                View and manage all lead records in the system
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
                        Contact
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
                    <TableHead>Interest</TableHead>
                    <TableHead>
                      <button 
                        className="flex items-center"
                        onClick={() => handleSort('source')}
                      >
                        Source
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead>
                      <button 
                        className="flex items-center"
                        onClick={() => handleSort('lastContactDate')}
                      >
                        Last Contact
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-32">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <UserPlus className="h-8 w-8 mb-2" />
                          <p>No leads found. Start by adding a lead.</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => navigate("/add-lead")}
                          >
                            <Plus className="mr-1 h-4 w-4" />
                            Add Lead
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">
                          {/* In a real app, you would join with contacts table */}
                          Contact #{lead.contactId}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(lead.status)}
                        </TableCell>
                        <TableCell>
                          {lead.interestLevel && getInterestBadge(lead.interestLevel)}
                        </TableCell>
                        <TableCell>{lead.source || "—"}</TableCell>
                        <TableCell>
                          {lead.lastContactDate ? (
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                              {format(new Date(lead.lastContactDate), "MMM d, yyyy")}
                            </div>
                          ) : "—"}
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
                              <DropdownMenuItem onClick={() => navigate(`/view-lead/${lead.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/edit-lead/${lead.id}`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/communicate/${lead.id}`)}>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Send Message
                              </DropdownMenuItem>
                              {lead.status !== "converted" && (
                                <DropdownMenuItem onClick={() => navigate(`/applications/new?leadId=${lead.id}`)}>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Create Application
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
        <TabsContent value="new" className="mt-0">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>New Leads</CardTitle>
              <CardDescription>
                Leads that need initial contact
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar table with filtered data for new leads */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacted" className="mt-0">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Contacted Leads</CardTitle>
              <CardDescription>
                Leads that have been contacted but need qualification
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar table with filtered data for contacted leads */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qualified" className="mt-0">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Qualified Leads</CardTitle>
              <CardDescription>
                Leads that are ready for applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar table with filtered data for qualified leads */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="follow-up" className="mt-0">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Needs Follow-up</CardTitle>
              <CardDescription>
                Leads with scheduled follow-ups
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar table with filtered data for follow-up leads */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Leads;