import { useEffect, useState } from "react";
import HorizontalStepsLayout from "@/polymet/components/horizontal-steps-layout";
import VerticalStepsLayout from "@/polymet/components/vertical-steps-layout";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ResponsiveStepsLayoutProps {
  steps: Step[];
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  breakpoint?: number;
}

export default function ResponsiveStepsLayout({
  steps,
  title,
  subtitle,
  action,
  className,
  breakpoint = 768, // Default breakpoint at md
}: ResponsiveStepsLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [breakpoint]);

  return (
    <div className={cn(className)}>
      {isMobile ? (
        <VerticalStepsLayout
          steps={steps}
          title={title}
          subtitle={subtitle}
          action={action}
        />
      ) : (
        <HorizontalStepsLayout
          steps={steps}
          title={title}
          subtitle={subtitle}
          action={action}
        />
      )}
    </div>
  );
}
