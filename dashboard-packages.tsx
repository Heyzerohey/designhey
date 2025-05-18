import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { PlusIcon, HelpCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import PackageListCard from "@/polymet/components/package-list-card";

interface Package {
  id: string;
  name: string;
  clientName: string;
  createdDate: string;
  status: "draft" | "active" | "completed" | "expired";
}

interface DashboardPackagesProps {
  packages: Package[];
  className?: string;
}

export default function DashboardPackages({
  packages,
  className,
}: DashboardPackagesProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Packages</h2>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          size="sm"
          asChild
        >
          <Link to="/package/create">
            <PlusIcon className="h-4 w-4 mr-1" />
            Create New Package
          </Link>
        </Button>
      </div>

      <PackageListCard packages={packages} />

      <div className="flex items-center text-sm text-muted-foreground">
        <HelpCircleIcon className="h-4 w-4 mr-1" />

        <span>
          Need help with packages?{" "}
          <Link
            to="/help/packages"
            className="text-orange-500 hover:text-orange-600 underline underline-offset-4"
          >
            View our guide
          </Link>
        </span>
      </div>
    </div>
  );
}
