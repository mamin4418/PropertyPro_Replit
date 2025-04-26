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
  // Temporarily allowing all access
  return <Route path={path} component={Component} />;
}