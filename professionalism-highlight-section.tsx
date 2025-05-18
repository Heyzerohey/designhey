import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StarIcon, TrendingUpIcon, BadgeCheckIcon } from "lucide-react";

export default function ProfessionalismHighlightSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-950 overflow-hidden relative">
      {/* Background pattern - subtle grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 grid grid-cols-12 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="border-r border-gray-900 dark:border-gray-100 h-full"
            />
          ))}
        </div>
        <div className="absolute inset-0 grid grid-rows-12 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="border-b border-gray-900 dark:border-gray-100 w-full"
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center mb-6">
            <StarIcon className="h-6 w-6 text-orange-500 mr-2" />

            <h2 className="text-2xl md:text-3xl font-bold">
              Look Like a Pro, Win More Clients
            </h2>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-10 text-lg">
            First impressions matter. Signhey's professional client experience
            helps you stand out from the competition and win more business.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-900 shadow-sm">
              <BadgeCheckIcon className="h-8 w-8 text-orange-500 mb-4" />

              <h3 className="font-medium text-lg mb-2">
                Professional Branding
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Customize your client experience with your logo, colors, and
                business name.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-900 shadow-sm">
              <TrendingUpIcon className="h-8 w-8 text-orange-500 mb-4" />

              <h3 className="font-medium text-lg mb-2">Higher Conversion</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Clients are 3x more likely to complete onboarding with a
                streamlined process.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-900 shadow-sm">
              <StarIcon className="h-8 w-8 text-orange-500 mb-4" />

              <h3 className="font-medium text-lg mb-2">Client Satisfaction</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Clients appreciate the ease and professionalism of your
                onboarding experience.
              </p>
            </div>
          </div>

          <Button
            asChild
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 h-auto text-lg"
          >
            <Link to="/signup">
              Make a Lasting Impression – Get Started Now
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
