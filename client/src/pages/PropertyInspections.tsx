import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, CalendarDays, Check, AlertCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface Inspection {
  id: number;
  propertyId: number;
  propertyName: string;
  inspectionType: string;
  scheduledDate?: string;
  scheduledTime?: string;
  inspector: string;
  status: string;
  units: string[];
  inspectionDate?: string;
  completedBy?: string;
  reportLink?: string;
  findings?: Array<{
    item: string;
    condition: string;
    notes: string;
    images: string[];
  }>;
}

export default function PropertyInspections() {
  const [scheduledInspections, setScheduledInspections] = useState<Inspection[]>([]);
  const [completedInspections, setCompletedInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInspections() {
      try {
        setLoading(true);
        // Fetch scheduled inspections
        const scheduledResponse = await fetch('/api/property-inspections/scheduled');
        if (!scheduledResponse.ok) {
          throw new Error(`Failed to fetch scheduled inspections: ${scheduledResponse.statusText}`);
        }
        const scheduledData = await scheduledResponse.json();
        setScheduledInspections(scheduledData);

        // Fetch completed inspections
        const completedResponse = await fetch('/api/property-inspections/completed');
        if (!completedResponse.ok) {
          throw new Error(`Failed to fetch completed inspections: ${completedResponse.statusText}`);
        }
        const completedData = await completedResponse.json();
        setCompletedInspections(completedData);

        setError(null);
      } catch (err) {
        console.error('Error fetching inspections:', err);
        setError('Failed to load inspection data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchInspections();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Scheduled</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'in progress':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">In Progress</Badge>;
      case 'passed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Passed</Badge>;
      case 'issues':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Issues Found</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Property Inspections</h1>
        <Link to="/schedule-inspection">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Inspection
          </Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 mb-6 rounded-md border border-red-200">
          <AlertCircle className="h-5 w-5 inline mr-2" />
          {error}
        </div>
      )}

      <Tabs defaultValue="scheduled">
        <TabsList className="mb-4">
          <TabsTrigger value="scheduled">Scheduled Inspections</TabsTrigger>
          <TabsTrigger value="completed">Completed Inspections</TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled">
          {loading ? (
            <div className="text-center p-8">
              <Clock className="h-8 w-8 mx-auto mb-2 animate-spin text-muted-foreground" />
              <p>Loading inspections...</p>
            </div>
          ) : scheduledInspections.length === 0 ? (
            <div className="text-center p-8 border rounded-md bg-muted/20">
              <CalendarDays className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <h3 className="text-lg font-medium">No scheduled inspections</h3>
              <p className="text-muted-foreground mt-1">Schedule your first property inspection to get started</p>
              <Link to="/schedule-inspection" className="mt-4 inline-block">
                <Button>Schedule Inspection</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scheduledInspections.map((inspection) => (
                <Card key={inspection.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{inspection.propertyName}</CardTitle>
                      {getStatusBadge(inspection.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Type:</span>
                        <span>{inspection.inspectionType}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Date:</span>
                        <span>{inspection.scheduledDate}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Time:</span>
                        <span>{inspection.scheduledTime}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Inspector:</span>
                        <span>{inspection.inspector}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Units:</span>
                        <span>{inspection.units.join(", ")}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-end space-x-2">
                      <Button variant="outline" size="sm">Reschedule</Button>
                      <Button size="sm">Start Inspection</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {loading ? (
            <div className="text-center p-8">
              <Clock className="h-8 w-8 mx-auto mb-2 animate-spin text-muted-foreground" />
              <p>Loading inspections...</p>
            </div>
          ) : completedInspections.length === 0 ? (
            <div className="text-center p-8 border rounded-md bg-muted/20">
              <Check className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <h3 className="text-lg font-medium">No completed inspections</h3>
              <p className="text-muted-foreground mt-1">Completed inspections will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedInspections.map((inspection) => (
                <Card key={inspection.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{inspection.propertyName}</CardTitle>
                      {getStatusBadge(inspection.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Type:</span>
                        <span>{inspection.inspectionType}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Date:</span>
                        <span>{inspection.inspectionDate}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Inspector:</span>
                        <span>{inspection.completedBy}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Units:</span>
                        <span>{inspection.units.join(", ")}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-end space-x-2">
                      <Link to={`/inspections/${inspection.id}`}>
                        <Button size="sm">View Report</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}