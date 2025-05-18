import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface VerticalStepsLayoutProps {
  steps: Step[];
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function VerticalStepsLayout({
  steps,
  title,
  subtitle,
  action,
  className,
}: VerticalStepsLayoutProps) {
  return (
    <div className={cn("max-w-3xl mx-auto", className)}>
      {(title || subtitle) && (
        <div className="text-center mb-8">
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>
          )}
          {subtitle && (
            <p className="text-gray-600 dark:text-gray-300">{subtitle}</p>
          )}
        </div>
      )}

      <div className="space-y-8 relative">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start gap-4">
            <div className="flex-shrink-0 relative">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20">
                {step.icon}
              </div>
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                {step.id}
              </span>
              {index < steps.length - 1 && (
                <div className="absolute top-12 left-1/2 w-0.5 h-12 bg-gray-200 dark:bg-gray-700 -translate-x-1/2"></div>
              )}
            </div>
            <div className="flex-grow pt-1">
              <h3 className="font-medium text-lg mb-1">{step.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {action && <div className="text-center mt-10">{action}</div>}
    </div>
  );
}
