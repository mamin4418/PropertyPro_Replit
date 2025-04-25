import { Progress } from "@/components/ui/progress";
import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Payment {
  tenantName: string;
  unitInfo: string;
  amount: number;
  date: string;
}

interface RentCollectionProps {
  collected: number;
  total: number;
  recentPayments: Payment[];
}

const RentCollection = ({ collected, total, recentPayments }: RentCollectionProps) => {
  const percentage = Math.round((collected / total) * 100);
  
  return (
    <div className="card p-6 rounded-lg shadow-sm border border-custom">
      <h3 className="text-xl font-semibold mb-4">Rent Collection</h3>
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block text-primary">
              {percentage}% Collected
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-primary">
              ${collected.toLocaleString()} / ${total.toLocaleString()}
            </span>
          </div>
        </div>
        <Progress value={percentage} className="h-2 bg-primary/20" />
      </div>
      
      <div className="mt-4">
        <h4 className="font-semibold mb-2">Recent Payments</h4>
        <div className="space-y-3">
          {recentPayments.map((payment, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-secondary text-xs">
                    <User size={14} />
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="font-medium">{payment.tenantName}</p>
                  <p className="text-xs text-muted-foreground">{payment.unitInfo}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">${payment.amount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{payment.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RentCollection;
