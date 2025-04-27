import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, FileText, Home, Plus, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Insurance } from "@shared/schema";

export default function Insurances() {
  const [_, setLocation] = useLocation();
  const { propertyId } = useParams();
  
  const propertyIdNum = propertyId ? parseInt(propertyId) : undefined;
  
  const { data: insurances, isLoading, error } = useQuery<Insurance[]>({
    queryKey: ['/api/insurances', propertyIdNum ? `/property/${propertyIdNum}` : ''],
    queryFn: async () => {
      const url = propertyIdNum 
        ? `/api/insurances/property/${propertyIdNum}` 
        : '/api/insurances';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch insurances');
      return res.json();
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
        <h1 className="text-2xl font-bold mb-6">Insurance Policies</h1>
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          Error loading insurances: {error.message}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Insurance Policies</h1>
          {property && (
            <p className="text-muted-foreground">
              <Home className="inline mr-1" size={16} /> {property.name}
            </p>
          )}
        </div>
        <Button onClick={() => setLocation(propertyIdNum ? `/add-insurance/${propertyIdNum}` : '/add-insurance')}>
          <Plus className="h-4 w-4 mr-2" /> Add Insurance
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
      ) : insurances && insurances.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insurances.map((insurance) => (
            <Card key={insurance.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-primary" />
                  {insurance.insuranceProvider}
                </CardTitle>
                <Badge className="mt-1" variant={insurance.isActive ? "default" : "secondary"}>
                  {insurance.isActive ? "Active" : "Inactive"}
                </Badge>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Policy:</span>
                    <span className="ml-1 font-medium">{insurance.policyNumber}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Coverage:</span>
                    <span className="ml-1 font-medium">{formatCurrency(Number(insurance.coverageAmount))}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Expires:</span>
                    <span className="ml-1 font-medium">
                      {insurance.endDate 
                        ? format(new Date(insurance.endDate), 'MMM d, yyyy')
                        : 'No end date'}
                    </span>
                  </div>
                  <div className="bg-muted p-2 rounded-sm text-sm mt-2">
                    <p className="font-medium">{insurance.policyType}</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      Premium: {formatCurrency(Number(insurance.premium))}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/view-insurance/${insurance.id}`}>View Details</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/edit-insurance/${insurance.id}`}>Edit</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No Insurance Policies</h3>
          <p className="mt-2 text-muted-foreground">
            There are no insurance policies {property ? `for ${property.name}` : ''} yet.
          </p>
          <Button 
            className="mt-4" 
            onClick={() => setLocation(propertyIdNum ? `/add-insurance/${propertyIdNum}` : '/add-insurance')}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Insurance
          </Button>
        </div>
      )}
    </div>
  );
}