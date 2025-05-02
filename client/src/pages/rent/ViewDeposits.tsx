
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { 
  Calendar,
  Download,
  FilterX
} from "lucide-react";

const ViewDeposits = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("dateRange");
  
  // Summary data
  const summaryData = {
    paymentsDue: {
      amount: 31329.31,
      count: 45
    },
    overdueBills: {
      amount: 23979.31,
      count: 35
    },
    depositsInitiated: {
      amount: 0,
      count: 0
    },
    depositsMade: {
      amount: 0,
      count: 0
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Rent Deposits</h2>
        <p className="text-muted-foreground">View and manage all deposit transactions</p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-gray-50 border-gray-200">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-700">${summaryData.paymentsDue.amount.toLocaleString()}</span>
            <span className="text-sm text-gray-600">{summaryData.paymentsDue.count} Due</span>
          </div>
        </Card>
        <Card className="p-4 bg-gray-50 border-gray-200">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-700">${summaryData.overdueBills.amount.toLocaleString()}</span>
            <span className="text-sm text-gray-600">{summaryData.overdueBills.count} Overdue</span>
          </div>
        </Card>
        <Card className="p-4 bg-gray-50 border-gray-200">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold text-gray-700">${summaryData.depositsInitiated.amount.toLocaleString()}</span>
            </div>
            <span className="text-sm text-gray-600">{summaryData.depositsInitiated.count} Deposits initiated</span>
          </div>
        </Card>
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-blue-700">${summaryData.depositsMade.amount.toLocaleString()}</span>
            <span className="text-sm text-blue-600">{summaryData.depositsMade.count} Deposits made</span>
          </div>
        </Card>
      </div>
      
      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-3">
        <div className="flex items-center gap-2">
          <span className="font-medium">Deposits (0 Paid)</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center bg-white border rounded-md p-2 min-w-[250px]">
            <Calendar className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm">Date Paid: Starting on 4/1/2025</span>
          </div>
          
          <Select defaultValue="deposit" onValueChange={() => {}}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Deposit Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deposit">Deposit Date</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="all">
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
      
      {/* Payments Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 border">
          <div className="flex items-start">
            <div className="bg-gray-100 p-2 rounded-full mr-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 2H9C6.79086 2 5 3.79086 5 6V18C5 20.2091 6.79086 22 9 22H15C17.2091 22 19 20.2091 19 18V6C19 3.79086 17.2091 2 15 2Z" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 18H12.01" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold mb-1">$0</p>
              <p className="text-sm text-gray-500">0 Payments from 2025-04-01 to 2025-05-02</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border">
          <div className="flex items-start">
            <div className="bg-gray-100 p-2 rounded-full mr-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 6H3" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold mb-1">$0</p>
              <p className="text-sm text-gray-500">0 Recent (pending) payments</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border">
          <div className="flex items-start">
            <div className="bg-gray-100 p-2 rounded-full mr-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9H18" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3Z" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 16C12.5523 16 13 15.5523 13 15C13 14.4477 12.5523 14 12 14C11.4477 14 11 14.4477 11 15C11 15.5523 11.4477 16 12 16Z" fill="#4B5563"/>
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold mb-1">$0</p>
              <p className="text-sm text-gray-500">0 Deposits initiated</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border">
          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 7L12 13L21 7" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold mb-1">$0</p>
              <p className="text-sm text-blue-500">0 Deposits made</p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Deposits Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transfer Amount</TableHead>
              <TableHead>Payment(s) linked</TableHead>
              <TableHead>Paid By</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Paid on</TableHead>
              <TableHead>Received by</TableHead>
              <TableHead>Deposit to</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No deposits found for the selected period
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ViewDeposits;
