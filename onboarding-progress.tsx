import { CheckIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  className?: string;
}

export default function OnboardingProgress({
  currentStep,
  totalSteps,
  completedSteps,
  className,
}: OnboardingProgressProps) {
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className={className}>
      {/* Horizontal progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Vertical step list */}
      <div className="space-y-4">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = completedSteps.includes(stepNumber);

          return (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  isCompleted
                    ? "bg-green-100 dark:bg-green-900/30"
                    : isActive
                      ? "bg-orange-100 dark:bg-orange-900/30"
                      : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                {isCompleted ? (
                  <CheckIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <span
                    className={`text-sm font-medium ${
                      isActive
                        ? "text-orange-600 dark:text-orange-400"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {stepNumber}
                  </span>
                )}
              </div>
              <div
                className={`ml-3 ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {stepNumber === 1 && "Profile Setup"}
                {stepNumber === 2 && "Account Settings"}
                {stepNumber === 3 && "Create Package"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
