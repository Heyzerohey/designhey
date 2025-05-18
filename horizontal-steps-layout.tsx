import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface HorizontalStepsLayoutProps {
  steps: Step[];
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function HorizontalStepsLayout({
  steps,
  title,
  subtitle,
  action,
  className,
}: HorizontalStepsLayoutProps) {
  return (
    <div className={cn("max-w-6xl mx-auto", className)}>
      {(title || subtitle) && (
        <div className="text-center mb-12">
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>
          )}
          {subtitle && (
            <p className="text-gray-600 dark:text-gray-300">{subtitle}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="relative">
                {step.icon}
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                  {step.id}
                </span>
              </div>
            </div>
            <h3 className="font-medium mb-2">{step.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {action && <div className="text-center">{action}</div>}
    </div>
  );
}
