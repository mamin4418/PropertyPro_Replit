
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";

const ExportCharges = () => {
  const [, navigate] = useLocation();
  const [startDate, setStartDate] = useState("04/01/2025");
  const [endDate, setEndDate] = useState("04/30/2025");
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Export Charges</h2>
        <p className="text-muted-foreground">Export rent charge and payment data for your records</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          {/* Empty space for layout balance */}
        </div>
        
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-cyan-600 mb-4">Export Charges & Payments</h3>
              <p className="text-muted-foreground">
                Export your payments to a spreadsheet or a file specifically formatted to import into QuickBooks 
                Online, or charges (invoices) and payments to a file specifically formatted to import to Quickbooks 
                Desktop/Pro, or Quickbooks Enterprise!
              </p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div>
                <Select defaultValue="excel">
                  <SelectTrigger>
                    <SelectValue placeholder="Select an Export Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                    <SelectItem value="qbo">QuickBooks Online</SelectItem>
                    <SelectItem value="qbp">QuickBooks Pro/Desktop</SelectItem>
                    <SelectItem value="qbe">QuickBooks Enterprise</SelectItem>
                    <SelectItem value="csv">CSV File</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Payment Accounts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payment Accounts</SelectItem>
                    <SelectItem value="bank">Bank Accounts Only</SelectItem>
                    <SelectItem value="cash">Cash Accounts Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Input 
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-10"
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <div className="relative">
                  <Input 
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-10"
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="pt-4">
                <Button className="w-full bg-cyan-500 hover:bg-cyan-600">
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExportCharges;
