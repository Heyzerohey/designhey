import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FileTextIcon,
  SendIcon,
  FileCheckIcon,
  UploadCloudIcon,
  LayoutDashboardIcon,
  ClockIcon,
} from "lucide-react";
import ClientFlowDemo from "@/polymet/components/client-flow-demo";
import DashboardPreview from "@/polymet/components/dashboard-preview";

export default function HowItWorksSection() {
  const steps = [
    {
      id: 1,
      title: "Prepare",
      description:
        "Create your agreement template and customize your client flow",
      icon: <FileTextIcon className="h-6 w-6 text-orange-500" />,
    },
    {
      id: 2,
      title: "Share",
      description: "Send a single link to your client via email or text",
      icon: <SendIcon className="h-6 w-6 text-orange-500" />,

      demo: <ClientFlowDemo />,
    },
    {
      id: 3,
      title: "Sign",
      description:
        "Client reviews and signs your agreement with a legally binding e-signature",
      icon: <FileCheckIcon className="h-6 w-6 text-orange-500" />,
    },
    {
      id: 4,
      title: "Upload & Pay",
      description:
        "Client uploads required documents and completes payment in one flow",
      icon: <UploadCloudIcon className="h-6 w-6 text-orange-500" />,
    },
    {
      id: 5,
      title: "Manage",
      description: "Track all your client engagements from a simple dashboard",
      icon: <LayoutDashboardIcon className="h-6 w-6 text-orange-500" />,

      demo: <DashboardPreview />,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
          How It Works
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-16 max-w-2xl mx-auto">
          Signhey streamlines your client onboarding in five simple steps
        </p>

        <div className="space-y-24 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Step content */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <span className="text-2xl font-bold text-orange-500">
                    {step.id}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
                <div className="md:ml-auto flex-shrink-0">{step.icon}</div>
              </div>

              {/* Demo content if available */}
              {step.demo && <div className="mt-8 mb-12">{step.demo}</div>}

              {/* Connector line between steps (except last) */}
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-16 h-24 w-px bg-gray-200 dark:bg-gray-700"></div>
              )}
            </div>
          ))}
        </div>

        {/* Time savings highlight */}
        <div className="mt-20 bg-white dark:bg-gray-800 rounded-xl p-8 max-w-3xl mx-auto text-center shadow-sm">
          <div className="flex items-center justify-center mb-4">
            <ClockIcon className="h-8 w-8 text-orange-500 mr-2" />

            <h3 className="text-xl font-medium">Get Back to What You Love</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Signhey saves you hours every week by automating your client
            onboarding process. No more chasing signatures, documents, or
            payments.
          </p>
          <Button
            asChild
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
