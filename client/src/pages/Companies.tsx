import { useState } from "react";
import { Link } from "wouter";
import { Building, MoreHorizontal, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface Company {
  id: number;
  companyName: string;
  legalName: string;
  email: string;
  phone: string;
  type: string;
  status: "active" | "inactive";
  properties: number;
}

const sampleCompanies: Company[] = [
  {
    id: 1,
    companyName: "Skyline Properties",
    legalName: "Skyline Properties LLC",
    email: "info@skylineproperties.com",
    phone: "(555) 123-4567",
    type: "LLC",
    status: "active",
    properties: 12
  },
  {
    id: 2,
    companyName: "Urban Living Management",
    legalName: "Urban Living Inc.",
    email: "contact@urbanliving.com",
    phone: "(555) 234-5678",
    type: "Corporation",
    status: "active",
    properties: 8
  },
  {
    id: 3,
    companyName: "Cornerstone Real Estate",
    legalName: "Cornerstone Holdings",
    email: "admin@cornerstonere.com",
    phone: "(555) 345-6789",
    type: "LLC",
    status: "active",
    properties: 15
  },
  {
    id: 4,
    companyName: "Harbor View Properties",
    legalName: "Harbor View LLC",
    email: "info@harborviewprops.com",
    phone: "(555) 456-7890",
    type: "LLC",
    status: "inactive",
    properties: 5
  },
  {
    id: 5,
    companyName: "Metropolitan Housing",
    legalName: "Metropolitan Housing Partners",
    email: "contact@metrohousing.com",
    phone: "(555) 567-8901",
    type: "Partnership",
    status: "active",
    properties: 23
  }
];

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [companies, setCompanies] = useState(sampleCompanies);

  const filteredCompanies = companies.filter(
    (company) =>
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.legalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
          <p className="text-muted-foreground">
            Manage all your property management companies
          </p>
        </div>
        <Link href="/companies/add">
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>Add Company</span>
          </Button>
        </Link>
      </div>

      <div className="flex items-center py-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Legal Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Properties</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompanies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  No companies found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="flex items-center gap-2 font-medium">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{company.companyName}</span>
                  </TableCell>
                  <TableCell>{company.legalName}</TableCell>
                  <TableCell>{company.type}</TableCell>
                  <TableCell>
                    <div>{company.email}</div>
                    <div className="text-sm text-muted-foreground">{company.phone}</div>
                  </TableCell>
                  <TableCell>{company.properties}</TableCell>
                  <TableCell>
                    <Badge
                      variant={company.status === "active" ? "default" : "secondary"}
                    >
                      {company.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/companies/${company.id}`}>
                          <DropdownMenuItem>View</DropdownMenuItem>
                        </Link>
                        <Link href={`/companies/${company.id}/edit`}>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem className="text-destructive">
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
      </div>
    </div>
  );
};

export default Companies;