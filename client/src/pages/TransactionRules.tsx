
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, Download, Upload, Filter, Search, Edit, Check, MoreHorizontal } from "lucide-react";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function TransactionRules() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showRuleDialog, setShowRuleDialog] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  
  // Mock data for transaction rules
  const [rules, setRules] = useState([
    {
      id: 1,
      name: "Rent Payments",
      description: "Match rent payments from tenants",
      conditions: [
        { field: "description", operator: "contains", value: "rent" },
        { field: "amount", operator: "greater_than", value: "1000" }
      ],
      actions: [
        { type: "categorize", category: "Income", subcategory: "Rent" },
        { type: "assignProperty", property: "All Properties" }
      ],
      active: true,
      priority: 1,
      matchedCount: 47,
      createdAt: "2023-04-01"
    },
    {
      id: 2,
      name: "Utility Bills",
      description: "Match utility bill payments",
      conditions: [
        { field: "description", operator: "contains", value: "utility" },
        { field: "description", operator: "contains", value: "water" },
        { field: "description", operator: "contains", value: "electric" }
      ],
      actions: [
        { type: "categorize", category: "Expense", subcategory: "Utilities" }
      ],
      active: true,
      priority: 2,
      matchedCount: 32,
      createdAt: "2023-04-05"
    },
    {
      id: 3,
      name: "Insurance Payments",
      description: "Match insurance premium payments",
      conditions: [
        { field: "description", operator: "contains", value: "insurance" }
      ],
      actions: [
        { type: "categorize", category: "Expense", subcategory: "Insurance" }
      ],
      active: true,
      priority: 3,
      matchedCount: 5,
      createdAt: "2023-04-12"
    },
    {
      id: 4,
      name: "Maintenance Expenses",
      description: "Match maintenance and repair payments",
      conditions: [
        { field: "description", operator: "contains", value: "repair" },
        { field: "description", operator: "contains", value: "maintenance" },
        { field: "description", operator: "contains", value: "fix" }
      ],
      actions: [
        { type: "categorize", category: "Expense", subcategory: "Repairs & Maintenance" }
      ],
      active: true,
      priority: 4,
      matchedCount: 28,
      createdAt: "2023-04-15"
    },
    {
      id: 5,
      name: "Property Management Fees",
      description: "Match property management fee payments",
      conditions: [
        { field: "description", operator: "contains", value: "management fee" }
      ],
      actions: [
        { type: "categorize", category: "Expense", subcategory: "Property Management" }
      ],
      active: false,
      priority: 5,
      matchedCount: 0,
      createdAt: "2023-04-20"
    }
  ]);
  
  // Filter rules based on search query and active filter
  const filteredRules = rules.filter(rule => {
    const matchesSearch = 
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesActiveFilter = 
      activeFilter === "all" ||
      (activeFilter === "active" && rule.active) ||
      (activeFilter === "inactive" && !rule.active);
    
    return matchesSearch && matchesActiveFilter;
  });
  
  // Toggle rule active status
  const toggleRuleActive = (id, active) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, active } : rule
    ));
  };
  
  // Delete rule
  const deleteRule = (id) => {
    if (confirm("Are you sure you want to delete this rule?")) {
      setRules(rules.filter(rule => rule.id !== id));
    }
  };
  
  // Edit rule
  const editRule = (rule) => {
    setEditingRule(rule);
    setShowRuleDialog(true);
  };
  
  // Format conditions for display
  const formatConditions = (conditions) => {
    if (!conditions || conditions.length === 0) return "No conditions";
    return conditions.map(c => {
      let operator = c.operator;
      switch(operator) {
        case "contains": operator = "contains"; break;
        case "equals": operator = "equals"; break;
        case "greater_than": operator = "is greater than"; break;
        case "less_than": operator = "is less than"; break;
        default: break;
      }
      return `${c.field} ${operator} "${c.value}"`;
    }).join(" AND ");
  };
  
  // Format actions for display
  const formatActions = (actions) => {
    if (!actions || actions.length === 0) return "No actions";
    return actions.map(a => {
      if (a.type === "categorize") {
        return `Categorize as ${a.category}/${a.subcategory}`;
      } else if (a.type === "assignProperty") {
        return `Assign to ${a.property}`;
      }
      return a.type;
    }).join(", ");
  };
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" asChild className="mr-4">
            <Link href="/banking/reconciliation">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Reconciliation
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Transaction Rules</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => { setEditingRule(null); setShowRuleDialog(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Create Rule
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search rules..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={activeFilter} onValueChange={setActiveFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rules</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import Rules
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Rules
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Transaction Matching Rules</CardTitle>
          <CardDescription>
            Rules are applied in priority order. Higher priority rules are applied first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Active</TableHead>
                <TableHead>Rule Name</TableHead>
                <TableHead>Conditions</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead className="text-center">Matches</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRules.length > 0 ? (
                filteredRules.map(rule => (
                  <TableRow key={rule.id}>
                    <TableCell>
                      <Switch 
                        checked={rule.active} 
                        onCheckedChange={(checked) => toggleRuleActive(rule.id, checked)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>{rule.name}</div>
                      <div className="text-sm text-muted-foreground">{rule.description}</div>
                    </TableCell>
                    <TableCell className="max-w-[250px] truncate">
                      <div className="text-sm">{formatConditions(rule.conditions)}</div>
                    </TableCell>
                    <TableCell className="max-w-[250px] truncate">
                      <div className="text-sm">{formatActions(rule.actions)}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      {rule.matchedCount > 0 ? (
                        <Badge variant="outline">{rule.matchedCount}</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => editRule(rule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => deleteRule(rule.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No rules found with the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Rule Editor Dialog */}
      <Dialog open={showRuleDialog} onOpenChange={setShowRuleDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingRule ? "Edit Rule" : "Create New Rule"}</DialogTitle>
            <DialogDescription>
              {editingRule 
                ? "Modify this transaction matching rule" 
                : "Create a new rule to automatically categorize transactions"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                defaultValue={editingRule?.name || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                defaultValue={editingRule?.description || ""}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Active
              </Label>
              <div className="col-span-3">
                <Switch 
                  defaultChecked={editingRule?.active !== false} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">
                Conditions
              </Label>
              <div className="col-span-3 space-y-2">
                {/* Dynamic conditions would be added here */}
                <div className="flex flex-col gap-2 p-3 border rounded-md">
                  <p className="text-sm text-muted-foreground">
                    Define when this rule should apply:
                  </p>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <Select defaultValue="description">
                      <SelectTrigger>
                        <SelectValue placeholder="Field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="description">Description</SelectItem>
                        <SelectItem value="amount">Amount</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="accountName">Account</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select defaultValue="contains">
                      <SelectTrigger>
                        <SelectValue placeholder="Operator" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="starts_with">Starts With</SelectItem>
                        <SelectItem value="greater_than">Greater Than</SelectItem>
                        <SelectItem value="less_than">Less Than</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Input 
                      placeholder="Value" 
                      defaultValue={editingRule?.conditions?.[0]?.value || ""}
                    />
                  </div>
                  
                  <Button variant="outline" size="sm" className="mt-2 w-full">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Condition
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">
                Actions
              </Label>
              <div className="col-span-3 space-y-2">
                {/* Dynamic actions would be added here */}
                <div className="flex flex-col gap-2 p-3 border rounded-md">
                  <p className="text-sm text-muted-foreground">
                    Define what happens when conditions are met:
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Select defaultValue="categorize">
                      <SelectTrigger>
                        <SelectValue placeholder="Action Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="categorize">Categorize</SelectItem>
                        <SelectItem value="assignProperty">Assign Property</SelectItem>
                        <SelectItem value="tag">Tag</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select defaultValue="Income">
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Income">Income</SelectItem>
                        <SelectItem value="Expense">Expense</SelectItem>
                        <SelectItem value="Transfer">Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select defaultValue="Rent">
                      <SelectTrigger>
                        <SelectValue placeholder="Subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Rent">Rent</SelectItem>
                        <SelectItem value="Security Deposit">Security Deposit</SelectItem>
                        <SelectItem value="Late Fees">Late Fees</SelectItem>
                        <SelectItem value="Other Income">Other Income</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button variant="outline" size="sm" className="mt-2 w-full">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Action
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRuleDialog(false)}>
              Cancel
            </Button>
            <Button>
              {editingRule ? "Update Rule" : "Create Rule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
