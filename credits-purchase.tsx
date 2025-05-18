import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CreditCard,
  DollarSign,
  ArrowRight,
  CheckCircle,
  Package,
} from "lucide-react";

export default function CreditsPurchasePage() {
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const creditPacks = [
    { id: "pack-5", credits: 5, price: 6.25, perCredit: 1.25 },
    { id: "pack-10", credits: 10, price: 12.5, perCredit: 1.25 },
    { id: "pack-25", credits: 25, price: 31.25, perCredit: 1.25 },
    { id: "pack-50", credits: 50, price: 62.5, perCredit: 1.25 },
    { id: "pack-100", credits: 100, price: 100, perCredit: 1.0, popular: true },
  ];

  const handleBuyNow = (packId: string) => {
    setSelectedPack(packId);
    setIsProcessing(true);

    // Simulate API call to Stripe
    setTimeout(() => {
      setIsProcessing(false);
      // In a real implementation, redirect to Stripe checkout
      alert("Redirecting to payment gateway...");
    }, 1500);
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Purchase Signature Credits
        </h1>
        <p className="text-muted-foreground mt-2">
          Buy credits to send your packages to clients
        </p>
      </div>

      <div className="flex items-center justify-center mb-8 bg-orange-50 p-4 rounded-lg">
        <Package className="h-5 w-5 text-orange-500 mr-2" />

        <span className="text-sm">
          You currently have <strong>0</strong> signature credits
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creditPacks.map((pack, index) => (
          <Card
            key={pack.id}
            className={`overflow-hidden ${
              pack.popular ? "border-orange-500 shadow-md" : ""
            }`}
          >
            {pack.popular && (
              <div className="bg-orange-500 text-white text-center py-1 text-xs font-medium">
                MOST POPULAR
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="text-2xl">{pack.credits} Credits</span>
                {pack.popular && (
                  <span className="ml-auto bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
                    Best Value
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                {pack.credits === 1
                  ? "1 signature"
                  : `${pack.credits} signatures`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold">
                  ${pack.price.toFixed(2)}
                </span>
                <span className="text-muted-foreground ml-2">
                  (${pack.perCredit.toFixed(2)}/credit)
                </span>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Send packages to clients
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Legally binding signatures
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  No monthly commitment
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleBuyNow(pack.id)}
                disabled={isProcessing && selectedPack === pack.id}
                className={`w-full ${
                  pack.popular
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-gray-800 hover:bg-gray-900"
                }`}
              >
                {isProcessing && selectedPack === pack.id ? (
                  <span className="flex items-center">Processing...</span>
                ) : (
                  <span className="flex items-center">
                    Buy Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-medium mb-4">About Signature Credits</h2>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Signature credits allow you to send packages to clients for
            electronic signature. Each time you send a package, one credit is
            used. Credits never expire and can be used at any time.
          </p>
          <div className="flex items-center text-sm text-gray-600">
            <CreditCard className="h-4 w-4 mr-2 text-orange-500" />

            <span>Secure payment processing via Stripe</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-2 text-orange-500" />

            <span>Money-back guarantee if you're not satisfied</span>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link to="/dashboard">
          <Button variant="outline">Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
