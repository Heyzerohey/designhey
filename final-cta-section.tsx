import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircleIcon, BookOpenIcon } from "lucide-react";

export default function FinalCtaSection() {
  return (
    <section className="py-24 bg-white dark:bg-gray-950 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-30"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-orange-500/5 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-orange-500/5 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stop Losing Clients – Start Winning More Today
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of professionals who've silenced their onboarding
            hassles.
          </p>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 mb-10 shadow-sm">
            <div className="flex items-center justify-center mb-6">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 overflow-hidden bg-orange-100 dark:bg-orange-900/30">
                  <img
                    src="https://github.com/yusufhilmi.png"
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 overflow-hidden bg-orange-100 dark:bg-orange-900/30">
                  <img
                    src="https://github.com/furkanksl.png"
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 overflow-hidden bg-orange-100 dark:bg-orange-900/30">
                  <img
                    src="https://github.com/kdrnp.png"
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 overflow-hidden bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <span className="text-xs font-medium text-orange-500">
                    +5K
                  </span>
                </div>
              </div>
              <span className="ml-3 text-gray-600 dark:text-gray-300">
                Professionals trust Signhey
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Free onboarding support to get you started
            </p>

            <Button
              asChild
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 h-auto text-lg"
            >
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button asChild variant="outline" className="flex items-center">
              <Link to="/contact">
                <MessageCircleIcon className="h-4 w-4 mr-2" />
                Questions? Contact us
              </Link>
            </Button>
            <Button asChild variant="ghost" className="flex items-center">
              <Link to="/resources">
                <BookOpenIcon className="h-4 w-4 mr-2" />
                Explore our Resources
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
