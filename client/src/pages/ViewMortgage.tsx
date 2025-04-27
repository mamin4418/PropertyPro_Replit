
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
import { ArrowLeft, Calendar, DollarSign, FileText, Home, Pencil, Building2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { format } from "date-fns";

export default function ViewMortgage() {
  const { id } = useParams();
  const [_, setLocation] = useLocation();
  
  const mortgageId = id ? parseInt(id) : undefined;
  
  // Fetch the mortgage data
  const { data: mortgage, isLoading, error } = useQuery({
    queryKey: ['/api/mortgages', mortgageId],
    queryFn: async () => {
      if (!mortgageId) return null;
      const res = await fetch(`/api/mortgages/${mortgageId}`);
      if (!res.ok) throw new Error('Failed to fetch mortgage');
      return res.json();
    },
    enabled: !!mortgageId
  });
  
  // Fetch property data for the mortgage
  const { data: property } = useQuery({
    queryKey: ['/api/properties', mortgage?.propertyId],
    queryFn: async () => {
      if (!mortgage?.propertyId) return null;
      const res = await fetch(`/api/properties/${mortgage.propertyId}`);
      if (!res.ok) throw new Error('Failed to fetch property');
      return res.json();
    },
    enabled: !!mortgage?.propertyId
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
  
  if (error || !mortgage) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-lg mx-auto mt-10 p-6 bg-destructive/10 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-destructive">Mortgage Not Found</h2>
          <p className="mb-4">The mortgage you are looking for does not exist or has been deleted.</p>
          <Button onClick={() => setLocation('/mortgages')}>
            Back to Mortgages
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
        onClick={() => setLocation(mortgage.propertyId ? `/mortgages/${mortgage.propertyId}` : '/mortgages')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Mortgages
      </Button>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          <Building2 className="inline-block mr-2 h-6 w-6 text-primary" />
          {mortgage.lender} Mortgage
        </h1>
        <Button variant="outline" onClick={() => setLocation(`/edit-mortgage/${mortgage.id}`)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Mortgage
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
              <Badge variant={mortgage.isActive ? "default" : "secondary"} className="ml-2">
                {mortgage.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">{property.address}</p>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mortgage Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Loan Number</p>
                <p className="font-medium">{mortgage.loanNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Loan Type</p>
                <p className="font-medium">{mortgage.loanType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Original Amount</p>
                <p className="font-medium">{formatCurrency(Number(mortgage.originalAmount))}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
                <p className="font-medium">{formatCurrency(Number(mortgage.currentBalance))}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Interest Rate</p>
                <p className="font-medium">{Number(mortgage.interestRate).toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Payment</p>
                <p className="font-medium">{formatCurrency(Number(mortgage.monthlyPayment))}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Origination Date</p>
                <p className="font-medium">
                  {mortgage.startDate 
                    ? format(new Date(mortgage.startDate), 'MMM d, yyyy')
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Maturity Date</p>
                <p className="font-medium">
                  {mortgage.maturityDate 
                    ? format(new Date(mortgage.maturityDate), 'MMM d, yyyy')
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
                <p className="font-medium">{mortgage.contactName || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contact Phone</p>
                <p className="font-medium">{mortgage.contactPhone || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contact Email</p>
                <p className="font-medium">{mortgage.contactEmail || 'Not specified'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {mortgage.notes && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{mortgage.notes}</p>
          </CardContent>
        </Card>
      )}
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Documents</CardTitle>
          <CardDescription>Mortgage related documents</CardDescription>
        </CardHeader>
        <CardContent>
          {mortgage.documents?.length > 0 ? (
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
                {mortgage.documents.map((doc, index) => (
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
          onClick={() => setLocation(mortgage.propertyId ? `/mortgages/${mortgage.propertyId}` : '/mortgages')}
        >
          Back to Mortgages
        </Button>
        <Button onClick={() => setLocation(`/edit-mortgage/${mortgage.id}`)}>
          Edit Mortgage
        </Button>
      </div>
    </div>
  );
}
