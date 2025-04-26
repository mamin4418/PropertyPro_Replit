import { useState } from "react";
import { useLocation } from "wouter";
import { Search, Plus, LayoutGrid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PropertyFilters from "@/components/properties/PropertyFilters";
import PropertyCard from "@/components/properties/PropertyCard";

const Properties = () => {
  const [, navigate] = useLocation();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Mock data for demonstration
  const properties = [
    {
      id: 1,
      name: "Sunset Heights",
      address: "123 Main St, Anytown, USA",
      status: "active",
      revenue: 24000,
      units: { occupied: 24, total: 24 },
      occupancy: 100
    },
    {
      id: 2,
      name: "Maple Gardens",
      address: "456 Oak Dr, Anytown, USA",
      status: "active",
      revenue: 13500,
      units: { occupied: 12, total: 15 },
      occupancy: 80
    },
    {
      id: 3,
      name: "Urban Lofts",
      address: "789 Pine Ln, Anytown, USA",
      status: "maintenance",
      revenue: 14500,
      units: { occupied: 8, total: 10 },
      occupancy: 80
    },
    {
      id: 4,
      name: "Riverside Condos",
      address: "321 River Rd, Anytown, USA",
      status: "vacant",
      revenue: 0,
      units: { occupied: 0, total: 6 },
      occupancy: 0
    },
    {
      id: 5,
      name: "Highland Towers",
      address: "555 Hill St, Anytown, USA",
      status: "active",
      revenue: 18200,
      units: { occupied: 14, total: 16 },
      occupancy: 88
    },
    {
      id: 6,
      name: "Central Plaza",
      address: "100 Center Ave, Anytown, USA",
      status: "active",
      revenue: 21000,
      units: { occupied: 20, total: 20 },
      occupancy: 100
    }
  ] as const;
  
  const handleViewDetails = (id: number | string) => {
    // Navigate to property details page
    navigate(`/view-property/${id}`);
  };
  
  const handleResetFilters = () => {
    // In a real app, reset filter state
    console.log("Filters reset");
  };
  
  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Properties</h2>
          <p className="text-muted-foreground">Manage all your properties in one place</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search properties..."
              className="pl-10"
            />
          </div>
          <Button onClick={() => navigate("/add-property")}>
            <Plus className="mr-2 h-4 w-4" /> Add Property
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <PropertyFilters onReset={handleResetFilters} />
      
      {/* Grid/List Toggle */}
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-md border">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            className="rounded-r-none"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="mr-2 h-4 w-4" /> Grid
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            className="rounded-l-none"
            onClick={() => setViewMode("list")}
          >
            <List className="mr-2 h-4 w-4" /> List
          </Button>
        </div>
      </div>
      
      {/* Properties View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              name={property.name}
              address={property.address}
              status={property.status}
              revenue={property.revenue}
              units={property.units}
              occupancy={property.occupancy}
              onViewDetails={() => handleViewDetails(property.id)}
            />
          ))}
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-xs uppercase">Property</th>
                <th className="px-4 py-3 text-left font-medium text-xs uppercase">Address</th>
                <th className="px-4 py-3 text-left font-medium text-xs uppercase">Status</th>
                <th className="px-4 py-3 text-left font-medium text-xs uppercase">Units</th>
                <th className="px-4 py-3 text-left font-medium text-xs uppercase">Occupancy</th>
                <th className="px-4 py-3 text-left font-medium text-xs uppercase">Revenue</th>
                <th className="px-4 py-3 text-left font-medium text-xs uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {properties.map((property) => (
                <tr key={property.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">{property.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{property.address}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium
                      ${property.status === 'active' ? 'bg-green-100 text-green-700' : 
                        property.status === 'maintenance' ? 'bg-amber-100 text-amber-700' : 
                        'bg-gray-100 text-gray-700'}`}>
                      {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">{property.units.occupied}/{property.units.total}</td>
                  <td className="px-4 py-3">{property.occupancy}%</td>
                  <td className="px-4 py-3">${property.revenue.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="link" onClick={() => handleViewDetails(property.id)}>
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">1</span> to <span className="font-medium">6</span> of <span className="font-medium">12</span> properties
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <Button
            variant={currentPage === 1 ? "secondary" : "outline"}
            size="sm"
            onClick={() => setCurrentPage(1)}
          >
            1
          </Button>
          <Button
            variant={currentPage === 2 ? "secondary" : "outline"}
            size="sm"
            onClick={() => setCurrentPage(2)}
          >
            2
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 2}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Properties;
