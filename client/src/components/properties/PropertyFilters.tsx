import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface PropertyFiltersProps {
  onReset: () => void;
}

const PropertyFilters = ({ onReset }: PropertyFiltersProps) => {
  return (
    <div className="card p-4 rounded-lg shadow-sm border border-custom mb-6">
      <div className="flex flex-wrap gap-4">
        <div className="w-full sm:w-auto">
          <Label className="mb-1 block">Property Type</Label>
          <Select defaultValue="">
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full sm:w-auto">
          <Label className="mb-1 block">Status</Label>
          <Select defaultValue="">
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="vacant">Vacant</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full sm:w-auto">
          <Label className="mb-1 block">Occupancy</Label>
          <Select defaultValue="">
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Any Occupancy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Occupancy</SelectItem>
              <SelectItem value="full">Fully Occupied</SelectItem>
              <SelectItem value="partial">Partially Occupied</SelectItem>
              <SelectItem value="vacant">Vacant</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full sm:w-auto sm:ml-auto sm:self-end">
          <Button
            variant="outline"
            className="w-full"
            onClick={onReset}
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
