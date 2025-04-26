
import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Plus, Search } from "lucide-react";

// Sample company data
const sampleCompanies = [
  { 
    id: 1, 
    companyName: "ABC Properties", 
    legalName: "ABC Properties LLC", 
    ein: "12-3456789", 
    email: "info@abcproperties.com",
    phone: "(555) 123-4567",
    type: "LLC",
    status: "active",
    properties: 12,
    occupancy: 92
  },
  { 
    id: 2, 
    companyName: "XYZ Real Estate", 
    legalName: "XYZ Real Estate Group, Inc.", 
    ein: "98-7654321", 
    email: "contact@xyzrealestate.com",
    phone: "(555) 987-6543",
    type: "Corporation",
    status: "active",
    properties: 8,
    occupancy: 88
  },
  { 
    id: 3, 
    companyName: "Sunset Heights", 
    legalName: "Sunset Heights Inc.", 
    ein: "45-6789123", 
    email: "hello@sunshineproperties.com",
    phone: "(555) 456-7890",
    type: "C-Corp",
    status: "active",
    properties: 15,
    occupancy: 83
  },
  { 
    id: 4, 
    companyName: "Green Properties", 
    legalName: "Green Properties LLC", 
    ein: "56-7891234", 
    email: "info@greenproperties.com",
    phone: "(555) 234-5678",
    type: "LLC",
    status: "active",
    properties: 10,
    occupancy: 94
  },
  { 
    id: 5, 
    companyName: "Urban Living", 
    legalName: "Urban Living Management Inc.", 
    ein: "67-8912345", 
    email: "contact@urbanliving.com",
    phone: "(555) 345-6789",
    type: "S-Corp",
    status: "active",
    properties: 6,
    occupancy: 90
  }
];

const Companies = () => {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Types");
  const [viewType, setViewType] = useState("grid");

  const { data: companies, isLoading } = useQuery({
    queryKey: ['/api/companies'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/companies');
        if (!response.ok) throw new Error("Failed to fetch companies");
        return response.json();
      } catch (error) {
        console.error("Failed to fetch companies:", error);
        // Return sample data when API fails
        return sampleCompanies;
      }
    }
  });

  const filteredCompanies = companies?.filter(company => {
    const matchesSearch = 
      company.companyName.toLowerCase().includes(search.toLowerCase()) ||
      company.legalName.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = 
      filter === "All Types" || company.type === filter;
    
    return matchesSearch && matchesFilter;
  }) || [];

  const companyTypes = ["All Types", "LLC", "Corporation", "C-Corp", "S-Corp"];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Companies</h1>
        <Button onClick={() => navigate("/add-company")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select 
          className="p-2 border rounded-md bg-background"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {companyTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        
        <div className="flex border rounded-md overflow-hidden">
          <button 
            className={`px-3 py-2 ${viewType === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
            onClick={() => setViewType('grid')}
          >
            Grid
          </button>
          <button 
            className={`px-3 py-2 ${viewType === 'list' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
            onClick={() => setViewType('list')}
          >
            List
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(index => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-2/3"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : viewType === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <Card 
              key={company.id}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {company.companyName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <p className="text-muted-foreground">Legal Name: {company.legalName}</p>
                  {company.email && <p className="text-muted-foreground">Email: {company.email}</p>}
                  {company.phone && <p className="text-muted-foreground">Phone: {company.phone}</p>}
                  <p className="text-muted-foreground">Type: {company.type}</p>
                  
                  <div className="flex justify-between mt-4">
                    <div className="text-center">
                      <div className="font-bold">{company.properties}</div>
                      <div className="text-xs text-muted-foreground">Properties</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold">{company.occupancy}%</div>
                      <div className="text-xs text-muted-foreground">Occupancy</div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t mt-4">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/view-company/${company.id}`);
                      }}
                    >
                      View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/edit-company/${company.id}`);
                      }}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Are you sure you want to delete this company?")) {
                          // Delete logic would go here
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCompanies.map((company) => (
            <div 
              key={company.id}
              className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3 md:mb-0">
                <Building2 className="h-8 w-8" />
                <div>
                  <h3 className="font-medium">{company.companyName}</h3>
                  <p className="text-sm text-muted-foreground">{company.legalName}</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-sm">
                <div className="md:text-center">
                  <span className="md:block font-medium">Type</span>
                  <span className="ml-2 md:ml-0">{company.type}</span>
                </div>
                <div className="md:text-center">
                  <span className="md:block font-medium">Properties</span>
                  <span className="ml-2 md:ml-0">{company.properties}</span>
                </div>
                <div className="md:text-center">
                  <span className="md:block font-medium">Occupancy</span>
                  <span className="ml-2 md:ml-0">{company.occupancy}%</span>
                </div>
              </div>

              <div className="flex gap-2 mt-3 md:mt-0">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/view-company/${company.id}`)}
                >
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/edit-company/${company.id}`)}
                >
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-destructive"
                  onClick={(e) => {
                    if (confirm("Are you sure you want to delete this company?")) {
                      // Delete logic would go here
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Companies;
