import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "@/polymet/layouts/auth-layout";
import AuthForm from "@/polymet/components/auth-form";
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(undefined);

    try {
      // This would be replaced with actual authentication logic
      // For example: await supabase.auth.signInWithPassword({ email, password })

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, simulate successful login
      if (email === "demo@example.com" && password === "password123") {
        // Set login success state
        setLoginSuccess(true);
      } else {
        // Simulate authentication error
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // If login is successful, show a success message with a link to dashboard
  if (loginSuccess) {
    return (
      <AuthLayout
        title="Login Successful"
        description="You have been successfully logged in"
      >
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
              <CheckIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-muted-foreground">
            Redirecting you to your dashboard...
          </p>
          <Link to="/dashboard">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to your account to continue"
    >
      <AuthForm
        type="login"
        onSubmit={handleLogin}
        isLoading={isLoading}
        error={error}
      />

      <div className="text-center">
        <Link
          to="/forgot-password"
          className="text-sm text-orange-500 hover:text-orange-600"
        >
          Forgot your password?
        </Link>
      </div>
    </AuthLayout>
  );
}
