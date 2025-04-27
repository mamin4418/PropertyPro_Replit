import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, FileText, Home, Plus, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Mortgage } from "@shared/schema";

export default function Mortgages() {
  const [_, setLocation] = useLocation();
  const { propertyId } = useParams();
  
  const propertyIdNum = propertyId ? parseInt(propertyId) : undefined;
  
  const { data: mortgages, isLoading, error } = useQuery<Mortgage[]>({
    queryKey: ['/api/mortgages', propertyIdNum ? `/property/${propertyIdNum}` : ''],
    queryFn: async () => {
      try {
        const url = propertyIdNum 
          ? `/api/mortgages/property/${propertyIdNum}` 
          : '/api/mortgages';
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch mortgages');
        
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error('Error parsing JSON:', text.substring(0, 100));
          throw new Error('Invalid response format from server');
        }
      } catch (err) {
        console.error('Error fetching mortgages:', err);
        throw err;
      }
    },
  });
  
  const { data: property } = useQuery({
    queryKey: ['/api/properties', propertyIdNum],
    queryFn: async () => {
      if (!propertyIdNum) return null;
      const res = await fetch(`/api/properties/${propertyIdNum}`);
      if (!res.ok) throw new Error('Failed to fetch property');
      return res.json();
    },
    enabled: !!propertyIdNum
  });
  
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Mortgages</h1>
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          Error loading mortgages: {error.message}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mortgages</h1>
          {property && (
            <p className="text-muted-foreground">
              <Home className="inline mr-1" size={16} /> {property.name}
            </p>
          )}
        </div>
        <Button onClick={() => setLocation(propertyIdNum ? `/add-mortgage/${propertyIdNum}` : '/add-mortgage')}>
          <Plus className="h-4 w-4 mr-2" /> Add Mortgage
        </Button>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : mortgages && mortgages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mortgages.map((mortgage) => (
            <Card key={mortgage.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-primary" />
                  {mortgage.lender}
                </CardTitle>
                <Badge className="mt-1" variant={mortgage.isActive ? "default" : "secondary"}>
                  {mortgage.isActive ? "Active" : "Inactive"}
                </Badge>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Loan:</span>
                    <span className="ml-1 font-medium">{mortgage.loanNumber}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Balance:</span>
                    <span className="ml-1 font-medium">{formatCurrency(Number(mortgage.currentBalance))}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Maturity:</span>
                    <span className="ml-1 font-medium">
                      {mortgage.maturityDate 
                        ? format(new Date(mortgage.maturityDate), 'MMM d, yyyy')
                        : 'No maturity date'}
                    </span>
                  </div>
                  <div className="bg-muted p-2 rounded-sm text-sm mt-2">
                    <p className="font-medium">{mortgage.loanType} loan</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      Monthly Payment: {formatCurrency(Number(mortgage.monthlyPayment))}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Interest Rate: {Number(mortgage.interestRate).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/view-mortgage/${mortgage.id}`}>View Details</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/edit-mortgage/${mortgage.id}`}>Edit</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No Mortgages</h3>
          <p className="mt-2 text-muted-foreground">
            There are no mortgages {property ? `for ${property.name}` : ''} yet.
          </p>
          <Button 
            className="mt-4" 
            onClick={() => setLocation(propertyIdNum ? `/add-mortgage/${propertyIdNum}` : '/add-mortgage')}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Mortgage
          </Button>
        </div>
      )}
    </div>
  );
}