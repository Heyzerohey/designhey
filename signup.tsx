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

  const handleSignup = async (email: string, password: string) => {
    setIsLoading(true);
    setError(undefined);

    try {
      // This would be replaced with actual signup logic
      // For example: await supabase.auth.signUp({ email, password })

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, simulate successful signup
      if (email !== "taken@example.com") {
        // Set signup success state
        setSignupSuccess(true);
      } else {
        // Simulate signup error
        setError("This email is already in use");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("An unexpected error occurred. Please try again.");
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
