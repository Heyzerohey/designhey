import { cn } from "@/lib/utils";
import {
  FileIcon,
  MessageSquareIcon,
  CalendarIcon,
  PenIcon,
  CreditCardIcon,
  CheckCircleIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ActivityUser {
  name: string;
  avatar?: string;
}

interface Activity {
  id: string;
  type: "document" | "message" | "event" | "signature" | "payment" | "status";
  title: string;
  description: string;
  timestamp: string;
  user?: ActivityUser;
}

interface ClientActivityTimelineProps {
  activities: Activity[];
  className?: string;
}

export default function ClientActivityTimeline({
  activities,
  className,
}: ClientActivityTimelineProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    } else {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
    }
  };

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "document":
        return (
          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <FileIcon className="h-4 w-4" />
          </div>
        );

      case "message":
        return (
          <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400">
            <MessageSquareIcon className="h-4 w-4" />
          </div>
        );

      case "event":
        return (
          <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <CalendarIcon className="h-4 w-4" />
          </div>
        );

      case "signature":
        return (
          <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-400">
            <PenIcon className="h-4 w-4" />
          </div>
        );

      case "payment":
        return (
          <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CreditCardIcon className="h-4 w-4" />
          </div>
        );

      case "status":
        return (
          <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400">
            <CheckCircleIcon className="h-4 w-4" />
          </div>
        );

      default:
        return (
          <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400">
            <FileIcon className="h-4 w-4" />
          </div>
        );
    }
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No recent activity
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {activities.map((activity, index) => (
        <div key={activity.id} className="relative">
          {index !== activities.length - 1 && (
            <div className="absolute left-4 top-8 bottom-0 w-px bg-border -translate-x-1/2" />
          )}
          <div className="flex gap-4">
            <div className="flex-shrink-0 mt-1">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-sm">{activity.title}</h4>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {activity.description}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatTimestamp(activity.timestamp)}
                </div>
              </div>
              {activity.user && (
                <div className="flex items-center mt-2">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage
                      src={activity.user.avatar}
                      alt={activity.user.name}
                    />

                    <AvatarFallback className="text-[10px]">
                      {activity.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs">{activity.user.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
