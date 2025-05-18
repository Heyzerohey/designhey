import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeftIcon,
  CheckIcon,
  FileTextIcon,
  UploadIcon,
  CreditCardIcon,
  MailIcon,
  PlusIcon,
} from "lucide-react";
import { RECENT_PACKAGES } from "@/polymet/data/dashboard-packages-data";
import { ALL_CLIENTS } from "@/polymet/data/clients-data";
import EngagementActionsCard from "@/polymet/components/engagement-actions-card";
import ClientActivityTimeline from "@/polymet/components/client-activity-timeline";

export default function PackageDetailsPage() {
  const { id = "" } = useParams();

  // Find the package by ID
  const packageItem = RECENT_PACKAGES.find((pkg) => pkg.id === id);

  // If package not found, show a message
  if (!packageItem) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h1 className="text-2xl font-semibold mb-2">Package Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The package you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  // Find the client associated with this package
  const client = ALL_CLIENTS.find((client) =>
    client.packages?.some((pkg) => pkg.id === id)
  );

  // Determine progress based on status
  let progress = 0;
  switch (packageItem.status) {
    case "draft":
      progress = 0;
      break;
    case "active":
      progress = 50;
      break;
    case "completed":
      progress = 100;
      break;
    case "expired":
      progress = 100;
      break;
  }

  // Mock activities for the timeline
  const activities = [
    {
      id: "activity-001",
      type: "document",
      title: "Package Created",
      description: `${packageItem.name} was created`,
      timestamp: packageItem.createdDate,
    },
  ];

  // Add more activities based on status
  if (packageItem.status !== "draft") {
    activities.push({
      id: "activity-002",
      type: "signature",
      title: "Agreement Signed",
      description: `${client?.name || "Client"} signed the agreement`,
      timestamp: new Date(
        new Date(packageItem.createdDate).getTime() + 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
      user: client
        ? {
            name: client.name,
            avatar: `https://github.com/polymet-ai.png`,
          }
        : undefined,
    });
  }

  if (packageItem.status === "completed" || packageItem.status === "expired") {
    activities.push({
      id: "activity-003",
      type: "upload",
      title: "Documents Uploaded",
      description: "Required documents were uploaded",
      timestamp: new Date(
        new Date(packageItem.createdDate).getTime() + 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
    });

    activities.push({
      id: "activity-004",
      type: "payment",
      title: "Payment Received",
      description: "Payment was processed successfully",
      timestamp: new Date(
        new Date(packageItem.createdDate).getTime() + 4 * 24 * 60 * 60 * 1000
      ).toISOString(),
    });
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "draft":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
          >
            Draft
          </Badge>
        );

      case "active":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
          >
            Active
          </Badge>
        );

      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
          >
            Completed
          </Badge>
        );

      case "expired":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800"
          >
            Expired
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeftIcon className="h-4 w-4" />

                <span>Back</span>
              </Button>
            </Link>
            <h1 className="text-3xl font-semibold tracking-tight">
              Client Progress – {packageItem.name}
            </h1>
            {getStatusBadge(packageItem.status)}
          </div>
          <p className="text-muted-foreground">
            Track Your Client's Engagement
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                  <div
                    className={`rounded-full p-2 ${
                      packageItem.status !== "draft"
                        ? "bg-green-100 text-green-700"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {packageItem.status !== "draft" ? (
                      <CheckIcon className="h-5 w-5" />
                    ) : (
                      <FileTextIcon className="h-5 w-5" />
                    )}
                  </div>
                  <span className="mt-2 text-sm font-medium">Sign</span>
                </div>

                <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                  <div
                    className={`rounded-full p-2 ${
                      packageItem.status === "completed" ||
                      packageItem.status === "expired"
                        ? "bg-green-100 text-green-700"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {packageItem.status === "completed" ||
                    packageItem.status === "expired" ? (
                      <CheckIcon className="h-5 w-5" />
                    ) : (
                      <UploadIcon className="h-5 w-5" />
                    )}
                  </div>
                  <span className="mt-2 text-sm font-medium">Upload</span>
                </div>

                <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                  <div
                    className={`rounded-full p-2 ${
                      packageItem.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {packageItem.status === "completed" ? (
                      <CheckIcon className="h-5 w-5" />
                    ) : (
                      <CreditCardIcon className="h-5 w-5" />
                    )}
                  </div>
                  <span className="mt-2 text-sm font-medium">Pay</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Engagement Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
                disabled={!client?.email}
                onClick={() => {
                  if (client?.email) {
                    console.warn(
                      "Prevented assignment: `window.location.href = `mailto:${client.email}?subject=Regarding your package``"
                    ) /*TODO: Do not use window.location for navigation. Use react-router instead.*/;
                  }
                }}
              >
                <MailIcon className="h-4 w-4" />

                <span>Contact {client?.name || "Client"}</span>
              </Button>

              <Button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
                asChild
              >
                <Link
                  to={
                    client?.id
                      ? `/package/create?client=${client.id}`
                      : "/package/create"
                  }
                >
                  <PlusIcon className="h-4 w-4" />

                  <span>Create Another Package</span>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full border-orange-500 text-orange-500 hover:bg-orange-50 flex items-center gap-2"
                asChild
              >
                <Link to="/dashboard">
                  <ArrowLeftIcon className="h-4 w-4" />

                  <span>View All Packages</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ClientActivityTimeline activities={activities} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Package Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Package Name</p>
              <p className="font-medium">{packageItem.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Client</p>
              <p className="font-medium">
                {client ? (
                  <Link
                    to={`/clients/${client.id}`}
                    className="text-orange-500 hover:underline"
                  >
                    {client.name}
                  </Link>
                ) : (
                  "Unknown Client"
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created Date</p>
              <p className="font-medium">
                {new Date(packageItem.createdDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium">
                {getStatusBadge(packageItem.status)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
