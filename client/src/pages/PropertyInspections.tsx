
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, Search, Filter, Calendar, ClipboardCheck, Check, 
  X, MoreHorizontal, ChevronDown, ChevronRight, Eye, FileText 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const PropertyInspections = () => {
  const [, navigate] = useLocation();
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  const [expandedInspection, setExpandedInspection] = useState<number | null>(null);
  const [scheduledInspections, setScheduledInspections] = useState<any[]>([]);
  const [completedInspections, setCompletedInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchInspectionData = async () => {
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
        
      } catch (error) {
        console.error('Error fetching inspection data:', error);
        toast({
          title: "Error",
          description: "Failed to load inspection data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchInspectionData();
  }, [toast]);
  
  // Use API data, fallback to sample data if API fails
  const displayScheduledInspections = scheduledInspections.length ? scheduledInspections : [
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
  
  // Use API data, fallback to sample data if API fails
  const displayCompletedInspections = completedInspections.length ? completedInspections : [
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
          <p className="text-muted-foreground">Schedule and manage property inspections</p>
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
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Inspections</CardTitle>
            <CardDescription>Next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayScheduledInspections.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Inspections</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayCompletedInspections.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Issues Identified</CardTitle>
            <CardDescription>Requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {displayCompletedInspections.filter(insp => insp.status === "issues").length}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for different views */}
      <Tabs defaultValue="scheduled" className="mb-6">
        <TabsList>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="templates">Inspection Templates</TabsTrigger>
        </TabsList>
        
        {/* Scheduled Inspections Tab */}
        <TabsContent value="scheduled">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Upcoming Inspections</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search inspections..."
                      className="pl-8 w-[200px] md:w-[300px]"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Inspector</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredScheduled.map((inspection) => (
                    <TableRow key={inspection.id}>
                      <TableCell className="font-medium">{inspection.propertyName}</TableCell>
                      <TableCell>{inspection.inspectionType}</TableCell>
                      <TableCell>
                        {inspection.scheduledDate} at {inspection.scheduledTime}
                      </TableCell>
                      <TableCell>
                        {inspection.units.length > 2 
                          ? `${inspection.units.slice(0, 2).join(", ")} +${inspection.units.length - 2} more`
                          : inspection.units.join(", ")
                        }
                      </TableCell>
                      <TableCell>{inspection.inspector}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/edit-inspection/${inspection.id}`)}>
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/conduct-inspection/${inspection.id}`)}>
                              Conduct Inspection
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/reschedule-inspection/${inspection.id}`)}>
                              Reschedule
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Cancel Inspection
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Completed Inspections Tab */}
        <TabsContent value="completed">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Completed Inspections</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search reports..."
                      className="pl-8 w-[200px] md:w-[300px]"
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="passed">Passed</SelectItem>
                      <SelectItem value="issues">With Issues</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredCompleted.map((inspection) => (
                <Collapsible
                  key={inspection.id}
                  open={expandedInspection === inspection.id}
                  onOpenChange={() => toggleExpand(inspection.id)}
                  className="mb-4 border rounded-md"
                >
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/50">
                      <div className="flex items-center">
                        {expandedInspection === inspection.id ? 
                          <ChevronDown className="h-5 w-5 mr-2 text-muted-foreground" /> : 
                          <ChevronRight className="h-5 w-5 mr-2 text-muted-foreground" />
                        }
                        <div>
                          <h3 className="font-medium">{inspection.propertyName} - {inspection.inspectionType} Inspection</h3>
                          <p className="text-sm text-muted-foreground">
                            {inspection.inspectionDate} • Unit(s): {inspection.units.join(", ")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium mr-4 ${
                          inspection.status === "passed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          {inspection.status === "passed" ? "Passed" : "Issues Found"}
                        </span>
                        <Button variant="outline" size="sm" onClick={(e) => {
                          e.stopPropagation();
                          window.open(inspection.reportLink, '_blank');
                        }}>
                          <FileText className="h-4 w-4 mr-2" /> Report
                        </Button>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-4 pt-0 border-t">
                      <h4 className="font-medium mb-2 mt-4">Inspection Findings</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Condition</TableHead>
                            <TableHead>Notes</TableHead>
                            <TableHead>Photos</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {inspection.findings.map((finding, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-medium">{finding.item}</TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                  finding.condition === "Good" ? "bg-green-100 text-green-700" : 
                                  finding.condition === "Fair" ? "bg-amber-100 text-amber-700" : 
                                  "bg-red-100 text-red-700"
                                }`}>
                                  {finding.condition}
                                </span>
                              </TableCell>
                              <TableCell>{finding.notes}</TableCell>
                              <TableCell>
                                {finding.images.length > 0 ? (
                                  <Button variant="outline" size="sm" onClick={() => console.log("View images")}>
                                    <Eye className="h-4 w-4 mr-2" /> View {finding.images.length} Photos
                                  </Button>
                                ) : (
                                  <span className="text-muted-foreground text-sm">No photos</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      
                      <div className="flex justify-between mt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Completed by: <span className="font-medium">{inspection.completedBy}</span>
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/create-maintenance/${inspection.id}`)}
                          >
                            Create Maintenance Request
                          </Button>
                          <Button size="sm">
                            Send to Owner
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Inspection Templates Tab */}
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Inspection Templates</CardTitle>
                  <CardDescription>
                    Standardized checklists for different types of inspections
                  </CardDescription>
                </div>
                <Button onClick={() => navigate("/create-inspection-template")}>
                  <Plus className="mr-2 h-4 w-4" /> New Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Template Cards */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Move-in Inspection</CardTitle>
                    <CardDescription>For new tenant move-ins</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      42 inspection points covering all areas of the unit
                    </p>
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm" onClick={() => navigate("/edit-inspection-template/1")}>
                        Edit Template
                      </Button>
                      <Button size="sm">
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Move-out Inspection</CardTitle>
                    <CardDescription>For tenant departures</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      45 inspection points with security deposit deduction options
                    </p>
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm" onClick={() => navigate("/edit-inspection-template/2")}>
                        Edit Template
                      </Button>
                      <Button size="sm">
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Routine Inspection</CardTitle>
                    <CardDescription>For regular property checks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      30 inspection points focusing on maintenance and upkeep
                    </p>
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm" onClick={() => navigate("/edit-inspection-template/3")}>
                        Edit Template
                      </Button>
                      <Button size="sm">
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropertyInspections;
