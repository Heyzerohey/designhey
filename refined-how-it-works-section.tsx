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

export default function RefinedHowItWorksSection() {
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
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            How It Works – In 5 Steps
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            So Easy, Anyone Can Do It
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 flex flex-col items-center text-center transition-all hover:shadow-md"
            >
              <div className="w-12 h-12 flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
                <span className="text-sm font-medium text-orange-500">
                  {step.id}
                </span>
              </div>
              <h3 className="text-lg font-medium mb-2">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            asChild
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Link to="/signup">Get Started Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
