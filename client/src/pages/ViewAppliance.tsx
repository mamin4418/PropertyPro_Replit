
import { useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';
import { 
  ArrowLeft,
  Calendar,
  CalendarClock,
  Clock,
  Edit,
  Info,
  Trash2,
  Wrench
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import type { Appliance } from '@shared/schema';

export default function ViewAppliance() {
  const [, params] = useRoute('/view-appliance/:id');
  const [location, setLocation] = useLocation();
  const applianceId = params?.id ? parseInt(params.id) : null;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch appliance data
  const { 
    data: appliance, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['/api/appliances', applianceId],
    queryFn: () => apiRequest<Appliance>(`/api/appliances/${applianceId}`),
    enabled: !!applianceId,
    retry: 1,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => {
      return apiRequest(`/api/appliances/${applianceId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      toast({
        title: "Appliance Deleted",
        description: "The appliance has been successfully removed.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/appliances'] });
      setLocation('/appliances');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete appliance. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Active
          </Badge>
        );
      case 'repair-needed':
        return (
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
            Needs Repair
          </Badge>
        );
      case 'inactive':
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            Inactive
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            {status}
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6 flex justify-between items-center">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-2/3 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !appliance) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Info className="h-10 w-10 text-destructive mx-auto mb-2" />
            <h3 className="text-xl font-semibold">Appliance Not Found</h3>
            <p className="text-muted-foreground">The appliance you are looking for doesn't exist or was removed.</p>
            <Button className="mt-4" onClick={() => setLocation('/appliances')}>
              Back to Appliances
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Button variant="outline" onClick={() => setLocation('/appliances')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Appliances
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setLocation(`/edit-appliance/${appliance.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the appliance from your inventory.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => deleteMutation.mutate()}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="mb-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Wrench className="h-6 w-6" /> 
          {appliance.type}
          {appliance.make ? ` - ${appliance.make}` : ''}
          {appliance.model ? ` ${appliance.model}` : ''}
        </h1>
        <div className="flex items-center mt-2">
          <span className="text-muted-foreground mr-2">Status:</span> 
          {getStatusBadge(appliance.status)}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appliance Details</CardTitle>
          <CardDescription>
            Complete information about this appliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Info Card */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <dt className="text-muted-foreground">Type</dt>
                      <dd className="font-medium">{appliance.type}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Make</dt>
                      <dd className="font-medium">{appliance.make || 'N/A'}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Model</dt>
                      <dd className="font-medium">{appliance.model || 'N/A'}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Serial Number</dt>
                      <dd className="font-medium">{appliance.serialNumber || 'N/A'}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Unit ID</dt>
                      <dd className="font-medium">#{appliance.unitId}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Warranty</dt>
                      <dd className="font-medium">{appliance.warranty || 'N/A'}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Important Dates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <dt className="text-muted-foreground">Purchase Date</dt>
                      <dd className="font-medium">
                        {appliance.purchaseDate
                          ? formatDate(new Date(appliance.purchaseDate))
                          : 'N/A'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Installation Date</dt>
                      <dd className="font-medium">
                        {appliance.installDate
                          ? formatDate(new Date(appliance.installDate))
                          : 'N/A'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Last Service Date</dt>
                      <dd className="font-medium">
                        {appliance.lastServiceDate
                          ? formatDate(new Date(appliance.lastServiceDate))
                          : 'Never serviced'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Added On</dt>
                      <dd className="font-medium">
                        {formatDate(new Date(appliance.createdAt))}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
            
            {/* Notes Section */}
            {appliance.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{appliance.notes}</p>
                </CardContent>
              </Card>
            )}
            
            {/* Images Section - would be implemented with actual image display */}
            {appliance.images && appliance.images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {appliance.images.map((image, index) => (
                      <div 
                        key={index}
                        className="aspect-square bg-muted rounded-md overflow-hidden"
                      >
                        <img 
                          src={image} 
                          alt={`${appliance.type} image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Maintenance History - placeholder for future feature */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <CalendarClock className="h-4 w-4 mr-2" />
                  Maintenance History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-4">
                  No maintenance records available.
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
