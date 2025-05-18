import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubscriptionPlanCardProps {
  isSelected: boolean;
  onSelect: () => void;
}

export default function SubscriptionPlanCard({
  isSelected,
  onSelect,
}: SubscriptionPlanCardProps) {
  return (
    <div
      className={`border rounded-lg p-6 transition-all ${
        isSelected
          ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-800"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold">Pro+</h3>
          <div className="flex items-baseline mt-1">
            <span className="text-3xl font-bold">$30</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">
              /month
            </span>
          </div>
        </div>
        <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 px-3 py-1 rounded-full text-sm font-medium">
          Recommended
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        <li className="flex items-start">
          <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />

          <span className="text-gray-600 dark:text-gray-300">
            Unlimited Packages
          </span>
        </li>
        <li className="flex items-start">
          <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />

          <span className="text-gray-600 dark:text-gray-300">
            Full Dashboard Access
          </span>
        </li>
        <li className="flex items-start">
          <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />

          <span className="text-gray-600 dark:text-gray-300">
            Collect Payments from Clients
          </span>
        </li>
        <li className="flex items-start">
          <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />

          <span className="text-gray-600 dark:text-gray-300">
            Mobile-Friendly Signer Experience
          </span>
        </li>
        <li className="flex items-start">
          <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />

          <span className="text-gray-600 dark:text-gray-300">
            Secure File Uploads
          </span>
        </li>
      </ul>

      <Button
        onClick={onSelect}
        className={`w-full ${
          isSelected
            ? "bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600"
            : "bg-orange-500 hover:bg-orange-600"
        }`}
      >
        {isSelected ? "Selected" : "Select Plan"}
      </Button>
    </div>
  );
}
