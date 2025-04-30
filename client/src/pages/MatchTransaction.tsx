import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useRoute, useLocation } from "wouter";
import { useState } from "react";
import { ArrowLeft, ArrowUp, ArrowDown, Search, CheckCircle2, Plus, Trash2, Save, Filter } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function MatchTransaction() {
  const [, params] = useRoute("/banking/transactions/:id/match");
  const [, navigate] = useLocation();
  const transactionId = params?.id;
  const [matchType, setMatchType] = useState("rentPayment");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("manual");
  const [rules, setRules] = useState<Rule[]>([{ 
    id: 1, 
    field: "description", 
    condition: "contains", 
    value: "", 
    enabled: true 
  }]);
  const [actions, setActions] = useState<Action[]>([{ 
    id: 1, 
    type: "expense", 
    property: "", 
    category: "", 
    percentage: 100 
  }]);

  // Field options for rules
  const fieldOptions = [
    { value: "description", label: "Description" },
    { value: "amount", label: "Amount" },
    { value: "date", label: "Date" },
    { value: "category", label: "Category" },
    { value: "accountName", label: "Account Name" }
  ];

  // Condition options for rules
  const conditionOptions = [
    { value: "contains", label: "Contains" },
    { value: "equals", label: "Equals" },
    { value: "starts_with", label: "Starts With" },
    { value: "ends_with", label: "Ends With" },
    { value: "greater_than", label: "Greater Than" },
    { value: "less_than", label: "Less Than" }
  ];

  // Mock transaction data (in a real app, you would fetch this from an API)
  const transaction = {
    id: 1,
    date: "2023-05-01",
    description: "Rent Payment - Unit 303",
    amount: 1850.00,
    type: "income",
    category: "Rent",
    accountId: 1,
    accountName: "Operating Account",
    bankName: "First National Bank"
  };

  // Mock properties for dropdown
  const properties = [
    { id: 1, name: "Sunset Heights" },
    { id: 2, name: "Maple Gardens" },
    { id: 3, name: "Downtown Lofts" }
  ];

  // Mock categories for dropdown
  const expenseCategories = [
    { id: 1, name: "Repairs & Maintenance" },
    { id: 2, name: "Utilities" },
    { id: 3, name: "Insurance" },
    { id: 4, name: "Property Management" },
    { id: 5, name: "Taxes" }
  ];

  const paymentCategories = [
    { id: 1, name: "Rent" },
    { id: 2, name: "Late Fees" },
    { id: 3, name: "Security Deposit" },
    { id: 4, name: "Pet Fees" },
    { id: 5, name: "Application Fees" }
  ];

  // Mock rent payments data
  const rentPayments = [
    { id: 1, tenant: "John Smith", unit: "Unit 303", property: "Sunset Heights", dueDate: "2023-05-01", amount: 1850.00, status: "Due" },
    { id: 2, tenant: "Sarah Johnson", unit: "Unit 201", property: "Maple Gardens", dueDate: "2023-05-01", amount: 1425.00, status: "Due" },
    { id: 3, tenant: "Michael Brown", unit: "Unit 105", property: "Sunset Heights", dueDate: "2023-05-01", amount: 1500.00, status: "Due" }
  ];

  // Mock expenses data
  const expenses = [
    { id: 1, vendor: "City Water & Sewer", property: "Sunset Heights", category: "Utilities", dueDate: "2023-05-10", amount: 342.15, status: "Pending" },
    { id: 2, vendor: "ABC Plumbing", property: "Maple Gardens", category: "Repairs & Maintenance", dueDate: "2023-05-05", amount: 275.00, status: "Pending" },
    { id: 3, vendor: "Premium Insurance", property: "All Properties", category: "Insurance", dueDate: "2023-05-15", amount: 825.50, status: "Pending" }
  ];

  // Mock security deposits data
  const securityDeposits = [
    { id: 1, tenant: "Michael Brown", unit: "Unit 105", property: "Sunset Heights", date: "2023-04-27", amount: 1500.00, status: "Pending" },
    { id: 2, tenant: "Lisa Wilson", unit: "Unit 202", property: "Maple Gardens", date: "2023-05-02", amount: 1200.00, status: "Pending" }
  ];

  // Mock other income data
  const otherIncome = [
    { id: 1, description: "Laundry Income", property: "Sunset Heights", category: "Laundry", date: "2023-05-01", amount: 320.00 },
    { id: 2, description: "Late Fee - Unit 104", property: "Maple Gardens", category: "Late Fees", date: "2023-04-10", amount: 50.00 }
  ];

  // Types for rule-based matching
  type Rule = {
    id: number;
    field: string;
    condition: string;
    value: string;
    enabled: boolean;
  };

  type Action = {
    id: number;
    type: string;
    property: string;
    category: string;
    percentage: number;
  };

  // Add a new rule
  const addRule = () => {
    const newId = rules.length > 0 ? Math.max(...rules.map(rule => rule.id)) + 1 : 1;
    setRules([...rules, { 
      id: newId, 
      field: "description", 
      condition: "contains", 
      value: "", 
      enabled: true 
    }]);
  };

  // Remove a rule
  const removeRule = (id: number) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  // Update a rule
  const updateRule = (id: number, field: keyof Rule, value: any) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, [field]: value } : rule
    ));
  };

  // Add a new action
  const addAction = () => {
    const newId = actions.length > 0 ? Math.max(...actions.map(action => action.id)) + 1 : 1;
    setActions([...actions, { 
      id: newId, 
      type: "expense", 
      property: "", 
      category: "", 
      percentage: 100 
    }]);
  };

  // Remove an action
  const removeAction = (id: number) => {
    setActions(actions.filter(action => action.id !== id));
  };

  // Update an action
  const updateAction = (id: number, field: keyof Action, value: any) => {
    setActions(actions.map(action => 
      action.id === id ? { ...action, [field]: value } : action
    ));
  };

  // Save rule configuration
  const saveRuleConfiguration = () => {
    // In a real application, you would send this to the backend
    console.log("Saving rules:", rules);
    console.log("Saving actions:", actions);

    // Show a success message
    alert("Rules saved successfully! These will now be applied to incoming transactions.");

    // Navigate back or show success message
    setActiveTab("manual");
  };

  // Evaluate if a transaction matches the rules
  const evaluateRules = (transaction) => {
    // Return true if any enabled rule matches
    return rules.some(rule => {
      if (!rule.enabled) return false;

      const value = transaction[rule.field];
      const ruleValue = rule.value;

      switch(rule.condition) {
        case "contains":
          return String(value).toLowerCase().includes(String(ruleValue).toLowerCase());
        case "equals":
          return String(value).toLowerCase() === String(ruleValue).toLowerCase();
        case "starts_with":
          return String(value).toLowerCase().startsWith(String(ruleValue).toLowerCase());
        case "ends_with":
          return String(value).toLowerCase().endsWith(String(ruleValue).toLowerCase());
        case "greater_than":
          return Number(value) > Number(ruleValue);
        case "less_than":
          return Number(value) < Number(ruleValue);
        default:
          return false;
      }
    });
  };

  // Apply actions when rules match
  const applyActions = (transaction) => {
    if (evaluateRules(transaction)) {
      console.log("Transaction matches rules! Applying actions:", actions);
      // In a real app, you would apply the actions here
      return actions;
    }
    return null;
  };

  // Filter items based on search query and transaction type (income/expense)
  let filteredItems = [];

  if (matchType === "rentPayment") {
    filteredItems = rentPayments.filter(item =>
      item.tenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.unit.toLowerCase().includes(searchQuery.toLowerCase())
    );
  } else if (matchType === "expense") {
    filteredItems = expenses.filter(item =>
      item.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  } else if (matchType === "securityDeposit") {
    filteredItems = securityDeposits.filter(item =>
      item.tenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.unit.toLowerCase().includes(searchQuery.toLowerCase())
    );
  } else if (matchType === "otherIncome") {
    filteredItems = otherIncome.filter(item =>
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Handle match confirmation
  const handleMatchConfirm = () => {
    if (!selectedItem) return;

    // In a real app, this would send the match data to the server
    console.log("Matching transaction", transaction.id, "with", matchType, "item", selectedItem);

    // Navigate back to transaction details
    navigate(`/banking/transactions/${transaction.id}`);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center">
        <Button variant="ghost" asChild className="mr-4">
          <Link href={`/banking/transactions/${transaction.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Transaction
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Match Transaction</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
          <CardDescription>Select what this transaction should be matched with</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-muted rounded-lg mb-6">
            <div>
              <h3 className="font-medium">{transaction.description}</h3>
              <p className="text-sm text-muted-foreground">{transaction.date} • {transaction.accountName}</p>
            </div>
            <div className={`text-xl font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
              {transaction.amount > 0 ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              ${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Manual Matching</TabsTrigger>
              <TabsTrigger value="rules">Rule-Based Matching</TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="space-y-4">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">What type of transaction is this?</h3>
                  <RadioGroup value={matchType} onValueChange={setMatchType} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2 border rounded-md p-3">
                      <RadioGroupItem value="rentPayment" id="rentPayment" />
                      <Label htmlFor="rentPayment" className="cursor-pointer">Rent Payment</Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-3">
                      <RadioGroupItem value="expense" id="expense" />
                      <Label htmlFor="expense" className="cursor-pointer">Expense</Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-3">
                      <RadioGroupItem value="securityDeposit" id="securityDeposit" />
                      <Label htmlFor="securityDeposit" className="cursor-pointer">Security Deposit</Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-3">
                      <RadioGroupItem value="otherIncome" id="otherIncome" />
                      <Label htmlFor="otherIncome" className="cursor-pointer">Other Income</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative w-full md:w-[350px]">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    {matchType === "rentPayment" && (
                      <Select defaultValue="all">
                        <SelectTrigger className="w-full md:w-[180px]">
                          <SelectValue placeholder="Filter by Property" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Properties</SelectItem>
                          <SelectItem value="sunset">Sunset Heights</SelectItem>
                          <SelectItem value="maple">Maple Gardens</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {matchType === "rentPayment" && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]"></TableHead>
                          <TableHead>Tenant</TableHead>
                          <TableHead>Unit</TableHead>
                          <TableHead>Property</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredItems.length > 0 ? (
                          filteredItems.map((item: any) => (
                            <TableRow key={item.id} className={selectedItem === item.id ? "bg-primary/5" : ""}>
                              <TableCell>
                                <Button
                                  variant={selectedItem === item.id ? "default" : "ghost"}
                                  size="icon"
                                  onClick={() => setSelectedItem(item.id)}
                                  className="h-8 w-8"
                                >
                                  <CheckCircle2 className={`h-5 w-5 ${selectedItem === item.id ? "text-white" : "text-muted-foreground"}`} />
                                </Button>
                              </TableCell>
                              <TableCell>{item.tenant}</TableCell>
                              <TableCell>{item.unit}</TableCell>
                              <TableCell>{item.property}</TableCell>
                              <TableCell>{item.dueDate}</TableCell>
                              <TableCell className="text-right">${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                              No matching rent payments found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}

                  {matchType === "expense" && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]"></TableHead>
                          <TableHead>Vendor</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Property</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredItems.length > 0 ? (
                          filteredItems.map((item: any) => (
                            <TableRow key={item.id} className={selectedItem === item.id ? "bg-primary/5" : ""}>
                              <TableCell>
                                <Button
                                  variant={selectedItem === item.id ? "default" : "ghost"}
                                  size="icon"
                                  onClick={() => setSelectedItem(item.id)}
                                  className="h-8 w-8"
                                >
                                  <CheckCircle2 className={`h-5 w-5 ${selectedItem === item.id ? "text-white" : "text-muted-foreground"}`} />
                                </Button>
                              </TableCell>
                              <TableCell>{item.vendor}</TableCell>
                              <TableCell>{item.category}</TableCell>
                              <TableCell>{item.property}</TableCell>
                              <TableCell>{item.dueDate}</TableCell>
                              <TableCell className="text-right">${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                              No matching expenses found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}

                  {matchType === "securityDeposit" && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]"></TableHead>
                          <TableHead>Tenant</TableHead>
                          <TableHead>Unit</TableHead>
                          <TableHead>Property</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredItems.length > 0 ? (
                          filteredItems.map((item: any) => (
                            <TableRow key={item.id} className={selectedItem === item.id ? "bg-primary/5" : ""}>
                              <TableCell>
                                <Button
                                  variant={selectedItem === item.id ? "default" : "ghost"}
                                  size="icon"
                                  onClick={() => setSelectedItem(item.id)}
                                  className="h-8 w-8"
                                >
                                  <CheckCircle2 className={`h-5 w-5 ${selectedItem === item.id ? "text-white" : "text-muted-foreground"}`} />
                                </Button>
                              </TableCell>
                              <TableCell>{item.tenant}</TableCell>
                              <TableCell>{item.unit}</TableCell>
                              <TableCell>{item.property}</TableCell>
                              <TableCell>{item.date}</TableCell>
                              <TableCell className="text-right">${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                              No matching security deposits found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}

                  {matchType === "otherIncome" && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]"></TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Property</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredItems.length > 0 ? (
                          filteredItems.map((item: any) => (
                            <TableRow key={item.id} className={selectedItem === item.id ? "bg-primary/5" : ""}>
                              <TableCell>
                                <Button
                                  variant={selectedItem === item.id ? "default" : "ghost"}
                                  size="icon"
                                  onClick={() => setSelectedItem(item.id)}
                                  className="h-8 w-8"
                                >
                                  <CheckCircle2 className={`h-5 w-5 ${selectedItem === item.id ? "text-white" : "text-muted-foreground"}`} />
                                </Button>
                              </TableCell>
                              <TableCell>{item.description}</TableCell>
                              <TableCell>{item.category}</TableCell>
                              <TableCell>{item.property}</TableCell>
                              <TableCell>{item.date}</TableCell>
                              <TableCell className="text-right">${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                              No matching income entries found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" asChild>
                  <Link href={`/banking/transactions/${transaction.id}`}>Cancel</Link>
                </Button>
                <Button 
                  onClick={handleMatchConfirm} 
                  disabled={!selectedItem}
                >
                  Confirm Match
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="rules" className="space-y-6">
              <div className="bg-muted/30 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-medium mb-2">About Rule-Based Matching</h3>
                <p className="text-sm text-muted-foreground">
                  Create rules to automatically match transactions based on criteria like description or amount. 
                  When rules match, the specified actions will be applied.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Matching Rules</h3>
                  <Button variant="outline" size="sm" onClick={addRule}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Rule
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-4">
                    {rules.map((rule) => (
                      <div key={rule.id} className="flex items-center gap-2 mb-4 pb-4 border-b last:border-b-0 last:mb-0 last:pb-0">
                        <div className="flex-shrink-0">
                          <Switch 
                            checked={rule.enabled} 
                            onCheckedChange={(checked) => updateRule(rule.id, 'enabled', checked)} 
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-grow">
                          <Select 
                            value={rule.field} 
                            onValueChange={(value) => updateRule(rule.id, 'field', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Field" />
                            </SelectTrigger>
                            <SelectContent>
                              {fieldOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select 
                            value={rule.condition} 
                            onValueChange={(value) => updateRule(rule.id, 'condition', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Condition" />
                            </SelectTrigger>
                            <SelectContent>
                              {conditionOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Input 
                            placeholder="Value" 
                            value={rule.value} 
                            onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
                          />
                        </div>

                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeRule(rule.id)}
                          className="flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    ))}

                    {rules.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        No rules have been created yet. Click "Add Rule" to get started.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Actions When Rules Match</h3>
                  <Button variant="outline" size="sm" onClick={addAction}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Action
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-4">
                    {actions.map((action) => (
                      <div key={action.id} className="flex items-start gap-2 mb-4 pb-4 border-b last:border-b-0 last:mb-0 last:pb-0">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 flex-grow">
                          <Select 
                            value={action.type} 
                            onValueChange={(value) => updateAction(action.id, 'type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="expense">Expense</SelectItem>
                              <SelectItem value="payment">Payment</SelectItem>
                            </SelectContent>
                          </Select>

                          <Select 
                            value={action.property} 
                            onValueChange={(value) => updateAction(action.id, 'property', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Property" />
                            </SelectTrigger>
                            <SelectContent>
                              {properties.map(property => (
                                <SelectItem key={property.id} value={property.id.toString()}>{property.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select 
                            value={action.category} 
                            onValueChange={(value) => updateAction(action.id, 'category', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {action.type === "expense" 
                                ? expenseCategories.map(category => (
                                    <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
                                  ))
                                : paymentCategories.map(category => (
                                    <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
                                  ))
                              }
                            </SelectContent>
                          </Select>

                          <div className="flex items-center gap-2">
                            <Input 
                              type="number" 
                              min="0" 
                              max="100" 
                              value={action.percentage} 
                              onChange={(e) => updateAction(action.id, 'percentage', parseInt(e.target.value) || 0)}
                              className="w-20"
                            />
                            <span className="text-muted-foreground">%</span>
                          </div>
                        </div>

                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeAction(action.id)}
                          className="flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    ))}

                    {actions.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        No actions have been created yet. Click "Add Action" to get started.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" asChild>
                  <Link href={`/banking/transactions/${transaction.id}`}>Cancel</Link>
                </Button>
                <Button 
                  onClick={saveRuleConfiguration}
                  disabled={rules.length === 0 || actions.length === 0}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Rules & Actions
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}