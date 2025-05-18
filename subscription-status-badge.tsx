import { Link } from "react-router-dom";
import { AlertCircleIcon, CheckCircleIcon, PackageIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SubscriptionStatusBadgeProps {
  isActive: boolean;
  creditsRemaining: number;
  className?: string;
}

export default function SubscriptionStatusBadge({
  isActive,
  creditsRemaining,
  className = "",
}: SubscriptionStatusBadgeProps) {
  return (
    <div className={`flex items-center space-x-3 text-sm ${className}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div
              className={`flex items-center px-3 py-1 rounded-full ${
                isActive
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {isActive ? (
                <CheckCircleIcon className="h-4 w-4 mr-1.5" />
              ) : (
                <AlertCircleIcon className="h-4 w-4 mr-1.5" />
              )}
              <span className="font-medium">
                {isActive ? "Pro+ Active" : "Inactive"}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {isActive
                ? "Your Pro+ subscription is active"
                : "Your subscription is not active. Activate to unlock all features."}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Link
              to="/subscription-checkout"
              className={`flex items-center px-3 py-1 rounded-full ${
                creditsRemaining > 0
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              } hover:opacity-90 transition-opacity`}
            >
              <PackageIcon className="h-4 w-4 mr-1.5" />

              <span className="font-medium">
                {creditsRemaining}{" "}
                {creditsRemaining === 1 ? "Credit" : "Credits"}
              </span>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {creditsRemaining > 0
                ? `You have ${creditsRemaining} signature credits remaining`
                : "You have no signature credits. Purchase credits to send packages."}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
