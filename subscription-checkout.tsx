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
    setCurrentStep("success");
  };

  // Handle continue to package creation
  const handleContinueToPackage = () => {
    console.warn(
      'Prevented assignment: `window.location.href = "/package/create"`'
    ) /*TODO: Do not use window.location for navigation. Use react-router instead.*/;
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
                      onClick={() => setCurrentStep("payment")}
                      className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white"
                      disabled={!subscriptionSelected && !selectedBundleId}
                    >
                      Continue to Payment
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
                      onClick={() => setCurrentStep("payment")}
                      className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white"
                      disabled={!subscriptionSelected}
                    >
                      Continue to Payment
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
              <div>
                <h2 className="text-xl font-medium mb-4">Payment Method</h2>
                <CheckoutPaymentForm
                  totalAmount={totalAmount}
                  onPaymentComplete={handlePaymentComplete}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
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
