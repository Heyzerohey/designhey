import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon, FilterIcon } from "lucide-react";
import ClientActivityTimeline from "@/polymet/components/client-activity-timeline";
import { clients } from "@/polymet/data/clients-data";

type ActivityType =
  | "document"
  | "message"
  | "event"
  | "signature"
  | "payment"
  | "status"
  | "all";

interface User {
  name: string;
  avatar: string;
}

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  user?: User;
}

interface ActivityListProps {
  activities: Activity[];
  className?: string;
}

export default function ActivityList({
  activities,
  className,
}: ActivityListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<ActivityType>("all");
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [timeframe, setTimeframe] = useState<string>("all");

  // Filter activities based on search query, type, client, and timeframe
  const filteredActivities = useMemo(() => {
    let filtered = activities;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (activity) =>
          activity.title.toLowerCase().includes(query) ||
          activity.description.toLowerCase().includes(query) ||
          (activity.user && activity.user.name.toLowerCase().includes(query))
      );
    }

    // Filter by activity type
    if (selectedType !== "all") {
      filtered = filtered.filter((activity) => activity.type === selectedType);
    }

    // Filter by client
    if (selectedClient !== "all") {
      filtered = filtered.filter(
        (activity) =>
          activity.user &&
          activity.user.name.toLowerCase() === selectedClient.toLowerCase()
      );
    }

    // Filter by timeframe
    if (timeframe !== "all") {
      const now = new Date();
      const cutoff = new Date();

      switch (timeframe) {
        case "today":
          cutoff.setHours(0, 0, 0, 0);
          break;
        case "week":
          cutoff.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoff.setMonth(now.getMonth() - 1);
          break;
      }

      filtered = filtered.filter(
        (activity) => new Date(activity.timestamp) >= cutoff
      );
    }

    return filtered;
  }, [activities, searchQuery, selectedType, selectedClient, timeframe]);

  // Get unique clients from activities
  const uniqueClients = useMemo(() => {
    const clientsSet = new Set<string>();
    activities.forEach((activity) => {
      if (activity.user) {
        clientsSet.add(activity.user.name);
      }
    });
    return Array.from(clientsSet);
  }, [activities]);

  return (
    <div className={className}>
      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          <Input
            placeholder="Search activities..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap gap-4">
          {/* Client filter */}
          <div className="flex items-center space-x-2">
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {uniqueClients.map((client) => (
                  <SelectItem key={client} value={client}>
                    {client}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Timeframe filter */}
          <div className="flex items-center space-x-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset filters */}
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setSelectedType("all");
              setSelectedClient("all");
              setTimeframe("all");
            }}
            className="ml-auto"
          >
            Reset Filters
          </Button>
        </div>

        {/* Activity type tabs */}
        <Tabs
          defaultValue="all"
          value={selectedType}
          onValueChange={(value) => setSelectedType(value as ActivityType)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-7 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="signature">Signatures</TabsTrigger>
            <TabsTrigger value="document">Documents</TabsTrigger>
            <TabsTrigger value="payment">Payments</TabsTrigger>
            <TabsTrigger value="message">Messages</TabsTrigger>
            <TabsTrigger value="event">Events</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Activity timeline */}
      {filteredActivities.length > 0 ? (
        <ClientActivityTimeline activities={filteredActivities} />
      ) : (
        <div className="text-center py-12 border rounded-lg bg-card">
          <FilterIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />

          <h3 className="text-lg font-medium mb-2">No activities found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
}
