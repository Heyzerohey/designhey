import SignheyLogo from "@/polymet/components/signhey-logo";
import PrivacyContent from "@/polymet/components/privacy-content";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <header className="border-b border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center">
            <SignheyLogo />
          </Link>
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <PrivacyContent />
        </div>
      </main>

      <footer className="border-t border-gray-100 dark:border-gray-800 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Signhey. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link to="/terms" className="hover:text-orange-500">
              Terms of Service
            </Link>
            <Link to="/privacy" className="hover:text-orange-500">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
