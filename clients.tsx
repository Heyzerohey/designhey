import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PlusIcon,
  SearchIcon,
  MoreVerticalIcon,
  ArrowRightIcon,
  EyeIcon,
} from "lucide-react";
import { ALL_CLIENTS } from "@/polymet/data/clients-data";

const getStatusBadge = (status: string) => {
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

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = ALL_CLIENTS.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Manage Your Clients
          </h1>
          <p className="text-muted-foreground">Track engagements easily</p>
        </div>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
          asChild
        >
          <Link to="/package/create">
            <PlusIcon className="h-4 w-4" />

            <span>Add New Client</span>
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          <Input
            placeholder="Search clients..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Engagement</TableHead>
              <TableHead>Packages</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No clients found
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client, index) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{getStatusBadge(client.status)}</TableCell>
                  <TableCell>
                    {new Date(client.lastEngagement).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{client.packageCount}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {client.packages && client.packages.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-orange-500 text-orange-500 hover:bg-orange-50 h-8"
                          asChild
                        >
                          <Link to={`/packages/${client.packages[0].id}`}>
                            <EyeIcon className="h-4 w-4 mr-1" />
                            View Engagement
                          </Link>
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        className="border-orange-500 text-orange-500 hover:bg-orange-50 h-8 w-8 p-0"
                        asChild
                      >
                        <Link to={`/clients/${client.id}`}>
                          <ArrowRightIcon className="h-4 w-4" />

                          <span className="sr-only">View client</span>
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
