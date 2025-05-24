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

    // Helper to get user auth details (replace with your actual auth context/logic)
    const getAuthHeaders = () => {
      const token = localStorage.getItem("sessionToken");
      const userDataString = localStorage.getItem("userData");
      const userData = userDataString ? JSON.parse(userDataString) : null;

      if (!token || !userData?.id || !userData?.email) {
        // toast({ title: "Authentication Error", description: "User not authenticated. Please log in.", variant: "destructive" });
        throw new Error("User not authenticated. Please log in.");
      }
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-user-id': userData.id,
        'x-user-email': userData.email,
      };
    };

    // Ensure your Stripe Publishable Key is in your .env file (e.g., VITE_STRIPE_PUBLISHABLE_KEY)
    const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;
    
    // Backend API URL
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

    // Map frontend pack IDs to Stripe Price IDs (from .env or config)
    // These should match the keys used in SIGNATURE_PACK_PRICE_IDS in backend stripeService.js
    const CREDIT_PACK_STRIPE_PRICE_IDS: Record<string, string> = {
      'pack-5': import.meta.env.VITE_SIGNATURE_PACK_PRICE_ID_5 || 'price_placeholder_pack_5',
      'pack-10': import.meta.env.VITE_SIGNATURE_PACK_PRICE_ID_10 || 'price_placeholder_pack_10',
      'pack-25': import.meta.env.VITE_SIGNATURE_PACK_PRICE_ID_25 || 'price_placeholder_pack_25',
      'pack-50': import.meta.env.VITE_SIGNATURE_PACK_PRICE_ID_50 || 'price_placeholder_pack_50',
      'pack-100': import.meta.env.VITE_SIGNATURE_PACK_PRICE_ID_100 || 'price_placeholder_pack_100',
    };

    const stripePackPriceId = CREDIT_PACK_STRIPE_PRICE_IDS[packId];

    if (!stripePackPriceId) {
      console.error(`Stripe Price ID not found for pack: ${packId}`);
      // toast({ title: "Error", description: "Could not find payment information for this pack.", variant: "destructive" });
      setIsProcessing(false);
      return;
    }

    let authHeaders;
    try {
      authHeaders = getAuthHeaders();
    } catch (error: any) {
      // toast({ title: "Authentication Error", description: error.message, variant: "destructive" });
      setIsProcessing(false);
      return;
    }

    const callApi = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/stripe/create-checkout-session-for-packs`, {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({ priceId: stripePackPriceId, quantity: 1 }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to create checkout session.');
        }
        
        const sessionId = data.sessionId;
        if (!stripePromise || !sessionId) {
          // toast({ title: "Stripe Error", description: "Stripe.js has not loaded or session ID is missing.", variant: "destructive" });
          return;
        }

        const stripe = await stripePromise;
        if (stripe) {
          const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
          if (stripeError) {
            console.error("Stripe checkout error:", stripeError);
            // toast({ title: "Payment Error", description: stripeError.message || "An error occurred during checkout.", variant: "destructive" });
          }
        } else {
           // toast({ title: "Stripe Error", description: "Stripe.js failed to load.", variant: "destructive" });
        }
      } catch (error: any) {
        console.error("Payment processing error:", error);
        // toast({ title: "Payment Error", description: error.message || "An unexpected error occurred.", variant: "destructive" });
      } finally {
        setIsProcessing(false);
      }
    };

    callApi();
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
