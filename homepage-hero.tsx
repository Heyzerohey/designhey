import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, ChevronRightIcon } from "lucide-react";

export default function HomepageHero() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Onboarding, silenced.
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Sign agreements. Upload documents. Accept payments. All with one
            link.
          </p>
          <div className="inline-flex items-center justify-center px-3 py-1 mb-8 text-sm font-medium rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300">
            10,000+ Pros onboarded
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Link to="/signup">
                Get Started
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="#pricing">See Pricing</Link>
            </Button>
          </div>
        </div>

        {/* UI Mockup */}
        <div className="relative max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-sm transition-all hover:shadow-md">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-500 flex items-center justify-center mb-4">
                <span className="font-medium">1</span>
              </div>
              <h3 className="font-medium text-lg mb-2">Sign</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Review and sign agreements with a simple, secure e-signature.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-sm transition-all hover:shadow-md">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-500 flex items-center justify-center mb-4">
                <span className="font-medium">2</span>
              </div>
              <h3 className="font-medium text-lg mb-2">Upload</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Securely upload required documents with drag-and-drop ease.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-sm transition-all hover:shadow-md">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-500 flex items-center justify-center mb-4">
                <span className="font-medium">3</span>
              </div>
              <h3 className="font-medium text-lg mb-2">Pay</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Complete payment securely in the same seamless flow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
