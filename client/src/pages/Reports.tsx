
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart, LineChart, FileText, Download, DollarSign, Users, Home, PieChart, TrendingUp, FileClock, Calculator, Receipt } from "lucide-react";
import { ResponsiveContainer as RechartsResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart as RechartsPieChart, Pie, Cell } from "recharts";

const Reports = () => {
  const [reportType, setReportType] = useState<string>("financial");
  const [timeRange, setTimeRange] = useState<string>("month");
  const [propertyFilter, setPropertyFilter] = useState<string>("all");
  const [financialReportType, setFinancialReportType] = useState<string>("overview");

  // Sample data for financial report
  const financialData = [
    { month: 'Jan', revenue: 18200, expenses: 14100, profit: 4100 },
    { month: 'Feb', revenue: 17800, expenses: 13900, profit: 3900 },
    { month: 'Mar', revenue: 19500, expenses: 14300, profit: 5200 },
    { month: 'Apr', revenue: 20100, expenses: 14700, profit: 5400 },
    { month: 'May', revenue: 21000, expenses: 15200, profit: 5800 },
    { month: 'Jun', revenue: 22300, expenses: 15800, profit: 6500 },
    { month: 'Jul', revenue: 23500, expenses: 16100, profit: 7400 },
    { month: 'Aug', revenue: 23800, expenses: 16500, profit: 7300 },
    { month: 'Sep', revenue: 24100, expenses: 16800, profit: 7300 },
    { month: 'Oct', revenue: 24300, expenses: 17000, profit: 7300 },
    { month: 'Nov', revenue: 24500, expenses: 17200, profit: 7300 },
    { month: 'Dec', revenue: 24800, expenses: 17400, profit: 7400 },
  ];

  // Sample data for cash flow
  const cashFlowData = [
    { month: 'Jan', inflow: 18200, outflow: 14100, netCashFlow: 4100 },
    { month: 'Feb', inflow: 17800, outflow: 13900, netCashFlow: 3900 },
    { month: 'Mar', inflow: 19500, outflow: 14300, netCashFlow: 5200 },
    { month: 'Apr', inflow: 20100, outflow: 14700, netCashFlow: 5400 },
    { month: 'May', inflow: 21000, outflow: 15200, netCashFlow: 5800 },
    { month: 'Jun', inflow: 22300, outflow: 15800, netCashFlow: 6500 },
    { month: 'Jul', inflow: 23500, outflow: 16100, netCashFlow: 7400 },
    { month: 'Aug', inflow: 23800, outflow: 16500, netCashFlow: 7300 },
    { month: 'Sep', inflow: 24100, outflow: 16800, netCashFlow: 7300 },
    { month: 'Oct', inflow: 24300, outflow: 17000, netCashFlow: 7300 },
    { month: 'Nov', inflow: 24500, outflow: 17200, netCashFlow: 7300 },
    { month: 'Dec', inflow: 24800, outflow: 17400, netCashFlow: 7400 },
  ];

  // Sample data for property P&L
  const propertyPLData = [
    { property: 'Parkside Apartments', revenue: 120000, expenses: 75000, profit: 45000 },
    { property: 'Highland Residences', revenue: 95000, expenses: 60000, profit: 35000 },
    { property: 'Sunset Heights', revenue: 88000, expenses: 52000, profit: 36000 },
    { property: 'Meadow View Condos', revenue: 76000, expenses: 48000, profit: 28000 },
    { property: 'Riverfront Townhomes', revenue: 110000, expenses: 70000, profit: 40000 },
  ];

  // Sample data for ROI
  const roiData = [
    { property: 'Parkside Apartments', investment: 1200000, annualReturn: 45000, roi: 3.75 },
    { property: 'Highland Residences', investment: 950000, annualReturn: 35000, roi: 3.68 },
    { property: 'Sunset Heights', investment: 880000, annualReturn: 36000, roi: 4.09 },
    { property: 'Meadow View Condos', investment: 760000, annualReturn: 28000, roi: 3.68 },
    { property: 'Riverfront Townhomes', investment: 1100000, annualReturn: 40000, roi: 3.64 },
  ];

  // Sample data for tax preparation
  const taxData = [
    { category: 'Property Taxes', amount: 38500 },
    { category: 'Mortgage Interest', amount: 52000 },
    { category: 'Repairs & Maintenance', amount: 28700 },
    { category: 'Insurance', amount: 22300 },
    { category: 'Property Management', amount: 18600 },
    { category: 'Utilities', amount: 15200 },
    { category: 'Depreciation', amount: 42000 },
    { category: 'Legal & Professional', amount: 12500 },
  ];

  // Sample data for demographics
  const demographicData = [
    { name: '18-25', value: 10 },
    { name: '26-35', value: 35 },
    { name: '36-45', value: 25 },
    { name: '46-55', value: 20 },
    { name: '56+', value: 10 },
  ];

  // Sample data for maintenance categories
  const maintenanceData = [
    { category: 'Plumbing', value: 32 },
    { category: 'Electrical', value: 18 },
    { category: 'HVAC', value: 27 },
    { category: 'Appliances', value: 15 },
    { category: 'Structural', value: 8 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d'];

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate insights and track performance metrics</p>
        </div>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Report Types */}
      <Tabs value={reportType} onValueChange={setReportType} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="financial">
            <DollarSign className="h-4 w-4 mr-2" />
            Financial
          </TabsTrigger>
          <TabsTrigger value="occupancy">
            <Users className="h-4 w-4 mr-2" />
            Occupancy
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            <Home className="h-4 w-4 mr-2" />
            Maintenance
          </TabsTrigger>
        </TabsList>

        {/* Report Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Time Range</label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Last Week</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                    <SelectItem value="quarter">Last Quarter</SelectItem>
                    <SelectItem value="year">Last Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Property</label>
                <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Properties</SelectItem>
                    <SelectItem value="property1">Parkside Apartments</SelectItem>
                    <SelectItem value="property2">Highland Residences</SelectItem>
                    <SelectItem value="property3">Sunset Heights</SelectItem>
                    <SelectItem value="property4">Meadow View Condos</SelectItem>
                    <SelectItem value="property5">Riverfront Townhomes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Button className="mt-6" variant="outline">Apply Filters</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Reports */}
        <TabsContent value="financial">
          {/* Financial Report Types */}
          <Tabs value={financialReportType} onValueChange={setFinancialReportType} className="mb-6">
            <TabsList className="mb-4 flex flex-wrap">
              <TabsTrigger value="overview">
                <BarChart className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="cashflow">
                <TrendingUp className="h-4 w-4 mr-2" />
                Cash Flow
              </TabsTrigger>
              <TabsTrigger value="profitloss">
                <DollarSign className="h-4 w-4 mr-2" />
                Profit & Loss
              </TabsTrigger>
              <TabsTrigger value="roi">
                <Calculator className="h-4 w-4 mr-2" />
                ROI Analysis
              </TabsTrigger>
              <TabsTrigger value="tax">
                <Receipt className="h-4 w-4 mr-2" />
                Tax Report
              </TabsTrigger>
            </TabsList>
          
            {/* Overview Report */}
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Performance</CardTitle>
                  <CardDescription>
                    Revenue, expenses, and net income by property
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full overflow-x-auto">
                    <RechartsResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={financialData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `$${value}`} />
                        <Legend />
                        <Bar dataKey="revenue" name="Revenue" fill="#0088FE" />
                        <Bar dataKey="expenses" name="Expenses" fill="#FF8042" />
                        <Bar dataKey="profit" name="Net Income" fill="#00C49F" />
                      </RechartsBarChart>
                    </RechartsResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-blue-50 dark:bg-blue-950 rounded-md p-4">
                      <p className="font-semibold text-blue-700 dark:text-blue-300">Total Revenue</p>
                      <p className="text-2xl font-bold">$265,400</p>
                      <p className="text-sm text-blue-600 dark:text-blue-400">+8.2% from last year</p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-950 rounded-md p-4">
                      <p className="font-semibold text-orange-700 dark:text-orange-300">Total Expenses</p>
                      <p className="text-2xl font-bold">$179,000</p>
                      <p className="text-sm text-orange-600 dark:text-orange-400">+5.4% from last year</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950 rounded-md p-4">
                      <p className="font-semibold text-green-700 dark:text-green-300">Net Income</p>
                      <p className="text-2xl font-bold">$86,400</p>
                      <p className="text-sm text-green-600 dark:text-green-400">+14.8% from last year</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Cash Flow */}
            <TabsContent value="cashflow">
              <Card>
                <CardHeader>
                  <CardTitle>Cash Flow Statement</CardTitle>
                  <CardDescription>
                    Track incoming, outgoing cash and net cash flow by period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full overflow-x-auto">
                    <RechartsResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={cashFlowData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `$${value}`} />
                        <Legend />
                        <Bar dataKey="inflow" name="Cash Inflow" fill="#4CAF50" />
                        <Bar dataKey="outflow" name="Cash Outflow" fill="#F44336" />
                        <Bar dataKey="netCashFlow" name="Net Cash Flow" fill="#2196F3" />
                      </RechartsBarChart>
                    </RechartsResponsiveContainer>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Cash Flow Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-50 dark:bg-green-950 rounded-md p-4">
                        <p className="font-semibold text-green-700 dark:text-green-300">Total Cash Inflow</p>
                        <p className="text-2xl font-bold">$265,400</p>
                        <p className="text-sm">Rent payments, security deposits, etc.</p>
                      </div>
                      <div className="bg-red-50 dark:bg-red-950 rounded-md p-4">
                        <p className="font-semibold text-red-700 dark:text-red-300">Total Cash Outflow</p>
                        <p className="text-2xl font-bold">$179,000</p>
                        <p className="text-sm">Maintenance, mortgage, taxes, etc.</p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-950 rounded-md p-4">
                        <p className="font-semibold text-blue-700 dark:text-blue-300">Net Cash Flow</p>
                        <p className="text-2xl font-bold">$86,400</p>
                        <p className="text-sm">Available to reinvest or distribute</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Cash Flow by Property</h3>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Property</th>
                          <th className="text-right py-2">Cash Inflow</th>
                          <th className="text-right py-2">Cash Outflow</th>
                          <th className="text-right py-2">Net Cash Flow</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">Parkside Apartments</td>
                          <td className="text-right py-2 text-green-600">$120,000</td>
                          <td className="text-right py-2 text-red-600">$75,000</td>
                          <td className="text-right py-2 font-semibold">$45,000</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Highland Residences</td>
                          <td className="text-right py-2 text-green-600">$95,000</td>
                          <td className="text-right py-2 text-red-600">$60,000</td>
                          <td className="text-right py-2 font-semibold">$35,000</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Sunset Heights</td>
                          <td className="text-right py-2 text-green-600">$88,000</td>
                          <td className="text-right py-2 text-red-600">$52,000</td>
                          <td className="text-right py-2 font-semibold">$36,000</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Meadow View Condos</td>
                          <td className="text-right py-2 text-green-600">$76,000</td>
                          <td className="text-right py-2 text-red-600">$48,000</td>
                          <td className="text-right py-2 font-semibold">$28,000</td>
                        </tr>
                        <tr>
                          <td className="py-2">Riverfront Townhomes</td>
                          <td className="text-right py-2 text-green-600">$110,000</td>
                          <td className="text-right py-2 text-red-600">$70,000</td>
                          <td className="text-right py-2 font-semibold">$40,000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Generate Detailed Cash Flow Report</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Profit & Loss */}
            <TabsContent value="profitloss">
              <Card>
                <CardHeader>
                  <CardTitle>Profit & Loss Report by Property</CardTitle>
                  <CardDescription>
                    Detailed income, expenses, and profitability by property
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full overflow-x-auto">
                    <RechartsResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={propertyPLData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="property" width={150} />
                        <Tooltip formatter={(value) => `$${value}`} />
                        <Legend />
                        <Bar dataKey="revenue" name="Revenue" fill="#4CAF50" />
                        <Bar dataKey="expenses" name="Expenses" fill="#F44336" />
                        <Bar dataKey="profit" name="Net Profit" fill="#2196F3" />
                      </RechartsBarChart>
                    </RechartsResponsiveContainer>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">P&L Summary by Property</h3>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Property</th>
                          <th className="text-right py-2">Revenue</th>
                          <th className="text-right py-2">Expenses</th>
                          <th className="text-right py-2">Net Profit</th>
                          <th className="text-right py-2">Profit Margin</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">Parkside Apartments</td>
                          <td className="text-right py-2">$120,000</td>
                          <td className="text-right py-2">$75,000</td>
                          <td className="text-right py-2 font-semibold">$45,000</td>
                          <td className="text-right py-2">37.5%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Highland Residences</td>
                          <td className="text-right py-2">$95,000</td>
                          <td className="text-right py-2">$60,000</td>
                          <td className="text-right py-2 font-semibold">$35,000</td>
                          <td className="text-right py-2">36.8%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Sunset Heights</td>
                          <td className="text-right py-2">$88,000</td>
                          <td className="text-right py-2">$52,000</td>
                          <td className="text-right py-2 font-semibold">$36,000</td>
                          <td className="text-right py-2">40.9%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Meadow View Condos</td>
                          <td className="text-right py-2">$76,000</td>
                          <td className="text-right py-2">$48,000</td>
                          <td className="text-right py-2 font-semibold">$28,000</td>
                          <td className="text-right py-2">36.8%</td>
                        </tr>
                        <tr>
                          <td className="py-2">Riverfront Townhomes</td>
                          <td className="text-right py-2">$110,000</td>
                          <td className="text-right py-2">$70,000</td>
                          <td className="text-right py-2 font-semibold">$40,000</td>
                          <td className="text-right py-2">36.4%</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr className="border-t font-semibold">
                          <td className="py-2">Total</td>
                          <td className="text-right py-2">$489,000</td>
                          <td className="text-right py-2">$305,000</td>
                          <td className="text-right py-2">$184,000</td>
                          <td className="text-right py-2">37.6%</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Generate Detailed P&L Report</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* ROI Analysis */}
            <TabsContent value="roi">
              <Card>
                <CardHeader>
                  <CardTitle>ROI Calculations Per Property</CardTitle>
                  <CardDescription>
                    Analysis of return on investment for each property
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full overflow-x-auto">
                    <RechartsResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={roiData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="property" />
                        <YAxis yAxisId="left" orientation="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="investment" name="Investment ($)" fill="#8884d8" />
                        <Bar yAxisId="left" dataKey="annualReturn" name="Annual Return ($)" fill="#82ca9d" />
                        <Bar yAxisId="right" dataKey="roi" name="ROI (%)" fill="#ff7300" />
                      </RechartsBarChart>
                    </RechartsResponsiveContainer>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">ROI Analysis</h3>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Property</th>
                          <th className="text-right py-2">Investment</th>
                          <th className="text-right py-2">Annual Return</th>
                          <th className="text-right py-2">ROI (%)</th>
                          <th className="text-right py-2">Payback Period</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">Parkside Apartments</td>
                          <td className="text-right py-2">$1,200,000</td>
                          <td className="text-right py-2">$45,000</td>
                          <td className="text-right py-2 font-semibold">3.75%</td>
                          <td className="text-right py-2">26.7 years</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Highland Residences</td>
                          <td className="text-right py-2">$950,000</td>
                          <td className="text-right py-2">$35,000</td>
                          <td className="text-right py-2 font-semibold">3.68%</td>
                          <td className="text-right py-2">27.1 years</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Sunset Heights</td>
                          <td className="text-right py-2">$880,000</td>
                          <td className="text-right py-2">$36,000</td>
                          <td className="text-right py-2 font-semibold">4.09%</td>
                          <td className="text-right py-2">24.4 years</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Meadow View Condos</td>
                          <td className="text-right py-2">$760,000</td>
                          <td className="text-right py-2">$28,000</td>
                          <td className="text-right py-2 font-semibold">3.68%</td>
                          <td className="text-right py-2">27.1 years</td>
                        </tr>
                        <tr>
                          <td className="py-2">Riverfront Townhomes</td>
                          <td className="text-right py-2">$1,100,000</td>
                          <td className="text-right py-2">$40,000</td>
                          <td className="text-right py-2 font-semibold">3.64%</td>
                          <td className="text-right py-2">27.5 years</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr className="border-t font-semibold">
                          <td className="py-2">Portfolio Average</td>
                          <td className="text-right py-2">$4,890,000</td>
                          <td className="text-right py-2">$184,000</td>
                          <td className="text-right py-2">3.76%</td>
                          <td className="text-right py-2">26.6 years</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950 rounded-md">
                    <h3 className="text-lg font-medium mb-2 text-amber-800 dark:text-amber-300">ROI Analysis Notes</h3>
                    <ul className="list-disc pl-5 space-y-1 text-amber-700 dark:text-amber-400">
                      <li>ROI calculations include both cash flow and property appreciation</li>
                      <li>Sunset Heights shows the highest ROI at 4.09%</li>
                      <li>Average portfolio ROI of 3.76% exceeds average market return of 3.2%</li>
                      <li>Properties with longer payback periods may offer better long-term appreciation</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Export Detailed ROI Analysis</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Tax Report */}
            <TabsContent value="tax">
              <Card>
                <CardHeader>
                  <CardTitle>Tax-Related Reports</CardTitle>
                  <CardDescription>
                    Tax deduction summary and preparation resources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Tax Deductions by Category</h3>
                      <div className="h-[300px]">
                        <RechartsResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={taxData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="amount"
                              nameKey="category"
                              label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {taxData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => `$${value}`} />
                          </RechartsPieChart>
                        </RechartsResponsiveContainer>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Deductible Expenses Summary</h3>
                      <div className="space-y-4">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Category</th>
                              <th className="text-right py-2">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {taxData.map((item, index) => (
                              <tr key={index} className="border-b">
                                <td className="py-2">{item.category}</td>
                                <td className="text-right py-2">${item.amount.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="border-t font-semibold">
                              <td className="py-2">Total Deductible Expenses</td>
                              <td className="text-right py-2">
                                ${taxData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">Property-Specific Tax Information</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Property</th>
                            <th className="text-right py-2">Property Tax</th>
                            <th className="text-right py-2">Mortgage Interest</th>
                            <th className="text-right py-2">Depreciation</th>
                            <th className="text-right py-2">Repairs</th>
                            <th className="text-right py-2">Insurance</th>
                            <th className="text-right py-2">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2">Parkside Apartments</td>
                            <td className="text-right py-2">$12,500</td>
                            <td className="text-right py-2">$18,300</td>
                            <td className="text-right py-2">$14,500</td>
                            <td className="text-right py-2">$8,700</td>
                            <td className="text-right py-2">$6,200</td>
                            <td className="text-right py-2 font-semibold">$60,200</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">Highland Residences</td>
                            <td className="text-right py-2">$9,200</td>
                            <td className="text-right py-2">$12,700</td>
                            <td className="text-right py-2">$10,800</td>
                            <td className="text-right py-2">$7,100</td>
                            <td className="text-right py-2">$5,400</td>
                            <td className="text-right py-2 font-semibold">$45,200</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">Sunset Heights</td>
                            <td className="text-right py-2">$8,600</td>
                            <td className="text-right py-2">$10,300</td>
                            <td className="text-right py-2">$8,800</td>
                            <td className="text-right py-2">$5,300</td>
                            <td className="text-right py-2">$4,800</td>
                            <td className="text-right py-2 font-semibold">$37,800</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">Meadow View Condos</td>
                            <td className="text-right py-2">$6,400</td>
                            <td className="text-right py-2">$8,900</td>
                            <td className="text-right py-2">$7,500</td>
                            <td className="text-right py-2">$3,800</td>
                            <td className="text-right py-2">$3,200</td>
                            <td className="text-right py-2 font-semibold">$29,800</td>
                          </tr>
                          <tr>
                            <td className="py-2">Riverfront Townhomes</td>
                            <td className="text-right py-2">$11,800</td>
                            <td className="text-right py-2">$15,800</td>
                            <td className="text-right py-2">$13,400</td>
                            <td className="text-right py-2">$7,600</td>
                            <td className="text-right py-2">$5,700</td>
                            <td className="text-right py-2 font-semibold">$54,300</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-md">
                    <h3 className="text-lg font-medium mb-2 text-blue-800 dark:text-blue-300">Tax Preparation Resources</h3>
                    <ul className="list-disc pl-5 space-y-1 text-blue-700 dark:text-blue-400">
                      <li>Schedule E (Form 1040) for reporting rental income and expenses</li>
                      <li>Form 4562 for depreciation and amortization</li>
                      <li>Form 8825 for rental real estate income and expenses of a partnership or an S corporation</li>
                      <li>Form 1098 for mortgage interest statements</li>
                    </ul>
                    <div className="mt-3">
                      <Button size="sm" variant="outline">Download Tax Forms</Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Export Tax Report for Accountant</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Occupancy Reports */}
        <TabsContent value="occupancy">
          <Card>
            <CardHeader>
              <CardTitle>Occupancy Rates</CardTitle>
              <CardDescription>
                Occupancy trends and tenant turnover analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                {/* Placeholder for occupancy chart */}
                <div className="flex items-center justify-center h-full border rounded-md">
                  <p className="text-muted-foreground">Occupancy chart will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Reports */}
        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Metrics</CardTitle>
              <CardDescription>
                Service requests, response times, and maintenance costs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Maintenance Requests by Category</h3>
                  <div className="h-[300px]">
                    <RechartsResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={maintenanceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="category"
                          label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {maintenanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value} requests`} />
                      </RechartsPieChart>
                    </RechartsResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3">Maintenance Costs by Property</h3>
                  <div className="h-[300px]">
                    {/* Placeholder for maintenance costs chart */}
                    <div className="flex items-center justify-center h-full border rounded-md">
                      <p className="text-muted-foreground">Maintenance costs chart will be displayed here</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Additional Reports */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tenant Demographics</CardTitle>
            <CardDescription>
              Age, income, and household size distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <RechartsResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={demographicData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={(entry) => entry.name}
                  >
                    {demographicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </RechartsPieChart>
              </RechartsResponsiveContainer>
            </div>
            <p className="text-sm text-center text-muted-foreground mt-4">
              Age distribution of current tenants across all properties
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View Full Report</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Payment Analytics</CardTitle>
            <CardDescription>
              Payment trends, delinquencies, and collection rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
              <LineChart className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Track payment performance over time with detailed payment analytics and forecasting.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View Report</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Market Comparison</CardTitle>
            <CardDescription>
              Rent benchmarking against local market rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
              <BarChart className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Compare your property performance to local market rates and identify opportunities.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View Report</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
