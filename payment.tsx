import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import PaymentSection from "@/polymet/components/payment-section";
import ProgressIndicator from "@/polymet/components/progress-indicator";
import WelcomeHeader from "@/polymet/components/welcome-header";
import SignheyLogo from "@/polymet/components/signhey-logo";

export default function PaymentPage() {
  const [paymentComplete, setPaymentComplete] = useState(false);

  const handlePaymentComplete = () => {
    setPaymentComplete(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/upload"
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

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <ProgressIndicator
            steps={["Agreement", "Files", "Payment"]}
            currentStep={2}
          />
        </div>

        <WelcomeHeader
          professionalName="Alex Johnson"
          professionalAvatar="https://github.com/yusufhilmi.png"
          clientName="Sarah Chen"
          businessName="Creative Design Studio"
        />

        <div className="mt-10 space-y-8">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-medium mb-2">Complete Your Payment</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please complete the payment to finalize your engagement.
            </p>

            <PaymentSection
              amount={500}
              description="Initial consultation and document review fee for Creative Design Studio services."
              businessName="Creative Design Studio"
              onPaymentComplete={handlePaymentComplete}
            />
          </div>

          {paymentComplete && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
              <p className="text-green-700 dark:text-green-400 font-medium">
                Payment completed successfully! Thank you for your business.
              </p>
              <div className="mt-4">
                <Link to="/dashboard">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {!paymentComplete && (
            <div className="flex justify-between">
              <Link to="/upload">
                <Button
                  variant="outline"
                  className="border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950"
                >
                  Back to Files
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

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
