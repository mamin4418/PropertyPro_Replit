import { Building2, Users, Home, DollarSign } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import RentCollection from "@/components/dashboard/RentCollection";
import MaintenanceRequests from "@/components/dashboard/MaintenanceRequests";
import PropertiesOverview from "@/components/dashboard/PropertiesOverview";
import UpcomingTasks from "@/components/dashboard/UpcomingTasks";

const Dashboard = () => {
  // Mock data for demonstration
  const statsData = {
    properties: {
      value: 12,
      change: { value: 2, isIncrease: true }
    },
    tenants: {
      value: 48,
      change: { value: 5, isIncrease: true }
    },
    occupancy: {
      value: "92%",
      change: { value: "3%", isIncrease: true }
    },
    revenue: {
      value: "$38,500",
      change: { value: "8%", isIncrease: true }
    }
  };
  
  const rentCollection = {
    collected: 32725,
    total: 38500,
    recentPayments: [
      { tenantName: "John Doe", unitInfo: "Apt 101, Sunset Heights", amount: 1200, date: "Today" },
      { tenantName: "Sarah Johnson", unitInfo: "Unit 3B, Maple Gardens", amount: 950, date: "Yesterday" },
      { tenantName: "Mike Smith", unitInfo: "Unit 2A, Urban Lofts", amount: 1450, date: "2 days ago" }
    ]
  };
  
  const maintenanceData = {
    counts: {
      urgent: 3,
      normal: 7,
      completed: 12
    },
    recentRequests: [
      { title: "Water Leak in Bathroom", location: "Apt 205, Sunset Heights", priority: "urgent", timeAgo: "2 hours ago" },
      { title: "AC Not Working", location: "Unit 3B, Maple Gardens", priority: "normal", timeAgo: "1 day ago" },
      { title: "Light Fixture Replacement", location: "Unit 101, Urban Lofts", priority: "completed", timeAgo: "2 days ago" }
    ] as const
  };
  
  const propertiesData = [
    {
      id: 1,
      name: "Sunset Heights",
      address: "123 Main St, Anytown",
      units: { occupied: 24, total: 24 },
      occupancy: 100,
      revenue: 24000,
      status: "active"
    },
    {
      id: 2,
      name: "Maple Gardens",
      address: "456 Oak Dr, Anytown",
      units: { occupied: 12, total: 15 },
      occupancy: 80,
      revenue: 10800,
      status: "active"
    },
    {
      id: 3,
      name: "Urban Lofts",
      address: "789 Pine Ln, Anytown",
      units: { occupied: 8, total: 10 },
      occupancy: 80,
      revenue: 11600,
      status: "maintenance"
    }
  ] as const;
  
  const upcomingTasks = [
    { id: 1, title: "Lease Renewal - John Doe", location: "Apt 101, Sunset Heights", dueIn: "5 days", type: "lease" },
    { id: 2, title: "Resolve Water Leak Issue", location: "Apt 205, Sunset Heights", dueIn: "1 day", type: "maintenance" },
    { id: 3, title: "Payment Collection Reminder", location: "Multiple tenants", dueIn: "tomorrow", type: "payment" }
  ] as const;
  
  return (
    <div>
      {/* Dashboard Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your properties.</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Properties"
          value={statsData.properties.value}
          icon={<Building2 size={20} />}
          iconBgColor="bg-primary/10"
          iconColor="text-primary"
          change={statsData.properties.change}
        />
        
        <StatsCard
          title="Tenants"
          value={statsData.tenants.value}
          icon={<Users size={20} />}
          iconBgColor="bg-secondary/10"
          iconColor="text-secondary-foreground"
          change={statsData.tenants.change}
        />
        
        <StatsCard
          title="Occupancy"
          value={statsData.occupancy.value}
          icon={<Home size={20} />}
          iconBgColor="bg-accent/10"
          iconColor="text-accent-foreground"
          change={statsData.occupancy.change}
        />
        
        <StatsCard
          title="Revenue"
          value={statsData.revenue.value}
          icon={<DollarSign size={20} />}
          iconBgColor="bg-green-100"
          iconColor="text-green-500"
          change={statsData.revenue.change}
        />
      </div>
      
      {/* Rent Collection & Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <RentCollection 
          collected={rentCollection.collected}
          total={rentCollection.total}
          recentPayments={rentCollection.recentPayments}
        />
        
        <MaintenanceRequests
          counts={maintenanceData.counts}
          recentRequests={maintenanceData.recentRequests}
        />
      </div>
      
      {/* Properties Overview */}
      <PropertiesOverview properties={propertiesData} />
      
      {/* Upcoming Tasks */}
      <UpcomingTasks tasks={upcomingTasks} />
    </div>
  );
};

export default Dashboard;
