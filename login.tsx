import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "@/polymet/layouts/auth-layout";
import AuthForm from "@/polymet/components/auth-form";
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false); // Local loading state for the form
  const [error, setError] = useState<string | undefined>(); // Local error state for the form
  // const [loginSuccess, setLoginSuccess] = useState(false); // loginSuccess state might no longer be needed locally
  const navigate = useNavigate(); // For redirection after successful login
  const { login: authLogin, isLoading: authIsLoading } = useAuth(); // Use login from AuthContext

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

      if (response.ok && data.user && data.session) {
        // Call login from AuthContext
        authLogin(data.user, data.session.access_token);
        toast.success("Login Successful! Redirecting...");
        // setLoginSuccess(true); // Context now handles the user state
        navigate('/dashboard'); // Redirect to dashboard after successful login and context update
      } else {
        const errorMessage = data.error || "Invalid email or password. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err: any) {
      console.error("Login API error:", err);
      const errorMessage = err.message || "An unexpected error occurred. Please try again later.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // loginSuccess state and its related UI can be removed if AuthContext handles redirection
  // For example, App.tsx or a ProtectedRoute component can watch useAuth().user and redirect.

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to your account to continue"
    >
      <AuthForm
        type="login"
        onSubmit={handleLogin}
        isLoading={isLoading || authIsLoading} // Combine local and auth loading states
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
