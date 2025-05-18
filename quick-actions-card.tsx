import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import {
  PlusIcon,
  ShareIcon,
  FileTextIcon,
  MessageSquareIcon,
  CreditCardIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuickActionsCardProps {
  className?: string;
}

export default function QuickActionsCard({ className }: QuickActionsCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white w-full justify-start"
          asChild
        >
          <Link to="/package/create">
            <PlusIcon className="h-4 w-4 mr-2" />
            Create New Package
          </Link>
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950 justify-start"
            asChild
          >
            <Link to="/help/sharing">
              <ShareIcon className="h-4 w-4 mr-2" />
              Share Package
            </Link>
          </Button>

          <Button
            variant="outline"
            className="border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950 justify-start"
            asChild
          >
            <Link to="/help/templates">
              <FileTextIcon className="h-4 w-4 mr-2" />
              View Templates
            </Link>
          </Button>

          <Button
            variant="outline"
            className="border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950 justify-start"
            asChild
          >
            <Link to="/messages">
              <MessageSquareIcon className="h-4 w-4 mr-2" />
              Send Message
            </Link>
          </Button>

          <Button
            variant="outline"
            className="border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950 justify-start"
            asChild
          >
            <Link to="/credits/purchase">
              <CreditCardIcon className="h-4 w-4 mr-2" />
              Buy Credits
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
