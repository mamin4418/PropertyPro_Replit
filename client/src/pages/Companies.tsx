
import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Plus, Search, Loader2 } from "lucide-react";

const Companies = () => {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");

  const { data: companies, isLoading, isError } = useQuery({
    queryKey: ['/api/companies'],
    queryFn: async () => {
      const response = await fetch('/api/companies');
      if (!response.ok) throw new Error("Failed to fetch companies");
      return response.json();
    },
    // Mock data for now until API is implemented
    initialData: [
      {
        id: 1,
        legalName: "Cornerstone Properties LLC",
        companyName: "Cornerstone Properties",
        ein: "12-3456789",
        email: "info@cornerstoneproperties.com",
        phone: "(555) 123-4567",
        type: "LLC",
        status: "active"
      },
      {
        id: 2,
        legalName: "Urban Living Investments Inc.",
        companyName: "Urban Living",
        ein: "98-7654321",
        email: "contact@urbanliving.com",
        phone: "(555) 987-6543",
        type: "Corporation",
        status: "active"
      }
    ]
  });

  const filteredCompanies = companies?.filter(company => 
    company.companyName.toLowerCase().includes(search.toLowerCase()) ||
    company.legalName.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mb-2 mx-auto" />
          <p>Loading companies...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center p-10">
          <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
          <p className="mb-6">Failed to load companies</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

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
        {filteredCompanies?.map((company) => (
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
    </div>
  );
};

export default Companies;
