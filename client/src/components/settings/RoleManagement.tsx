
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash, Edit, Save, Check, Shield } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define the structure for permissions
interface Permission {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

// Define the structure for a role
interface Role {
  id: number;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: Record<string, Permission>;
}

// Define the structure for a page/module
interface Module {
  id: string;
  name: string;
  description: string;
}

const RoleManagement = () => {
  // Predefined system modules
  const [modules, setModules] = useState<Module[]>([
    { id: "dashboard", name: "Dashboard", description: "Main dashboard and analytics" },
    { id: "properties", name: "Properties", description: "Property management" },
    { id: "tenants", name: "Tenants", description: "Tenant management" },
    { id: "leases", name: "Leases", description: "Lease agreements" },
    { id: "payments", name: "Payments", description: "Payment tracking and processing" },
    { id: "maintenance", name: "Maintenance", description: "Maintenance requests and tracking" },
    { id: "vacancies", name: "Vacancies", description: "Vacancy listings and applications" },
    { id: "vendors", name: "Vendors", description: "Vendor management" },
    { id: "reports", name: "Reports", description: "Financial and operational reports" },
    { id: "documents", name: "Documents", description: "Document management and signing" },
    { id: "banking", name: "Banking", description: "Bank account management" },
    { id: "settings", name: "Settings", description: "System settings" },
    { id: "users", name: "Users", description: "User management" },
    { id: "roles", name: "Roles", description: "Role management" },
  ]);

  // Predefined system roles
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 1,
      name: "Administrator",
      description: "Full access to all system features",
      isSystem: true,
      permissions: Object.fromEntries(
        modules.map(m => [
          m.id,
          { create: true, read: true, update: true, delete: true }
        ])
      )
    },
    {
      id: 2,
      name: "Property Manager",
      description: "Manage properties, tenants, leases, and maintenance",
      isSystem: true,
      permissions: Object.fromEntries(
        modules.map(m => [
          m.id,
          m.id === "settings" || m.id === "users" || m.id === "roles"
            ? { create: false, read: false, update: false, delete: false }
            : { create: true, read: true, update: true, delete: m.id !== "reports" }
        ])
      )
    },
    {
      id: 3,
      name: "Leasing Agent",
      description: "Handle vacancies, applications, and tenant onboarding",
      isSystem: true,
      permissions: Object.fromEntries(
        modules.map(m => [
          m.id,
          ["vacancies", "tenants", "leases", "dashboard"].includes(m.id)
            ? { create: true, read: true, update: true, delete: false }
            : { create: false, read: true, update: false, delete: false }
        ])
      )
    },
    {
      id: 4,
      name: "Finance Officer",
      description: "Manage payments, banking, and financial reports",
      isSystem: true,
      permissions: Object.fromEntries(
        modules.map(m => [
          m.id,
          ["payments", "banking", "reports", "dashboard"].includes(m.id)
            ? { create: true, read: true, update: true, delete: false }
            : { create: false, read: true, update: false, delete: false }
        ])
      )
    },
    {
      id: 5,
      name: "Maintenance Coordinator",
      description: "Handle maintenance requests and vendor management",
      isSystem: true,
      permissions: Object.fromEntries(
        modules.map(m => [
          m.id,
          ["maintenance", "vendors", "dashboard"].includes(m.id)
            ? { create: true, read: true, update: true, delete: false }
            : { create: false, read: true, update: false, delete: false }
        ])
      )
    },
    {
      id: 6,
      name: "Viewer",
      description: "Read-only access to most system features",
      isSystem: true,
      permissions: Object.fromEntries(
        modules.map(m => [
          m.id,
          { create: false, read: true, update: false, delete: false }
        ])
      )
    }
  ]);

  // State for role creation/editing
  const [newModule, setNewModule] = useState<Module>({ id: "", name: "", description: "" });
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleFormOpen, setRoleFormOpen] = useState(false);
  const [newRole, setNewRole] = useState<Omit<Role, "id">>({
    name: "",
    description: "",
    isSystem: false,
    permissions: {},
  });

  // Initialize permissions for a new role
  const initializePermissions = () => {
    return Object.fromEntries(
      modules.map(m => [
        m.id,
        { create: false, read: false, update: false, delete: false }
      ])
    );
  };

  // Handle role creation
  const handleCreateRole = () => {
    setNewRole({
      name: "",
      description: "",
      isSystem: false,
      permissions: initializePermissions(),
    });
    setEditingRole(null);
    setRoleFormOpen(true);
  };

  // Handle role editing
  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setNewRole({
      name: role.name,
      description: role.description,
      isSystem: role.isSystem,
      permissions: { ...role.permissions },
    });
    setRoleFormOpen(true);
  };

  // Handle permission change
  const handlePermissionChange = (moduleId: string, action: keyof Permission, value: boolean) => {
    setNewRole(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [moduleId]: {
          ...prev.permissions[moduleId],
          [action]: value
        }
      }
    }));
  };

  // Handle read permission change (affects all other permissions)
  const handleReadPermissionChange = (moduleId: string, value: boolean) => {
    if (!value) {
      // If read is turned off, turn off all other permissions
      setNewRole(prev => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [moduleId]: {
            create: false,
            read: false,
            update: false,
            delete: false
          }
        }
      }));
    } else {
      // If read is turned on, just update read
      handlePermissionChange(moduleId, "read", value);
    }
  };

  // Save role
  const saveRole = () => {
    if (editingRole) {
      // Update existing role
      setRoles(prev => 
        prev.map(r => 
          r.id === editingRole.id 
            ? { ...editingRole, ...newRole } 
            : r
        )
      );
    } else {
      // Create new role
      const id = Math.max(0, ...roles.map(r => r.id)) + 1;
      setRoles(prev => [...prev, { id, ...newRole }]);
    }
    setRoleFormOpen(false);
  };

  // Delete role
  const deleteRole = (id: number) => {
    setRoles(prev => prev.filter(r => r.id !== id));
  };

  // Add new module
  const handleAddModule = () => {
    if (newModule.name && newModule.id) {
      setModules(prev => [...prev, newModule]);
      
      // Update all roles to include this new module
      setRoles(prev => prev.map(role => ({
        ...role,
        permissions: {
          ...role.permissions,
          [newModule.id]: { create: false, read: false, update: false, delete: false }
        }
      })));
      
      setNewModule({ id: "", name: "", description: "" });
      setIsAddingModule(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-6 w-6" />
            Role Management
          </CardTitle>
          <CardDescription>
            Define and manage roles with granular permission control
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="roles">
            <TabsList>
              <TabsTrigger value="roles">Roles</TabsTrigger>
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="audit">Audit Log</TabsTrigger>
            </TabsList>
            
            <TabsContent value="roles" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">System Roles</h3>
                <Button onClick={handleCreateRole}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Custom Role
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell>
                        {role.isSystem ? (
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            System
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                            Custom
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditRole(role)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {!role.isSystem && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteRole(role.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="modules" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Available Modules</h3>
                <Button onClick={() => setIsAddingModule(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Module
                </Button>
              </div>
              
              {isAddingModule && (
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle>Add New Module</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="moduleId">Module ID</Label>
                          <Input
                            id="moduleId"
                            value={newModule.id}
                            onChange={(e) => setNewModule(prev => ({ ...prev, id: e.target.value.toLowerCase().replace(/\s+/g, "-") }))}
                            placeholder="e.g. custom-reports"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="moduleName">Module Name</Label>
                          <Input
                            id="moduleName"
                            value={newModule.name}
                            onChange={(e) => setNewModule(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g. Custom Reports"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="moduleDescription">Description</Label>
                        <Input
                          id="moduleDescription"
                          value={newModule.description}
                          onChange={(e) => setNewModule(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="e.g. Custom reporting tools"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsAddingModule(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleAddModule}>
                          Add Module
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modules.map((module) => (
                    <TableRow key={module.id}>
                      <TableCell className="font-mono text-sm">{module.id}</TableCell>
                      <TableCell className="font-medium">{module.name}</TableCell>
                      <TableCell>{module.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="audit" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Role and Permission Audit Log</h3>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Export Log
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date/Time</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2023-06-15 14:23:45</TableCell>
                    <TableCell>admin@example.com</TableCell>
                    <TableCell>Created Role</TableCell>
                    <TableCell>Created "Regional Manager" role</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2023-06-14 09:12:30</TableCell>
                    <TableCell>admin@example.com</TableCell>
                    <TableCell>Modified Role</TableCell>
                    <TableCell>Updated permissions for "Leasing Agent"</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2023-06-10 16:45:22</TableCell>
                    <TableCell>admin@example.com</TableCell>
                    <TableCell>Assigned Role</TableCell>
                    <TableCell>Assigned "Property Manager" to user jane@example.com</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={roleFormOpen} onOpenChange={setRoleFormOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {editingRole ? `Edit Role: ${editingRole.name}` : "Create New Role"}
            </DialogTitle>
            <DialogDescription>
              Define role details and set permissions for each module
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roleName">Role Name</Label>
                  <Input
                    id="roleName"
                    value={newRole.name}
                    onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Regional Manager"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roleDescription">Description</Label>
                  <Input
                    id="roleDescription"
                    value={newRole.description}
                    onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="e.g. Manages properties in a specific region"
                  />
                </div>
              </div>
              
              <div className="pt-2">
                <Label>Module Permissions</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Set granular permissions for each module. Read access is required for other operations.
                </p>
                
                <ScrollArea className="h-[40vh] border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Module</TableHead>
                        <TableHead className="text-center">Read</TableHead>
                        <TableHead className="text-center">Create</TableHead>
                        <TableHead className="text-center">Update</TableHead>
                        <TableHead className="text-center">Delete</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {modules.map((module) => (
                        <TableRow key={module.id}>
                          <TableCell>
                            <div className="font-medium">{module.name}</div>
                            <div className="text-sm text-muted-foreground">{module.description}</div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={newRole.permissions[module.id]?.read || false}
                              onCheckedChange={(checked) => 
                                handleReadPermissionChange(module.id, checked === true)
                              }
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={newRole.permissions[module.id]?.create || false}
                              disabled={!newRole.permissions[module.id]?.read}
                              onCheckedChange={(checked) => 
                                handlePermissionChange(module.id, "create", checked === true)
                              }
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={newRole.permissions[module.id]?.update || false}
                              disabled={!newRole.permissions[module.id]?.read}
                              onCheckedChange={(checked) => 
                                handlePermissionChange(module.id, "update", checked === true)
                              }
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={newRole.permissions[module.id]?.delete || false}
                              disabled={!newRole.permissions[module.id]?.read}
                              onCheckedChange={(checked) => 
                                handlePermissionChange(module.id, "delete", checked === true)
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveRole}>
              <Save className="mr-2 h-4 w-4" />
              {editingRole ? "Update Role" : "Create Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RoleManagement;
