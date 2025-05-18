import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon } from "lucide-react";

interface HelpCenterCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  articleCount: number;
  link: string;
  isPopular?: boolean;
}

export default function HelpCenterCard({
  title,
  description,
  icon,
  articleCount,
  link,
  isPopular = false,
}: HelpCenterCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <Link to={link} className="block h-full">
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              {icon}
            </div>
            {isPopular && (
              <Badge className="bg-orange-500 hover:bg-orange-600">
                Popular
              </Badge>
            )}
          </div>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-orange-500 transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground mb-6 flex-grow">{description}</p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-sm text-muted-foreground">
              {articleCount} articles
            </span>
            <span className="text-orange-500 flex items-center text-sm font-medium">
              View articles
              <ArrowRightIcon className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
