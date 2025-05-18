import { CreditCard, Package } from "lucide-react";

interface CheckoutSummaryProps {
  subscriptionPrice: number;
  selectedBundle: {
    id: string;
    credits: number;
    price: number;
  } | null;
}

export default function CheckoutSummary({
  subscriptionPrice,
  selectedBundle,
}: CheckoutSummaryProps) {
  const subtotal = subscriptionPrice + (selectedBundle?.price || 0);

  // Calculate savings if bundle is selected (compared to buying credits individually at $1.25 each)
  const savings =
    selectedBundle && selectedBundle.id === "bundle-100"
      ? selectedBundle.credits * 1.25 - selectedBundle.price
      : 0;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
      <h3 className="text-lg font-medium mb-4">Order Summary</h3>

      <div className="space-y-3 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <CreditCard className="h-4 w-4 text-orange-500 mr-2" />

            <span className="text-gray-700 dark:text-gray-300">
              Pro+ Monthly Subscription
            </span>
          </div>
          <span className="font-medium">${subscriptionPrice.toFixed(2)}</span>
        </div>

        {selectedBundle && (
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <Package className="h-4 w-4 text-orange-500 mr-2" />

              <span className="text-gray-700 dark:text-gray-300">
                {selectedBundle.credits} eSignature Credits
              </span>
            </div>
            <span className="font-medium">
              ${selectedBundle.price.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mb-3">
        <div className="flex justify-between mb-1">
          <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>

        {savings > 0 && (
          <div className="flex justify-between text-green-600 dark:text-green-400 text-sm">
            <span>Bundle savings</span>
            <span>-${savings.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
        <div className="flex justify-between text-lg font-bold">
          <span>Total today</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          You'll be charged ${subscriptionPrice.toFixed(2)} monthly starting
          today. Credits are a one-time purchase.
        </p>
      </div>
    </div>
  );
}
