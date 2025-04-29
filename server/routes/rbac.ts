
import { Router } from 'express';
import { storage } from '../storage';

const router = Router();

// Role and permission related routes

// Get all roles
router.get('/roles', async (req, res) => {
  try {
    const roles = await storage.getAllRoles();
    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

// Get a specific role
router.get('/roles/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const role = await storage.getRole(id);
    
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    
    res.json(role);
  } catch (error) {
    console.error('Error fetching role:', error);
    res.status(500).json({ error: 'Failed to fetch role' });
  }
});

// Create a new role
router.post('/roles', async (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    
    if (!name || !permissions) {
      return res.status(400).json({ error: 'Name and permissions are required' });
    }
    
    const role = await storage.createRole({
      name,
      description: description || '',
      isSystem: false,
      permissions
    });
    
    res.status(201).json(role);
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ error: 'Failed to create role' });
  }
});

// Update a role
router.put('/roles/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, permissions } = req.body;
    
    const existingRole = await storage.getRole(id);
    
    if (!existingRole) {
      return res.status(404).json({ error: 'Role not found' });
    }
    
    // Don't allow modifying system roles
    if (existingRole.isSystem) {
      return res.status(403).json({ error: 'Cannot modify system roles' });
    }
    
    const updatedRole = await storage.updateRole(id, {
      name: name || existingRole.name,
      description: description !== undefined ? description : existingRole.description,
      permissions: permissions || existingRole.permissions
    });
    
    res.json(updatedRole);
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// Delete a role
router.delete('/roles/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const existingRole = await storage.getRole(id);
    
    if (!existingRole) {
      return res.status(404).json({ error: 'Role not found' });
    }
    
    // Don't allow deleting system roles
    if (existingRole.isSystem) {
      return res.status(403).json({ error: 'Cannot delete system roles' });
    }
    
    // Check if any users are using this role
    const usersWithRole = await storage.getUsersByRole(id);
    
    if (usersWithRole.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete role that is assigned to users',
        users: usersWithRole.map(u => u.username)
      });
    }
    
    await storage.deleteRole(id);
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ error: 'Failed to delete role' });
  }
});

// User-role assignment routes

// Get user's role
router.get('/users/:userId/role', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const role = user.roleId ? await storage.getRole(user.roleId) : null;
    
    res.json({ roleId: user.roleId, role });
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).json({ error: 'Failed to fetch user role' });
  }
});

// Assign role to user
router.put('/users/:userId/role', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { roleId } = req.body;
    
    if (roleId === undefined) {
      return res.status(400).json({ error: 'Role ID is required' });
    }
    
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (roleId !== null) {
      const role = await storage.getRole(roleId);
      
      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }
    }
    
    const updatedUser = await storage.updateUser(userId, { roleId });
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error assigning role to user:', error);
    res.status(500).json({ error: 'Failed to assign role to user' });
  }
});

// Permission checks for middleware

// Check if user has permission for a resource and action
router.post('/check-permission', async (req, res) => {
  try {
    const { userId, resource, action } = req.body;
    
    if (!userId || !resource || !action) {
      return res.status(400).json({ error: 'User ID, resource, and action are required' });
    }
    
    const user = await storage.getUser(userId);
    
    if (!user || !user.roleId) {
      return res.json({ hasPermission: false });
    }
    
    const role = await storage.getRole(user.roleId);
    
    if (!role) {
      return res.json({ hasPermission: false });
    }
    
    const hasPermission = role.permissions[resource]?.[action] === true;
    
    res.json({ hasPermission });
  } catch (error) {
    console.error('Error checking permission:', error);
    res.status(500).json({ error: 'Failed to check permission' });
  }
});

// Audit logs

// Get audit logs for roles and permissions
router.get('/audit-logs', async (req, res) => {
  try {
    const { userId, resource, action, startDate, endDate, limit, offset } = req.query;
    
    const logs = await storage.getRbacAuditLogs({
      userId: userId ? parseInt(userId as string) : undefined,
      resource: resource as string | undefined,
      action: action as string | undefined,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      limit: limit ? parseInt(limit as string) : 100,
      offset: offset ? parseInt(offset as string) : 0
    });
    
    res.json(logs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

export default router;
