import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "@/polymet/layouts/auth-layout";
import AuthForm from "@/polymet/components/auth-form";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [signupSuccess, setSignupSuccess] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

  const handleSignup = async (email: string, password: string) => {
    setIsLoading(true);
    setError(undefined);

    try {
      // Note: The AuthForm currently doesn't collect 'businessName'.
      // If 'businessName' is required or beneficial for signup, AuthForm and this handler would need adjustment.
      // For now, we'll proceed without it, as the backend's 'business_name' is optional.
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password /* business_name: "Optional Business Name" */ }),
      });

      const data = await response.json();

      if (response.status === 201) { // HTTP 201 for successful creation
        setSignupSuccess(true); // This will trigger UI change to show success message and link.
        // The backend currently returns:
        // { message: 'Signup successful. Please check your email for confirmation if enabled.', 
        //   user: authData.user, profile: profileData[0], credits: creditsData[0] }
        // We are not directly logging the user in or storing tokens here,
        // as email confirmation might be pending. The user will be redirected to login.
      } else {
        setError(data.error || "Could not create account. Please try again.");
      }
    } catch (err) {
      console.error("Signup API error:", err);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // If signup is successful, show a success message with a link to onboarding
  if (signupSuccess) {
    return (
      <AuthLayout
        title="Account Created"
        description="Your account has been successfully created"
      >
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
              <CheckIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-muted-foreground">
            Let's get your account set up!
          </p>
          <Link to="/onboarding">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Continue to Onboarding
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create an account"
      description="Sign up to get started with Signhey"
    >
      <AuthForm
        type="signup"
        onSubmit={handleSignup}
        isLoading={isLoading}
        error={error}
      />

      <div className="text-center text-xs text-muted-foreground">
        By signing up, you agree to our{" "}
        <Link to="/terms" className="text-orange-500 hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/privacy" className="text-orange-500 hover:underline">
          Privacy Policy
        </Link>
        .
      </div>
    </AuthLayout>
  );
}
