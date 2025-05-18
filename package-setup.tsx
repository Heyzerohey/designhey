import { useState } from "react";
import { Link } from "react-router-dom";
import SignheyLogo from "@/polymet/components/signhey-logo";
import OnboardingProgress from "@/polymet/components/onboarding-progress";
import PackageSetupForm from "@/polymet/components/package-setup-form";

export default function PackageSetupPage() {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    // Simulate delay before navigation
    setTimeout(() => {
      // Navigation will be handled by the Link component in the form
    }, 1000);
  };

  const handleSkip = () => {
    // Navigation will be handled by the Link component in the form
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
              Create your first package
            </h1>
            <p className="text-muted-foreground">
              Send an agreement to your client
            </p>
          </div>

          <div className="mb-8">
            <OnboardingProgress
              currentStep={3}
              totalSteps={3}
              completedSteps={isCompleted ? [1, 2, 3] : [1, 2]}
            />
          </div>

          <PackageSetupForm onComplete={handleComplete} onSkip={handleSkip} />
        </div>
      </main>
    </div>
  );
}
