
import React from 'react';
import { usePermission } from '@/lib/rbac';
import { Shield } from 'lucide-react';

interface PermissionGuardProps {
  resource: string;
  action?: 'create' | 'read' | 'update' | 'delete';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * A component that conditionally renders its children based on user permissions
 */
const PermissionGuard: React.FC<PermissionGuardProps> = ({
  resource,
  action = 'read',
  children,
  fallback
}) => {
  const { can } = usePermission();
  const hasPermission = can(action, resource);

  if (!hasPermission) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
        <Shield className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Access Restricted</h2>
        <p className="text-muted-foreground max-w-md">
          You don't have permission to {action} {resource.replace(/-/g, ' ')}.
          Please contact your administrator if you need access.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default PermissionGuard;
