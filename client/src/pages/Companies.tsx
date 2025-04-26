
import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Plus, Search } from "lucide-react";

// Sample company data until we connect to the API
const sampleCompanies = [
  {
    id: 1,
    companyName: "Parkside Properties LLC",
    legalName: "Parkside Properties LLC",
    email: "info@parksideproperties.com",
    phone: "(555) 123-4567",
    type: "LLC",
    properties: 4,
    units: 24,
    occupancy: "92%"
  },
  {
    id: 2,
    companyName: "Sunset Heights Inc.",
    legalName: "Sunset Heights Investment Corporation",
    email: "contact@sunsetheights.com",
    phone: "(555) 987-6543",
    type: "C-Corp",
    properties: 2,
    units: 12,
    occupancy: "83%"
  },
  {
    id: 3,
    companyName: "Green Properties LLC",
    legalName: "Green Environmental Properties LLC",
    email: "leasing@greenprops.com",
    phone: "(555) 456-7890",
    type: "LLC",
    properties: 3,
    units: 18,
    occupancy: "95%"
  }
];

const Companies = () => {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");

  // Filter companies based on search
  const filteredCompanies = sampleCompanies.filter(company => 
    company.companyName.toLowerCase().includes(search.toLowerCase()) ||
    company.legalName.toLowerCase().includes(search.toLowerCase())
  );

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
                <p className="text-muted-foreground">Email: {company.email}</p>
                <p className="text-muted-foreground">Phone: {company.phone}</p>
                <p className="text-muted-foreground">Type: {company.type}</p>
                <div className="flex justify-between mt-4 pt-2 border-t">
                  <div className="text-center">
                    <p className="font-medium">{company.properties}</p>
                    <p className="text-xs text-muted-foreground">Properties</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{company.units}</p>
                    <p className="text-xs text-muted-foreground">Units</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{company.occupancy}</p>
                    <p className="text-xs text-muted-foreground">Occupancy</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Companies;
