import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftIcon, HelpCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignheyLogo from "@/polymet/components/signhey-logo";
import SubscriptionPlanCard from "@/polymet/components/subscription-plan-card";
import CreditBundleCard from "@/polymet/components/credit-bundle-card";
import CheckoutSummary from "@/polymet/components/checkout-summary";
import CheckoutPaymentForm from "@/polymet/components/checkout-payment-form";
import CheckoutSuccess from "@/polymet/components/checkout-success";

// Credit bundle options
const CREDIT_BUNDLES = [
  {
    id: "bundle-10",
    credits: 10,
    price: 12.5,
    perCredit: 1.25,
    isPopular: false,
  },
  {
    id: "bundle-50",
    credits: 50,
    price: 62.5,
    perCredit: 1.25,
    isPopular: true,
  },
  {
    id: "bundle-100",
    credits: 100,
    price: 100,
    perCredit: 1.0,
    isPopular: false,
  },
];

export default function SubscriptionCheckoutPage() {
  // Checkout state
  const [currentStep, setCurrentStep] = useState<
    "select" | "payment" | "success"
  >("select");
  const [subscriptionSelected, setSubscriptionSelected] = useState(true);
  const [selectedBundleId, setSelectedBundleId] = useState<string | null>(
    "bundle-50"
  ); // Default to 50 credits
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("subscription-credits");

  // Get selected bundle details
  const selectedBundle = selectedBundleId
    ? CREDIT_BUNDLES.find((bundle) => bundle.id === selectedBundleId)
    : null;

  // Calculate total amount
  const subscriptionPrice = 30; // $30/month
  const totalAmount = subscriptionSelected
    ? subscriptionPrice + (selectedBundle?.price || 0)
    : selectedBundle?.price || 0;

  // Handle bundle selection
  const handleBundleSelect = (bundleId: string) => {
    setSelectedBundleId(selectedBundleId === bundleId ? null : bundleId);
  };

  // Handle payment completion
  const handlePaymentComplete = () => {
    // This is called by CheckoutPaymentForm AFTER it has processed payment with Stripe.js (e.g. card elements)
    // For redirectToCheckout, this success is handled by Stripe redirecting to success_url.
    // So, this specific function might be for a different flow (e.g. embedded elements success)
    // or might need to be re-evaluated in context of redirectToCheckout.
    // For now, if redirectToCheckout is used, success is handled by Stripe's success_url.
    setCurrentStep("success"); 
  };

  const handleContinueToPackage = () => {
    console.warn(
      'Prevented assignment: `window.location.href = "/package/create"`'
    ) /*TODO: Do not use window.location for navigation. Use react-router instead.*/;
  };
  
  const [clientSecretForPaymentForm, setClientSecretForPaymentForm] = useState<string | null>(null);


  // Helper to get user auth details (replace with your actual auth context/logic)
  const getAuthHeaders = () => {
    const token = localStorage.getItem("sessionToken"); 
    const userDataString = localStorage.getItem("userData");
    const userData = userDataString ? JSON.parse(userDataString) : null;

    if (!token || !userData?.id || !userData?.email) {
      // toast({ title: "Authentication Error", description: "User not authenticated. Please log in.", variant: "destructive" });
      // Throwing error here to be caught by caller
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

  // Placeholder Price IDs from backend/services/stripeService.js (or your .env if frontend has access)
  const PRO_PLAN_PRICE_ID_FROM_ENV = import.meta.env.VITE_PRO_PLAN_PRICE_ID || 'price_placeholder_pro_plan'; 

  const SIGNATURE_PACK_PRICE_IDS_MAP_FROM_ENV: Record<string, string> = {
    'bundle-10': import.meta.env.VITE_SIGNATURE_PACK_PRICE_ID_10 || 'price_placeholder_pack_10',
    'bundle-50': import.meta.env.VITE_SIGNATURE_PACK_PRICE_ID_50 || 'price_placeholder_pack_50',
    'bundle-100': import.meta.env.VITE_SIGNATURE_PACK_PRICE_ID_100 || 'price_placeholder_pack_100',
    // Add other bundles if they exist (e.g. bundle-5, bundle-25)
  };


  const handleProceedToStripeCheckout = async () => {
    setIsProcessing(true);
    if (!subscriptionSelected && !selectedBundleId) {
      // toast({ title: "No items selected", description: "Please select a plan or credit bundle.", variant: "destructive" });
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

    let sessionId;
    try {
      if (activeTab === 'subscription-only' && subscriptionSelected) {
        // Only Pro subscription
        const response = await fetch(`${API_BASE_URL}/stripe/create-subscription`, {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({ priceId: PRO_PLAN_PRICE_ID_FROM_ENV }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to create subscription session.');
        sessionId = data.sessionId;
      } else if (activeTab === 'subscription-credits') {
        // This logic needs to be smarter if backend doesn't support mixed cart.
        // Assuming for now: if credits are selected, it's a credit pack purchase.
        // If subscription is also selected, it will be a separate transaction or UI should guide it.
        // The current backend supports one checkout session at a time (either sub or one-time payment).
        
        // Scenario 1: Subscription + Credits (User wants both)
        // This would ideally be handled by a backend that can create a checkout session with both items.
        // If not, we might need two separate checkouts or guide the user.
        // For this iteration, let's assume if credits are involved, we prioritize that checkout.
        // A more robust solution might involve creating the subscription first, then adding credits, or vice-versa.
        
        if (selectedBundleId && selectedBundle) {
            const stripeCreditPriceId = SIGNATURE_PACK_PRICE_IDS_MAP_FROM_ENV[selectedBundleId];
            if (!stripeCreditPriceId) {
                throw new Error(`Stripe Price ID not found for credit bundle: ${selectedBundleId}`);
            }
            // If subscription is also selected, the current backend creates a *separate* session.
            // This example will proceed to checkout for credits. User might need to sub separately.
            // A better UX would be a combined checkout if possible.
            const response = await fetch(`${API_BASE_URL}/stripe/create-checkout-session-for-packs`, {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify({ priceId: stripeCreditPriceId, quantity: 1 }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to create checkout session for credits.');
            sessionId = data.sessionId;
        } else if (subscriptionSelected) { // Only subscription selected under this tab (no bundle)
             const response = await fetch(`${API_BASE_URL}/stripe/create-subscription`, {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify({ priceId: PRO_PLAN_PRICE_ID_FROM_ENV }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to create subscription session.');
            sessionId = data.sessionId;
        } else {
            // toast({ title: "Selection Error", description: "Please select items to purchase.", variant: "destructive" });
            setIsProcessing(false);
            return;
        }
      } else {
        // toast({ title: "Invalid Tab", description: "Unknown selection.", variant: "destructive" });
        setIsProcessing(false);
        return;
      }

      if (!stripePromise || !sessionId) {
        // toast({ title: "Stripe Error", description: "Stripe.js has not loaded or session ID is missing.", variant: "destructive" });
        setIsProcessing(false);
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

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "subscription-only") {
      setSelectedBundleId(null);
    } else if (value === "subscription-credits" && !selectedBundleId) {
      setSelectedBundleId("bundle-50"); // Default to 50 credits if none selected
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
          >
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeftIcon className="h-4 w-4" />

              <span>Back</span>
            </Button>
          </Link>

          <Link
            to="/"
            className="text-lg font-medium text-orange-600 dark:text-orange-500"
          >
            <SignheyLogo />
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {currentStep === "select" && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">
                Activate Your Subscription
              </h1>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Get unlimited access to all Signhey features and purchase
                eSignature credits to start sending packages right away.
              </p>
            </div>

            <Tabs
              defaultValue="subscription-credits"
              value={activeTab}
              onValueChange={handleTabChange}
              className="mb-8"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="subscription-credits">
                  Subscription + Credits
                </TabsTrigger>
                <TabsTrigger value="subscription-only">
                  Subscription Only
                </TabsTrigger>
              </TabsList>
              <TabsContent value="subscription-credits" className="pt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-xl font-medium mb-4">
                      1. Pro+ Subscription
                    </h2>
                    <SubscriptionPlanCard
                      isSelected={subscriptionSelected}
                      onSelect={() =>
                        setSubscriptionSelected(!subscriptionSelected)
                      }
                    />

                    <div className="mt-8">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-medium">
                          2. eSignature Credits
                        </h2>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center text-sm text-gray-500 cursor-help">
                                What are credits?
                                <HelpCircleIcon className="h-4 w-4 ml-1" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>
                                Each time you send a package to a client for
                                electronic signature, one credit is used.
                                Credits never expire.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {CREDIT_BUNDLES.map((bundle) => (
                          <CreditBundleCard
                            key={bundle.id}
                            id={bundle.id}
                            credits={bundle.credits}
                            price={bundle.price}
                            perCredit={bundle.perCredit}
                            isPopular={bundle.isPopular}
                            isSelected={selectedBundleId === bundle.id}
                            onSelect={handleBundleSelect}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-medium mb-4">Order Summary</h2>
                    <CheckoutSummary
                      subscriptionPrice={
                        subscriptionSelected ? subscriptionPrice : 0
                      }
                      selectedBundle={
                        selectedBundle
                          ? {
                              id: selectedBundle.id,
                              credits: selectedBundle.credits,
                              price: selectedBundle.price,
                            }
                          : null
                      }
                    />

                    <Button
                      onClick={handleProceedToStripeCheckout}
                      className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white"
                      disabled={isProcessing || (!subscriptionSelected && !selectedBundleId)}
                    >
                      {isProcessing ? "Processing..." : "Continue to Payment"}
                    </Button>

                    <p className="text-xs text-center text-gray-500 mt-4">
                      By continuing, you agree to our{" "}
                      <Link
                        to="/terms"
                        className="text-orange-500 hover:text-orange-600"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-orange-500 hover:text-orange-600"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="subscription-only" className="pt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-xl font-medium mb-4">
                      Pro+ Subscription
                    </h2>
                    <SubscriptionPlanCard
                      isSelected={subscriptionSelected}
                      onSelect={() =>
                        setSubscriptionSelected(!subscriptionSelected)
                      }
                    />

                    <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        <strong>Note:</strong> You'll need to purchase
                        eSignature credits separately before you can send
                        packages to clients.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-medium mb-4">Order Summary</h2>
                    <CheckoutSummary
                      subscriptionPrice={
                        subscriptionSelected ? subscriptionPrice : 0
                      }
                      selectedBundle={null}
                    />

                    <Button
                      onClick={handleProceedToStripeCheckout}
                      className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white"
                      disabled={isProcessing || !subscriptionSelected}
                    >
                      {isProcessing ? "Processing..." : "Continue to Payment"}
                    </Button>

                    <p className="text-xs text-center text-gray-500 mt-4">
                      By continuing, you agree to our{" "}
                      <Link
                        to="/terms"
                        className="text-orange-500 hover:text-orange-600"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-orange-500 hover:text-orange-600"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}

        {currentStep === "payment" && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Payment Details</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Complete your purchase to activate your subscription
                {selectedBundle
                  ? ` and add ${selectedBundle.credits} credits`
                  : ""}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* The CheckoutPaymentForm is likely for an embedded Stripe Elements flow.
                  Since we are using redirectToCheckout, this form might not be used in this specific path.
                  If currentStep 'payment' is still intended, it implies we'd show a summary
                  and then redirect, or use Stripe Elements here.
                  For redirectToCheckout, the "Continue to Payment" button directly triggers the redirect.
                  So, this "payment" step in the UI might be skipped or simplified.
                  Let's assume for now that `handleProceedToStripeCheckout` handles the redirect,
                  and this 'payment' step might be for a different flow or can be removed if only redirect is used.
                  If this step IS to be shown, then `handleProceedToStripeCheckout` should have been called by a button
                  on THIS step, not the "select" step.
                  
                  Given the current task, `handleProceedToStripeCheckout` is the primary action.
                  The existence of CheckoutPaymentForm suggests an alternative payment path (Stripe Elements).
                  We'll keep the structure but note that `redirectToCheckout` bypasses client-side form handling.
              */}
              <div>
                <h2 className="text-xl font-medium mb-4">Confirm Purchase</h2>
                 <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You will be redirected to Stripe to complete your payment securely.
                </p>
                {/* This button could trigger the redirect if not done on previous step */}
                {/* <Button onClick={handleProceedToStripeCheckout} disabled={isProcessing} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  {isProcessing ? "Redirecting..." : `Pay $${totalAmount}`}
                </Button> */}
                
                {/* If CheckoutPaymentForm is intended for use with redirectToCheckout, it's a misunderstanding of Stripe flows.
                    It's typically for Stripe Elements. For now, this component will be "skipped" by the redirect logic.
                */}
                <CheckoutPaymentForm 
                  totalAmount={totalAmount}
                  onPaymentComplete={handlePaymentComplete} // This would be called if using Stripe Elements and payment succeeds client-side
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                  clientSecret={clientSecretForPaymentForm} // Pass client secret if using Payment Intents with Elements
                />
              </div>

              <div>
                <h2 className="text-xl font-medium mb-4">Order Summary</h2>
                <CheckoutSummary
                  subscriptionPrice={
                    subscriptionSelected ? subscriptionPrice : 0
                  }
                  selectedBundle={
                    selectedBundle
                      ? {
                          id: selectedBundle.id,
                          credits: selectedBundle.credits,
                          price: selectedBundle.price,
                        }
                      : null
                  }
                />

                <Button
                  onClick={() => setCurrentStep("select")}
                  variant="outline"
                  className="w-full mt-6"
                  disabled={isProcessing}
                >
                  Back to Selection
                </Button>
              </div>
            </div>
          </div>
        )}

        {currentStep === "success" && (
          <div className="max-w-3xl mx-auto">
            <CheckoutSuccess
              subscriptionActive={subscriptionSelected}
              creditsPurchased={selectedBundle?.credits || null}
              onContinue={handleContinueToPackage}
            />
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Signhey. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                to="/terms"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
              >
                Terms of Service
              </Link>
              <Link
                to="/privacy"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
              >
                Privacy Policy
              </Link>
              <Link
                to="/contact"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
