
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  CalendarCheck, 
  ClipboardCheck, 
  Plus,
  Search,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

interface InspectionItem {
  id: number;
  propertyId: number;
  propertyName: string;
  inspectionType: string;
  scheduledDate?: string;
  scheduledTime?: string;
  inspectionDate?: string;
  inspector?: string;
  completedBy?: string;
  status: string;
  units: string[];
  reportLink?: string;
  findings?: Array<{
    item: string;
    condition: string;
    notes: string;
    images?: string[];
  }>;
}

const PropertyInspections: React.FC = () => {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("scheduled");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProperty, setFilterProperty] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const { data: scheduledInspections, isLoading: loadingScheduled } = useQuery({
    queryKey: ["scheduledInspections"],
    queryFn: async () => {
      const res = await fetch("/api/property-inspections/scheduled");
      if (!res.ok) throw new Error("Failed to fetch scheduled inspections");
      return res.json();
    }
  });

  const { data: completedInspections, isLoading: loadingCompleted } = useQuery({
    queryKey: ["completedInspections"],
    queryFn: async () => {
      const res = await fetch("/api/property-inspections/completed");
      if (!res.ok) throw new Error("Failed to fetch completed inspections");
      return res.json();
    }
  });

  // Function to filter inspections based on search and filters
  const filterInspections = (inspections: InspectionItem[] | undefined) => {
    if (!inspections) return [];
    
    return inspections.filter(inspection => {
      const matchesSearch = searchTerm === "" || 
        inspection.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inspection.units.some(unit => unit.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesProperty = filterProperty === "all" || inspection.propertyId.toString() === filterProperty;
      const matchesType = filterType === "all" || inspection.inspectionType === filterType;
      
      return matchesSearch && matchesProperty && matchesType;
    });
  };

  const filteredScheduled = filterInspections(scheduledInspections);
  const filteredCompleted = filterInspections(completedInspections);

  // Extract unique property names for filter dropdown
  const getUniqueProperties = () => {
    const allInspections = [...(scheduledInspections || []), ...(completedInspections || [])];
    const uniqueProperties = Array.from(new Set(
      allInspections.map(inspection => ({ 
        id: inspection.propertyId, 
        name: inspection.propertyName 
      }))
    ));
    return uniqueProperties.filter((prop, index, self) => 
      index === self.findIndex(p => p.id === prop.id)
    );
  };

  // Extract unique inspection types for filter dropdown
  const getInspectionTypes = () => {
    const allInspections = [...(scheduledInspections || []), ...(completedInspections || [])];
    return Array.from(new Set(allInspections.map(inspection => inspection.inspectionType)));
  };

  const renderStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'scheduled':
        return <Badge className="bg-blue-500">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'passed':
        return <Badge className="bg-green-500">Passed</Badge>;
      case 'issues':
        return <Badge className="bg-yellow-500">Issues Found</Badge>;
      case 'canceled':
        return <Badge className="bg-red-500">Canceled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Property Inspections</h1>
          <p className="text-muted-foreground">Schedule and manage property inspections</p>
        </div>
        <Button onClick={() => setLocation("/schedule-inspection")}>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Inspection
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search property or unit"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={filterProperty} onValueChange={setFilterProperty}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by property" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Properties</SelectItem>
            {getUniqueProperties().map(property => (
              <SelectItem key={property.id} value={property.id.toString()}>
                {property.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {getInspectionTypes().map(type => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scheduled" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Scheduled Inspections
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Completed Inspections
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="scheduled">
          {loadingScheduled ? (
            <div className="text-center py-8">Loading scheduled inspections...</div>
          ) : filteredScheduled.length === 0 ? (
            <div className="text-center py-8">
              <ClipboardCheck className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No scheduled inspections found</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterProperty !== "all" || filterType !== "all" 
                  ? "Try adjusting your search or filters"
                  : "Schedule a new inspection to get started"}
              </p>
              {!(searchTerm || filterProperty !== "all" || filterType !== "all") && (
                <Button onClick={() => setLocation("/schedule-inspection")} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Inspection
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {filteredScheduled.map((inspection) => (
                <Card key={inspection.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{inspection.propertyName}</CardTitle>
                        <CardDescription className="mt-1">
                          {inspection.inspectionType} Inspection
                        </CardDescription>
                      </div>
                      {renderStatusBadge(inspection.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <CalendarCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{inspection.scheduledDate} at {inspection.scheduledTime}</span>
                      </div>
                      <div className="flex items-center">
                        <ClipboardCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Inspector: {inspection.inspector || "Not assigned"}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Units:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {inspection.units.map((unit, idx) => (
                            <Badge key={idx} variant="outline">{unit}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/50 pt-3">
                    <Button variant="outline" className="w-full" 
                      onClick={() => alert(`View inspection details for ID: ${inspection.id}`)}>
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {loadingCompleted ? (
            <div className="text-center py-8">Loading completed inspections...</div>
          ) : filteredCompleted.length === 0 ? (
            <div className="text-center py-8">
              <FileCheck className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No completed inspections found</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterProperty !== "all" || filterType !== "all" 
                  ? "Try adjusting your search or filters"
                  : "Complete scheduled inspections to see them here"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {filteredCompleted.map((inspection) => (
                <Card key={inspection.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{inspection.propertyName}</CardTitle>
                        <CardDescription className="mt-1">
                          {inspection.inspectionType} Inspection
                        </CardDescription>
                      </div>
                      {renderStatusBadge(inspection.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <CalendarCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Completed: {inspection.inspectionDate}</span>
                      </div>
                      <div className="flex items-center">
                        <ClipboardCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Inspector: {inspection.completedBy}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Units:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {inspection.units.map((unit, idx) => (
                            <Badge key={idx} variant="outline">{unit}</Badge>
                          ))}
                        </div>
                      </div>
                      {inspection.findings && inspection.findings.some(f => f.condition !== "Good") && (
                        <div className="flex items-center text-yellow-600">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          <span>Issues found</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/50 pt-3 flex gap-2">
                    <Button variant="outline" className="flex-1" 
                      onClick={() => alert(`View inspection details for ID: ${inspection.id}`)}>
                      View Details
                    </Button>
                    {inspection.reportLink && (
                      <Button variant="secondary" className="flex-1" 
                        onClick={() => window.open(inspection.reportLink, '_blank')}>
                        View Report
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropertyInspections;
