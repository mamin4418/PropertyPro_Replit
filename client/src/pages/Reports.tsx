import { useState } from "react";
import { 
  BarChart, 
  PieChart, 
  LineChart, 
  DollarSign, 
  Calendar, 
  Home, 
  Users, 
  Percent, 
  Download, 
  FileText,
  Filter,
  ArrowUpDown
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Import recharts components for charts
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from "recharts";

const Reports = () => {
  const [reportType, setReportType] = useState<string>("financial");
  const [timeRange, setTimeRange] = useState<string>("month");
  const [propertyFilter, setPropertyFilter] = useState<string>("all");

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

  // Sample data for occupancy report
  const occupancyData = [
    { month: 'Jan', occupancyRate: 82 },
    { month: 'Feb', occupancyRate: 83 },
    { month: 'Mar', occupancyRate: 84 },
    { month: 'Apr', occupancyRate: 85 },
    { month: 'May', occupancyRate: 85 },
    { month: 'Jun', occupancyRate: 86 },
    { month: 'Jul', occupancyRate: 87 },
    { month: 'Aug', occupancyRate: 87 },
    { month: 'Sep', occupancyRate: 88 },
    { month: 'Oct', occupancyRate: 88 },
    { month: 'Nov', occupancyRate: 88 },
    { month: 'Dec', occupancyRate: 87 },
  ];

  // Sample data for maintenance report
  const maintenanceData = [
    { category: 'Plumbing', value: 28 },
    { category: 'Electrical', value: 22 },
    { category: 'HVAC', value: 18 },
    { category: 'Appliances', value: 15 },
    { category: 'Structural', value: 10 },
    { category: 'Other', value: 7 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Sample data for tenant demographics
  const demographicData = [
    { name: '18-25', value: 15 },
    { name: '26-35', value: 35 },
    { name: '36-45', value: 25 },
    { name: '46-55', value: 15 },
    { name: '56+', value: 10 },
  ];

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
                  <SelectItem value="property3">Westlake Condominiums</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button>
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <h2 className="text-3xl font-bold mt-1">$24,358</h2>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <ArrowUpDown className="h-3 w-3 mr-1" />
                  +4.3% from previous period
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Occupancy Rate</p>
                <h2 className="text-3xl font-bold mt-1">87.5%</h2>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <ArrowUpDown className="h-3 w-3 mr-1" />
                  +2.1% from previous period
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Percent className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Lease Duration</p>
                <h2 className="text-3xl font-bold mt-1">14.3 mo</h2>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <ArrowUpDown className="h-3 w-3 mr-1" />
                  +0.8 mo from previous period
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Maintenance Costs</p>
                <h2 className="text-3xl font-bold mt-1">$4,217</h2>
                <p className="text-xs text-red-500 flex items-center mt-1">
                  <ArrowUpDown className="h-3 w-3 mr-1" />
                  +12.8% from previous period
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Home className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
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

        {/* Financial Reports */}
        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle>Financial Performance</CardTitle>
              <CardDescription>
                Revenue, expenses, and net income by property
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height="100%">
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
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 dark:bg-blue-950 rounded-md p-4">
                  <div className="text-sm text-muted-foreground">Total Revenue</div>
                  <div className="text-2xl font-bold mt-1">$259,600</div>
                  <div className="text-xs text-green-500 mt-1">+5.8% year over year</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-950 rounded-md p-4">
                  <div className="text-sm text-muted-foreground">Total Expenses</div>
                  <div className="text-2xl font-bold mt-1">$183,000</div>
                  <div className="text-xs text-red-500 mt-1">+4.2% year over year</div>
                </div>
                <div className="bg-green-50 dark:bg-green-950 rounded-md p-4">
                  <div className="text-sm text-muted-foreground">Net Income</div>
                  <div className="text-2xl font-bold mt-1">$76,600</div>
                  <div className="text-xs text-green-500 mt-1">+9.1% year over year</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between border-t px-6 py-4">
              <div className="text-sm text-muted-foreground">
                Last updated: April 26, 2025
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Occupancy Reports */}
        <TabsContent value="occupancy">
          <Card>
            <CardHeader>
              <CardTitle>Occupancy Analysis</CardTitle>
              <CardDescription>
                Occupancy rates, tenant turnover, and lease renewals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={occupancyData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[75, 95]} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="occupancyRate" 
                      name="Occupancy Rate" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }} 
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-3">Occupancy Trends</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Average Occupancy</p>
                      <p className="text-2xl font-bold">85.8%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Vacancy Rate</p>
                      <p className="text-2xl font-bold">14.2%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Peak Occupancy</p>
                      <p className="text-2xl font-bold">88%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Lowest Occupancy</p>
                      <p className="text-2xl font-bold">82%</p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-3">Tenant Retention</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Renewal Rate</p>
                      <p className="text-2xl font-bold">76%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Tenant Stay</p>
                      <p className="text-2xl font-bold">2.4 yrs</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Move-outs (YTD)</p>
                      <p className="text-2xl font-bold">28</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Move-ins (YTD)</p>
                      <p className="text-2xl font-bold">34</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between border-t px-6 py-4">
              <div className="text-sm text-muted-foreground">
                Last updated: April 26, 2025
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </CardFooter>
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
                    <ResponsiveContainer width="100%" height="100%">
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
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Maintenance Performance</h3>
                  <div className="space-y-6">
                    <div className="border rounded-md p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Requests</p>
                          <p className="text-2xl font-bold">142</p>
                          <p className="text-xs text-green-500">-8% from previous year</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Avg. Response Time</p>
                          <p className="text-2xl font-bold">1.4 days</p>
                          <p className="text-xs text-green-500">-0.3 days from previous year</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Request Status</h4>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-green-50 dark:bg-green-950 p-2 rounded-md">
                          <p className="text-sm text-muted-foreground">Completed</p>
                          <p className="text-xl font-semibold">112</p>
                          <p className="text-xs text-muted-foreground">78.9%</p>
                        </div>
                        <div className="bg-yellow-50 dark:bg-yellow-950 p-2 rounded-md">
                          <p className="text-sm text-muted-foreground">In Progress</p>
                          <p className="text-xl font-semibold">24</p>
                          <p className="text-xs text-muted-foreground">16.9%</p>
                        </div>
                        <div className="bg-red-50 dark:bg-red-950 p-2 rounded-md">
                          <p className="text-sm text-muted-foreground">Pending</p>
                          <p className="text-xl font-semibold">6</p>
                          <p className="text-xs text-muted-foreground">4.2%</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Maintenance Costs</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Costs</p>
                          <p className="text-xl font-semibold">$48,742</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Avg. Cost/Unit</p>
                          <p className="text-xl font-semibold">$724</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between border-t px-6 py-4">
              <div className="text-sm text-muted-foreground">
                Last updated: April 26, 2025
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </CardFooter>
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
              <ResponsiveContainer width="100%" height="100%">
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
              </ResponsiveContainer>
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
