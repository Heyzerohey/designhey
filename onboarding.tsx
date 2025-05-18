import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckIcon, FileTextIcon, SettingsIcon, UserIcon } from "lucide-react";
import SignheyLogo from "@/polymet/components/signhey-logo";

export default function OnboardingPage() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const onboardingSteps = [
    {
      id: 1,
      title: "Complete your profile",
      description: "Add your name, company, and professional details",
      icon: UserIcon,
      action: "Complete Profile",
      path: "/profile-setup",
    },
    {
      id: 2,
      title: "Set up your account",
      description: "Configure your account settings and preferences",
      icon: SettingsIcon,
      action: "Configure Settings",
      path: "/account-setup",
    },
    {
      id: 3,
      title: "Create your first package",
      description: "Upload an agreement, request documents, and set payment",
      icon: FileTextIcon,
      action: "Create Package",
      path: "/package-setup",
    },
  ];

  const toggleStep = (stepId: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepId)
        ? prev.filter((id) => id !== stepId)
        : [...prev, stepId]
    );
  };

  const progress = Math.round(
    (completedSteps.length / onboardingSteps.length) * 100
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <SignheyLogo />
          </div>
          <Link to="/dashboard">
            <Button variant="ghost" className="text-sm text-muted-foreground">
              Skip for now
            </Button>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold tracking-tight mb-2">
              Welcome to Signhey
            </h1>
            <p className="text-muted-foreground">
              Let's get you set up in just a few steps
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                {completedSteps.length} of {onboardingSteps.length} completed
              </span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-4">
            {onboardingSteps.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id);
              return (
                <Card
                  key={step.id}
                  className={cn(
                    "transition-all",
                    isCompleted
                      ? "border-green-200 dark:border-green-900"
                      : "hover:border-orange-200 dark:hover:border-orange-900"
                  )}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                          isCompleted
                            ? "bg-green-100 dark:bg-green-900/30"
                            : "bg-orange-100 dark:bg-orange-900/30"
                        )}
                      >
                        {isCompleted ? (
                          <CheckIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <step.icon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{step.title}</h3>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`step-${step.id}`}
                              checked={isCompleted}
                              onCheckedChange={() => toggleStep(step.id)}
                            />

                            <Label
                              htmlFor={`step-${step.id}`}
                              className="text-sm cursor-pointer"
                            >
                              {isCompleted ? "Completed" : "Mark as completed"}
                            </Label>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                        <Link to={step.path}>
                          <Button variant="outline" size="sm" className="mt-2">
                            {step.action}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-8 flex justify-end">
            <Link to="/dashboard">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                {completedSteps.length === onboardingSteps.length
                  ? "Go to Dashboard"
                  : "Continue to Dashboard"}
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
