import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[500px]">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <SettingsIcon className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-2">System Settings</h2>
      <p className="text-muted-foreground mb-4 text-center max-w-md">
        This page will allow you to configure user accounts, notification preferences, and system settings.
      </p>
      <p className="text-sm text-muted-foreground">Coming soon...</p>
    </div>
  );
};

export default Settings;
