import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowUpDown,
  Check,
  Copy,
  Edit,
  Eye,
  Filter,
  Github,
  Home,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Share2,
  Trash2,
  Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for vacancies until we connect to the API
const mockVacancies = [
  {
    id: 1,
    unitId: 101,
    propertyId: 1,
    propertyName: "Parkside Apartments",
    propertyAddress: "123 Main St, Anytown, CA 91234",
    title: "Modern 1 Bedroom Apartment",
    description:
      "Beautiful renovated 1 bedroom apartment with hardwood floors, stainless steel appliances, and a private balcony. Plenty of natural light and storage space.",
    rentAmount: 1250,
    depositAmount: 1250,
    availableFrom: "2023-06-01",
    leaseDuration: 12,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 750,
    amenities: ["Dishwasher", "A/C", "In-unit Laundry", "Balcony"],
    petPolicy: "Cats only, $500 pet deposit",
    includedUtilities: ["Water", "Trash"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
    ],
    status: "active",
    applications: 3,
    inquiries: 7,
    createdAt: "2023-04-15T10:30:00Z",
    updatedAt: "2023-04-20T15:45:00Z",
  },
  {
    id: 2,
    unitId: 203,
    propertyId: 1,
    propertyName: "Parkside Apartments",
    propertyAddress: "123 Main St, Anytown, CA 91234",
    title: "Spacious 2 Bedroom Apartment",
    description:
      "Spacious 2 bedroom apartment with modern finishes, open floor plan, and mountain views. Features a chef's kitchen and walk-in closets.",
    rentAmount: 1650,
    depositAmount: 1650,
    availableFrom: "2023-05-15",
    leaseDuration: 12,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1050,
    amenities: [
      "Dishwasher",
      "A/C",
      "In-unit Laundry",
      "Walk-in Closets",
      "Fireplace",
    ],
    petPolicy: "Pet friendly, $750 pet deposit",
    includedUtilities: ["Water", "Trash", "Internet"],
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858",
    ],
    status: "active",
    applications: 1,
    inquiries: 4,
    createdAt: "2023-04-10T09:15:00Z",
    updatedAt: "2023-04-18T11:20:00Z",
  },
  {
    id: 3,
    unitId: 305,
    propertyId: 2,
    propertyName: "The Willows",
    propertyAddress: "456 Oak Lane, Anytown, CA 91234",
    title: "Luxury Studio Apartment",
    description:
      "Compact but luxurious studio apartment with high-end finishes, full kitchen, and city views. Perfect for professionals.",
    rentAmount: 1050,
    depositAmount: 1050,
    availableFrom: "2023-06-15",
    leaseDuration: 12,
    bedrooms: 0,
    bathrooms: 1,
    sqft: 550,
    amenities: ["Dishwasher", "A/C", "Gym Access", "Rooftop Terrace"],
    petPolicy: "No pets allowed",
    includedUtilities: ["Water", "Trash", "Heat"],
    images: [
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80",
      "https://images.unsplash.com/photo-1518481612222-68bbe828ecd1",
    ],
    status: "inactive",
    applications: 0,
    inquiries: 2,
    createdAt: "2023-04-05T14:20:00Z",
    updatedAt: "2023-04-12T16:30:00Z",
  },
];

const ManageVacancies = () => {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [sortField, setSortField] = useState("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Query for fetching vacancies - will replace mock data when API is ready
  const { data: vacancies, isLoading, isError } = useQuery({
    queryKey: ["/api/vacancies/manage"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/vacancies/manage");
        if (!response.ok) {
          throw new Error("Failed to fetch vacancies");
        }
        return response.json();
      } catch (error) {
        console.error("Error fetching vacancies:", error);
        // Return mock data for now
        return mockVacancies;
      }
    },
  });

  // Mutation for deleting a vacancy
  const { mutate: deleteVacancy, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/vacancies/${id}`, null);
    },
    onSuccess: () => {
      toast({
        title: "Vacancy deleted",
        description: "The vacancy listing has been removed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/vacancies/manage"] });
      queryClient.invalidateQueries({ queryKey: ["/api/vacancies"] });
      setConfirmDeleteId(null);
    },
    onError: (error) => {
      console.error("Error deleting vacancy:", error);
      toast({
        title: "Deletion Error",
        description: "There was a problem deleting the vacancy. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Mutation for toggling vacancy status
  const { mutate: toggleStatus, isPending: isToggling } = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await apiRequest("PATCH", `/api/vacancies/${id}/status`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "The vacancy status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/vacancies/manage"] });
      queryClient.invalidateQueries({ queryKey: ["/api/vacancies"] });
    },
    onError: (error) => {
      console.error("Error updating vacancy status:", error);
      toast({
        title: "Update Error",
        description: "There was a problem updating the status. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handler for sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Get sort indicator
  const getSortIndicator = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? " ▲" : " ▼";
  };

  // Filter and sort vacancies
  const filteredVacancies = vacancies
    ? vacancies
        .filter((vacancy: any) => {
          // Search term filter
          const matchesSearch =
            searchTerm === "" ||
            vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vacancy.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(vacancy.unitId).includes(searchTerm);

          // Status filter
          const matchesStatus =
            statusFilter === "all" || vacancy.status === statusFilter;

          // Property filter - simplified for now
          const matchesProperty =
            propertyFilter === "all" ||
            vacancy.propertyId.toString() === propertyFilter;

          return matchesSearch && matchesStatus && matchesProperty;
        })
        .sort((a: any, b: any) => {
          // Handle different field types
          const aValue = a[sortField];
          const bValue = b[sortField];

          if (typeof aValue === "string" && typeof bValue === "string") {
            return sortDirection === "asc"
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          }

          if (typeof aValue === "number" && typeof bValue === "number") {
            return sortDirection === "asc"
              ? aValue - bValue
              : bValue - aValue;
          }

          // For dates
          const aDate = new Date(aValue).getTime();
          const bDate = new Date(bValue).getTime();
          return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
        })
    : [];

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Inactive
          </Badge>
        );
      case "rented":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Rented
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100">
            {status}
          </Badge>
        );
    }
  };

  // Toggle vacancy status
  const handleToggleStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    toggleStatus({ id, status: newStatus });
  };

  // Confirm delete action
  const confirmDelete = (id: number) => {
    setConfirmDeleteId(id);
  };

  // Handle delete action
  const handleDelete = () => {
    if (confirmDeleteId) {
      deleteVacancy(confirmDeleteId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading vacancy listings...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-destructive mb-2">Error</h2>
        <p className="mb-4">
          There was a problem loading the vacancy listings.
        </p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Vacancies</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage property listings for rent
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/vacancy-listing")}>
            <Eye className="mr-2 h-4 w-4" />
            View Public Listings
          </Button>
          <Button onClick={() => navigate("/create-vacancy")}>
            <Plus className="mr-2 h-4 w-4" />
            Create Listing
          </Button>
        </div>
      </div>

      {/* Filter and search controls */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, property, or unit number..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="rented">Rented</SelectItem>
            </SelectContent>
          </Select>

          <Select value={propertyFilter} onValueChange={setPropertyFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Properties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              <SelectItem value="1">Parkside Apartments</SelectItem>
              <SelectItem value="2">The Willows</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Listings</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="inquiries">With Inquiries</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>All Vacancy Listings</CardTitle>
              <CardDescription>
                Manage all your property listings in one place
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <button
                        className="flex items-center"
                        onClick={() => handleSort("title")}
                      >
                        Listing Title
                        {getSortIndicator("title")}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        className="flex items-center"
                        onClick={() => handleSort("propertyName")}
                      >
                        Property
                        {getSortIndicator("propertyName")}
                      </button>
                    </TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>
                      <button
                        className="flex items-center"
                        onClick={() => handleSort("rentAmount")}
                      >
                        Rent
                        {getSortIndicator("rentAmount")}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        className="flex items-center"
                        onClick={() => handleSort("availableFrom")}
                      >
                        Available From
                        {getSortIndicator("availableFrom")}
                      </button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <button
                        className="flex items-center"
                        onClick={() => handleSort("inquiries")}
                      >
                        Inquiries
                        {getSortIndicator("inquiries")}
                      </button>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVacancies.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No vacancies found matching your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVacancies.map((vacancy: any) => (
                      <TableRow key={vacancy.id}>
                        <TableCell className="font-medium">
                          {vacancy.title}
                        </TableCell>
                        <TableCell>{vacancy.propertyName}</TableCell>
                        <TableCell>Unit {vacancy.unitId}</TableCell>
                        <TableCell>${vacancy.rentAmount}/mo</TableCell>
                        <TableCell>
                          {new Date(vacancy.availableFrom).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(vacancy.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {vacancy.inquiries}
                            {vacancy.inquiries > 0 && (
                              <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
                                {vacancy.applications} applications
                              </Badge>
                            )}
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
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/view-vacancy/${vacancy.id}`)
                                }
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/edit-vacancy/${vacancy.id}`)
                                }
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Listing
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleToggleStatus(
                                    vacancy.id,
                                    vacancy.status
                                  )
                                }
                              >
                                <Check className="mr-2 h-4 w-4" />
                                {vacancy.status === "active"
                                  ? "Mark as Inactive"
                                  : "Mark as Active"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  const url = `/vacancy/${vacancy.id}`;
                                  navigator.clipboard.writeText(
                                    window.location.origin + url
                                  );
                                  toast({
                                    title: "Link copied",
                                    description:
                                      "Listing URL has been copied to clipboard",
                                  });
                                }}
                              >
                                <Copy className="mr-2 h-4 w-4" />
                                Copy Link
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => confirmDelete(vacancy.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Listing
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

        <TabsContent value="active">
          {/* Similar table but filtered for active listings */}
        </TabsContent>

        <TabsContent value="inactive">
          {/* Similar table but filtered for inactive listings */}
        </TabsContent>

        <TabsContent value="inquiries">
          {/* Similar table but filtered for listings with inquiries */}
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog for Delete */}
      <AlertDialog
        open={confirmDeleteId !== null}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the vacancy listing. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageVacancies;