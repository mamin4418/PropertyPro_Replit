import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Calendar, FileText, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

function PropertyInspectionsPage() {
  const [scheduledInspections, setScheduledInspections] = useState([]);
  const [completedInspections, setCompletedInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch scheduled inspections
    fetch('/api/inspections')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch scheduled inspections');
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched scheduled inspections:', data);
        setScheduledInspections(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching scheduled inspections:', err);
        setError(err.message);
        setLoading(false);
      });

    // Fetch completed inspections
    fetch('/api/completed-inspections')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch completed inspections');
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched completed inspections:', data);
        setCompletedInspections(data);
      })
      .catch(err => {
        console.error('Error fetching completed inspections:', err);
      });
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading inspections data...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error Loading Inspections</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  // Default to empty arrays if no data
  const safeScheduledInspections = scheduledInspections || [];
  const safeCompletedInspections = completedInspections || [];

  const upcomingInspections = safeScheduledInspections.filter(inspection => {
    if (!inspection.scheduledDate && !inspection.date) return false;
    const inspectionDate = new Date(inspection.scheduledDate || inspection.date);
    const today = new Date();
    return inspectionDate >= today;
  });

  const overdueInspections = safeScheduledInspections.filter(inspection => {
    if (!inspection.scheduledDate && !inspection.date) return false;
    const inspectionDate = new Date(inspection.scheduledDate || inspection.date);
    const today = new Date();
    return inspectionDate < today && (inspection.status !== 'completed');
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Property Inspections</h1>
        <Link to="/schedule-inspection">
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Inspection
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Upcoming</CardTitle>
            <CardDescription>Scheduled inspections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingInspections.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Completed</CardTitle>
            <CardDescription>Finished inspections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{safeCompletedInspections.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Overdue</CardTitle>
            <CardDescription>Past due inspections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overdueInspections.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="scheduled">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scheduled">Scheduled Inspections</TabsTrigger>
          <TabsTrigger value="completed">Completed Inspections</TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Inspections</CardTitle>
              <CardDescription>Upcoming and pending property inspections</CardDescription>
            </CardHeader>
            <CardContent>
              {safeScheduledInspections.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">No scheduled inspections found.</p>
                  <Link to="/schedule-inspection">
                    <Button variant="outline" className="mt-2">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Your First Inspection
                    </Button>
                  </Link>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Inspection Type</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Inspector</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {safeScheduledInspections.map((inspection) => {
                      const inspectionDate = new Date(inspection.scheduledDate || inspection.date);
                      const today = new Date();
                      const isOverdue = inspectionDate < today && (inspection.status !== 'completed');

                      return (
                        <TableRow key={inspection.id}>
                          <TableCell className="font-medium">{inspection.propertyName || `Property ${inspection.propertyId}`}</TableCell>
                          <TableCell>{inspection.inspectionType || 'Routine'}</TableCell>
                          <TableCell>
                            {inspectionDate.toLocaleDateString()} {inspection.scheduledTime ? `at ${inspection.scheduledTime}` : ''}
                          </TableCell>
                          <TableCell>{inspection.inspector}</TableCell>
                          <TableCell>
                            {isOverdue ? (
                              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                                <Clock className="h-3 w-3 mr-1" />
                                Overdue
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                                Scheduled
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Completed Inspections</CardTitle>
              <CardDescription>Inspection history and results</CardDescription>
            </CardHeader>
            <CardContent>
              {safeCompletedInspections.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">No completed inspections found.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Inspection Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Completed By</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {safeCompletedInspections.map((inspection) => (
                      <TableRow key={inspection.id}>
                        <TableCell className="font-medium">{inspection.propertyName || `Property ${inspection.propertyId}`}</TableCell>
                        <TableCell>{inspection.inspectionType || 'Routine'}</TableCell>
                        <TableCell>{new Date(inspection.inspectionDate || inspection.dateCompleted || inspection.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{inspection.completedBy || inspection.inspector || 'System'}</TableCell>
                        <TableCell>
                          {inspection.status === 'passed' ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Passed
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                              <XCircle className="h-3 w-3 mr-1" />
                              {inspection.status || 'Completed'}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PropertyInspectionsPage;