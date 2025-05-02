
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
import { Plus } from "lucide-react";

const LateFeeRules = () => {
  const [, navigate] = useLocation();
  
  // Mock data for late fee rules
  const rules = [
    {
      id: 1,
      address: "320 Jay St",
      unit: "main",
      gracePeriod: "-",
      firstLateFee: "-",
      recurringLateFee: "-",
      maxLateFee: "-"
    },
    {
      id: 2,
      address: "1 Main Street",
      unit: "1A",
      gracePeriod: "5 days",
      firstLateFee: "$10",
      recurringLateFee: "$5",
      maxLateFee: "25%"
    },
    {
      id: 3,
      address: "1 Main Street",
      unit: "2B",
      gracePeriod: "5 days",
      firstLateFee: "$10",
      recurringLateFee: "$5",
      maxLateFee: "25%"
    },
    {
      id: 4,
      address: "431 Main Street",
      unit: "Main",
      gracePeriod: "-",
      firstLateFee: "-",
      recurringLateFee: "-",
      maxLateFee: "-"
    },
    {
      id: 5,
      address: "7 Marne St",
      unit: "-",
      gracePeriod: "-",
      firstLateFee: "-",
      recurringLateFee: "-",
      maxLateFee: "-"
    },
    {
      id: 6,
      address: "7 Marne St",
      unit: "1A",
      gracePeriod: "-",
      firstLateFee: "-",
      recurringLateFee: "-",
      maxLateFee: "-"
    }
  ];
  
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Late Fee Rules</h2>
          <p className="text-muted-foreground">Manage late fee policies for your properties</p>
        </div>
        <Button onClick={() => navigate("/rent/late-fee-rules/new")}>
          <Plus className="mr-2 h-4 w-4" /> Add Rule
        </Button>
      </div>
      
      {/* Rules Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Grace Period</TableHead>
              <TableHead>First Late Fee</TableHead>
              <TableHead>Rec Late Fee</TableHead>
              <TableHead>Max Late Fee</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/rent/late-fee-rules/${rule.id}`)}>
                <TableCell>{rule.address}</TableCell>
                <TableCell>{rule.unit}</TableCell>
                <TableCell>{rule.gracePeriod}</TableCell>
                <TableCell>{rule.firstLateFee}</TableCell>
                <TableCell>{rule.recurringLateFee}</TableCell>
                <TableCell>{rule.maxLateFee}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LateFeeRules;
