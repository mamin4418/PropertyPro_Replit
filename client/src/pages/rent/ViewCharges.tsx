
import { useState } from "react";
import { useLocation } from "wouter";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { 
  ChevronDown,
  Download,
  FilterX
} from "lucide-react";

const ViewCharges = () => {
  const [, navigate] = useLocation();
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  
  // Mock data for charges
  const charges = [
    {
      id: 1,
      balance: 880.00,
      address: "7 Marne St",
      unit: "3C",
      description: "Rent- Section 8 Portion",
      dueDate: "Jul 01, 2024",
    },
    {
      id: 2,
      balance: 50.00,
      address: "320 Jay St",
      unit: "main",
      description: "Rent",
      dueDate: "Aug 01, 2024",
    },
    {
      id: 3,
      balance: 700.00,
      address: "320 Jay St",
      unit: "main",
      description: "Rent Section 8",
      dueDate: "Aug 28, 2024",
    },
  ];

  // Summary data
  const summaryData = {
    due: {
      amount: 31329.31,
      count: 45,
      days: "next 30 days"
    },
    overdue1to10: {
      amount: 0,
      count: 0
    },
    overdue11Plus: {
      amount: 23979.31,
      count: 35
    },
    paid: {
      amount: 0,
      count: 0,
      days: "last 30 days"
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Rent Charges</h2>
        <p className="text-muted-foreground">View and manage all upcoming and overdue rent charges</p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-blue-700">${summaryData.due.amount.toLocaleString()}</span>
            <span className="text-sm text-blue-600">{summaryData.due.count} Due in {summaryData.due.days}</span>
          </div>
        </Card>
        <Card className="p-4 bg-gray-50 border-gray-200">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-700">${summaryData.overdue1to10.amount.toLocaleString()}</span>
            <span className="text-sm text-gray-600">{summaryData.overdue1to10.count} Overdue 1-10 days</span>
          </div>
        </Card>
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-amber-700">${summaryData.overdue11Plus.amount.toLocaleString()}</span>
            <span className="text-sm text-amber-600">{summaryData.overdue11Plus.count} Overdue 11+ days</span>
          </div>
        </Card>
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-green-700">${summaryData.paid.amount.toLocaleString()}</span>
            <span className="text-sm text-green-600">{summaryData.paid.count} Paid in {summaryData.paid.days}</span>
          </div>
        </Card>
      </div>
      
      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <span className="font-medium">Charges ({charges.length} Due in next 30 days)</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select defaultValue="date" onValueChange={() => {}}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Date Due" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date Due</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue={selectedProperty} onValueChange={setSelectedProperty}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select a property..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              <SelectItem value="marne">7 Marne St</SelectItem>
              <SelectItem value="jay">320 Jay St</SelectItem>
              <SelectItem value="main">1 Main Street</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <FilterX className="h-4 w-4" /> Clear Filters
            </Button>
          </div>
        </div>
      </div>
      
      {/* Charges Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Balance</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {charges.map((charge) => (
              <TableRow key={charge.id}>
                <TableCell className="font-medium">${charge.balance.toFixed(2)}</TableCell>
                <TableCell>{charge.address}</TableCell>
                <TableCell>{charge.unit}</TableCell>
                <TableCell>{charge.description}</TableCell>
                <TableCell>{charge.dueDate}</TableCell>
                <TableCell className="text-right">
                  <Select>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Select an Action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="edit">Edit Charge</SelectItem>
                      <SelectItem value="pay">Record Payment</SelectItem>
                      <SelectItem value="delete">Delete Charge</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button onClick={() => navigate("/rent/add-charge")}>
          Add New Charge
        </Button>
      </div>
    </div>
  );
};

export default ViewCharges;
