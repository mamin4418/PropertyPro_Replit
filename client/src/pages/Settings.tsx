
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Lock, Bell, Palette, Shield, Users, Database, FileText } from "lucide-react";
import ThemeSwitcher from "@/components/layout/ThemeSwitcher";
import { useTheme } from "@/hooks/use-theme";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Settings = () => {
  const { currentTheme, changeTheme } = useTheme();
  const [newFieldName, setNewFieldName] = React.useState("");
  const [newFieldValue, setNewFieldValue] = React.useState("");
  const [newTemplateTitle, setNewTemplateTitle] = React.useState("");
  const [templateContent, setTemplateContent] = React.useState("");

  // Mock data for users
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Manager" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Editor" },
  ];

  // Mock data for dropdown values
  const [configValues, setConfigValues] = React.useState([
    { id: 1, category: "Property Types", value: "Single Family" },
    { id: 2, category: "Property Types", value: "Multi Family" },
    { id: 3, category: "Property Types", value: "Apartment" },
    { id: 4, category: "Lease Terms", value: "Month-to-Month" },
    { id: 5, category: "Lease Terms", value: "6 Months" },
    { id: 6, category: "Lease Terms", value: "12 Months" },
    { id: 7, category: "Maintenance Categories", value: "Plumbing" },
    { id: 8, category: "Maintenance Categories", value: "Electrical" },
    { id: 9, category: "Maintenance Categories", value: "HVAC" },
  ]);

  // Mock data for templates
  const [templates, setTemplates] = React.useState([
    { id: 1, title: "Welcome Email", content: "Dear {{tenant_name}},\n\nWelcome to your new home at {{property_address}}! We are pleased to have you as our tenant." },
    { id: 2, title: "Maintenance Request", content: "Maintenance request for {{property_address}} - Unit {{unit_number}}.\n\nIssue: {{issue_description}}" },
    { id: 3, title: "Lease Renewal", content: "Dear {{tenant_name}},\n\nYour lease at {{property_address}} will expire on {{lease_end_date}}. We would like to offer you a renewal." },
  ]);

  const handleAddConfigValue = () => {
    if (newFieldName && newFieldValue) {
      setConfigValues([
        ...configValues,
        { id: configValues.length + 1, category: newFieldName, value: newFieldValue }
      ]);
      setNewFieldName("");
      setNewFieldValue("");
    }
  };

  const handleRemoveConfigValue = (id) => {
    setConfigValues(configValues.filter(value => value.id !== id));
  };

  const handleSaveTemplate = () => {
    if (newTemplateTitle && templateContent) {
      setTemplates([
        ...templates,
        { id: templates.length + 1, title: newTemplateTitle, content: templateContent }
      ]);
      setNewTemplateTitle("");
      setTemplateContent("");
    }
  };

  const handleRemoveTemplate = (id) => {
    setTemplates(templates.filter(template => template.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <p className="text-muted-foreground mb-8">Manage your account and system preferences</p>

      <Tabs defaultValue="profile">
        <TabsList className="mb-8 flex w-full border-b pb-px">
          <TabsTrigger value="profile" className="flex items-center gap-2 rounded-none border-b-2 border-transparent pb-2 pt-1 data-[state=active]:border-primary">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center gap-2 rounded-none border-b-2 border-transparent pb-2 pt-1 data-[state=active]:border-primary">
            <User className="h-4 w-4" />
            <span>Company</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2 rounded-none border-b-2 border-transparent pb-2 pt-1 data-[state=active]:border-primary">
            <Users className="h-4 w-4" />
            <span>Users & Permissions</span>
          </TabsTrigger>
          <TabsTrigger value="configurations" className="flex items-center gap-2 rounded-none border-b-2 border-transparent pb-2 pt-1 data-[state=active]:border-primary">
            <Database className="h-4 w-4" />
            <span>Value Configurations</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2 rounded-none border-b-2 border-transparent pb-2 pt-1 data-[state=active]:border-primary">
            <FileText className="h-4 w-4" />
            <span>Templates</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 rounded-none border-b-2 border-transparent pb-2 pt-1 data-[state=active]:border-primary">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-2 rounded-none border-b-2 border-transparent pb-2 pt-1 data-[state=active]:border-primary">
            <Palette className="h-4 w-4" />
            <span>Theme</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2 rounded-none border-b-2 border-transparent pb-2 pt-1 data-[state=active]:border-primary">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Manage your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="(123) 456-7890" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Manage your company details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" placeholder="Acme Inc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyAddress">Address</Label>
                <Input id="companyAddress" placeholder="123 Main St, New York, NY 10001" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyTaxId">Tax ID / EIN</Label>
                <Input id="companyTaxId" placeholder="12-3456789" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users & Permissions</CardTitle>
              <CardDescription>Manage users and their access levels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-end mb-4">
                <Button>
                  <Users className="mr-2 h-4 w-4" />
                  Add New User
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Select defaultValue={user.role}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Manager">Manager</SelectItem>
                            <SelectItem value="Editor">Editor</SelectItem>
                            <SelectItem value="Viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="destructive" size="sm">Remove</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Role Permissions</CardTitle>
                  <CardDescription>Define what each role can access</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Admin</p>
                        <p className="text-sm text-muted-foreground">Full access to all features</p>
                      </div>
                      <Badge>Default</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Manager</p>
                        <p className="text-sm text-muted-foreground">Can manage properties, tenants, and financial data</p>
                      </div>
                      <Button variant="outline" size="sm">Edit Permissions</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Editor</p>
                        <p className="text-sm text-muted-foreground">Can edit but not delete records</p>
                      </div>
                      <Button variant="outline" size="sm">Edit Permissions</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Viewer</p>
                        <p className="text-sm text-muted-foreground">Read-only access</p>
                      </div>
                      <Button variant="outline" size="sm">Edit Permissions</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configurations">
          <Card>
            <CardHeader>
              <CardTitle>Value Configurations</CardTitle>
              <CardDescription>Manage dropdown values used throughout the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="fieldCategory">Field Category</Label>
                  <Input 
                    id="fieldCategory" 
                    placeholder="e.g. Property Types, Lease Terms" 
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fieldValue">Field Value</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="fieldValue" 
                      placeholder="e.g. Single Family, Month-to-Month" 
                      value={newFieldValue}
                      onChange={(e) => setNewFieldValue(e.target.value)}
                    />
                    <Button onClick={handleAddConfigValue}>Add</Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Current Values</h3>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {configValues.map((value) => (
                      <TableRow key={value.id}>
                        <TableCell>{value.category}</TableCell>
                        <TableCell>{value.value}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleRemoveConfigValue(value.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Communication Templates</CardTitle>
              <CardDescription>Create and manage templates for emails, SMS, and more</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="templateTitle">Template Title</Label>
                  <Input 
                    id="templateTitle" 
                    placeholder="e.g. Welcome Email, Lease Renewal" 
                    value={newTemplateTitle}
                    onChange={(e) => setNewTemplateTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="templateContent">Template Content</Label>
                  <div className="mb-2">
                    <p className="text-sm text-muted-foreground">Available Variables:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="outline">{"{{tenant_name}}"}</Badge>
                      <Badge variant="outline">{"{{property_address}}"}</Badge>
                      <Badge variant="outline">{"{{unit_number}}"}</Badge>
                      <Badge variant="outline">{"{{lease_start_date}}"}</Badge>
                      <Badge variant="outline">{"{{lease_end_date}}"}</Badge>
                      <Badge variant="outline">{"{{rent_amount}}"}</Badge>
                      <Badge variant="outline">{"{{payment_due_date}}"}</Badge>
                      <Badge variant="outline">{"{{company_name}}"}</Badge>
                      <Badge variant="outline">{"{{manager_name}}"}</Badge>
                      <Badge variant="outline">{"{{manager_phone}}"}</Badge>
                    </div>
                  </div>
                  <Textarea 
                    id="templateContent" 
                    placeholder="Enter your template content here. Use {{variable}} for dynamic content." 
                    className="min-h-32"
                    value={templateContent}
                    onChange={(e) => setTemplateContent(e.target.value)}
                  />
                </div>
                <Button onClick={handleSaveTemplate}>Save Template</Button>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Saved Templates</h3>
                
                <div className="space-y-4">
                  {templates.map((template) => (
                    <Card key={template.id} className="border-gray-200">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle>{template.title}</CardTitle>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleRemoveTemplate(template.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <pre className="text-sm bg-gray-50 dark:bg-gray-950 p-3 rounded-md whitespace-pre-wrap">
                          {template.content}
                        </pre>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive notifications in-app</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>Customize the application appearance</CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-medium mb-4">Theme Selection</h3>
              <p className="text-sm text-muted-foreground mb-4">Choose from our curated themes</p>

              <ThemeSwitcher />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and security options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch />
              </div>
              <Button className="mt-4">Update Security Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
