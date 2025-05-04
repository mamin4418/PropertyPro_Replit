
import React, { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { Clipboard, Calendar, CheckCircle, AlertCircle, ChevronRight } from "lucide-react";

// Simple interfaces for static data
interface ScheduledInspection {
  id: number;
  propertyName: string;
  inspectionType: string;
  scheduledDate: string;
  scheduledTime: string;
  inspector: string;
  status: string;
  units: string[];
}

interface CompletedInspection {
  id: number;
  propertyName: string;
  inspectionType: string;
  inspectionDate: string;
  completedBy: string;
  status: string;
  units: string[];
  findings?: Array<{ item: string; condition: string; notes: string }>;
}

// Static data to avoid API dependencies
const scheduledInspections: ScheduledInspection[] = [
  {
    id: 1,
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
    propertyName: "Sunset Heights",
    inspectionType: "Move-out",
    scheduledDate: "2023-08-10",
    scheduledTime: "2:00 PM",
    inspector: "Sarah Williams",
    status: "scheduled",
    units: ["305"]
  },
  {
    id: 3,
    propertyName: "Maple Gardens",
    inspectionType: "Maintenance",
    scheduledDate: "2023-08-18",
    scheduledTime: "11:30 AM",
    inspector: "Michael Brown",
    status: "scheduled",
    units: ["B2", "C1"]
  }
];

const completedInspections: CompletedInspection[] = [
  {
    id: 4,
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
  },
  {
    id: 5,
    propertyName: "Maple Gardens",
    inspectionType: "Routine",
    inspectionDate: "2023-07-20",
    completedBy: "David Johnson",
    status: "issues",
    units: ["A1"],
    findings: [
      { item: "Kitchen Sink", condition: "Fair", notes: "Slight leakage, needs repair" },
      { item: "Windows", condition: "Good", notes: "All functional" }
    ]
  }
];

const PropertyInspections: React.FC = () => {
  const [activeTab, setActiveTab] = useState("scheduled");

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
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
    switch (status?.toLowerCase()) {
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

  return (
    <div className="container mx-auto p-4">
      {/* Simple breadcrumb */}
      <div className="mb-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <a href="/" className="text-sm text-blue-600 hover:underline">Dashboard</a>
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="ml-2 text-sm text-gray-700">Property Inspections</span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Property Inspections</h1>
        <Button>Schedule Inspection</Button>
      </div>

      {/* Tabs */}
      <Tabs 
        defaultValue="scheduled" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="scheduled">Scheduled Inspections</TabsTrigger>
          <TabsTrigger value="completed">Completed Inspections</TabsTrigger>
        </TabsList>

        {/* Scheduled Inspections Tab */}
        <TabsContent value="scheduled">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scheduledInspections.map((inspection) => (
              <Card key={inspection.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{inspection.inspectionType} Inspection</CardTitle>
                      <p className="text-sm text-gray-500">{inspection.propertyName}</p>
                    </div>
                    {getStatusIcon(inspection.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Date:</span>
                      <span className="text-sm font-medium">{inspection.scheduledDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Time:</span>
                      <span className="text-sm font-medium">{inspection.scheduledTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Inspector:</span>
                      <span className="text-sm font-medium">{inspection.inspector}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Units:</span>
                      <span className="text-sm font-medium">{inspection.units.join(", ")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Status:</span>
                      <span className={`text-sm font-medium ${getStatusColor(inspection.status)}`}>
                        {inspection.status}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">View Details</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Completed Inspections Tab */}
        <TabsContent value="completed">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedInspections.map((inspection) => (
              <Card key={inspection.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{inspection.inspectionType} Inspection</CardTitle>
                      <p className="text-sm text-gray-500">{inspection.propertyName}</p>
                    </div>
                    {getStatusIcon(inspection.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Date:</span>
                      <span className="text-sm font-medium">{inspection.inspectionDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Completed By:</span>
                      <span className="text-sm font-medium">{inspection.completedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Units:</span>
                      <span className="text-sm font-medium">{inspection.units.join(", ")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Status:</span>
                      <span className={`text-sm font-medium ${getStatusColor(inspection.status)}`}>
                        {inspection.status}
                      </span>
                    </div>
                    {inspection.findings && (
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-1">Findings:</p>
                        <ul className="text-sm list-disc pl-5">
                          {inspection.findings.map((finding, idx) => (
                            <li key={idx}>
                              {finding.item}: <span className={
                                finding.condition === 'Good' ? 'text-green-500' :
                                finding.condition === 'Fair' ? 'text-amber-500' : 'text-red-500'
                              }>{finding.condition}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" className="w-full mt-4">View Full Report</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropertyInspections;
