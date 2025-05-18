"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  GoogleLogo,
  AppleLogo,
} from "@/polymet/components/auth-provider-logos";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AuthFormProps {
  type: "login" | "signup";
  onSubmit: (email: string, password: string) => void;
  isLoading?: boolean;
  error?: string;
  className?: string;
}

export default function AuthForm({
  type,
  onSubmit,
  isLoading = false,
  error,
  className,
}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (type === "signup" && password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    onSubmit(email, password);
  };

  return (
    <div className={cn("w-full max-w-md", className)}>
      <div className="flex flex-col space-y-6">
        {/* Social Auth */}
        <div className="grid grid-cols-1 gap-3">
          <Button
            variant="outline"
            type="button"
            className="bg-white dark:bg-gray-950"
          >
            <GoogleLogo className="h-5 w-5 mr-2" />

            {type === "login" ? "Sign in with Google" : "Sign up with Google"}
          </Button>
          <Button
            variant="outline"
            type="button"
            className="bg-white dark:bg-gray-950"
          >
            <AppleLogo className="h-5 w-5 mr-2" />

            {type === "login" ? "Sign in with Apple" : "Sign up with Apple"}
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-2 text-xs text-muted-foreground">
              OR CONTINUE WITH EMAIL
            </span>
          </div>
        </div>

        {/* Error message */}
        {(error || passwordError) && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />

            <AlertDescription>{error || passwordError}</AlertDescription>
          </Alert>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete={type === "login" ? "username" : "email"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={
                type === "login" ? "current-password" : "new-password"
              }
            />
          </div>
          {type === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {type === "login" ? "Signing in..." : "Signing up..."}
              </>
            ) : type === "login" ? (
              "Sign in"
            ) : (
              "Sign up"
            )}
          </Button>
        </form>

        {/* Switch between login/signup */}
        <div className="text-center text-sm">
          {type === "login" ? (
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="text-orange-500 hover:underline">
                Sign up
              </Link>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-orange-500 hover:underline">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
