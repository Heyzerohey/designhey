import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { CheckIcon, HelpCircleIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function PricingTable() {
  const [signVolume, setSignVolume] = useState(50);
  const [totalCost, setTotalCost] = useState(0);
  const basePrice = 30; // $30/month base price

  // Calculate total cost based on sign volume
  useEffect(() => {
    let signCost = 0;

    if (signVolume <= 100) {
      signCost = signVolume * 1.25;
    } else {
      signCost = 100 * 1.25 + (signVolume - 100) * 1.0;
    }

    setTotalCost(basePrice + signCost);
  }, [signVolume]);

  const features = [
    "Unlimited Packages",
    "Simulate Signing Flows",
    "Real Signatures",
    "Full Dashboard Access",
    "Collect Payments from Clients",
    "Mobile-Friendly Signer Experience",
    "Secure File Uploads",
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold">Pro+</h3>
            <div className="flex items-baseline mt-1">
              <span className="text-3xl font-bold">${basePrice}</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">
                /month
              </span>
            </div>
          </div>
          <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 px-3 py-1 rounded-full text-sm font-medium">
            Recommended
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="text-lg font-medium mb-4">Included Features</h4>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />

                  <span className="text-gray-600 dark:text-gray-300">
                    {feature}
                  </span>
                </li>
              ))}
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />

                <span className="text-gray-600 dark:text-gray-300">
                  You keep 100% of payments
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircleIcon className="h-4 w-4 inline-block ml-1 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>
                          Standard Stripe processing fees (2.9% + 30¢) apply,
                          but we don't add any markups.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
              </li>
            </ul>
          </div>

          <div>
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <h4 className="text-lg font-medium">Cost Calculator</h4>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center text-sm text-gray-500 cursor-help">
                        What's a completed sign?
                        <HelpCircleIcon className="h-4 w-4 ml-1" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>
                        A completed sign is counted when your client completes
                        the entire signing process, including document review,
                        signature, and submission.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">1 sign</span>
                  <span className="text-sm text-gray-500">500 signs</span>
                </div>
                <Slider
                  value={[signVolume]}
                  min={1}
                  max={500}
                  step={1}
                  onValueChange={(value) => setSignVolume(value[0])}
                  className="mb-2"
                />

                <div className="text-center">
                  <span className="text-lg font-medium">
                    {signVolume} signs/month
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between mb-2">
                  <span>Base price</span>
                  <span>${basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>
                    Sign cost
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircleIcon className="h-4 w-4 inline-block ml-1 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>
                            $1.25/sign for first 100 signs, then $1.00/sign
                            after that
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </span>
                  <span>
                    $
                    {(signVolume <= 100
                      ? signVolume * 1.25
                      : 100 * 1.25 + (signVolume - 100) * 1.0
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                <div className="flex justify-between font-bold">
                  <span>Total monthly cost</span>
                  <span>${totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <span className="text-gray-600 dark:text-gray-300">
                  <strong>Example:</strong> At 50 signs/month = $
                  {(basePrice + 50 * 1.25).toFixed(2)}
                  /month (just ${((basePrice + 50 * 1.25) / 50).toFixed(2)} per
                  sign)
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-600 dark:text-gray-300">
                  <strong>Example:</strong> At 150 signs/month = $
                  {(basePrice + 100 * 1.25 + 50 * 1.0).toFixed(2)}/month (just $
                  {((basePrice + 100 * 1.25 + 50 * 1.0) / 150).toFixed(2)} per
                  sign)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center">
              <div className="bg-orange-100 dark:bg-orange-900/30 rounded-full p-2 mr-3">
                <CheckIcon className="h-5 w-5 text-orange-500" />
              </div>
              <span className="text-gray-600 dark:text-gray-300 font-medium">
                14-Day Money-Back Guarantee
              </span>
            </div>
            <div>
              <Button
                asChild
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white w-full md:w-auto"
              >
                <Link to="/signup?plan=pro-plus">Get Started</Link>
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            No hidden fees – what you see is what you pay. Third-party fees
            (e.g., Stripe) apply where applicable.
          </p>
        </div>
      </div>
    </div>
  );
}
