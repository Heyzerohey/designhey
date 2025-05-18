import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MailIcon, PlusCircleIcon, ArrowLeftIcon } from "lucide-react";

interface EngagementActionsCardProps {
  clientId: string;
  clientName: string;
  clientEmail: string;
}

export default function EngagementActionsCard({
  clientId,
  clientName,
  clientEmail,
}: EngagementActionsCardProps) {
  const handleEmailClient = () => {
    console.warn(
      "Prevented assignment: `window.location.href = `mailto:${clientEmail}?subject=Regarding your engagement with Signhey``"
    ) /*TODO: Do not use window.location for navigation. Use react-router instead.*/;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Engagement Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          onClick={handleEmailClient}
        >
          <MailIcon className="mr-2 h-4 w-4" />
          Contact Client
        </Button>

        <Button
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          as={Link}
          to={`/package/create?client=${clientId}`}
        >
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Create Another Package
        </Button>

        <Button
          variant="outline"
          className="w-full border-orange-500 text-orange-500 hover:bg-orange-50"
          as={Link}
          to="/dashboard"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="text-sm text-muted-foreground mt-4 text-center">
          <p>Client: {clientName}</p>
          <p className="text-xs">{clientEmail}</p>
        </div>
      </CardContent>
    </Card>
  );
}
