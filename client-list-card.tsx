import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  UserIcon,
  MailIcon,
  MoreVerticalIcon,
  ArrowRightIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ClientStatus = "completed" | "awaiting" | "signed";

interface Client {
  id: string;
  name: string;
  email: string;
  status: ClientStatus;
  lastEngagement?: string;
  packageCount?: number;
}

interface ClientListCardProps {
  clients: Client[];
  className?: string;
  showViewAll?: boolean;
}

const getStatusBadge = (status: ClientStatus) => {
  switch (status) {
    case "completed":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
        >
          Completed
        </Badge>
      );

    case "awaiting":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
        >
          Awaiting
        </Badge>
      );

    case "signed":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
        >
          Signed
        </Badge>
      );

    default:
      return (
        <Badge variant="outline">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
  }
};

export default function ClientListCard({
  clients,
  className,
  showViewAll = true,
}: ClientListCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm",
        className
      )}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Recent Clients</h3>
          {showViewAll && (
            <Button
              variant="ghost"
              size="sm"
              className="text-sm"
              as={Link}
              to="/clients"
            >
              View all
            </Button>
          )}
        </div>
        <div className="space-y-4">
          {clients.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No clients found
            </p>
          ) : (
            clients.map((client, index) => (
              <div
                key={client.id}
                className="flex items-center justify-between p-3 rounded-md bg-muted/40 hover:bg-muted transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <UserIcon className="h-4 w-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{client.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <MailIcon className="h-3 w-3 text-muted-foreground" />

                      <span className="text-xs text-muted-foreground">
                        {client.email}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(client.status)}
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-orange-500 text-orange-500 hover:bg-orange-50"
                    as={Link}
                    to={`/clients/${client.id}`}
                  >
                    <span className="mr-1">View</span>
                    <ArrowRightIcon className="h-3 w-3" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVerticalIcon className="h-4 w-4" />

                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Link
                          to={`/clients/${client.id}`}
                          className="flex w-full"
                        >
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link
                          to={`/package/create?client=${client.id}`}
                          className="flex w-full"
                        >
                          Create Package
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Send Email</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
