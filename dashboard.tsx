import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FileIcon,
  UsersIcon,
  DollarSignIcon,
  FileTextIcon,
} from "lucide-react";
import DashboardStatsCard from "@/polymet/components/dashboard-stats-card";
import RecentCasesTable from "@/polymet/components/recent-cases-table";
import UpcomingEventsCard from "@/polymet/components/upcoming-events-card";
import DocumentListCard from "@/polymet/components/document-list-card";
import ClientActivityTimeline from "@/polymet/components/client-activity-timeline";
import DashboardPackages from "@/polymet/components/dashboard-packages";
import {
  RECENT_CASES,
  UPCOMING_EVENTS,
  RECENT_DOCUMENTS,
  RECENT_ACTIVITIES,
} from "@/polymet/data/dashboard-data";
import { RECENT_PACKAGES } from "@/polymet/data/dashboard-packages-data";

export default function DashboardPage() {
  // Properly formatted dashboard stats data
  const dashboardStats = [
    {
      title: "Active Clients",
      value: "25",
      change: 15,
      data: [
        { value: 10 },
        { value: 12 },
        { value: 15 },
        { value: 18 },
        { value: 15 },
        { value: 20 },
        { value: 25 },
      ],

      icon: <UsersIcon className="h-4 w-4 text-orange-500" />,
    },
    {
      title: "Pending Cases",
      value: "18",
      change: 8,
      data: [
        { value: 8 },
        { value: 10 },
        { value: 12 },
        { value: 15 },
        { value: 14 },
        { value: 16 },
        { value: 18 },
      ],

      icon: <FileIcon className="h-4 w-4 text-blue-500" />,
    },
    {
      title: "Monthly Revenue",
      value: "$9,500",
      change: 22,
      data: [
        { value: 5000 },
        { value: 6200 },
        { value: 5800 },
        { value: 7500 },
        { value: 8200 },
        { value: 7800 },
        { value: 9500 },
      ],

      icon: <DollarSignIcon className="h-4 w-4 text-green-500" />,
    },
    {
      title: "Documents Processed",
      value: "45",
      change: -5,
      data: [
        { value: 25 },
        { value: 30 },
        { value: 28 },
        { value: 35 },
        { value: 32 },
        { value: 40 },
        { value: 45 },
      ],

      icon: <FileTextIcon className="h-4 w-4 text-purple-500" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your practice.
          </p>
        </div>
        <Link to="/client-engagement">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            New Engagement
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, index) => (
          <DashboardStatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            data={stat.data}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Packages Section */}
      <DashboardPackages packages={RECENT_PACKAGES} />

      {/* Recent Cases and Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentCasesTable cases={RECENT_CASES} />
        </div>
        <div>
          <UpcomingEventsCard events={UPCOMING_EVENTS} />
        </div>
      </div>

      {/* Documents and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DocumentListCard documents={RECENT_DOCUMENTS} />

        <ClientActivityTimeline activities={RECENT_ACTIVITIES} />
      </div>
    </div>
  );
}
