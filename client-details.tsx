import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeftIcon,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  FileTextIcon,
} from "lucide-react";
import { ALL_CLIENTS } from "@/polymet/data/clients-data";
import PackageListCard from "@/polymet/components/package-list-card";
import ClientActivityTimeline from "@/polymet/components/client-activity-timeline";
import EngagementActionsCard from "@/polymet/components/engagement-actions-card";

export default function ClientDetailsPage() {
  const { id = "" } = useParams();
  const [notes, setNotes] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Find the client by ID
  const client = ALL_CLIENTS.find((client) => client.id === id);

  // If client not found, show a message
  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h1 className="text-2xl font-semibold mb-2">Client Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The client you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/clients">Back to Clients</Link>
        </Button>
      </div>
    );
  }

  // Initialize notes from client data if available
  useState(() => {
    if (client.notes) {
      setNotes(client.notes);
    }
  });

  // Mock activities for the timeline
  const activities = [
    {
      id: "activity-001",
      type: "signature" as const,
      title: "Agreement Signed",
      description: `${client.name} signed the ${client.packages?.[0]?.name || "agreement"}`,
      timestamp: client.lastEngagement,
      user: {
        name: client.name,
        avatar: `https://github.com/polymet-ai.png`,
      },
    },
    {
      id: "activity-002",
      type: "document" as const,
      title: "Documents Uploaded",
      description: "Required documents were uploaded to the system",
      timestamp: new Date(
        new Date(client.lastEngagement).getTime() - 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
      user: {
        name: client.name,
        avatar: `https://github.com/polymet-ai.png`,
      },
    },
    {
      id: "activity-003",
      type: "payment" as const,
      title: "Payment Received",
      description: "Payment was processed successfully",
      timestamp: new Date(
        new Date(client.lastEngagement).getTime() - 1 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
      case "awaiting":
        return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
      case "signed":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/clients">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeftIcon className="h-4 w-4" />

                <span>Back</span>
              </Button>
            </Link>
            <h1 className="text-3xl font-semibold tracking-tight">
              {client.name}
            </h1>
            <Badge variant="outline" className={getStatusColor(client.status)}>
              {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Client details and engagement history
          </p>
        </div>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
          asChild
        >
          <Link to={`/package/create?client=${client.id}`}>
            <FileTextIcon className="h-4 w-4" />

            <span>Create Package</span>
          </Link>
        </Button>
      </div>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Client's contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <MailIcon className="h-4 w-4 text-muted-foreground" />

                  <span>{client.email}</span>
                </div>
                {client.phone && (
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4 text-muted-foreground" />

                    <span>{client.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />

                  <span>
                    Last engagement:{" "}
                    {new Date(client.lastEngagement).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Engagement Summary</CardTitle>
                <CardDescription>
                  Overview of client's engagement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Total Packages
                    </p>
                    <p className="text-2xl font-bold">{client.packageCount}</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Active Packages
                    </p>
                    <p className="text-2xl font-bold">
                      {client.packages?.filter((pkg) => pkg.status === "active")
                        .length || 0}
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">
                      {client.packages?.filter(
                        (pkg) => pkg.status === "completed"
                      ).length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              {client.packages && (
                <PackageListCard
                  packages={client.packages.map((pkg) => ({
                    id: pkg.id,
                    name: pkg.name,
                    clientName: client.name,
                    createdDate: pkg.createdDate,
                    status: pkg.status,
                  }))}
                  showViewAll={false}
                />
              )}
            </div>
            <EngagementActionsCard
              clientId={client.id}
              clientName={client.name}
              clientEmail={client.email}
            />
          </div>
        </TabsContent>

        <TabsContent value="packages" className="mt-6">
          {client.packages && client.packages.length > 0 ? (
            <PackageListCard
              packages={client.packages.map((pkg) => ({
                id: pkg.id,
                name: pkg.name,
                clientName: client.name,
                createdDate: pkg.createdDate,
                status: pkg.status,
              }))}
              showViewAll={false}
              className="w-full"
            />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">
                  No packages found for this client
                </p>
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  asChild
                >
                  <Link to={`/package/create?client=${client.id}`}>
                    Create First Package
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <ClientActivityTimeline activities={activities} />
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Notes</CardTitle>
              <CardDescription>Add notes about this client</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add notes about this client..."
                className="min-h-[200px]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              <Button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white">
                Save Notes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
