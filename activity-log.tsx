import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ActivityList from "@/polymet/components/activity-list";
import { RECENT_ACTIVITIES } from "@/polymet/data/dashboard-data";
import { ALL_CLIENTS } from "@/polymet/data/clients-data";
import { Activity, FileText, Users } from "lucide-react";

export default function ActivityLogPage() {
  const [viewMode, setViewMode] = useState<"all" | "unread">("all");

  // Combine activities from all sources
  const allActivities = [...RECENT_ACTIVITIES];

  // Add client activities
  ALL_CLIENTS.forEach((client) => {
    if (client.packages) {
      client.packages.forEach((pkg) => {
        // Add package creation activity
        allActivities.push({
          id: `pkg-create-${pkg.id}`,
          type: "document" as const,
          title: `Package Created: ${pkg.name}`,
          description: `A new package was created for ${client.name}`,
          timestamp: pkg.createdDate,
          user: {
            name: client.name,
            avatar: `https://github.com/polymet-ai.png`,
          },
        });

        // Add status change activity if completed
        if (pkg.status === "completed") {
          allActivities.push({
            id: `pkg-complete-${pkg.id}`,
            type: "status" as const,
            title: `Package Completed: ${pkg.name}`,
            description: `${client.name}'s package was marked as completed`,
            timestamp: new Date(
              new Date(pkg.createdDate).getTime() + 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
          });
        }
      });
    }
  });

  // Sort activities by timestamp (newest first)
  allActivities.sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  // Filter activities based on view mode
  const displayedActivities =
    viewMode === "all" ? allActivities : allActivities.slice(0, 5); // Simulating "unread" activities

  // Activity stats
  const stats = {
    total: allActivities.length,
    today: allActivities.filter((activity) => {
      const activityDate = new Date(activity.timestamp);
      const today = new Date();
      return activityDate.toDateString() === today.toDateString();
    }).length,
    unread: 5, // Simulated unread count
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Activity Log
          </h1>
          <p className="text-muted-foreground">View All Client Interactions</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "all" ? "default" : "outline"}
            onClick={() => setViewMode("all")}
            className={
              viewMode === "all"
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : ""
            }
          >
            All Activities
          </Button>
          <Button
            variant={viewMode === "unread" ? "default" : "outline"}
            onClick={() => setViewMode("unread")}
            className={
              viewMode === "unread"
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : ""
            }
          >
            Unread ({stats.unread})
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Activities
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Across all clients and packages
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Activities
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.today}</div>
            <p className="text-xs text-muted-foreground">
              New activities in the last 24 hours
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Clients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ALL_CLIENTS.length}</div>
            <p className="text-xs text-muted-foreground">
              Clients with recent activity
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>
            Track all client interactions in one place
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityList activities={displayedActivities} />
        </CardContent>
      </Card>
    </div>
  );
}
