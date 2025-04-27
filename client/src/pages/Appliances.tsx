
import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';
import { Wrench, AlertTriangle, Plus, Search, Tag, Filter } from 'lucide-react';
import type { Appliance } from '@shared/schema';

export default function Appliances() {
  const [location, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('type');
  const { toast } = useToast();
  
  const { data: appliances, isLoading, error } = useQuery({
    queryKey: ['/api/appliances'],
    retry: 1,
  });

  // Get unique property IDs from appliances for filtering
  const propertyIds = appliances ? [...new Set(appliances.map((a: Appliance) => a.propertyId))] : [];
  
  // Filter appliances based on search term, status and property
  const filteredAppliances = appliances?.filter((appliance: Appliance) => {
    // Search filter
    const matchesSearch = 
      searchTerm === '' || 
      appliance.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (appliance.make && appliance.make.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (appliance.model && appliance.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (appliance.serialNumber && appliance.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()));
      
    // Status filter
    const matchesStatus = 
      statusFilter === 'all' || 
      appliance.status === statusFilter;
      
    // Property filter
    const matchesProperty = 
      propertyFilter === 'all' || 
      appliance.propertyId?.toString() === propertyFilter;
      
    return matchesSearch && matchesStatus && matchesProperty;
  });
  
  // Sort appliances based on sortBy
  const sortedAppliances = filteredAppliances ? [...filteredAppliances].sort((a: Appliance, b: Appliance) => {
    switch(sortBy) {
      case 'type':
        return a.type.localeCompare(b.type);
      case 'make':
        return (a.make || '').localeCompare(b.make || '');
      case 'unit':
        return a.unitId - b.unitId;
      case 'lastService':
        if (!a.lastServiceDate) return 1;
        if (!b.lastServiceDate) return -1;
        return new Date(b.lastServiceDate).getTime() - new Date(a.lastServiceDate).getTime();
      default:
        return 0;
    }
  }) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'repair-needed':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'inactive':
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Appliances</h1>
          <p className="text-muted-foreground">Manage appliances for all rental units</p>
        </div>
        <Button onClick={() => setLocation('/add-appliance')}>
          <Plus className="mr-2 h-4 w-4" /> Add Appliance
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search appliances..."
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
                  <SelectItem value="repair-needed">Needs Repair</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
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
                      Property {id || 'Unknown'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="mb-1 block">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="type">Type</SelectItem>
                  <SelectItem value="make">Make/Model</SelectItem>
                  <SelectItem value="unit">Unit</SelectItem>
                  <SelectItem value="lastService">Last Service Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setPropertyFilter('all');
              setSortBy('type');
            }}>
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Skeleton className="h-20 w-20 rounded-md" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-2/4" />
                  </div>
                  <Skeleton className="h-10 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-2" />
            <h3 className="text-xl font-semibold">Error Loading Appliances</h3>
            <p className="text-muted-foreground">An error occurred while loading appliances.</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : appliances?.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Wrench className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <h3 className="text-xl font-semibold">No Appliances Found</h3>
            <p className="text-muted-foreground">You haven't added any appliances yet.</p>
            <Button className="mt-4" onClick={() => setLocation('/add-appliance')}>
              Add Your First Appliance
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Make/Model</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Last Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAppliances?.map((appliance: Appliance) => (
                    <TableRow key={appliance.id}>
                      <TableCell className="font-medium flex items-center">
                        <Tag className="h-4 w-4 mr-2" />
                        {appliance.type}
                      </TableCell>
                      <TableCell>
                        {appliance.make} {appliance.model && `/ ${appliance.model}`}
                      </TableCell>
                      <TableCell>
                        {appliance.serialNumber || 'N/A'}
                      </TableCell>
                      <TableCell>
                        Unit #{appliance.unitId}
                      </TableCell>
                      <TableCell>
                        {appliance.lastServiceDate 
                          ? formatDate(new Date(appliance.lastServiceDate)) 
                          : 'Never'}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(appliance.status || 'inactive')}>
                          {appliance.status === 'repair-needed' 
                            ? 'Needs Repair' 
                            : (appliance.status ? appliance.status.charAt(0).toUpperCase() + appliance.status.slice(1) : 'Inactive')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setLocation(`/view-appliance/${appliance.id}`)}
                          >
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setLocation(`/edit-appliance/${appliance.id}`)}
                          >
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
