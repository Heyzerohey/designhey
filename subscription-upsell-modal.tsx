import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckIcon, PackageIcon, XIcon } from "lucide-react";

interface SubscriptionUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  neededCredits?: number;
}

export default function SubscriptionUpsellModal({
  isOpen,
  onClose,
  neededCredits = 1,
}: SubscriptionUpsellModalProps) {
  const [showDismissButton, setShowDismissButton] = useState(false);

  // Show dismiss button after 3 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setShowDismissButton(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Activate Your Subscription
          </DialogTitle>
          <DialogDescription className="text-center">
            You need {neededCredits}{" "}
            {neededCredits === 1 ? "credit" : "credits"} to send this package
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center justify-center mb-6">
            <div className="h-16 w-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
              <PackageIcon className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
              <h3 className="font-medium mb-2">Pro+ Subscription</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />

                  <span className="text-gray-600 dark:text-gray-300 text-sm">
                    $30/month for unlimited features
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />

                  <span className="text-gray-600 dark:text-gray-300 text-sm">
                    Purchase credits to send packages
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />

                  <span className="text-gray-600 dark:text-gray-300 text-sm">
                    14-day money-back guarantee
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                <strong>Pro Tip:</strong> Purchase a bundle of 50 or 100 credits
                to save on per-signature costs.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-3">
          <Button
            asChild
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Link to="/subscription-checkout">Get Started Now</Link>
          </Button>

          {showDismissButton && (
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full text-gray-500"
            >
              <XIcon className="h-4 w-4 mr-2" />
              Not now
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
