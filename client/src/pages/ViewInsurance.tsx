
import { useParams, useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, DollarSign, FileText, Home, Pencil, Shield } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { format } from "date-fns";

export default function ViewInsurance() {
  const { id } = useParams();
  const [_, setLocation] = useLocation();
  
  const insuranceId = id ? parseInt(id) : undefined;
  
  // Fetch the insurance data
  const { data: insurance, isLoading, error } = useQuery({
    queryKey: ['/api/insurances', insuranceId],
    queryFn: async () => {
      if (!insuranceId) return null;
      const res = await fetch(`/api/insurances/${insuranceId}`);
      if (!res.ok) throw new Error('Failed to fetch insurance');
      return res.json();
    },
    enabled: !!insuranceId
  });
  
  // Fetch property data for the insurance
  const { data: property } = useQuery({
    queryKey: ['/api/properties', insurance?.propertyId],
    queryFn: async () => {
      if (!insurance?.propertyId) return null;
      const res = await fetch(`/api/properties/${insurance.propertyId}`);
      if (!res.ok) throw new Error('Failed to fetch property');
      return res.json();
    },
    enabled: !!insurance?.propertyId
  });
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (error || !insurance) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-lg mx-auto mt-10 p-6 bg-destructive/10 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-destructive">Insurance Not Found</h2>
          <p className="mb-4">The insurance policy you are looking for does not exist or has been deleted.</p>
          <Button onClick={() => setLocation('/insurances')}>
            Back to Insurances
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => setLocation(insurance.propertyId ? `/insurances/${insurance.propertyId}` : '/insurances')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Insurance Policies
      </Button>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          <Shield className="inline-block mr-2 h-6 w-6 text-primary" />
          {insurance.insuranceProvider} Policy
        </h1>
        <Button variant="outline" onClick={() => setLocation(`/edit-insurance/${insurance.id}`)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Policy
        </Button>
      </div>
      
      {property && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Property Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Home className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">{property.name}</h3>
              <Badge variant={insurance.isActive ? "default" : "secondary"} className="ml-2">
                {insurance.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">{property.address}</p>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Insurance Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Policy Number</p>
                <p className="font-medium">{insurance.policyNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Policy Type</p>
                <p className="font-medium">{insurance.policyType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Coverage Amount</p>
                <p className="font-medium">{formatCurrency(Number(insurance.coverageAmount))}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Premium</p>
                <p className="font-medium">{formatCurrency(Number(insurance.premium))}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Deductible</p>
                <p className="font-medium">
                  {insurance.deductible ? formatCurrency(Number(insurance.deductible)) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                <p className="font-medium">
                  {insurance.startDate 
                    ? format(new Date(insurance.startDate), 'MMM d, yyyy')
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">End Date</p>
                <p className="font-medium">
                  {insurance.endDate 
                    ? format(new Date(insurance.endDate), 'MMM d, yyyy')
                    : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contact Name</p>
                <p className="font-medium">{insurance.contactName || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contact Phone</p>
                <p className="font-medium">{insurance.contactPhone || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contact Email</p>
                <p className="font-medium">{insurance.contactEmail || 'Not specified'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {(insurance.coverageDetails || insurance.notes) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {insurance.coverageDetails && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Coverage Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{insurance.coverageDetails}</p>
              </CardContent>
            </Card>
          )}
          
          {insurance.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{insurance.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Documents</CardTitle>
          <CardDescription>Insurance policy related documents</CardDescription>
        </CardHeader>
        <CardContent>
          {insurance.documents?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>File Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Date Added</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {insurance.documents.map((doc, index) => (
                  <TableRow key={index}>
                    <TableCell>{doc.fileName || `Document ${index + 1}`}</TableCell>
                    <TableCell>{doc.type || 'Unknown'}</TableCell>
                    <TableCell>{doc.dateAdded ? format(new Date(doc.dateAdded), 'MMM d, yyyy') : 'Unknown'}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <FileText className="mx-auto h-8 w-8 mb-2" />
              <p>No documents available</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" disabled>
            Upload Document
          </Button>
        </CardFooter>
      </Card>
      
      <div className="flex justify-end mt-6 space-x-2">
        <Button 
          variant="outline" 
          onClick={() => setLocation(insurance.propertyId ? `/insurances/${insurance.propertyId}` : '/insurances')}
        >
          Back to Insurance Policies
        </Button>
        <Button onClick={() => setLocation(`/edit-insurance/${insurance.id}`)}>
          Edit Policy
        </Button>
      </div>
    </div>
  );
}
