import { useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
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
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  ArrowLeft, 
  CalendarClock, 
  Clock, 
  Edit, 
  Home, 
  Loader2, 
  Tag, 
  Trash2, 
  Wrench 
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
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

  // Fetch unit data
  const { 
    data: unit, 
    isLoading: isLoadingUnit 
  } = useQuery({
    queryKey: ['/api/units', appliance?.unitId],
    queryFn: () => apiRequest(`/api/units/${appliance?.unitId}`),
    enabled: !!appliance?.unitId,
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
        description: "The appliance has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/appliances'] });
      queryClient.invalidateQueries({ queryKey: ['/api/units'] });
      setLocation('/appliances');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete appliance. Please try again.",
        variant: "destructive",
      });
    }
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6">
          <div className="mb-6">
            <Skeleton className="h-10 w-1/4 mb-2" />
            <Skeleton className="h-6 w-1/3" />
          </div>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                </div>
                <Skeleton className="h-32" />
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !appliance) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6">
          <div className="mb-6">
            <Button variant="outline" onClick={() => setLocation('/appliances')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Appliances
            </Button>
          </div>
          
          <Card className="text-center py-8">
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <span className="rounded-full bg-destructive/10 p-4">
                    <Wrench className="h-8 w-8 text-destructive" />
                  </span>
                </div>
                <CardTitle>Appliance Not Found</CardTitle>
                <CardDescription>
                  The appliance you're looking for could not be found or there was an error loading it.
                </CardDescription>
                <Button onClick={() => setLocation('/appliances')}>
                  Return to Appliances List
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

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
    <DashboardLayout>
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
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleteMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl flex items-center">
                    <Tag className="h-5 w-5 mr-2" />
                    {appliance.type}
                    <Badge className={`ml-4 ${getStatusColor(appliance.status)}`}>
                      {appliance.status === 'repair-needed' 
                        ? 'Needs Repair' 
                        : appliance.status.charAt(0).toUpperCase() + appliance.status.slice(1)}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {appliance.make} {appliance.model ? `/ ${appliance.model}` : ''}
                    {appliance.serialNumber && ` • SN: ${appliance.serialNumber}`}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Home className="h-4 w-4 mr-2" />
                      Installation Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid grid-cols-1 gap-3 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Unit</dt>
                        <dd className="font-medium">
                          {isLoadingUnit ? (
                            <Skeleton className="h-4 w-20" />
                          ) : unit ? (
                            `Unit #${unit.unitNumber} - ${unit.propertyName || 'Property'}`
                          ) : (
                            `Unit ID: ${appliance.unitId}`
                          )}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Purchase Date</dt>
                        <dd className="font-medium">
                          {appliance.purchaseDate 
                            ? formatDate(new Date(appliance.purchaseDate))
                            : 'Not specified'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Installation Date</dt>
                        <dd className="font-medium">
                          {appliance.installDate 
                            ? formatDate(new Date(appliance.installDate))
                            : 'Not specified'}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Service & Warranty
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid grid-cols-1 gap-3 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Last Service Date</dt>
                        <dd className="font-medium">
                          {appliance.lastServiceDate 
                            ? formatDate(new Date(appliance.lastServiceDate))
                            : 'Never serviced'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Warranty</dt>
                        <dd className="font-medium">
                          {appliance.warranty || 'No warranty information'}
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
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}