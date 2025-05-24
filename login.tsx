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

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(undefined);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store session and user data (example: using localStorage)
        // Note: For production, consider more secure token storage like HttpOnly cookies or secure state management
        localStorage.setItem("sessionToken", data.session.access_token); // Or data.session?.access_token
        localStorage.setItem("userData", JSON.stringify(data.user));    // Or data.user
        
        // Set login success state (which will trigger UI change and redirect)
        setLoginSuccess(true);
        
        // Optionally, you can directly navigate here too if not relying on loginSuccess state for redirection
        // navigate('/dashboard'); // Make sure 'navigate' from 'react-router-dom' is available if you use this
      } else {
        setError(data.error || "Invalid email or password. Please try again.");
      }
    } catch (err) {
      console.error("Login API error:", err);
      setError("An unexpected error occurred. Please try again later.");
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
