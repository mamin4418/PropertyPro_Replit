
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
import { Download } from "lucide-react";

const RentRoll = () => {
  // Mock data for rent roll
  const rentRollData = [
    {
      id: 1,
      address: "1 Main Street",
      unit: "1A",
      tenant: "N/A",
      bedsBaths: "3/1",
      sqFt: "N/A",
      monthlyRent: 975.00,
      securityDeposit: 0.00,
      leaseStart: "02/01/2025",
      leaseEnd: "01/31/2026"
    },
    {
      id: 2,
      address: "1 Main Street",
      unit: "2B",
      tenant: "N/A",
      bedsBaths: "4/1",
      sqFt: "N/A",
      monthlyRent: 975.00,
      securityDeposit: 0.00,
      leaseStart: "01/01/2025",
      leaseEnd: "12/31/2025"
    },
    {
      id: 3,
      address: "320 Jay St",
      unit: "main",
      tenant: "N/A",
      bedsBaths: "4/1",
      sqFt: "N/A",
      monthlyRent: 750.00,
      securityDeposit: 0.00,
      leaseStart: "08/01/2024",
      leaseEnd: "07/31/2025"
    },
    {
      id: 4,
      address: "7 Marne St",
      unit: "-",
      tenant: "N/A",
      bedsBaths: "3/2",
      sqFt: "N/A",
      monthlyRent: 975.00,
      securityDeposit: 0.00,
      leaseStart: "01/01/2025",
      leaseEnd: "12/31/2025"
    },
    {
      id: 5,
      address: "431 Main Street",
      unit: "Main",
      tenant: "N/A",
      bedsBaths: "3/1",
      sqFt: "N/A",
      monthlyRent: 0.00,
      securityDeposit: 0.00,
      leaseStart: "N/A",
      leaseEnd: "N/A"
    },
    {
      id: 6,
      address: "7 Marne St",
      unit: "1A",
      tenant: "N/A",
      bedsBaths: "N/A",
      sqFt: "N/A",
      monthlyRent: 600.00,
      securityDeposit: 0.00,
      leaseStart: "06/28/2024",
      leaseEnd: "06/27/2025"
    },
    {
      id: 7,
      address: "7 Marne St",
      unit: "2B",
      tenant: "N/A",
      bedsBaths: "N/A",
      sqFt: "N/A",
      monthlyRent: 0.00,
      securityDeposit: 0.00,
      leaseStart: "N/A",
      leaseEnd: "N/A"
    }
  ];
  
  // Calculate totals
  const totalRent = rentRollData.reduce((sum, item) => sum + item.monthlyRent, 0);
  const totalDeposits = rentRollData.reduce((sum, item) => sum + item.securityDeposit, 0);
  const occupiedUnits = rentRollData.filter(item => item.monthlyRent > 0).length;
  const totalUnits = rentRollData.length;
  
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Rent Roll</h2>
          <p className="text-muted-foreground">View high-level details about your properties to help with your PnL statements</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Export Data
        </Button>
      </div>
      
      {/* Rent Roll Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>ADDRESS</TableHead>
              <TableHead>UNIT</TableHead>
              <TableHead>TENANT</TableHead>
              <TableHead>BEDS/BATH</TableHead>
              <TableHead>SQ. FT.</TableHead>
              <TableHead>MONTHLY RENT</TableHead>
              <TableHead>SECURITY DEPOSIT</TableHead>
              <TableHead>LEASE START</TableHead>
              <TableHead>LEASE END</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rentRollData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.address}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>{item.tenant}</TableCell>
                <TableCell>{item.bedsBaths}</TableCell>
                <TableCell>{item.sqFt}</TableCell>
                <TableCell>${item.monthlyRent.toFixed(2)}</TableCell>
                <TableCell>${item.securityDeposit.toFixed(2)}</TableCell>
                <TableCell>{item.leaseStart}</TableCell>
                <TableCell>{item.leaseEnd}</TableCell>
              </TableRow>
            ))}
            <TableRow className="font-medium bg-muted/50">
              <TableCell colSpan={5} className="text-right">TOTALS:</TableCell>
              <TableCell>${totalRent.toFixed(2)}</TableCell>
              <TableCell>${totalDeposits.toFixed(2)}</TableCell>
              <TableCell colSpan={2} className="text-right">
                Occupancy: {occupiedUnits}/{totalUnits} ({Math.round((occupiedUnits/totalUnits) * 100)}%)
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RentRoll;
