import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileIcon, MoreVerticalIcon, Share2Icon } from "lucide-react";
import { useState } from "react";
import SharePackageModal from "@/polymet/components/share-package-modal";

interface Package {
  id: string;
  name: string;
  clientName: string;
  createdDate: string;
  status: "draft" | "active" | "completed" | "expired";
}

interface PackageListCardProps {
  packages: Package[];
}

export default function PackageListCard({ packages }: PackageListCardProps) {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const handleShareClick = (pkg: Package) => {
    setSelectedPackage(pkg);
    setShareModalOpen(true);
  };

  const getStatusColor = (status: Package["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "draft":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "expired":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Packages</CardTitle>
      </CardHeader>
      <CardContent>
        {packages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />

            <p className="text-muted-foreground">No packages found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first package to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center">
                  <div className="mr-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                    <FileIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <Link
                      to={`/packages/${pkg.id}`}
                      className="font-medium hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                    >
                      {pkg.name}
                    </Link>
                    <div className="flex items-center mt-1 text-sm text-muted-foreground">
                      <span>{pkg.clientName}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(pkg.createdDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(pkg.status)}>
                    {pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleShareClick(pkg)}
                    className="text-gray-500 hover:text-orange-500"
                  >
                    <Share2Icon className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVerticalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Link to={`/packages/${pkg.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShareClick(pkg)}>
                        Share Package
                      </DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      {pkg.status === "draft" && (
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                      )}
                      {pkg.status === "expired" && (
                        <DropdownMenuItem>Renew</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4">
          <Link to="/packages">
            <Button variant="outline" className="w-full">
              View All Packages
            </Button>
          </Link>
        </div>
      </CardContent>
      {selectedPackage && (
        <SharePackageModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          packageName={selectedPackage.name}
        />
      )}
    </Card>
  );
}
