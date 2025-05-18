import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SignheyLogo from "@/polymet/components/signhey-logo";
import OnboardingProgress from "@/polymet/components/onboarding-progress";
import ProfileSetupForm from "@/polymet/components/profile-setup-form";

export default function ProfileSetupPage() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleComplete = () => {
    setCompletedSteps([1]);
  };

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
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold tracking-tight mb-2">
              Welcome to Signhey
            </h1>
            <p className="text-muted-foreground">
              Let's get you set up in just a few steps
            </p>
          </div>

          <OnboardingProgress
            currentStep={1}
            totalSteps={3}
            completedSteps={completedSteps}
          />

          <ProfileSetupForm
            onComplete={() => {
              handleComplete();
            }}
          />

          <div className="mt-4 flex justify-center">
            <Link to="/account-setup">
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white"
                disabled={completedSteps.length === 0}
              >
                Continue to Account Setup
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
