import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckIcon, PackageIcon, ArrowRightIcon } from "lucide-react";

interface CheckoutSuccessProps {
  subscriptionActive: boolean;
  creditsPurchased: number | null;
  onContinue: () => void;
}

export default function CheckoutSuccess({
  subscriptionActive,
  creditsPurchased,
  onContinue,
}: CheckoutSuccessProps) {
  return (
    <div className="text-center py-8 px-4">
      <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-6">
        <CheckIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
      </div>

      <h2 className="text-2xl font-bold mb-2">You're all set!</h2>

      <div className="max-w-md mx-auto">
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {subscriptionActive && creditsPurchased
            ? `Your Pro+ subscription is now active and ${creditsPurchased} eSignature credits have been added to your account.`
            : subscriptionActive
              ? "Your Pro+ subscription is now active."
              : `${creditsPurchased} eSignature credits have been added to your account.`}
        </p>

        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center">
            {creditsPurchased && (
              <div className="flex items-center mr-6">
                <PackageIcon className="h-5 w-5 text-orange-500 mr-2" />

                <span className="font-medium">
                  {creditsPurchased} Credits Available
                </span>
              </div>
            )}

            {subscriptionActive && (
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                <span className="font-medium">Pro+ Active</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={onContinue}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            Create Your First Package
            <ArrowRightIcon className="h-4 w-4 ml-2" />
          </Button>

          <Link to="/dashboard">
            <Button variant="outline" className="w-full">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
