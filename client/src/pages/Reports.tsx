import { BarChart } from "lucide-react";

const Reports = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[500px]">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <BarChart className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Reports & Analytics</h2>
      <p className="text-muted-foreground mb-4 text-center max-w-md">
        This page will provide financial reports, occupancy analytics, and property performance metrics.
      </p>
      <p className="text-sm text-muted-foreground">Coming soon...</p>
    </div>
  );
};

export default Reports;
