import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface Property {
  id: string | number;
  name: string;
  address: string;
  units: {
    occupied: number;
    total: number;
  };
  occupancy: number;
  revenue: number;
  status: "active" | "maintenance" | "vacant";
}

interface PropertiesOverviewProps {
  properties: Property[];
}

const PropertiesOverview = ({ properties }: PropertiesOverviewProps) => {
  const statusStyles = {
    active: "bg-green-100 text-green-800",
    maintenance: "bg-yellow-100 text-yellow-800",
    vacant: "bg-red-100 text-red-800"
  };
  
  return (
    <div className="card p-6 rounded-lg shadow-sm border border-custom mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold">Properties Overview</h3>
          <Link href="/properties">
            <Button variant="link" className="text-primary h-auto p-0">View All</Button>
          </Link>
        </div>
        <Link href="/add-property">
          <Button>Add Property</Button>
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Units</TableHead>
              <TableHead>Occupancy</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell>
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-secondary rounded-md"></div>
                    <div className="ml-4">
                      <div className="font-medium">{property.name}</div>
                      <div className="text-sm text-muted-foreground">{property.address}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {property.units.occupied} / {property.units.total}
                </TableCell>
                <TableCell>{property.occupancy}%</TableCell>
                <TableCell>${property.revenue.toLocaleString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[property.status]}`}>
                    {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/view-property/${property.id}`}>
                    <Button variant="link" className="text-primary h-auto p-0">View</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PropertiesOverview;
