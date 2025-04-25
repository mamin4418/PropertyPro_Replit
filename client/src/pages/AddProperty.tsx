import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";

const AddProperty = () => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Add New Property</h2>
        <p className="text-muted-foreground">Enter the details to add a new property to your portfolio</p>
      </div>
      
      <div className="card p-6 rounded-lg shadow-sm border border-custom">
        <form>
          {/* Property Information Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-border">Property Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="property_name">Property Name</Label>
                <Input 
                  id="property_name" 
                  placeholder="e.g. Sunset Heights" 
                  className="mt-1" 
                />
              </div>
              <div>
                <Label htmlFor="property_type">Property Type</Label>
                <Select>
                  <SelectTrigger id="property_type" className="mt-1">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment Building</SelectItem>
                    <SelectItem value="condo">Condominium</SelectItem>
                    <SelectItem value="house">Single Family Home</SelectItem>
                    <SelectItem value="duplex">Duplex</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="property_desc">Property Description</Label>
                <Textarea
                  id="property_desc"
                  placeholder="Enter property description"
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div className="md:col-span-2">
                <div className="mb-1 flex justify-between">
                  <Label>Property Images</Label>
                  <span className="text-xs text-muted-foreground">You can upload up to 10 images</span>
                </div>
                <div className="border-2 border-dashed border-border rounded-md p-6 flex flex-col items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl text-muted-foreground mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Drag and drop your images here, or <span className="text-primary cursor-pointer">browse</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Supported formats: JPEG, PNG, GIF</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Address Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-border">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="street_address">Street Address</Label>
                <Input
                  id="street_address"
                  placeholder="e.g. 123 Main St"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="e.g. New York"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="e.g. NY"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="zip">Zip Code</Label>
                <Input
                  id="zip"
                  placeholder="e.g. 10001"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  placeholder="e.g. USA"
                  className="mt-1"
                  defaultValue="USA"
                />
              </div>
            </div>
          </div>
          
          {/* Units Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-border">Units Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="total_units">Total Units</Label>
                <Input
                  id="total_units"
                  type="number"
                  placeholder="e.g. 10"
                  min="1"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="property_size">Property Size (sq ft)</Label>
                <Input
                  id="property_size"
                  type="number"
                  placeholder="e.g. 5000"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between mb-2">
                <Label>Unit Details</Label>
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0"
                >
                  + Add More Units
                </Button>
              </div>
              <div className="border border-border rounded-md overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unit Number</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Bedrooms</TableHead>
                      <TableHead>Bathrooms</TableHead>
                      <TableHead>Size (sq ft)</TableHead>
                      <TableHead>Rent</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Input placeholder="e.g. 101" />
                      </TableCell>
                      <TableCell>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="studio">Studio</SelectItem>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="condo">Condo</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input type="number" min="0" defaultValue="1" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" min="0" step="0.5" defaultValue="1" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" placeholder="e.g. 800" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" placeholder="e.g. 1200" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
          
          {/* Financial Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-border">Financial Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="purchase_price">Purchase Price</Label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-muted-foreground">$</span>
                  </div>
                  <Input
                    id="purchase_price"
                    type="number"
                    className="pl-7"
                    placeholder="e.g. 500000"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="purchase_date">Purchase Date</Label>
                <Input
                  id="purchase_date"
                  type="date"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="mortgage_amount">Mortgage Amount</Label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-muted-foreground">$</span>
                  </div>
                  <Input
                    id="mortgage_amount"
                    type="number"
                    className="pl-7"
                    placeholder="e.g. 400000"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="property_tax">Annual Property Tax</Label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-muted-foreground">$</span>
                  </div>
                  <Input
                    id="property_tax"
                    type="number"
                    className="pl-7"
                    placeholder="e.g. 5000"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-border">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="year_built">Year Built</Label>
                <Input
                  id="year_built"
                  type="number"
                  placeholder="e.g. 1998"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="mb-2 block">Amenities</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="parking" />
                    <Label htmlFor="parking" className="text-sm">Parking</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pool" />
                    <Label htmlFor="pool" className="text-sm">Swimming Pool</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="gym" />
                    <Label htmlFor="gym" className="text-sm">Gym</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="elevator" />
                    <Label htmlFor="elevator" className="text-sm">Elevator</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="laundry" />
                    <Label htmlFor="laundry" className="text-sm">Laundry</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="security" />
                    <Label htmlFor="security" className="text-sm">Security System</Label>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  rows={3}
                  placeholder="Enter any additional information about the property"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="button" variant="outline" className="text-primary">
              Save as Draft
            </Button>
            <Button type="submit">
              Add Property
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
