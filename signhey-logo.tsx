import { cn } from "@/lib/utils";

interface SignheyLogoProps {
  showTagline?: boolean;
  className?: string;
}

export default function SignheyLogo({
  showTagline = false,
  className,
}: SignheyLogoProps) {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="text-orange-500 dark:text-orange-400 font-semibold text-xl flex items-center">
        <span>Signhey</span>
      </div>
      {showTagline && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Streamline your client engagements
        </div>
      )}
    </div>
  );
}
