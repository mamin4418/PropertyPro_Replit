import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor: string;
  iconColor: string;
  change?: {
    value: string | number;
    isIncrease: boolean;
  };
}

const StatsCard = ({ title, value, icon, iconBgColor, iconColor, change }: StatsCardProps) => {
  return (
    <div className="card p-6 rounded-lg shadow-sm border border-custom">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <div className={`w-10 h-10 rounded-full ${iconBgColor} flex items-center justify-center ${iconColor}`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold">{value}</p>
      {change && (
        <p className="text-sm text-muted-foreground mt-2">
          <span className={change.isIncrease ? "text-green-500" : "text-red-500"}>
            {change.isIncrease ? "↑" : "↓"} {change.value}
          </span> from last month
        </p>
      )}
    </div>
  );
};

export default StatsCard;
