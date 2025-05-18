import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  HomeIcon,
  ArrowLeftIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
} from "lucide-react";

export default function NotFoundContent() {
  return (
    <div className="text-center">
      <h1 className="text-6xl font-bold text-orange-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button
          asChild
          className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto"
        >
          <Link to="/">
            <HomeIcon className="mr-2 h-4 w-4" />
            Return Home
          </Link>
        </Button>

        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link
            to="#"
            onClick={
              () =>
                console.warn(
                  "Prevented function call: `window.history.back()`"
                ) /*TODO: Do not use window.history for navigation. Use react-router instead.*/
            }
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Go Back
          </Link>
        </Button>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button asChild variant="ghost" size="sm" className="w-full sm:w-auto">
          <Link to="/help">
            <HelpCircleIcon className="mr-2 h-4 w-4" />
            Help Resources
          </Link>
        </Button>

        <Button asChild variant="ghost" size="sm" className="w-full sm:w-auto">
          <Link to="/dashboard">
            <LayoutDashboardIcon className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
