import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export default function ProgressIndicator({
  steps,
  currentStep,
  className,
}: ProgressIndicatorProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index;
          const isActive = currentStep === index;

          return (
            <div key={index} className="flex flex-col items-center relative">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors",
                  isCompleted
                    ? "bg-orange-500 border-orange-500 text-white"
                    : isActive
                      ? "border-orange-500 text-orange-500"
                      : "border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500"
                )}
              >
                {isCompleted ? (
                  <CheckIcon className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium",
                  isCompleted || isActive
                    ? "text-gray-900 dark:text-gray-100"
                    : "text-gray-400 dark:text-gray-500"
                )}
              >
                {step}
              </span>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-4 left-8 w-[calc(100vw/4)] h-0.5 -translate-y-1/2",
                    isCompleted
                      ? "bg-orange-500"
                      : "bg-gray-200 dark:bg-gray-700"
                  )}
                  style={{
                    width: `calc((100% - ${steps.length * 8}px) / ${
                      steps.length - 1
                    })`,
                  }}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
