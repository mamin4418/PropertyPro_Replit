import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Building2, Home, Key } from "lucide-react";

// Extend login schema for frontend validation
const loginSchema = insertUserSchema.pick({ username: true, password: true });

// Extend register schema for frontend validation
const registerSchema = insertUserSchema.pick({ username: true, password: true }).extend({
  passwordConfirm: z.string().min(6, "Password must be at least 6 characters"),
}).refine(data => data.password === data.passwordConfirm, {
  message: "Passwords do not match",
  path: ["passwordConfirm"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function TenantAuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const { user, isLoading, loginMutation, registerMutation } = useAuth();

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      passwordConfirm: "",
    },
  });

  // Handle login form submission
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate({
      ...data,
      role: "tenant" // Add tenant role
    });
  };

  // Handle register form submission
  const onRegisterSubmit = (data: RegisterFormValues) => {
    const { passwordConfirm, ...registerData } = data;
    registerMutation.mutate({
      ...registerData,
      role: "tenant" // Add tenant role
    });
  };

  // Redirect if user is already logged in
  if (user) {
    // Redirect tenant to tenant dashboard
    if (user.role === "tenant") {
      return <Redirect to="/tenant-dashboard" />;
    }
    // If a manager logs in, redirect to admin dashboard
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                PM
              </div>
            </div>
            <h1 className="text-3xl font-bold">Tenant Portal</h1>
            <p className="text-muted-foreground mt-2">Access your tenant account</p>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Tenant Login</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your tenant portal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="johndoe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full mt-2" 
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? 
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...</> : 
                          'Sign In'
                        }
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button 
                    variant="link" 
                    onClick={() => setActiveTab("register")}
                  >
                    Don't have an account? Sign up
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Register Form */}
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create a Tenant Account</CardTitle>
                  <CardDescription>
                    Enter your details to create a new tenant account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="johndoe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="passwordConfirm"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full mt-2" 
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? 
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</> : 
                          'Create Account'
                        }
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button 
                    variant="link" 
                    onClick={() => setActiveTab("login")}
                  >
                    Already have an account? Sign in
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-4 text-center">
            <Button variant="link" onClick={() => window.location.href = "/auth"}>
              Property Manager? Login here
            </Button>
          </div>
        </div>
      </div>

      {/* Right side - Hero */}
      <div className="flex-1 bg-muted p-10 hidden md:flex flex-col justify-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-bold mb-6">Tenant Portal Features</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-primary/10 p-2 rounded-full">
                <Home className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Manage Your Lease</h3>
                <p className="text-muted-foreground">View your lease agreement, rent amount, and payment history.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-primary/10 p-2 rounded-full">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Submit Maintenance Requests</h3>
                <p className="text-muted-foreground">Easily report issues and track the status of your maintenance requests.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-primary/10 p-2 rounded-full">
                <Key className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Secure Access</h3>
                <p className="text-muted-foreground">Access your tenant information securely from anywhere, anytime.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-10 p-6 bg-background rounded-lg border">
            <blockquote className="italic text-muted-foreground">
              "The tenant portal makes it so easy to pay rent online and submit maintenance requests. 
              I love being able to access all my lease information in one place."
            </blockquote>
            <div className="mt-4 font-medium">— Happy Tenant</div>
          </div>
        </div>
      </div>
    </div>
  );
}