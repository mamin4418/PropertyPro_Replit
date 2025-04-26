import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Search, Home, User2, DollarSign, CheckCircle2, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ManageUnits = () => {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [addUnitOpen, setAddUnitOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<number | null>(null);
  
  // Mock property data
  const property = {
    id,
    name: "Sunset Heights",
    address: "123 Main St, Anytown, USA",
    units: [
      {
        id: 1,
        number: "101",
        type: "1 Bedroom",
        sqft: 750,
        rent: 1100,
        status: "occupied",
        tenant: "John Doe",
        leaseEnd: "2024-12-15"
      },
      {
        id: 2,
        number: "102",
        type: "1 Bedroom",
        sqft: 750,
        rent: 1100,
        status: "vacant",
        tenant: null,
        leaseEnd: null
      },
      {
        id: 3,
        number: "103",
        type: "2 Bedroom",
        sqft: 1000,
        rent: 1500,
        status: "occupied",
        tenant: "Sarah Johnson",
        leaseEnd: "2025-02-28"
      },
      {
        id: 4,
        number: "201",
        type: "2 Bedroom",
        sqft: 1050,
        rent: 1550,
        status: "occupied",
        tenant: "Michael Smith",
        leaseEnd: "2024-11-30"
      },
      {
        id: 5,
        number: "202",
        type: "1 Bedroom",
        sqft: 750,
        rent: 1150,
        status: "maintenance",
        tenant: null,
        leaseEnd: null
      },
      {
        id: 6,
        number: "203",
        type: "Studio",
        sqft: 550,
        rent: 900,
        status: "vacant",
        tenant: null,
        leaseEnd: null
      }
    ]
  };
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Filter units based on search term and filters
  const filteredUnits = property.units.filter(unit => {
    const matchesSearch = 
      unit.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (unit.tenant && unit.tenant.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" ? true : unit.status === statusFilter;
    const matchesType = typeFilter === "all" ? true : unit.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  // Count units by status
  const counts = {
    total: property.units.length,
    occupied: property.units.filter(unit => unit.status === "occupied").length,
    vacant: property.units.filter(unit => unit.status === "vacant").length,
    maintenance: property.units.filter(unit => unit.status === "maintenance").length
  };
  
  // Get status badge based on unit status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "occupied":
        return <Badge className="bg-green-500">Occupied</Badge>;
      case "vacant":
        return <Badge className="bg-blue-500">Vacant</Badge>;
      case "maintenance":
        return <Badge className="bg-yellow-500">Maintenance</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  // Handle adding a new unit
  const handleAddUnit = () => {
    setAddUnitOpen(false);
    toast({
      title: "Unit Added",
      description: "The unit has been added successfully."
    });
  };
  
  // Handle deleting a unit
  const handleDeleteUnit = () => {
    setDeleteOpen(false);
    toast({
      title: "Unit Deleted",
      description: "The unit has been deleted successfully."
    });
  };
  
  // Function to confirm unit deletion
  const confirmDelete = (unitId: number) => {
    setUnitToDelete(unitId);
    setDeleteOpen(true);
  };
  
  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/properties">Properties</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/view-property/${id}`}>{property.name}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Manage Units</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="icon" 
            className="mr-4"
            onClick={() => navigate(`/view-property/${id}`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Manage Units</h1>
            <p className="text-muted-foreground">
              {property.name} • {property.address}
            </p>
          </div>
        </div>
        <Dialog open={addUnitOpen} onOpenChange={setAddUnitOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add Unit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Unit</DialogTitle>
              <DialogDescription>
                Enter the details for the new unit.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unit-number" className="text-right">
                  Unit #
                </Label>
                <Input id="unit-number" placeholder="e.g. 101" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unit-type" className="text-right">
                  Type
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select unit type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="1-bedroom">1 Bedroom</SelectItem>
                    <SelectItem value="2-bedroom">2 Bedroom</SelectItem>
                    <SelectItem value="3-bedroom">3 Bedroom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unit-size" className="text-right">
                  Size (sq ft)
                </Label>
                <Input id="unit-size" type="number" placeholder="e.g. 750" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unit-rent" className="text-right">
                  Rent ($)
                </Label>
                <Input id="unit-rent" type="number" placeholder="e.g. 1100" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unit-status" className="text-right">
                  Status
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select unit status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vacant">Vacant</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="maintenance">Under Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddUnitOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUnit}>Save Unit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                Total Units
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <User2 className="h-4 w-4 mr-2 text-muted-foreground" />
                Occupied Units
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.occupied}</div>
            <p className="text-sm text-green-600">
              {Math.round((counts.occupied / counts.total) * 100)}% Occupancy Rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                Vacant Units
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.vacant}</div>
            <p className="text-sm text-blue-600">
              Available for rent
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                Monthly Revenue
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${property.units.reduce((sum, unit) => sum + (unit.status === 'occupied' ? unit.rent : 0), 0).toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">
              From occupied units
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Units Table with Tabs */}
      <Tabs defaultValue="all">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Units</TabsTrigger>
            <TabsTrigger value="occupied">Occupied</TabsTrigger>
            <TabsTrigger value="vacant">Vacant</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search units..."
                className="pl-8 w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Studio">Studio</SelectItem>
                <SelectItem value="1 Bedroom">1 Bedroom</SelectItem>
                <SelectItem value="2 Bedroom">2 Bedroom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value="all" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit #</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Rent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Lease Ends</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUnits.length > 0 ? (
                    filteredUnits.map((unit) => (
                      <TableRow key={unit.id}>
                        <TableCell className="font-medium">{unit.number}</TableCell>
                        <TableCell>{unit.type}</TableCell>
                        <TableCell>{unit.sqft} sq ft</TableCell>
                        <TableCell>${unit.rent}/mo</TableCell>
                        <TableCell>{getStatusBadge(unit.status)}</TableCell>
                        <TableCell>
                          {unit.tenant ? (
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mr-2">
                                {unit.tenant.split(' ').map(n => n[0]).join('')}
                              </div>
                              {unit.tenant}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">None</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {unit.leaseEnd ? (
                            <div className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                              {new Date(unit.leaseEnd).toLocaleDateString()}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => confirmDelete(unit.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        No units found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="occupied" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit #</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Rent</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Lease Ends</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {property.units
                    .filter(unit => unit.status === "occupied")
                    .map((unit) => (
                      <TableRow key={unit.id}>
                        <TableCell className="font-medium">{unit.number}</TableCell>
                        <TableCell>{unit.type}</TableCell>
                        <TableCell>{unit.sqft} sq ft</TableCell>
                        <TableCell>${unit.rent}/mo</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mr-2">
                              {unit.tenant!.split(' ').map(n => n[0]).join('')}
                            </div>
                            {unit.tenant}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                            {new Date(unit.leaseEnd!).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => confirmDelete(unit.id)}
                            >
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
        </TabsContent>
        
        <TabsContent value="vacant" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit #</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Rent</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {property.units
                    .filter(unit => unit.status === "vacant")
                    .map((unit) => (
                      <TableRow key={unit.id}>
                        <TableCell className="font-medium">{unit.number}</TableCell>
                        <TableCell>{unit.type}</TableCell>
                        <TableCell>{unit.sqft} sq ft</TableCell>
                        <TableCell>${unit.rent}/mo</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => navigate("/add-tenant")}>
                              Add Tenant
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => confirmDelete(unit.id)}
                            >
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
        </TabsContent>
        
        <TabsContent value="maintenance" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit #</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {property.units
                    .filter(unit => unit.status === "maintenance")
                    .map((unit) => (
                      <TableRow key={unit.id}>
                        <TableCell className="font-medium">{unit.number}</TableCell>
                        <TableCell>{unit.type}</TableCell>
                        <TableCell>{unit.sqft} sq ft</TableCell>
                        <TableCell>Plumbing issue</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => navigate("/maintenance")}>
                              View Maintenance
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Confirmation Dialog for Delete */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this unit? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUnit}>
              Delete Unit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageUnits;