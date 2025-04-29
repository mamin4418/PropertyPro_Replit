import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, FileText, Home, Users, Building, Calendar, DollarSign, Wrench, FileCheck } from "lucide-react";

const HelpCenter = () => {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-2">Help Center</h1>
      <p className="text-muted-foreground mb-8">Find answers, guides, and resources for all your questions</p>

      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input 
          className="pl-10 py-6 text-lg" 
          placeholder="Search for help articles, tutorials, and FAQs..." 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Documentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Comprehensive guides and reference materials</p>
            <Button variant="outline" className="w-full">View Documentation</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <FileCheck className="mr-2 h-5 w-5" />
              Tutorials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Step-by-step guides for common tasks</p>
            <Button variant="outline" className="w-full">View Tutorials</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Wrench className="mr-2 h-5 w-5" />
              Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Contact our team for personalized help</p>
            <Button variant="outline" className="w-full">Contact Support</Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="gettingStarted">
        <TabsList className="mb-6">
          <TabsTrigger value="gettingStarted">Getting Started</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="properties">Properties Management</TabsTrigger>
          <TabsTrigger value="tenants">Tenants & Leases</TabsTrigger>
          <TabsTrigger value="finances">Financial Management</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="gettingStarted">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started with the Property Management System</CardTitle>
              <CardDescription>Learn the basics of using the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>System Overview</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">The Property Management System is designed to help property managers and landlords efficiently manage their properties, tenants, leases, and finances in one centralized platform.</p>
                    <p>Key features include:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-2">
                      <li>Property and unit management</li>
                      <li>Tenant screening and lease management</li>
                      <li>Rent collection and financial tracking</li>
                      <li>Maintenance request handling</li>
                      <li>Reporting and analytics</li>
                      <li>Communication tools</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>Setting Up Your Account</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">To get started with the system, follow these steps:</p>
                    <ol className="list-decimal pl-6 space-y-2">
                      <li>Complete your profile information in Settings</li>
                      <li>Add your company details</li>
                      <li>Set up users and permissions for your team</li>
                      <li>Configure your notification preferences</li>
                      <li>Add your properties and units</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>Navigation Guide</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">The main navigation is divided into several sections:</p>
                    <div className="space-y-3">
                      <div>
                        <div className="font-medium">Dashboard</div>
                        <p className="text-sm text-muted-foreground">Overview of key metrics and activities</p>
                      </div>
                      <div>
                        <div className="font-medium">Properties</div>
                        <p className="text-sm text-muted-foreground">Manage your properties, units, and vacancies</p>
                      </div>
                      <div>
                        <div className="font-medium">Tenants</div>
                        <p className="text-sm text-muted-foreground">Manage tenants, applications, and leases</p>
                      </div>
                      <div>
                        <div className="font-medium">Financial</div>
                        <p className="text-sm text-muted-foreground">Track rent payments, expenses, and generate reports</p>
                      </div>
                      <div>
                        <div className="font-medium">Maintenance</div>
                        <p className="text-sm text-muted-foreground">Handle maintenance requests and track work orders</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>Quick Start Tutorial</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">Follow this quick start guide to get up and running:</p>
                    <ol className="list-decimal pl-6 space-y-2">
                      <li>Add your first property</li>
                      <li>Create units within the property</li>
                      <li>Add tenants and create leases</li>
                      <li>Set up rent collection</li>
                      <li>Configure maintenance request handling</li>
                    </ol>
                    <Button variant="outline" className="mt-4">View Detailed Tutorial</Button>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Settings Help</CardTitle>
              <CardDescription>Learn about configuring your system</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="users-1">
                  <AccordionTrigger>Users & Permissions</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">The Users & Permissions section allows you to manage user accounts and their access levels within the system.</p>
                    <p className="mb-2">Key features:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Add new users and assign roles</li>
                      <li>Modify permissions for each role</li>
                      <li>Remove users or change their access levels</li>
                      <li>Create custom permission sets for specific needs</li>
                    </ul>
                    <p className="mt-4">User roles include:</p>
                    <div className="space-y-2 mt-2">
                      <div>
                        <div className="font-medium">Admin</div>
                        <p className="text-sm text-muted-foreground">Full system access with all permissions</p>
                      </div>
                      <div>
                        <div className="font-medium">Manager</div>
                        <p className="text-sm text-muted-foreground">Can manage properties, tenants, and financial data</p>
                      </div>
                      <div>
                        <div className="font-medium">Editor</div>
                        <p className="text-sm text-muted-foreground">Can view and edit records but cannot delete</p>
                      </div>
                      <div>
                        <div className="font-medium">Viewer</div>
                        <p className="text-sm text-muted-foreground">Read-only access to the system</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="config-1">
                  <AccordionTrigger>Value Configurations</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">The Value Configurations section allows you to customize dropdown options used throughout the application.</p>
                    <p className="mb-2">You can manage values for:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Property types (e.g., Single Family, Multi-Family, Commercial)</li>
                      <li>Lease terms (e.g., Month-to-Month, 6 Months, 12 Months)</li>
                      <li>Maintenance categories (e.g., Plumbing, Electrical, HVAC)</li>
                      <li>Payment methods (e.g., Check, ACH, Credit Card)</li>
                      <li>Expense categories (e.g., Repairs, Utilities, Insurance)</li>
                    </ul>
                    <p className="mt-4">To add new values:</p>
                    <ol className="list-decimal pl-6 space-y-2 mt-2">
                      <li>Enter the category name in the "Field Category" input</li>
                      <li>Enter the value in the "Field Value" input</li>
                      <li>Click the "Add" button</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="templates-1">
                  <AccordionTrigger>Communication Templates</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">The Templates section allows you to create and manage standardized communication templates that can be used for emails, text messages, or printed documents.</p>
                    <p className="mb-2">Key features:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Create templates with dynamic variables that populate automatically</li>
                      <li>Save templates for future use</li>
                      <li>Edit existing templates</li>
                      <li>Use templates across the application for consistent communication</li>
                    </ul>
                    <p className="mt-4">Available variables include:</p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="text-sm">{"{{tenant_name}}"} - Tenant's full name</div>
                      <div className="text-sm">{"{{property_address}}"} - Property address</div>
                      <div className="text-sm">{"{{unit_number}}"} - Unit identifier</div>
                      <div className="text-sm">{"{{lease_start_date}}"} - Lease start date</div>
                      <div className="text-sm">{"{{lease_end_date}}"} - Lease end date</div>
                      <div className="text-sm">{"{{rent_amount}}"} - Monthly rent amount</div>
                      <div className="text-sm">{"{{payment_due_date}}"} - Rent due date</div>
                      <div className="text-sm">{"{{company_name}}"} - Your company name</div>
                      <div className="text-sm">{"{{manager_name}}"} - Property manager name</div>
                      <div className="text-sm">{"{{manager_phone}}"} - Manager's phone number</div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs content would be added here */}
      </Tabs>
    </div>
  );
};

export default HelpCenter;