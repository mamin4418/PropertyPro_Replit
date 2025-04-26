import { useCallback, useState } from "react";
import { Link } from "wouter";
import { FileText, Plus, Search, Eye, Edit, Trash2, ChevronLeft, ChevronRight, CalendarRange, AlertTriangle } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Mock data for demonstration
const leases = [
  {
    id: 1,
    tenant: "John Smith",
    property: "Sunset Heights",
    unit: "Apt 101",
    startDate: "2023-01-01",
    endDate: "2024-01-01",
    rent: 1200,
    status: "active"
  },
  {
    id: 2,
    tenant: "Sarah Johnson",
    property: "Maple Gardens",
    unit: "Unit 3B",
    startDate: "2023-04-15",
    endDate: "2023-08-15",
    rent: 950,
    status: "expiring-soon"
  },
  {
    id: 3,
    tenant: "Mike Smith",
    property: "Urban Lofts",
    unit: "Unit 2A",
    startDate: "2023-03-01",
    endDate: "2024-03-01",
    rent: 1450,
    status: "active"
  },
  {
    id: 4,
    tenant: "Jennifer Lee",
    property: "Sunset Heights",
    unit: "Apt 205",
    startDate: "2022-07-15",
    endDate: "2023-07-15",
    rent: 1100,
    status: "expiring"
  },
  {
    id: 5,
    tenant: "Robert Taylor",
    property: "Riverfront Condos",
    unit: "Condo 12B",
    startDate: "2023-02-01",
    endDate: "2024-02-01",
    rent: 1800,
    status: "active"
  }
];

const Leases = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get status badge color
  const getStatusBadge = useCallback((status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
      case "expiring-soon":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Expiring Soon</Badge>;
      case "expiring":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Expiring</Badge>;
      case "expired":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Expired</Badge>;
      case "renewal":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Up for Renewal</Badge>;
      default:
        return <Badge variant="outline">{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
    }
  }, []);
  
  // Format date to human readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleResetFilters = () => {
    // Reset filter state
    console.log("Filters reset");
  };
  
  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Lease Agreements</h2>
          <p className="text-muted-foreground">Manage all your property lease agreements in one place</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leases..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link href="/add-lease">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Lease
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="w-full sm:w-auto">
              <Label className="mb-1 block">Property</Label>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Properties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  <SelectItem value="sunset">Sunset Heights</SelectItem>
                  <SelectItem value="maple">Maple Gardens</SelectItem>
                  <SelectItem value="urban">Urban Lofts</SelectItem>
                  <SelectItem value="riverfront">Riverfront Condos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-auto">
              <Label className="mb-1 block">Status</Label>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="renewal">Up for Renewal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-auto">
              <Label className="mb-1 block">Lease Period</Label>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Any Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Period</SelectItem>
                  <SelectItem value="month">Month-to-Month</SelectItem>
                  <SelectItem value="6month">6 Months</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                  <SelectItem value="2year">2 Years</SelectItem>
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
      
      {/* Lease Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Leases</p>
                <h3 className="text-2xl font-bold">24</h3>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Leases</p>
                <h3 className="text-2xl font-bold">18</h3>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Expiring Soon</p>
                <h3 className="text-2xl font-bold">4</h3>
              </div>
              <div className="bg-yellow-100 p-2 rounded-full">
                <CalendarRange className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Expired</p>
                <h3 className="text-2xl font-bold">2</h3>
              </div>
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Leases Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Property/Unit</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Monthly Rent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leases.map((lease) => (
                <TableRow key={lease.id}>
                  <TableCell className="font-medium">{lease.tenant}</TableCell>
                  <TableCell>
                    <div>{lease.property}</div>
                    <div className="text-sm text-muted-foreground">{lease.unit}</div>
                  </TableCell>
                  <TableCell>
                    <div>{formatDate(lease.startDate)}</div>
                    <div className="text-sm text-muted-foreground">to {formatDate(lease.endDate)}</div>
                  </TableCell>
                  <TableCell>${lease.rent.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(lease.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/view-lease/${lease.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/edit-lease/${lease.id}`}>
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
      
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">24</span> results
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button variant="outline" size="sm" className="bg-primary/5">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Leases;
