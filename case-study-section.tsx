import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClockIcon, DollarSignIcon, CheckIcon } from "lucide-react";

export default function CaseStudySection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Image column */}
            <div className="relative">
              <div className="rounded-xl overflow-hidden shadow-md">
                <img
                  src="https://picsum.photos/seed/sarah/600/800"
                  alt="Sarah, freelance designer"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-5 w-5 text-orange-500" />

                  <span className="font-bold">5+ hours saved weekly</span>
                </div>
              </div>
            </div>

            {/* Content column */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                How Sarah reclaimed her weekends
              </h2>

              <div className="prose dark:prose-invert max-w-none mb-8">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Sarah is a freelance web designer who works with 8-10 clients
                  each month. Before Signhey, her client onboarding process was
                  a nightmare.
                </p>

                <h3 className="text-lg font-medium mt-6 mb-3">The Challenge</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  "I was spending my Sundays chasing signatures, hunting for
                  missing documents, and manually tracking payments. It was
                  exhausting and unprofessional."
                </p>

                <h3 className="text-lg font-medium mt-6 mb-3">The Solution</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Sarah switched to Signhey and created a streamlined onboarding
                  flow for her clients. Now she sends one link that handles
                  everything.
                </p>

                <div className="space-y-3 my-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-2">
                      <CheckIcon className="h-3 w-3 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>5+ hours saved</strong> each week on
                      administrative tasks
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-2">
                      <CheckIcon className="h-3 w-3 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>30% faster payments</strong> with integrated
                      payment processing
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-2">
                      <CheckIcon className="h-3 w-3 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Zero missed documents</strong> with required file
                      uploads
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border-l-4 border-orange-500 italic mb-6">
                  "Now I spend my weekends with my family instead of chasing
                  paperwork. Signhey has literally given me my life back."
                </div>
              </div>

              <Button
                asChild
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Link to="/signup">
                  Ready to Save Time Like Sarah? Sign Up Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
