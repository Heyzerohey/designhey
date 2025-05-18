import { Link } from "react-router-dom";
import SignheyLogo from "@/polymet/components/signhey-logo";
import HomeNavigation from "@/polymet/components/home-navigation";
import PricingTable from "@/polymet/components/pricing-table";
import FaqAccordion from "@/polymet/components/faq-accordion";
import { ArrowRightIcon, CheckIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center">
            <SignheyLogo />
          </Link>
          <HomeNavigation />
        </div>
      </header>

      {/* Hero Section */}
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
                <Link to="/signup?plan=pro-plus">Get Started</Link>
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

      {/* Feature Highlights */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Simplicity by design
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center group-hover:shadow transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-orange-500"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />

                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-3">
                Single Link Simplicity
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Share one link for your client to complete everything in a
                single flow.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center group-hover:shadow transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-orange-500"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />

                  <path d="M7 7h.01" />

                  <path d="M7 12h.01" />

                  <path d="M7 17h.01" />

                  <path d="M12 7h5" />

                  <path d="M12 12h5" />

                  <path d="M12 17h5" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-3">
                Secure Document Uploads
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                End-to-end encryption keeps sensitive documents protected.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center group-hover:shadow transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-orange-500"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />

                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-3">Payment Built-In</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Get paid faster with integrated, secure payment processing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Stories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            From our users
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 overflow-hidden mr-4">
                  <img
                    src="https://picsum.photos/seed/maria/200/200"
                    alt="Maria"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">Maria</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Consultant
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                "I used to spend hours chasing clients for signatures and
                payments. Now I send one link and everything is done in
                minutes."
              </p>
              <Button
                variant="link"
                className="text-orange-500 p-0 h-auto flex items-center"
              >
                Try it now <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 overflow-hidden mr-4">
                  <img
                    src="https://picsum.photos/seed/james/200/200"
                    alt="James"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">James</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Contractor
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                "My clients appreciate how professional the process feels. It's
                helped me win more projects and get paid faster."
              </p>
              <Button
                variant="link"
                className="text-orange-500 p-0 h-auto flex items-center"
              >
                Try it now <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 overflow-hidden mr-4">
                  <img
                    src="https://picsum.photos/seed/lila/200/200"
                    alt="Lila"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">Lila</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Coach
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                "The seamless onboarding experience has reduced my client
                drop-off rate by 40%. Worth every penny."
              </p>
              <Button
                variant="link"
                className="text-orange-500 p-0 h-auto flex items-center"
              >
                Try it now <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-xl mx-auto">
            Choose the plan that fits your needs. All plans include our core
            features.
          </p>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold">Pro+</h3>
                  <div className="flex items-baseline mt-1">
                    <span className="text-3xl font-bold">$30</span>
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
                  <h4 className="text-lg font-medium mb-4">
                    Included Features
                  </h4>
                  <ul className="space-y-3">
                    {[
                      "Unlimited Packages",
                      "Simulate Signing Flows",
                      "Real Signatures",
                      "Full Dashboard Access",
                      "Collect Payments from Clients",
                      "Mobile-Friendly Signer Experience",
                      "Secure File Uploads",
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />

                        <span className="text-gray-600 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-medium mb-4">
                      Cost Calculator
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Our pricing is simple: $30/month base fee plus $1.25 per
                      sign for the first 100 signs, and $1.00 per sign after
                      that.
                    </p>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-4 pt-4">
                      <div className="flex justify-between font-medium">
                        <span>Example: 50 signs/month</span>
                        <span>$92.50/month</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        ($30 base + $62.50 sign fees)
                      </p>
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
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Button asChild variant="outline" className="mx-auto">
              <Link to="/pricing">Compare Plans</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Frequently asked questions
          </h2>

          <FaqAccordion />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="#"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    Security
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="#"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    Guides
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="#"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/terms"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    Cookies
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    Licenses
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="mb-4 md:mb-0">
              <SignheyLogo showTagline />
            </div>
            <div className="flex space-x-6">
              <Link to="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link to="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </Link>
              <Link to="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">GitHub</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Built with care by Signhey © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
