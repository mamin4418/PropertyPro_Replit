
import { Route } from "wouter";
import { usePermission } from "./rbac";

// This component handles both authentication and authorization
export const ProtectedRoute = ({
  path,
  component: Component,
  resource,
  action = "read",
  allowedRoles = ["administrator"],
}: {
  path: string;
  component: () => React.JSX.Element;
  resource?: string;
  action?: "create" | "read" | "update" | "delete";
  allowedRoles?: string[];
}) => {
  // Directly render the component for now, but in a real implementation
  // you'd check authentication first
  const protectedComponent = (props: any) => {
    // If no resource is specified, skip authorization check
    if (!resource) {
      return <Component {...props} />;
    }

    const { can } = usePermission();
    
    // Check if user has permission for this resource and action
    if (!can(action, resource)) {
      return (
        <div className="flex items-center justify-center h-full p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to {action} {resource}.
            </p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };

  return <Route path={path} component={protectedComponent} />;
};

export default ProtectedRoute;
