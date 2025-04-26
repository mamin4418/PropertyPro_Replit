
import { useEffect } from "react";
import { Route, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType<any>;
}

export const ProtectedRoute = ({ path, component: Component }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/auth");
    }
  }, [user, isLoading, setLocation]);

  return <Route path={path} component={Component} />;
};
