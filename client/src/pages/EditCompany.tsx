import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";

// Same sample companies data as in ViewCompany.tsx
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
    occupancy: 92,
    address: "123 Main St, Suite 101, Boston, MA 02110",
    description: "ABC Properties is a residential property management company specializing in luxury apartments in downtown Boston.",
    founded: "2012",
    website: "www.abcproperties.com"
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
    occupancy: 88,
    address: "456 Park Ave, New York, NY 10022",
    description: "XYZ Real Estate specializes in commercial property management throughout the East Coast.",
    founded: "2005",
    website: "www.xyzrealestate.com"
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
    occupancy: 83,
    address: "789 Sunset Blvd, Los Angeles, CA 90026",
    description: "Sunset Heights manages residential properties across Southern California, focusing on mid-range apartment complexes.",
    founded: "2010",
    website: "www.sunsetheights.com"
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
    occupancy: 94,
    address: "321 Cedar St, Seattle, WA 98102",
    description: "Green Properties specializes in eco-friendly and sustainable apartment buildings in the Pacific Northwest.",
    founded: "2015",
    website: "www.greenproperties.com"
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
    occupancy: 90,
    address: "555 Urban Way, Chicago, IL 60611",
    description: "Urban Living specializes in luxury high-rise apartment buildings in downtown Chicago.",
    founded: "2008",
    website: "www.urbanliving.com"
  }
];

const EditCompany = () => {
  const [, navigate] = useLocation();
  const { id } = useParams<{ id: string }>();
  const companyId = parseInt(id);

  const { data: initialCompany, isLoading } = useQuery({
    queryKey: [`/api/companies/${id}`],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/companies/${id}`);
        if (!response.ok) throw new Error("Failed to fetch company");
        return response.json();
      } catch (error) {
        console.error("Failed to fetch company:", error);
        // Return sample data for the specific company when API fails
        return sampleCompanies.find(c => c.id === companyId) || null;
      }
    }
  });

  const [formData, setFormData] = useState({
    companyName: "",
    legalName: "",
    ein: "",
    type: "",
    status: "",
    email: "",
    phone: "",
    website: "",
    founded: "",
    address: "",
    description: ""
  });

  // Update form data when company data is loaded
  useState(() => {
    if (initialCompany) {
      setFormData({
        companyName: initialCompany.companyName || "",
        legalName: initialCompany.legalName || "",
        ein: initialCompany.ein || "",
        type: initialCompany.type || "",
        status: initialCompany.status || "",
        email: initialCompany.email || "",
        phone: initialCompany.phone || "",
        website: initialCompany.website || "",
        founded: initialCompany.founded || "",
        address: initialCompany.address || "",
        description: initialCompany.description || ""
      });
    }
  }, [initialCompany]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would submit this data to your API
    console.log("Submitting company data:", formData);

    // Simulate successful update and navigate back to view page
    navigate(`/view-company/${id}`);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-40 bg-muted rounded"></div>
          <div className="h-60 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!initialCompany) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Company Not Found</h1>
        <Button onClick={() => navigate("/companies")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Companies
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => navigate(`/view-company/${id}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Company
        </Button>
        <h1 className="text-3xl font-bold ml-4">Edit Company</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input 
                    id="companyName" 
                    name="companyName" 
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="legalName">Legal Name</Label>
                  <Input 
                    id="legalName" 
                    name="legalName" 
                    value={formData.legalName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ein">EIN</Label>
                  <Input 
                    id="ein" 
                    name="ein" 
                    value={formData.ein}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Company Type</Label>
                  <select 
                    id="type" 
                    name="type" 
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md bg-background"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="LLC">LLC</option>
                    <option value="Corporation">Corporation</option>
                    <option value="S-Corp">S-Corp</option>
                    <option value="C-Corp">C-Corp</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select 
                    id="status" 
                    name="status" 
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md bg-background"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founded">Founded</Label>
                  <Input 
                    id="founded" 
                    name="founded" 
                    value={formData.founded}
                    onChange={handleChange}
                    placeholder="Year founded"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website" 
                    name="website" 
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(`/view-company/${id}`)}
            >
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditCompany;