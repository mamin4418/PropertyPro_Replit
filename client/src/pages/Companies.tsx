
import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Plus, Search } from "lucide-react";

const Companies = () => {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");

  const { data: companies, isLoading } = useQuery({
    queryKey: ['/api/companies'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/companies');
        if (!response.ok) throw new Error("Failed to fetch companies");
        return response.json();
      } catch (error) {
        console.error("Failed to fetch companies:", error);
        // Return sample data for now
        return [
          { 
            id: 1, 
            companyName: "ABC Properties", 
            legalName: "ABC Properties LLC", 
            ein: "12-3456789", 
            email: "info@abcproperties.com",
            phone: "(555) 123-4567",
            type: "LLC"
          },
          { 
            id: 2, 
            companyName: "XYZ Real Estate", 
            legalName: "XYZ Real Estate Group, Inc.", 
            ein: "98-7654321", 
            email: "contact@xyzrealestate.com",
            phone: "(555) 987-6543",
            type: "Corporation"
          },
          { 
            id: 3, 
            companyName: "Sunshine Properties", 
            legalName: "Sunshine Properties Management LLC", 
            ein: "45-6789123", 
            email: "hello@sunshineproperties.com",
            phone: "(555) 456-7890",
            type: "LLC"
          }
        ];
      }
    }
  });

  const filteredCompanies = companies?.filter(company => 
    company.companyName.toLowerCase().includes(search.toLowerCase()) ||
    company.legalName.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Companies</h1>
        <Button onClick={() => navigate("/add-company")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <Card 
              key={company.id}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => navigate(`/view-company/${company.id}`)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {company.companyName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">Legal Name: {company.legalName}</p>
                  {company.email && <p className="text-muted-foreground">Email: {company.email}</p>}
                  {company.phone && <p className="text-muted-foreground">Phone: {company.phone}</p>}
                  <p className="text-muted-foreground">Type: {company.type}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Companies;
