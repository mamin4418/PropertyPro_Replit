import { DollarSign } from "lucide-react";

const Payments = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[500px]">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <DollarSign className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Payment Management</h2>
      <p className="text-muted-foreground mb-4 text-center max-w-md">
        This page will allow you to track rent payments, manage recurring billing, and generate payment reports.
      </p>
      <p className="text-sm text-muted-foreground">Coming soon...</p>
    </div>
  );
};

export default Payments;
