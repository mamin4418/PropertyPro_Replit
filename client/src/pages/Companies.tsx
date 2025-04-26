
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Plus, Filter, MoreHorizontal, FileEdit, Trash2, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";

// Sample company data
const sampleCompanies = [
  {
    id: 1,
    legalName: "ABC Property Management LLC",
    companyName: "ABC Properties",
    ein: "12-3456789",
    email: "info@abcproperties.com",
    phone: "(555) 123-4567",
    type: "LLC",
    status: "active"
  },
  {
    id: 2,
    legalName: "XYZ Real Estate Holdings Inc",
    companyName: "XYZ Realty",
    ein: "98-7654321",
    email: "contact@xyzrealty.com",
    phone: "(555) 987-6543",
    type: "Corporation",
    status: "active"
  },
  {
    id: 3,
    legalName: "Sunset Apartments Group LLC",
    companyName: "Sunset Living",
    ein: "45-6789123",
    email: "leasing@sunsetliving.com",
    phone: "(555) 456-7890",
    type: "LLC",
    status: "inactive"
  },
  {
    id: 4,
    legalName: "Metro Property Investments Ltd",
    companyName: "Metro Properties",
    ein: "78-9123456",
    email: "info@metroproperties.com",
    phone: "(555) 789-0123",
    type: "Limited Company",
    status: "active"
  },
  {
    id: 5,
    legalName: "Urban Home Rentals Inc",
    companyName: "Urban Homes",
    ein: "23-4567891",
    email: "rentals@urbanhomes.com",
    phone: "(555) 234-5678",
    type: "Corporation",
    status: "active"
  }
];

export default function Companies() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter companies based on search term and status
  const filteredCompanies = sampleCompanies.filter(company => {
    const matchesSearch = 
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.legalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || company.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Companies</h1>
        <Link href="/add-company">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Company
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Management</CardTitle>
          <CardDescription>
            Manage all your property management companies in one place.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
            <div className="flex flex-1 items-center gap-2">
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Status: {statusFilter === "all" ? "All" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                    Inactive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Table>
            <TableCaption>A list of all companies.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Legal Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.companyName}</TableCell>
                  <TableCell>{company.legalName}</TableCell>
                  <TableCell>{company.type}</TableCell>
                  <TableCell>
                    {company.email}<br />
                    {company.phone}
                  </TableCell>
                  <TableCell>
                    <Badge variant={company.status === "active" ? "success" : "destructive"}>
                      {company.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Link href={`/view-company/${company.id}`} className="flex items-center w-full">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link href={`/edit-company/${company.id}`} className="flex items-center w-full">
                            <FileEdit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCompanies.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No companies found. Try adjusting your search or filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredCompanies.length} of {sampleCompanies.length} companies
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
