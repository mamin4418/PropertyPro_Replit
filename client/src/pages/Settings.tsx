
import { useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeContext } from "@/context/ThemeProvider";
import { useToast } from "@/hooks/use-toast";
import { Users, Building2, Mail, Globe, Shield, Bell, Palette } from "lucide-react";

export default function Settings() {
  const { currentTheme, changeTheme } = useContext(ThemeContext);
  const { toast } = useToast();
  
  const handleThemeChange = (themeName: string) => {
    changeTheme(themeName as any);
    toast({
      title: "Theme Updated",
      description: `Application theme has been changed to ${themeName.replace('-theme', '')}.`,
    });
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-2">Settings</h1>
      <p className="text-muted-foreground mb-6">Manage your account and system preferences</p>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6 flex flex-wrap">
          <TabsTrigger value="profile" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center">
            <Building2 className="mr-2 h-4 w-4" />
            Company
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center">
            <Palette className="mr-2 h-4 w-4" />
            Theme
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    First Name
                  </label>
                  <Input placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Last Name
                  </label>
                  <Input placeholder="Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input placeholder="john.doe@example.com" type="email" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone
                  </label>
                  <Input placeholder="(555) 123-4567" type="tel" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Settings */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Configure company and application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Company Name
                  </label>
                  <Input placeholder="Acme Property Management" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Company Phone
                  </label>
                  <Input placeholder="(555) 987-6543" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Business Email
                  </label>
                  <Input placeholder="info@acmeproperties.com" type="email" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Website
                  </label>
                  <Input placeholder="https://acmeproperties.com" type="url" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for important updates
                    </p>
                  </div>
                  <div className="flex items-center h-8">
                    <input
                      type="checkbox"
                      id="email-notifications"
                      className="mr-2 h-4 w-4"
                      defaultChecked
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Payment Reminders</h3>
                    <p className="text-sm text-muted-foreground">
                      Get notified about upcoming and late payments
                    </p>
                  </div>
                  <div className="flex items-center h-8">
                    <input
                      type="checkbox"
                      id="payment-reminders"
                      className="mr-2 h-4 w-4"
                      defaultChecked
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Maintenance Alerts</h3>
                    <p className="text-sm text-muted-foreground">
                      Notifications for new and updated maintenance requests
                    </p>
                  </div>
                  <div className="flex items-center h-8">
                    <input
                      type="checkbox"
                      id="maintenance-alerts"
                      className="mr-2 h-4 w-4"
                      defaultChecked
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Lease Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Get notified about lease renewals and expirations
                    </p>
                  </div>
                  <div className="flex items-center h-8">
                    <input
                      type="checkbox"
                      id="lease-notifications"
                      className="mr-2 h-4 w-4"
                      defaultChecked
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theme Settings */}
        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>
                Customize the application appearance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Theme Selection</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose from our curated themes
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    <button
                      onClick={() => handleThemeChange("default")}
                      className={`h-16 rounded-md border-2 ${
                        currentTheme === "default" ? "border-primary" : "border-muted"
                      } bg-background transition-all`}
                      aria-label="Default Theme"
                    />
                    <button
                      onClick={() => handleThemeChange("dark-theme")}
                      className={`h-16 rounded-md border-2 ${
                        currentTheme === "dark-theme" ? "border-primary" : "border-muted"
                      } bg-neutral-900 transition-all`}
                      aria-label="Dark Theme"
                    />
                    <button
                      onClick={() => handleThemeChange("forest-theme")}
                      className={`h-16 rounded-md border-2 ${
                        currentTheme === "forest-theme" ? "border-primary" : "border-muted"
                      } bg-green-50 transition-all`}
                      aria-label="Forest Theme"
                    />
                    <button
                      onClick={() => handleThemeChange("ocean-theme")}
                      className={`h-16 rounded-md border-2 ${
                        currentTheme === "ocean-theme" ? "border-primary" : "border-muted"
                      } bg-blue-50 transition-all`}
                      aria-label="Ocean Theme"
                    />
                    <button
                      onClick={() => handleThemeChange("sunset-theme")}
                      className={`h-16 rounded-md border-2 ${
                        currentTheme === "sunset-theme" ? "border-primary" : "border-muted"
                      } bg-amber-50 transition-all`}
                      aria-label="Sunset Theme"
                    />
                    <button
                      onClick={() => handleThemeChange("lavender-theme")}
                      className={`h-16 rounded-md border-2 ${
                        currentTheme === "lavender-theme" ? "border-primary" : "border-muted"
                      } bg-purple-50 transition-all`}
                      aria-label="Lavender Theme"
                    />
                    <button
                      onClick={() => handleThemeChange("honey-theme")}
                      className={`h-16 rounded-md border-2 ${
                        currentTheme === "honey-theme" ? "border-primary" : "border-muted"
                      } bg-yellow-50 transition-all`}
                      aria-label="Honey Theme"
                    />
                    <button
                      onClick={() => handleThemeChange("sky-theme")}
                      className={`h-16 rounded-md border-2 ${
                        currentTheme === "sky-theme" ? "border-primary" : "border-muted"
                      } bg-sky-100 transition-all`}
                      aria-label="Sky Theme"
                    />
                    <button
                      onClick={() => handleThemeChange("mint-theme")}
                      className={`h-16 rounded-md border-2 ${
                        currentTheme === "mint-theme" ? "border-primary" : "border-muted"
                      } bg-emerald-50 transition-all`}
                      aria-label="Mint Theme"
                    />
                    <button
                      onClick={() => handleThemeChange("atom-theme")}
                      className={`h-16 rounded-md border-2 ${
                        currentTheme === "atom-theme" ? "border-primary" : "border-muted"
                      } bg-neutral-800 transition-all`}
                      aria-label="Atom Theme"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Current Password
                    </label>
                    <Input type="password" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      New Password
                    </label>
                    <Input type="password" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Confirm New Password
                    </label>
                    <Input type="password" />
                  </div>
                </div>
                <div className="mt-4">
                  <Button>Update Password</Button>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-6">
                <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add an extra layer of security to your account
                </p>
                <Button variant="outline">
                  Enable Two-Factor Authentication
                </Button>
              </div>
              
              <div className="border-t pt-4 mt-6">
                <h3 className="font-medium mb-2">Login Sessions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage your active sessions
                </p>
                <div className="rounded-md border p-4 mb-2">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-muted-foreground">
                        Chrome on Windows • IP: 192.168.1.1
                      </p>
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      Active Now
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full sm:w-auto">
                  Log Out All Other Sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
