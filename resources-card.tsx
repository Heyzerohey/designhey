import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon } from "lucide-react";

interface ResourcesCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  resourceType: "guide" | "template" | "video" | "webinar" | "ebook";
  link: string;
  isNew?: boolean;
  isPremium?: boolean;
}

export default function ResourcesCard({
  title,
  description,
  icon,
  resourceType,
  link,
  isNew = false,
  isPremium = false,
}: ResourcesCardProps) {
  // Resource type colors
  const resourceTypeColors = {
    guide: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    template:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    video:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    webinar:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    ebook: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
  };

  // Format resource type for display
  const formattedResourceType =
    resourceType.charAt(0).toUpperCase() + resourceType.slice(1);

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
            {icon}
          </div>
          <div className="flex space-x-2">
            {isNew && (
              <Badge className="bg-orange-500 hover:bg-orange-600">New</Badge>
            )}
            {isPremium && (
              <Badge
                variant="outline"
                className="border-orange-500 text-orange-500"
              >
                Premium
              </Badge>
            )}
          </div>
        </div>
        <Badge
          variant="secondary"
          className={`mb-3 ${resourceTypeColors[resourceType]}`}
        >
          {formattedResourceType}
        </Badge>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-0">
        <Button
          asChild
          variant="ghost"
          className="p-0 h-auto hover:bg-transparent hover:text-orange-500 transition-colors"
        >
          <Link to={link} className="flex items-center">
            View Resource
            <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
