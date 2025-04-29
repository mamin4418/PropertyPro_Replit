
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Permission {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: Record<string, Permission>;
}

export interface User {
  id: number;
  username: string;
  roleId: number;
}

interface RBACState {
  roles: Role[];
  userRole: number | null;
  // Methods
  can: (action: keyof Permission, resource: string) => boolean;
  hasAccess: (resource: string) => boolean;
  setUserRole: (roleId: number | null) => void;
  addRole: (role: Omit<Role, 'id'>) => void;
  updateRole: (id: number, role: Partial<Role>) => void;
  deleteRole: (id: number) => void;
}

// Create a store with persisted data
export const useRBAC = create<RBACState>()(
  persist(
    (set, get) => ({
      roles: [
        // Default roles should be synchronized with those in RoleManagement component
        {
          id: 1,
          name: "Administrator",
          description: "Full access to all system features",
          isSystem: true,
          permissions: {
            "dashboard": { create: true, read: true, update: true, delete: true },
            "properties": { create: true, read: true, update: true, delete: true },
            "tenants": { create: true, read: true, update: true, delete: true },
            "leases": { create: true, read: true, update: true, delete: true },
            "payments": { create: true, read: true, update: true, delete: true },
            "maintenance": { create: true, read: true, update: true, delete: true },
            "vacancies": { create: true, read: true, update: true, delete: true },
            "vendors": { create: true, read: true, update: true, delete: true },
            "reports": { create: true, read: true, update: true, delete: true },
            "documents": { create: true, read: true, update: true, delete: true },
            "banking": { create: true, read: true, update: true, delete: true },
            "settings": { create: true, read: true, update: true, delete: true },
            "users": { create: true, read: true, update: true, delete: true },
            "roles": { create: true, read: true, update: true, delete: true },
          }
        }
      ],
      userRole: 1, // Default to administrator

      // Check if the user can perform an action on a resource
      can: (action, resource) => {
        const { roles, userRole } = get();
        
        if (!userRole) return false;
        
        const role = roles.find(r => r.id === userRole);
        if (!role) return false;
        
        const permission = role.permissions[resource];
        return permission ? permission[action] : false;
      },

      // Check if the user has any access to a resource
      hasAccess: (resource) => {
        return get().can('read', resource);
      },

      // Set the user's role
      setUserRole: (roleId) => {
        set({ userRole: roleId });
      },

      // Add a new role
      addRole: (role) => {
        const roles = get().roles;
        const newId = Math.max(0, ...roles.map(r => r.id)) + 1;
        
        set({ 
          roles: [...roles, { id: newId, ...role }] 
        });
        
        return newId;
      },

      // Update an existing role
      updateRole: (id, roleUpdates) => {
        set(state => ({
          roles: state.roles.map(role => 
            role.id === id ? { ...role, ...roleUpdates } : role
          )
        }));
      },

      // Delete a role
      deleteRole: (id) => {
        set(state => ({
          roles: state.roles.filter(role => role.id !== id)
        }));
      }
    }),
    {
      name: 'rbac-storage', // Name for the persisted data
    }
  )
);

// Middleware for component-level RBAC
export const withPermission = (Component: React.ComponentType, resource: string, requiredAction: keyof Permission = 'read') => {
  return (props: any) => {
    const { can } = useRBAC();
    
    if (!can(requiredAction, resource)) {
      return (
        <div className="flex items-center justify-center h-full p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to {requiredAction} {resource}.
            </p>
          </div>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
};

// React Hook for component-level permission checks
export const usePermission = () => {
  const { can, hasAccess } = useRBAC();
  
  return {
    can,
    hasAccess,
    // Helper functions for common operations
    canView: (resource: string) => can('read', resource),
    canCreate: (resource: string) => can('create', resource),
    canEdit: (resource: string) => can('update', resource),
    canDelete: (resource: string) => can('delete', resource),
  };
};
