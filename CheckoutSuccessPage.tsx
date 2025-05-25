import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from './AuthContext'; // Adjust path as needed
import { toast } from 'sonner';

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const purchaseType = searchParams.get('type'); // 'subscription' or 'signature_pack'

  // Optional: You might want to refetch user/subscription/credit data here
  // or verify the session status with your backend for added security/confirmation.
  // For this example, we'll primarily rely on webhooks to update backend state.

  useEffect(() => {
    if (sessionId) {
      // Potentially clear any cart-related state from localStorage if you used one
      toast.success(`Payment successful for your ${purchaseType === 'subscription' ? 'subscription' : 'credit pack'}!`);
    }
  }, [sessionId, purchaseType]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 p-4 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md shadow-xl bg-white dark:bg-gray-900/80 backdrop-blur-lg border-gray-200 dark:border-gray-700/50">
        <CardHeader className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            {purchaseType === 'subscription' 
              ? "Your subscription has been activated. Welcome aboard!" 
              : "Your signature credits have been added to your account."}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            An email confirmation has been sent to you. Your account details should reflect these changes shortly.
            (Backend processing via webhooks might take a moment.)
          </p>
          <Link to="/dashboard">
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 mt-4">
              Go to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
