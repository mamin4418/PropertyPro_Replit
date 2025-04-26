import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PropertyCardProps {
  name: string;
  address: string;
  status: "active" | "maintenance" | "vacant";
  revenue: number;
  units: {
    occupied: number;
    total: number;
  };
  occupancy: number;
  onViewDetails: () => void;
  id?: string | number;
}

const PropertyCard = ({
  name,
  address,
  status,
  revenue,
  units,
  occupancy,
  onViewDetails,
  id = 0,
}: PropertyCardProps) => {
  const statusColors = {
    active: "bg-green-500",
    maintenance: "bg-yellow-500",
    vacant: "bg-red-500",
  };
  
  return (
    <div className="card rounded-lg shadow-sm border border-custom overflow-hidden">
      <div className="aspect-video bg-muted relative">
        <div className={`absolute top-2 right-2 px-2 py-1 ${statusColors[status]} text-white text-xs font-medium rounded`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{name}</h3>
          <div className="text-lg font-bold text-primary">${revenue.toLocaleString()}/mo</div>
        </div>
        
        <p className="text-muted-foreground text-sm mb-3">{address}</p>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="text-center p-2 bg-secondary rounded">
            <p className="text-xs text-muted-foreground">Units</p>
            <p className="font-semibold">{units.occupied} / {units.total}</p>
          </div>
          <div className="text-center p-2 bg-secondary rounded">
            <p className="text-xs text-muted-foreground">Occupancy</p>
            <p className="font-semibold">{occupancy}%</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            className="flex-1"
            onClick={onViewDetails}
          >
            View Details
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.location.href = `/edit-property/${id}`}>
                Edit Property
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.location.href = `/manage-units/${id}`}>
                Manage Units
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.location.href = `/tenants?property=${id}`}>
                View Tenants
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
