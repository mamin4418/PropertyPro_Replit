
import { Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
  allowedRoles = ["manager"],
}: {
  path: string;
  component: () => React.JSX.Element;
  allowedRoles?: string[];
}) {
  // Allow all access by directly rendering the component without any protection
  return <Route path={path} component={Component} />;
}

export default ProtectedRoute;
