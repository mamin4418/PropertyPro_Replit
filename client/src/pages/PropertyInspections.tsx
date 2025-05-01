import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarPlus, FileCheck, ClipboardList, ArrowUpRight } from "lucide-react";

export default function PropertyInspections() {
  const [location, navigate] = useLocation();
  const [scheduledInspections, setScheduledInspections] = useState<any[]>([]);
  const [completedInspections, setCompletedInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInspections() {
      try {
        setLoading(true);
        // Fetch scheduled inspections
        const scheduledResponse = await fetch('/api/property-inspections/scheduled');
        if (!scheduledResponse.ok) {
          throw new Error('Failed to fetch scheduled inspections');
        }
        const scheduledData = await scheduledResponse.json();
        setScheduledInspections(scheduledData);

        // Fetch completed inspections
        const completedResponse = await fetch('/api/property-inspections/completed');
        if (!completedResponse.ok) {
          throw new Error('Failed to fetch completed inspections');
        }
        const completedData = await completedResponse.json();
        setCompletedInspections(completedData);

        setError(null);
      } catch (err) {
        console.error('Error fetching inspections:', err);
        setError((err as Error).message || 'Failed to load inspections');
      } finally {
        setLoading(false);
      }
    }

    fetchInspections();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Scheduled</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">In Progress</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Cancelled</Badge>;
      case 'passed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Passed</Badge>;
      case 'issues':
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">Issues Found</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Property Inspections</h1>
        <Button onClick={() => navigate('/schedule-inspection')}>
          <CalendarPlus className="mr-2 h-4 w-4" />
          Schedule Inspection
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <Tabs defaultValue="scheduled" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled">
          {loading ? (
            <p className="text-center py-8">Loading scheduled inspections...</p>
          ) : scheduledInspections.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No scheduled inspections found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {scheduledInspections.map((inspection) => (
                <Card key={inspection.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>{inspection.propertyName} - {inspection.inspectionType} Inspection</CardTitle>
                      {getStatusBadge(inspection.status)}
                    </div>
                    <CardDescription>
                      Scheduled for: {new Date(inspection.scheduledDate).toLocaleDateString()} at {inspection.scheduledTime}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-1">
                      <div className="text-sm">
                        <span className="font-medium">Inspector:</span> {inspection.inspector}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Units:</span> {inspection.units?.join(', ')}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <ClipboardList className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                    <Button size="sm">
                      <FileCheck className="mr-2 h-4 w-4" />
                      Complete Inspection
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {loading ? (
            <p className="text-center py-8">Loading completed inspections...</p>
          ) : completedInspections.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No completed inspections found.</p>
              </CardContent>
            </Card>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Inspector</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedInspections.map((inspection) => (
                  <TableRow key={inspection.id}>
                    <TableCell>{inspection.propertyName}</TableCell>
                    <TableCell>{inspection.inspectionType}</TableCell>
                    <TableCell>{new Date(inspection.inspectionDate).toLocaleDateString()}</TableCell>
                    <TableCell>{inspection.completedBy}</TableCell>
                    <TableCell>{getStatusBadge(inspection.status)}</TableCell>
                    <TableCell>{inspection.units?.join(', ')}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}