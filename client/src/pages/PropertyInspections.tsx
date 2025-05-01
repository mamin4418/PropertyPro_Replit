import React, { useState, useEffect } from "react";
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { Clipboard, Calendar, CheckCircle, AlertCircle, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Finding {
  item: string;
  condition: string;
  notes: string;
  images?: string[];
}

interface CompletedInspection {
  id: number;
  propertyId: number;
  propertyName: string;
  inspectionType: string;
  inspectionDate: string;
  completedBy: string;
  status: string;
  units: string[];
  reportLink?: string;
  findings?: Finding[];
}

interface ScheduledInspection {
  id: number;
  propertyId: number;
  propertyName: string;
  inspectionType: string;
  scheduledDate: string;
  scheduledTime: string;
  inspector: string;
  status: string;
  units: string[];
}

export function PropertyInspections() {
  const [scheduledInspections, setScheduledInspections] = useState<ScheduledInspection[]>([]);
  const [completedInspections, setCompletedInspections] = useState<CompletedInspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInspections = async () => {
      try {
        console.log("Fetching inspections data...");
        setLoading(true);

        // Fetch scheduled inspections
        const scheduledRes = await fetch('/api/property-inspections/scheduled');
        if (!scheduledRes.ok) {
          throw new Error(`Failed to fetch scheduled inspections: ${scheduledRes.status}`);
        }
        const scheduledData = await scheduledRes.json();
        console.log("Fetched scheduled inspections:", scheduledData);
        setScheduledInspections(scheduledData);

        // Fetch completed inspections
        const completedRes = await fetch('/api/property-inspections/completed');
        if (!completedRes.ok) {
          throw new Error(`Failed to fetch completed inspections: ${completedRes.status}`);
        }
        const completedData = await completedRes.json();
        console.log("Fetched completed inspections:", completedData);
        setCompletedInspections(completedData);

        setError(null);
      } catch (error) {
        console.error('Error fetching inspections:', error);
        setError('Failed to load inspections. Please try again later.');

        // Set some fallback data if the fetch fails
        setScheduledInspections([
          {
            id: 1,
            propertyId: 1,
            propertyName: "Sunset Heights",
            inspectionType: "Routine",
            scheduledDate: "2023-08-15",
            scheduledTime: "10:00 AM",
            inspector: "David Johnson",
            status: "scheduled",
            units: ["101", "102", "103"]
          },
          {
            id: 2,
            propertyId: 1,
            propertyName: "Sunset Heights",
            inspectionType: "Move-out",
            scheduledDate: "2023-08-10",
            scheduledTime: "2:00 PM",
            inspector: "Sarah Williams",
            status: "scheduled",
            units: ["305"]
          }
        ]);

        setCompletedInspections([
          {
            id: 4,
            propertyId: 1,
            propertyName: "Sunset Heights",
            inspectionType: "Move-in",
            inspectionDate: "2023-07-25",
            completedBy: "Sarah Williams",
            status: "passed",
            units: ["204"],
            findings: [
              { item: "Walls", condition: "Good", notes: "Freshly painted" },
              { item: "Flooring", condition: "Good", notes: "New carpet installed" }
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchInspections();
  }, []);

  const handleScheduleInspection = () => {
    navigate('/schedule-inspection');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'text-blue-500';
      case 'passed':
        return 'text-green-500';
      case 'issues':
        return 'text-amber-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'issues':
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <Clipboard className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading property inspections...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Property Inspections</h1>
        <Button onClick={handleScheduleInspection}>
          <Plus className="mr-2 h-4 w-4" /> Schedule Inspection
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      <Tabs defaultValue="scheduled">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="scheduled">Scheduled Inspections</TabsTrigger>
          <TabsTrigger value="completed">Completed Inspections</TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scheduledInspections && scheduledInspections.length > 0 ? (
              scheduledInspections.map((inspection) => (
                <Card key={inspection.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{inspection.inspectionType} Inspection</CardTitle>
                        <CardDescription>{inspection.propertyName}</CardDescription>
                      </div>
                      {getStatusIcon(inspection.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Date:</span>
                        <span className="text-sm font-medium">{inspection.scheduledDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Time:</span>
                        <span className="text-sm font-medium">{inspection.scheduledTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Inspector:</span>
                        <span className="text-sm font-medium">{inspection.inspector}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Units:</span>
                        <span className="text-sm font-medium">{inspection.units ? inspection.units.join(", ") : "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <span className={`text-sm font-medium ${getStatusColor(inspection.status)}`}>
                          {inspection.status}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="outline" className="w-full">View Details</Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No scheduled inspections found.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedInspections && completedInspections.length > 0 ? (
              completedInspections.map((inspection) => (
                <Card key={inspection.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{inspection.inspectionType} Inspection</CardTitle>
                        <CardDescription>{inspection.propertyName}</CardDescription>
                      </div>
                      {getStatusIcon(inspection.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Date:</span>
                        <span className="text-sm font-medium">{inspection.inspectionDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Completed By:</span>
                        <span className="text-sm font-medium">{inspection.completedBy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Units:</span>
                        <span className="text-sm font-medium">{inspection.units ? inspection.units.join(", ") : "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <span className={`text-sm font-medium ${getStatusColor(inspection.status)}`}>
                          {inspection.status}
                        </span>
                      </div>
                      {inspection.findings && (
                        <div className="mt-3">
                          <p className="text-sm font-medium mb-1">Findings Summary:</p>
                          <ul className="text-sm list-disc pl-5">
                            {inspection.findings.slice(0, 2).map((finding, index) => (
                              <li key={index}>
                                {finding.item}: <span className={finding.condition === 'Good' ? 'text-green-500' : finding.condition === 'Fair' ? 'text-amber-500' : 'text-red-500'}>{finding.condition}</span>
                              </li>
                            ))}
                            {inspection.findings.length > 2 && <li>...</li>}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="outline" className="w-full">View Full Report</Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No completed inspections found.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PropertyInspections;