import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Building2, Phone, Mail, Briefcase } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

import type { Contact } from "@shared/schema";

const Contacts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [contactTypeFilter, setContactTypeFilter] = useState<string>("all");

  // Fetch contacts data from API
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['/api/contacts'],
    queryFn: async () => {
      const response = await fetch('/api/contacts');
      if (!response.ok) {
        throw new Error("Failed to fetch contacts");
      }
      return response.json() as Promise<Contact[]>;
    }
  });

  // Filter contacts based on search term and contact type
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      searchTerm === "" || 
      contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.companyName && contact.companyName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = 
      contactTypeFilter === "all" || 
      contact.contactType === contactTypeFilter;
    
    return matchesSearch && matchesType;
  });

  // Function to get appropriate icon based on contact type
  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case "tenant":
        return <User className="h-4 w-4" />;
      case "owner":
        return <Building2 className="h-4 w-4" />;
      case "vendor":
        return <Briefcase className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  // Function to get appropriate badge color based on contact type
  const getContactTypeBadgeStyle = (type: string) => {
    switch (type) {
      case "tenant":
        return "bg-blue-100 text-blue-800";
      case "owner":
        return "bg-purple-100 text-purple-800";
      case "vendor":
        return "bg-orange-100 text-orange-800";
      case "employee":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <Link href="/add-contact">
          <Button>Add Contact</Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Manage Contacts</CardTitle>
          <CardDescription>
            View and manage all your contacts in one place
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-56">
              <Select
                value={contactTypeFilter}
                onValueChange={setContactTypeFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="tenant">Tenants</SelectItem>
                  <SelectItem value="owner">Owners</SelectItem>
                  <SelectItem value="vendor">Vendors</SelectItem>
                  <SelectItem value="employee">Employees</SelectItem>
                  <SelectItem value="other">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-10">
              <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Loading contacts...</p>
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                        No contacts found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredContacts.map(contact => (
                      <TableRow key={contact.id}>
                        <TableCell>
                          <div className="font-medium">{contact.firstName} {contact.lastName}</div>
                          {contact.title && (
                            <div className="text-sm text-muted-foreground">{contact.title}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {contact.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                <span className="text-sm">{contact.email}</span>
                              </div>
                            )}
                            {contact.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                <span className="text-sm">{contact.phone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            className={`flex items-center space-x-1 ${getContactTypeBadgeStyle(contact.contactType)}`}
                          >
                            {getContactTypeIcon(contact.contactType)}
                            <span>
                              {contact.contactType.charAt(0).toUpperCase() + contact.contactType.slice(1)}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {contact.companyName || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={contact.status === "active" ? "default" : 
                                   contact.status === "inactive" ? "secondary" : "outline"}
                          >
                            {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Link href={`/view-contact/${contact.id}`}>
                            <Button variant="outline" size="sm">View</Button>
                          </Link>
                          <Link href={`/edit-contact/${contact.id}`}>
                            <Button variant="outline" size="sm">Edit</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Contacts;