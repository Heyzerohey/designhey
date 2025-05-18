import { Link } from "react-router-dom";
import SignheyLogo from "@/polymet/components/signhey-logo";
import HomeNavigation from "@/polymet/components/home-navigation";

interface BlogLayoutProps {
  children: React.ReactNode;
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center">
            <SignheyLogo />
          </Link>
          <HomeNavigation />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="#features"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="#pricing"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/compliance"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/blog"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/help"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/about"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    Contact
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
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="mb-4 md:mb-0">
              <SignheyLogo showTagline />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Signhey. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
