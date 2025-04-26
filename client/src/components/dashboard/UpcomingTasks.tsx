import { CalendarCheck, AlertCircle, BanknoteIcon } from "lucide-react";
import { Link } from "wouter";

interface Task {
  id: string | number;
  title: string;
  location: string;
  dueIn: string;
  type: "lease" | "maintenance" | "payment";
}

interface UpcomingTasksProps {
  tasks: Task[];
}

const UpcomingTasks = ({ tasks }: UpcomingTasksProps) => {
  const typeIcons = {
    lease: {
      icon: <CalendarCheck size={20} />,
      bg: "bg-primary/10",
      color: "text-primary",
    },
    maintenance: {
      icon: <AlertCircle size={20} />,
      bg: "bg-red-100",
      color: "text-red-500",
    },
    payment: {
      icon: <BanknoteIcon size={20} />,
      bg: "bg-yellow-100",
      color: "text-yellow-500",
    },
  };
  
  return (
    <div className="card p-6 rounded-lg shadow-sm border border-custom">
      <h3 className="text-xl font-semibold mb-4">Upcoming Tasks</h3>
      <div className="space-y-4">
        {tasks.map((task) => {
          // Determine the link based on task type
          let linkPath = '/';
          switch (task.type) {
            case 'lease':
              linkPath = '/leases';
              break;
            case 'maintenance':
              linkPath = '/maintenance';
              break;
            case 'payment':
              linkPath = '/payments';
              break;
          }
          
          return (
            <Link key={task.id} href={linkPath}>
              <div className="flex items-center p-3 bg-secondary rounded-md hover:bg-secondary/80 cursor-pointer transition-colors">
                <div className={`w-10 h-10 rounded-full ${typeIcons[task.type].bg} ${typeIcons[task.type].color} flex items-center justify-center`}>
                  {typeIcons[task.type].icon}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">Due in {task.dueIn}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{task.location}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingTasks;
