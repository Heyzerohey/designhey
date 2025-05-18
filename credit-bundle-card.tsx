import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

interface CreditBundleCardProps {
  id: string;
  credits: number;
  price: number;
  perCredit: number;
  isPopular?: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function CreditBundleCard({
  id,
  credits,
  price,
  perCredit,
  isPopular = false,
  isSelected,
  onSelect,
}: CreditBundleCardProps) {
  return (
    <div
      className={`border rounded-lg overflow-hidden transition-all ${
        isSelected
          ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-md"
          : isPopular
            ? "border-orange-200 dark:border-orange-800"
            : "border-gray-200 dark:border-gray-800"
      }`}
    >
      {isPopular && (
        <div className="bg-orange-500 text-white text-center py-1 text-xs font-medium">
          BEST VALUE
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Package className="h-5 w-5 text-orange-500 mr-2" />

            <span className="text-lg font-medium">{credits} Credits</span>
          </div>
          {isPopular && (
            <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
              Popular
            </span>
          )}
        </div>

        <div className="flex items-baseline mb-3">
          <span className="text-2xl font-bold">${price.toFixed(2)}</span>
          <span className="text-gray-500 dark:text-gray-400 ml-2 text-sm">
            (${perCredit.toFixed(2)}/credit)
          </span>
        </div>

        <Button
          onClick={() => onSelect(id)}
          className={`w-full ${
            isSelected
              ? "bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600"
              : isPopular
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600"
          }`}
        >
          {isSelected ? "Selected" : "Select Bundle"}
        </Button>
      </div>
    </div>
  );
}
