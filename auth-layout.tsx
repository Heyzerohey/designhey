import { cn } from "@/lib/utils";
import SignheyLogo from "@/polymet/components/signhey-logo";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export default function AuthLayout({
  children,
  title,
  description,
  className,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center">
            <SignheyLogo />
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className={cn("w-full max-w-md space-y-6", className)}>
          {/* Auth header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>

          {/* Auth form */}
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4">
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
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
