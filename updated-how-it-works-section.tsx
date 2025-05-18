import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FileTextIcon,
  SendIcon,
  FileSignatureIcon,
  UploadCloudIcon,
  LayoutDashboardIcon,
} from "lucide-react";
import HorizontalStepsLayout from "@/polymet/components/horizontal-steps-layout";

export default function UpdatedHowItWorksSection() {
  const steps = [
    {
      id: 1,
      title: "Create Your Agreement",
      description: "Quickly create or upload your service agreement",
      icon: <FileTextIcon className="h-8 w-8 text-orange-500" />,
    },
    {
      id: 2,
      title: "Send the Link",
      description: "Share a single Signhey Link with your client",
      icon: <SendIcon className="h-8 w-8 text-orange-500" />,
    },
    {
      id: 3,
      title: "Client Signs Securely",
      description: "Your client signs electronically, legally binding",
      icon: <FileSignatureIcon className="h-8 w-8 text-orange-500" />,
    },
    {
      id: 4,
      title: "Client Uploads & Pays",
      description: "Client uploads documents and pays instantly",
      icon: <UploadCloudIcon className="h-8 w-8 text-orange-500" />,
    },
    {
      id: 5,
      title: "Track Everything",
      description: "Manage all client engagements in one dashboard",
      icon: <LayoutDashboardIcon className="h-8 w-8 text-orange-500" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <HorizontalStepsLayout
          steps={steps}
          title="How It Works – In 5 Steps"
          subtitle="So Easy, Anyone Can Do It"
          action={
            <Button
              asChild
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Link to="/signup">Get Started Now</Link>
            </Button>
          }
        />
      </div>
    </section>
  );
}
