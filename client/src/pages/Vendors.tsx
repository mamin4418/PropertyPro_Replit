import { useState } from "react";
import { Link } from "wouter";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  CirclePlus, 
  FileEdit, 
  MoreHorizontal, 
  Phone, 
  Search, 
  Trash2, 
  Users
} from "lucide-react";

// Mock data for vendors
const mockVendors = [
  {
    id: 1,
    name: "ABC Plumbing Services",
    contactPerson: "John Smith",
    phone: "(555) 123-4567",
    email: "john@abcplumbing.com",
    category: "Plumbing",
    status: "active",
    rating: 4.5,
    propertiesServed: 5
  },
  {
    id: 2,
    name: "Elite Electrical Contractors",
    contactPerson: "Sarah Johnson",
    phone: "(555) 234-5678",
    email: "sarah@eliteelectrical.com",
    category: "Electrical",
    status: "active",
    rating: 4.8,
    propertiesServed: 7
  },
  {
    id: 3,
    name: "Green Lawn Care",
    contactPerson: "Mike Davis",
    phone: "(555) 345-6789",
    email: "mike@greenlawn.com",
    category: "Landscaping",
    status: "inactive",
    rating: 3.9,
    propertiesServed: 3
  },
  {
    id: 4,
    name: "Perfect Paint Pro",
    contactPerson: "Lisa Chen",
    phone: "(555) 456-7890",
    email: "lisa@perfectpaint.com",
    category: "Painting",
    status: "active",
    rating: 4.7,
    propertiesServed: 6
  },
  {
    id: 5,
    name: "Secure Locks & Doors",
    contactPerson: "Robert Wilson",
    phone: "(555) 567-8901",
    email: "robert@securelocks.com",
    category: "Security",
    status: "active",
    rating: 4.6,
    propertiesServed: 8
  },
  {
    id: 6,
    name: "Clean Sweep Janitorial",
    contactPerson: "Amanda Brown",
    phone: "(555) 678-9012",
    email: "amanda@cleansweep.com",
    category: "Cleaning",
    status: "inactive",
    rating: 3.7,
    propertiesServed: 4
  }
];

const Vendors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  // Filter vendors based on search and filters
  const filteredVendors = mockVendors.filter(vendor => {
    const matchesSearch = 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter === "all" || !categoryFilter ? true : vendor.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || !statusFilter ? true : vendor.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <Badge className="bg-green-500">Active</Badge>;
    } else {
      return <Badge className="bg-gray-500">Inactive</Badge>;
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Vendors</h2>
          <p className="text-muted-foreground">Manage your service providers and contractors</p>
        </div>
        <Link href="/add-vendor">
          <Button>
            <CirclePlus className="mr-2 h-4 w-4" />
            Add Vendor
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Vendor Management</CardTitle>
        </CardHeader>
        
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vendors..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-row gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Plumbing">Plumbing</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Landscaping">Landscaping</SelectItem>
                  <SelectItem value="Painting">Painting</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Cleaning">Cleaning</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Vendors Table */}
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.length > 0 ? (
                  filteredVendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium">
                        <div>{vendor.name}</div>
                        <div className="text-xs text-muted-foreground">{vendor.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{vendor.contactPerson}</span>
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Phone className="h-3 w-3 mr-1" /> 
                            {vendor.phone}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{vendor.category}</TableCell>
                      <TableCell>{getStatusBadge(vendor.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{vendor.rating}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i} 
                                className={`w-4 h-4 ${i < Math.floor(vendor.rating) ? "text-yellow-400" : "text-gray-300"}`} 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {vendor.propertiesServed} properties
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <FileEdit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No vendors found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Vendors;