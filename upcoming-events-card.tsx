import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: "court" | "consultation" | "deadline" | "meeting";
  participants?: string[];
}

interface UpcomingEventsCardProps {
  events: Event[];
  className?: string;
}

export default function UpcomingEventsCard({
  events,
  className,
}: UpcomingEventsCardProps) {
  const getEventTypeColor = (type: Event["type"]) => {
    switch (type) {
      case "court":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "consultation":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "deadline":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "meeting":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    return (
      today.getDate() === eventDate.getDate() &&
      today.getMonth() === eventDate.getMonth() &&
      today.getFullYear() === eventDate.getFullYear()
    );
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No upcoming events</p>
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="rounded-lg border p-3 hover:bg-accent/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{event.title}</h3>
                  <Badge
                    variant="secondary"
                    className={getEventTypeColor(event.type)}
                  >
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <CalendarIcon className="h-4 w-4 mr-2" />

                    <span>
                      {formatDate(event.date)}{" "}
                      {isToday(event.date) && (
                        <Badge variant="outline" className="ml-1">
                          Today
                        </Badge>
                      )}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{event.time}</span>
                  </div>

                  <div className="flex items-center text-muted-foreground">
                    <MapPinIcon className="h-4 w-4 mr-2" />

                    <span>{event.location}</span>
                  </div>

                  {event.participants && event.participants.length > 0 && (
                    <div className="flex items-center text-muted-foreground">
                      <UsersIcon className="h-4 w-4 mr-2" />

                      <div className="flex items-center">
                        <div className="flex -space-x-2 mr-2">
                          {event.participants
                            .slice(0, 3)
                            .map((participant, i) => (
                              <Avatar
                                key={`${event.id}-participant-${i}`}
                                className="h-6 w-6 border-2 border-background"
                              >
                                <AvatarFallback className="text-[10px]">
                                  {participant
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                        </div>
                        <span>
                          {event.participants.length > 3
                            ? `${event.participants.slice(0, 3).join(", ")} +${
                                event.participants.length - 3
                              } more`
                            : event.participants.join(", ")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            className="text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
          >
            View All Events
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
