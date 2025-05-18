import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Loader2 } from "lucide-react";
import {
  GoogleLogo,
  AppleLogo,
} from "@/polymet/components/auth-provider-logos";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For demo purposes, we'll use a simple validation
      if (email === "demo@example.com" && password === "password") {
        // Navigate using Link component instead
        console.warn(
          'Prevented assignment: `window.location.href = "/dashboard"`'
        ) /*TODO: Do not use window.location for navigation. Use react-router instead.*/;
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setIsLoading(true);
    // Simulate social login
    setTimeout(() => {
      console.warn(
        'Prevented assignment: `window.location.href = "/dashboard"`'
      ) /*TODO: Do not use window.location for navigation. Use react-router instead.*/;
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="text-2xl font-bold text-orange-500">
            Signhey
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/how-it-works"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400"
            >
              How It Works
            </Link>
            <Link
              to="/features"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400"
            >
              Features
            </Link>
            <Link
              to="/resources"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400"
            >
              Resources
            </Link>
            <Link
              to="/faq"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400"
            >
              FAQ
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          {/* Social login buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleSocialLogin("google")}
              disabled={isLoading}
            >
              <GoogleLogo className="h-5 w-5 mr-2" />
              Google
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleSocialLogin("apple")}
              disabled={isLoading}
            >
              <AppleLogo className="h-5 w-5 mr-2" />
              Apple
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-md flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />

                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-orange-500 hover:text-orange-600"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={setRememberMe}
                disabled={isLoading}
              />

              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Sign up
            </Link>
          </div>
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
