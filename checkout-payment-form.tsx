import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LockIcon } from "lucide-react";

interface CheckoutPaymentFormProps {
  totalAmount: number;
  onPaymentComplete: () => void;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}

export default function CheckoutPaymentForm({
  totalAmount,
  onPaymentComplete,
  isProcessing,
  setIsProcessing,
}: CheckoutPaymentFormProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [zipCode, setZipCode] = useState("");

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");

    // Add a space after every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");

    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");

    // Format as MM/YY
    if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }

    return digits;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardNumber || !expiryDate || !cvc || !nameOnCard || !zipCode) {
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentComplete();
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="card-number">Card Number</Label>
        <Input
          id="card-number"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          required
          disabled={isProcessing}
          className="font-mono"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiry">Expiry Date</Label>
          <Input
            id="expiry"
            placeholder="MM/YY"
            value={expiryDate}
            onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
            required
            disabled={isProcessing}
            className="font-mono"
            maxLength={5}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvc">CVC</Label>
          <Input
            id="cvc"
            placeholder="123"
            value={cvc}
            onChange={(e) =>
              setCvc(e.target.value.replace(/\D/g, "").slice(0, 3))
            }
            required
            disabled={isProcessing}
            className="font-mono"
            maxLength={3}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name on Card</Label>
        <Input
          id="name"
          placeholder="John Smith"
          value={nameOnCard}
          onChange={(e) => setNameOnCard(e.target.value)}
          required
          disabled={isProcessing}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="zip">Billing Zip/Postal Code</Label>
        <Input
          id="zip"
          placeholder="12345"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          required
          disabled={isProcessing}
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
              Processing...
            </>
          ) : (
            `Pay $${totalAmount.toFixed(2)}`
          )}
        </Button>
      </div>

      <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 mt-2">
        <LockIcon className="h-3 w-3 mr-1" />

        <span>
          Secure payment processed by Stripe. Your card details are encrypted.
        </span>
      </div>
    </form>
  );
}
