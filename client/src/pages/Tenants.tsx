import { useCallback } from "react";
import { Link } from "wouter";
import { Search, Plus, User, ChevronLeft, ChevronRight } from "lucide-react";
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
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Tenants = () => {
  // Mock data for demonstration
  const tenants = [
    {
      id: 1,
      name: "John Doe",
      type: "Primary",
      phone: "(555) 123-4567",
      email: "john.doe@example.com",
      property: "Sunset Heights",
      unit: "Apt 101",
      rent: 1200,
      leaseExpiry: "2023-12-31",
      status: "active"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      type: "Primary",
      phone: "(555) 234-5678",
      email: "sarah.j@example.com",
      property: "Maple Gardens",
      unit: "Unit 3B",
      rent: 950,
      leaseExpiry: "2023-08-15",
      status: "expiring-soon"
    },
    {
      id: 3,
      name: "Mike Smith",
      type: "Primary",
      phone: "(555) 345-6789",
      email: "mike.smith@example.com",
      property: "Urban Lofts",
      unit: "Unit 2A",
      rent: 1450,
      leaseExpiry: "2024-03-01",
      status: "active"
    },
    {
      id: 4,
      name: "Jennifer Lee",
      type: "Primary",
      phone: "(555) 456-7890",
      email: "jennifer.l@example.com",
      property: "Sunset Heights",
      unit: "Apt 205",
      rent: 1100,
      leaseExpiry: "2023-07-15",
      status: "expiring"
    },
    {
      id: 5,
      name: "Robert Johnson",
      type: "Primary",
      phone: "(555) 567-8901",
      email: "robert.j@example.com",
      property: "Urban Lofts",
      unit: "Unit 3C",
      rent: 1400,
      leaseExpiry: "2023-05-01",
      status: "past"
    }
  ];
  
  const getBadgeVariant = useCallback((status: string) => {
    switch (status) {
      case 'active':
        return "bg-green-100 text-green-800";
      case 'expiring-soon':
        return "bg-yellow-100 text-yellow-800";
      case 'expiring':
        return "bg-red-100 text-red-800";
      case 'past':
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }, []);
  
  const getBadgeText = useCallback((status: string) => {
    switch (status) {
      case 'active':
        return "Active";
      case 'expiring-soon':
        return "Expiring Soon";
      case 'expiring':
        return "Expiring";
      case 'past':
        return "Past";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  }, []);
  
  const handleResetFilters = () => {
    // In a real app, reset filter state
    console.log("Filters reset");
  };
  
  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Tenants</h2>
          <p className="text-muted-foreground">Manage all your tenants in one place</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tenants..."
              className="pl-10"
            />
          </div>
          <Link href="/add-tenant">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Tenant
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      <div className="card p-4 rounded-lg shadow-sm border border-custom mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="w-full sm:w-auto">
            <Label className="mb-1 block">Status</Label>
            <Select defaultValue="">
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="past">Past</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-auto">
            <Label className="mb-1 block">Property</Label>
            <Select defaultValue="">
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All Properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-properties">All Properties</SelectItem>
                <SelectItem value="sunset">Sunset Heights</SelectItem>
                <SelectItem value="maple">Maple Gardens</SelectItem>
                <SelectItem value="urban">Urban Lofts</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-auto">
            <Label className="mb-1 block">Lease Status</Label>
            <Select defaultValue="">
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Any Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any-status">Any Status</SelectItem>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="expiring">Expiring Soon</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
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
      </div>
      
      {/* Tenants Table */}
      <div className="card rounded-lg shadow-sm border border-custom overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Lease</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar>
                        <AvatarFallback className="bg-secondary">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <div className="font-medium">{tenant.name}</div>
                        <div className="text-sm text-muted-foreground">{tenant.type}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{tenant.phone}</div>
                    <div className="text-sm text-muted-foreground">{tenant.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{tenant.property}</div>
                    <div className="text-sm text-muted-foreground">{tenant.unit}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">${tenant.rent}/month</div>
                    <div className="text-sm text-muted-foreground">
                      {tenant.status === 'past' ? 'Expired' : 'Expires'}: {tenant.leaseExpiry}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getBadgeVariant(tenant.status)}>
                      {getBadgeText(tenant.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/view-tenant/${tenant.id}`}>
                        <Button variant="link" className="h-auto p-0 text-primary">View</Button>
                      </Link>
                      <Link href={`/edit-tenant/${tenant.id}`}>
                        <Button variant="link" className="h-auto p-0">Edit</Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-3 border-t border-border flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">48</span> tenants
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
            >
              1
            </Button>
            <Button
              variant="outline"
              size="sm"
            >
              2
            </Button>
            <Button
              variant="outline"
              size="sm"
            >
              3
            </Button>
            <Button
              variant="outline"
              size="sm"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tenants;
