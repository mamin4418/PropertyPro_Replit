import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, FileText, Home, Plus, Shield, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Insurance } from "@shared/schema";

export default function Insurances() {
  const [_, setLocation] = useLocation();
  const { propertyId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [policyTypeFilter, setPolicyTypeFilter] = useState('all');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('provider');

  const propertyIdNum = propertyId ? parseInt(propertyId) : undefined;

  const { data: insurances, isLoading, error } = useQuery<Insurance[]>({
    queryKey: ['/api/insurances', propertyIdNum ? `/property/${propertyIdNum}` : ''],
    queryFn: async () => {
      try {
        const url = propertyIdNum 
          ? `/api/insurances/property/${propertyIdNum}` 
          : '/api/insurances';
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch insurances');

        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error('Error parsing JSON:', text.substring(0, 100));
          throw new Error('Invalid response format from server');
        }
      } catch (err) {
        console.error('Error fetching insurances:', err);
        throw err;
      }
    },
  });

  // Get unique property IDs from insurances for filtering
  const propertyIds = insurances ? [...new Set(insurances.map(i => i.propertyId))] : [];

  // Get unique policy types for filtering
  const policyTypes = insurances ? [...new Set(insurances.map(i => i.policyType))] : [];

  // Filter insurances based on search term, status, policy type and property
  const filteredInsurances = insurances?.filter((insurance) => {
    // Search filter
    const matchesSearch = 
      searchTerm === '' || 
      insurance.insuranceProvider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insurance.policyNumber.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && insurance.isActive) ||
      (statusFilter === 'inactive' && !insurance.isActive);

    // Policy type filter
    const matchesPolicyType = 
      policyTypeFilter === 'all' || 
      insurance.policyType === policyTypeFilter;

    // Property filter
    const matchesProperty =
      propertyFilter === 'all' ||
      insurance.propertyId?.toString() === propertyFilter;

    return matchesSearch && matchesStatus && matchesPolicyType && matchesProperty;
  });

  // Sort insurances based on sortBy
  const sortedInsurances = filteredInsurances ? [...filteredInsurances].sort((a, b) => {
    switch(sortBy) {
      case 'provider':
        return a.insuranceProvider.localeCompare(b.insuranceProvider);
      case 'coverage':
        return Number(b.coverageAmount) - Number(a.coverageAmount);
      case 'premium':
        return Number(b.premium) - Number(a.premium);
      case 'expiry':
        if (!a.endDate) return 1;
        if (!b.endDate) return -1;
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      default:
        return 0;
    }
  }) : [];

  const { data: properties } = useQuery({
    queryKey: ['/api/properties'],
    queryFn: async () => {
      const res = await fetch('/api/properties');
      if (!res.ok) throw new Error('Failed to fetch properties');
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

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by provider or policy number..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <Label className="mb-1 block">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-1 block">Policy Type</Label>
              <Select value={policyTypeFilter} onValueChange={setPolicyTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by policy type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Policy Types</SelectItem>
                  {policyTypes.map((type) => (
                    <SelectItem key={type} value={type || ''}>
                      {type || 'Unknown'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!propertyIdNum && (
              <div>
                <Label className="mb-1 block">Property</Label>
                <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by property" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Properties</SelectItem>
                    {propertyIds.map((id) => (
                      <SelectItem key={id} value={id?.toString() || 'unknown'}>
                        {properties?.find(p => p.id === id)?.name || `Property ${id || 'Unknown'}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className={!propertyIdNum ? "md:col-start-1 md:col-span-4 lg:col-start-4 lg:col-span-1" : ""}>
              <Label className="mb-1 block">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="provider">Provider</SelectItem>
                  <SelectItem value="coverage">Coverage Amount</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="expiry">Expiry Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setPolicyTypeFilter('all');
              setPropertyFilter('all');
              setSortBy('provider');
            }}>
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

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
      ) : sortedInsurances && sortedInsurances.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedInsurances.map((insurance) => (
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