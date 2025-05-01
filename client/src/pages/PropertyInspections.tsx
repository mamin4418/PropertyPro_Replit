import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CheckCircle, ChevronDown, ChevronRight, ClipboardList, Clock, Filter, Home, Plus, Search, X } from "lucide-react";

function PropertyInspections() {
  const [_, navigate] = useLocation();
  const [selectedProperty, setSelectedProperty] = useState("all");
  const [expandedInspection, setExpandedInspection] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock scheduled inspections data
  const displayScheduledInspections = [
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
    },
    {
      id: 3,
      propertyId: 2,
      propertyName: "Maple Gardens",
      inspectionType: "Annual",
      scheduledDate: "2023-08-22",
      scheduledTime: "9:00 AM",
      inspector: "Michael Chen",
      status: "scheduled",
      units: ["A1", "A2", "B1", "B2"]
    },
  ];

  // Mock completed inspections data
  const displayCompletedInspections = [
    {
      id: 4,
      propertyId: 1,
      propertyName: "Sunset Heights",
      inspectionType: "Move-in",
      inspectionDate: "2023-07-25",
      completedBy: "Sarah Williams",
      status: "passed",
      units: ["204"],
      reportLink: "/reports/inspection-4.pdf",
      findings: [
        { item: "Walls", condition: "Good", notes: "Freshly painted", images: ["wall1.jpg", "wall2.jpg"] },
        { item: "Flooring", condition: "Good", notes: "New carpet installed", images: ["floor1.jpg"] },
        { item: "Kitchen", condition: "Good", notes: "All appliances working", images: ["kitchen1.jpg"] },
        { item: "Bathroom", condition: "Good", notes: "No leaks or issues found", images: ["bathroom1.jpg"] }
      ]
    },
    {
      id: 5,
      propertyId: 3,
      propertyName: "Urban Lofts",
      inspectionType: "Maintenance",
      inspectionDate: "2023-07-20",
      completedBy: "David Johnson",
      status: "issues",
      units: ["2B"],
      reportLink: "/reports/inspection-5.pdf",
      findings: [
        { item: "Walls", condition: "Good", notes: "No issues", images: [] },
        { item: "Flooring", condition: "Fair", notes: "Some wear in high traffic areas", images: ["floor-wear.jpg"] },
        { item: "Kitchen", condition: "Poor", notes: "Dishwasher leaking, needs repair", images: ["dishwasher-leak.jpg"] },
        { item: "Bathroom", condition: "Good", notes: "Recent renovation, all fixtures working", images: [] }
      ]
    },
    {
      id: 6,
      propertyId: 2,
      propertyName: "Maple Gardens",
      inspectionType: "Routine",
      inspectionDate: "2023-07-15",
      completedBy: "Michael Chen",
      status: "passed",
      units: ["C3"],
      reportLink: "/reports/inspection-6.pdf",
      findings: [
        { item: "Walls", condition: "Good", notes: "No issues", images: [] },
        { item: "Flooring", condition: "Good", notes: "No issues", images: [] },
        { item: "Kitchen", condition: "Good", notes: "All appliances working", images: [] },
        { item: "Bathroom", condition: "Good", notes: "No leaks or issues found", images: [] }
      ]
    },
  ];

  // Filter inspections based on selected property
  const filteredScheduled = selectedProperty === "all"
    ? displayScheduledInspections
    : displayScheduledInspections.filter(insp => insp.propertyId.toString() === selectedProperty);

  const filteredCompleted = selectedProperty === "all"
    ? displayCompletedInspections
    : displayCompletedInspections.filter(insp => insp.propertyId.toString() === selectedProperty);

  // Mock properties for the dropdown
  const properties = [
    { id: 1, name: "Sunset Heights" },
    { id: 2, name: "Maple Gardens" },
    { id: 3, name: "Urban Lofts" },
  ];

  // Toggle expanded inspection
  const toggleExpand = (id: number) => {
    if (expandedInspection === id) {
      setExpandedInspection(null);
    } else {
      setExpandedInspection(id);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Property Inspections</h1>
          <p className="text-muted-foreground">Schedule and track property inspections</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedProperty} onValueChange={setSelectedProperty}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.id.toString()}>
                  {property.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => navigate("/schedule-inspection")}>
            <Plus className="mr-2 h-4 w-4" /> Schedule Inspection
          </Button>
        </div>
      </div>

      {/* Search Bar and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search inspections..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs for Scheduled and Completed Inspections */}
      <Tabs defaultValue="scheduled" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scheduled">
            <Clock className="mr-2 h-4 w-4" />
            Scheduled
          </TabsTrigger>
          <TabsTrigger value="completed">
            <CheckCircle className="mr-2 h-4 w-4" />
            Completed
          </TabsTrigger>
        </TabsList>

        {/* Scheduled Inspections Tab */}
        <TabsContent value="scheduled">
          <div className="space-y-4">
            {filteredScheduled.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold">No scheduled inspections</h3>
                  <p className="text-muted-foreground mt-2">
                    No inspections scheduled for the selected property.
                  </p>
                  <Button onClick={() => navigate("/schedule-inspection")} className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule Inspection
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredScheduled.map((inspection) => (
                <Card key={inspection.id} className="overflow-hidden">
                  <div className="p-4 cursor-pointer" onClick={() => toggleExpand(inspection.id)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Home className="h-5 w-5 text-muted-foreground mr-2" />
                        <div>
                          <h3 className="text-lg font-semibold">{inspection.propertyName}</h3>
                          <p className="text-sm text-muted-foreground">{inspection.inspectionType} Inspection</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge>{inspection.status}</Badge>
                        {expandedInspection === inspection.id ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                  </div>

                  {expandedInspection === inspection.id && (
                    <CardContent className="border-t pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-start mb-2">
                            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
                            <div>
                              <p className="text-sm font-medium">Scheduled Date & Time</p>
                              <p className="text-sm">{inspection.scheduledDate} at {inspection.scheduledTime}</p>
                            </div>
                          </div>
                          <div className="flex items-start mb-2">
                            <Home className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
                            <div>
                              <p className="text-sm font-medium">Units to Inspect</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {inspection.units.map((unit, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    Unit {unit}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-start mb-2">
                            <div className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
                            <div>
                              <p className="text-sm font-medium">Inspector</p>
                              <p className="text-sm">{inspection.inspector}</p>
                            </div>
                          </div>
                          <div className="flex justify-end mt-4 space-x-2">
                            <Button variant="outline" size="sm">
                              Reschedule
                            </Button>
                            <Button size="sm">
                              Start Inspection
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Completed Inspections Tab */}
        <TabsContent value="completed">
          <div className="space-y-4">
            {filteredCompleted.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold">No completed inspections</h3>
                  <p className="text-muted-foreground mt-2">
                    No completed inspections for the selected property.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredCompleted.map((inspection) => (
                <Card key={inspection.id} className="overflow-hidden">
                  <div className="p-4 cursor-pointer" onClick={() => toggleExpand(inspection.id)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Home className="h-5 w-5 text-muted-foreground mr-2" />
                        <div>
                          <h3 className="text-lg font-semibold">{inspection.propertyName}</h3>
                          <p className="text-sm text-muted-foreground">{inspection.inspectionType} Inspection</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={inspection.status === "passed" ? "default" : "destructive"}>
                          {inspection.status}
                        </Badge>
                        {expandedInspection === inspection.id ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                  </div>

                  {expandedInspection === inspection.id && (
                    <CardContent className="border-t pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-start mb-2">
                            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
                            <div>
                              <p className="text-sm font-medium">Inspection Date</p>
                              <p className="text-sm">{inspection.inspectionDate}</p>
                            </div>
                          </div>
                          <div className="flex items-start mb-2">
                            <Home className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
                            <div>
                              <p className="text-sm font-medium">Units Inspected</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {inspection.units.map((unit, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    Unit {unit}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start mb-2">
                            <div className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
                            <div>
                              <p className="text-sm font-medium">Completed By</p>
                              <p className="text-sm">{inspection.completedBy}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Findings Summary</h4>
                          <div className="space-y-2">
                            {inspection.findings.slice(0, 3).map((finding, idx) => (
                              <div key={idx} className="flex items-start">
                                <div className={`h-2 w-2 mt-1.5 mr-2 rounded-full ${
                                  finding.condition === "Good" ? "bg-green-500" :
                                  finding.condition === "Fair" ? "bg-yellow-500" : "bg-red-500"
                                }`} />
                                <div>
                                  <p className="text-sm font-medium">{finding.item}</p>
                                  <p className="text-xs text-muted-foreground">{finding.notes}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-end mt-4 space-x-2">
                            <Button variant="outline" size="sm">
                              Download Report
                            </Button>
                            <Button size="sm">
                              View Full Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PropertyInspections;