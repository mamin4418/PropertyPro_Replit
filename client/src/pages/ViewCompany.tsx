
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Building2, Edit, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const ViewCompany = () => {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { data: company, isLoading, error } = useQuery({
    queryKey: [`/api/companies/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/companies/${id}`);
      if (!response.ok) throw new Error("Failed to fetch company");
      return response.json();
    }
  });

  const handleDeleteCompany = async () => {
    try {
      const response = await fetch(`/api/companies/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete company');
      }
      
      toast({
        title: "Success",
        description: "Company deleted successfully",
      });
      navigate("/companies");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete company",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate("/companies")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Companies
          </Button>
        </div>
        
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-2/3 bg-muted rounded"></div>
          <Card>
            <CardHeader>
              <div className="h-7 w-1/3 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-5 w-full bg-muted rounded"></div>
                <div className="h-5 w-2/3 bg-muted rounded"></div>
                <div className="h-5 w-1/2 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate("/companies")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Companies
          </Button>
        </div>
        
        <Card className="text-center py-8">
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-center">
                <span className="rounded-full bg-destructive/10 p-4">
                  <Building2 className="h-8 w-8 text-destructive" />
                </span>
              </div>
              <CardTitle>Company Not Found</CardTitle>
              <CardDescription>
                The company you're looking for could not be found or there was an error loading it.
              </CardDescription>
              <Button onClick={() => navigate("/companies")}>
                Return to Companies List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate("/companies")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Companies
        </Button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-full">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{company.companyName}</h1>
            <p className="text-muted-foreground">{company.legalName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/edit-company/${company.id}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the company
                  and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteCompany}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="details">Company Details</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-muted-foreground">Legal Name</h3>
                  <p className="text-lg">{company.legalName}</p>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">Company Name</h3>
                  <p className="text-lg">{company.companyName}</p>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">EIN</h3>
                  <p className="text-lg">{company.ein || "Not provided"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">Company Type</h3>
                  <p className="text-lg">{company.type}</p>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">Email</h3>
                  <p className="text-lg">{company.email || "Not provided"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">Phone</h3>
                  <p className="text-lg">{company.phone || "Not provided"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">Status</h3>
                  <p className="text-lg capitalize">{company.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="properties">
          <Card>
            <CardHeader>
              <CardTitle>Properties</CardTitle>
              <CardDescription>Properties managed by this company</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-muted-foreground">No properties found for this company</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate("/add-property")}
                >
                  Add Property
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Contacts</CardTitle>
              <CardDescription>Contacts associated with this company</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-muted-foreground">No contacts found for this company</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate("/add-contact")}
                >
                  Add Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Documents related to this company</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-muted-foreground">No documents found for this company</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                >
                  Upload Document
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ViewCompany;
