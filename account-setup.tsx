import { useState } from "react";
import { Link } from "react-router-dom";
import SignheyLogo from "@/polymet/components/signhey-logo";
import OnboardingProgress from "@/polymet/components/onboarding-progress";
import AccountSetupForm from "@/polymet/components/account-setup-form";

export default function AccountSetupPage() {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    // Simulate delay before navigation
    setTimeout(() => {
      // Navigation will be handled by the Link component in the form
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <SignheyLogo />
          </div>
          <Link to="/dashboard" className="text-sm text-muted-foreground">
            Skip for now
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold tracking-tight mb-2">
              Set up your account
            </h1>
            <p className="text-muted-foreground">
              Configure your account settings and preferences
            </p>
          </div>

          <div className="mb-8">
            <OnboardingProgress
              currentStep={2}
              totalSteps={3}
              completedSteps={isCompleted ? [1, 2] : [1]}
            />
          </div>

          <AccountSetupForm onComplete={handleComplete} />
        </div>
      </main>
    </div>
  );
}
