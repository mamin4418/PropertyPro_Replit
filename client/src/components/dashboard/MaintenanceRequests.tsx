import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface MaintenanceCount {
  urgent: number;
  normal: number;
  completed: number;
}

interface MaintenanceRequest {
  title: string;
  location: string;
  priority: "urgent" | "normal" | "completed";
  timeAgo: string;
}

interface MaintenanceRequestsProps {
  counts: MaintenanceCount;
  recentRequests: MaintenanceRequest[];
}

const MaintenanceRequests = ({ counts, recentRequests }: MaintenanceRequestsProps) => {
  const priorityStyles = {
    urgent: {
      bg: "bg-red-50",
      border: "border-red-100",
      badge: "bg-red-100 text-red-800",
    },
    normal: {
      bg: "bg-yellow-50",
      border: "border-yellow-100",
      badge: "bg-yellow-100 text-yellow-800",
    },
    completed: {
      bg: "bg-green-50",
      border: "border-green-100",
      badge: "bg-green-100 text-green-800",
    },
  };
  
  return (
    <div className="card p-6 rounded-lg shadow-sm border border-custom">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Maintenance Requests</h3>
        <Link href="/maintenance">
          <Button variant="link" className="text-primary h-auto p-0">View All</Button>
        </Link>
      </div>
      <div className="flex mb-4">
        <div className="flex-1 text-center p-2 bg-red-100 text-red-800 rounded-l-md">
          <p className="text-xl font-bold">{counts.urgent}</p>
          <p className="text-xs font-medium">Urgent</p>
        </div>
        <div className="flex-1 text-center p-2 bg-yellow-100 text-yellow-800">
          <p className="text-xl font-bold">{counts.normal}</p>
          <p className="text-xs font-medium">Normal</p>
        </div>
        <div className="flex-1 text-center p-2 bg-green-100 text-green-800 rounded-r-md">
          <p className="text-xl font-bold">{counts.completed}</p>
          <p className="text-xs font-medium">Completed</p>
        </div>
      </div>
      
      <div className="mt-4">
        <h4 className="font-semibold mb-2">Recent Requests</h4>
        <div className="space-y-3">
          {recentRequests.map((request, index) => (
            <Link href="/maintenance" key={index}>
              <div 
                className={`p-3 ${priorityStyles[request.priority].bg} border ${priorityStyles[request.priority].border} rounded-md flex items-center justify-between hover:shadow-sm cursor-pointer transition-shadow`}
              >
                <div>
                  <p className="font-medium">{request.title}</p>
                  <p className="text-xs text-muted-foreground">{request.location}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 ${priorityStyles[request.priority].badge} text-xs rounded-full`}>
                    {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">{request.timeAgo}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceRequests;
