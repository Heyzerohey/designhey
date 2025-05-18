import { Link } from "react-router-dom";
import SignheyLogo from "@/polymet/components/signhey-logo";
import HomeNavigation from "@/polymet/components/home-navigation";
import PricingTable from "@/polymet/components/pricing-table";
import FaqAccordion from "@/polymet/components/faq-accordion";
import StoriesSection from "@/polymet/components/stories-section";
import UpdatedHowItWorksSection from "@/polymet/components/updated-how-it-works-section";
import ProfessionalismHighlightSection from "@/polymet/components/professionalism-highlight-section";
import TestimonialsSection from "@/polymet/components/testimonials-section";
import CaseStudySection from "@/polymet/components/case-study-section";
import TrustNarrativeSection from "@/polymet/components/trust-narrative-section";
import FinalCtaSection from "@/polymet/components/final-cta-section";
import { ArrowRightIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UpdatedHomePage() {
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
                <Link to="/signup">Get Started</Link>
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

      {/* Stories Section */}
      <StoriesSection />

      {/* Updated How It Works Section */}
      <UpdatedHowItWorksSection />

      {/* Feature Highlights */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Simplicity by design
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-5xl mx-auto">
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
              <h3 className="text-lg font-medium mb-3">All-in-One Links</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Stop stressing over paperwork. One link handles everything.
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
                  <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />

                  <path d="M12 18h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-3">Mobile-Friendly Flow</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Seamless 3-step process works on any device, anywhere.
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
                  <path d="M20 7h-9" />

                  <path d="M14 17H5" />

                  <circle cx="17" cy="17" r="3" />

                  <circle cx="7" cy="7" r="3" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-3">
                Branding That Wins Clients
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Personalize links with your branding to impress clients.
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
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />

                  <path d="M7 12h10" />

                  <path d="M12 7v10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-3">Secure & Compliant</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                GDPR, E-SIGN, eIDAS, and HIPAA compliant for peace of mind.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center justify-center px-4 py-2 mb-6 text-sm font-medium rounded-full bg-gray-100 dark:bg-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-orange-500 mr-2"
              >
                <circle cx="12" cy="12" r="10" />

                <polyline points="12 6 12 12 16 14" />
              </svg>
              Save 5+ Hours a Week on Client Onboarding
            </div>
            <p className="text-lg mb-6">
              Ready to silence your onboarding?{" "}
              <Link
                to="/signup"
                className="text-orange-500 font-medium hover:underline"
              >
                Get started now <ChevronRightIcon className="inline h-4 w-4" />
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Professionalism Highlight Section */}
      <ProfessionalismHighlightSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Case Study Section */}
      <CaseStudySection />

      {/* Trust Narrative Section */}
      <TrustNarrativeSection />

      {/* Pricing Preview */}
      <section id="pricing" className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-xl mx-auto">
            Choose the plan that fits your needs. All plans include our core
            features.
          </p>

          <PricingTable />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Frequently asked questions
          </h2>

          <FaqAccordion />
        </div>
      </section>

      {/* Final CTA Section */}
      <FinalCtaSection />

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
