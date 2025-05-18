import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckIcon, PhoneIcon, MailIcon } from "lucide-react";
import SignheyLogo from "@/polymet/components/signhey-logo";

interface ConfirmationMessageProps {
  title: string;
  message: string;
  lawyerName?: string;
  lawyerEmail?: string;
  lawyerPhone?: string;
  businessName?: string;
  actionLabel: string;
  actionPath?: string;
  onAction?: () => void;
  className?: string;
}

export default function ConfirmationMessage({
  title,
  message,
  lawyerName,
  lawyerEmail,
  lawyerPhone,
  businessName = "[Your Business Name]",
  actionLabel,
  actionPath = "/dashboard",
  onAction,
  className,
}: ConfirmationMessageProps) {
  const handleAction = () => {
    if (onAction) {
      onAction();
    }
  };

  return (
    <div className={cn("w-full max-w-lg mx-auto", className)}>
      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {/* Success header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 flex flex-col items-center text-white">
            <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
              <CheckIcon className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-medium">{title}</h2>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Message */}
            <p className="text-center text-gray-600 dark:text-gray-300">
              {message.replace(
                /Sakura Legal Group|Law Firm|Attorney/g,
                businessName
              )}
            </p>

            {/* Contact information */}
            {(lawyerName || lawyerEmail || lawyerPhone) && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-sm font-medium mb-3 text-center">
                  Contact Information
                </h3>
                <div className="space-y-2">
                  {lawyerName && (
                    <p className="text-sm text-center font-medium">
                      {lawyerName}
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {lawyerEmail && (
                      <a
                        href={`mailto:${lawyerEmail}`}
                        className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400"
                      >
                        <MailIcon className="h-4 w-4 mr-2" />

                        {lawyerEmail}
                      </a>
                    )}
                    {lawyerPhone && (
                      <a
                        href={`tel:${lawyerPhone.replace(/[^0-9+]/g, "")}`}
                        className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400"
                      >
                        <PhoneIcon className="h-4 w-4 mr-2" />

                        {lawyerPhone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action button */}
            {actionPath ? (
              <Link to={actionPath} className="block w-full">
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={handleAction}
                >
                  {actionLabel}
                </Button>
              </Link>
            ) : (
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handleAction}
              >
                {actionLabel}
              </Button>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-4 flex justify-center">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span className="mr-2">Powered by</span>
              <SignheyLogo className="scale-75" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
