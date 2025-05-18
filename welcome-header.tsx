import { cn } from "@/lib/utils";
import SignheyLogo from "@/polymet/components/signhey-logo";

interface WelcomeHeaderProps {
  professionalName: string;
  professionalAvatar?: string;
  businessName?: string;
  businessLogo?: string;
  clientName?: string;
  className?: string;
}

export default function WelcomeHeader({
  professionalName,
  professionalAvatar,
  businessName,
  businessLogo,
  clientName,
  className,
}: WelcomeHeaderProps) {
  const displayName = businessName || professionalName;
  const displayImage = businessLogo || professionalAvatar;
  const clientGreeting = clientName ? `${clientName}, ` : "";

  return (
    <div className={cn("text-center", className)}>
      <div className="flex justify-center mb-6">
        {displayImage ? (
          <img
            src={displayImage}
            alt={displayName}
            className="h-16 w-16 rounded-full object-cover border-2 border-gray-100 dark:border-gray-800 shadow-sm"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-500 dark:text-orange-300 text-xl font-medium">
            {professionalName.charAt(0)}
          </div>
        )}
      </div>

      <h1 className="text-2xl font-medium mb-2">
        Welcome {clientGreeting}to {displayName}
      </h1>

      <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
        Please complete the following steps to finalize your engagement with{" "}
        {businessName || professionalName}.
      </p>

      {/* Decorative wave pattern */}
      <div className="mt-8 h-4 w-full opacity-20">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1200 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 6C200 -2 400 14 600 6C800 -2 1000 14 1200 6V12H0V6Z"
            fill="currentColor"
            className="text-orange-500 dark:text-orange-400"
          />
        </svg>
      </div>
    </div>
  );
}
