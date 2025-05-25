import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCartIcon, AlertTriangleIcon, CheckCircleIcon } from 'lucide-react'; // Assuming ShoppingCartIcon is suitable

interface SubscriptionStatusProps {
  plan_name: string | null;
  status: string | null; // e.g., 'active', 'trialing', 'past_due', 'inactive'
  current_period_end: string | null; // ISO date string
  isLoading: boolean;
  error: string | null;
}

const SubscriptionStatusDisplay: React.FC<SubscriptionStatusProps> = ({
  plan_name,
  status,
  current_period_end,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCartIcon className="h-5 w-5 mr-2 text-gray-500" />
            Subscription Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading subscription status...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-500">
        <CardHeader>
          <CardTitle className="flex items-center text-red-500">
            <AlertTriangleIcon className="h-5 w-5 mr-2" />
            Subscription Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusVariant = (status: string | null): "default" | "secondary" | "destructive" | "outline" => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'trialing':
        return 'default'; // Default (often green or primary color via Badge styling)
      case 'past_due':
      case 'incomplete':
        return 'destructive';
      case 'inactive':
      case 'cancelled':
        return 'secondary';
      default:
        return 'outline';
    }
  };
  
  const formattedPeriodEnd = current_period_end 
    ? new Date(current_period_end).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingCartIcon className="h-5 w-5 mr-2 text-gray-500" />
          Subscription Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">Plan:</span>
          <span>{plan_name || 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Status:</span>
          {status ? <Badge variant={getStatusVariant(status)}>{status.toUpperCase()}</Badge> : 'N/A'}
        </div>
        {(status === 'active' || status === 'trialing' || status === 'past_due') && current_period_end && (
          <div className="flex justify-between items-center">
            <span className="font-medium">{status === 'past_due' ? 'Payment Due By' : 'Renews/Expires on:'}</span>
            <span>{formattedPeriodEnd}</span>
          </div>
        )}
         {status === 'inactive' && (
            <p className="text-sm text-muted-foreground">You are currently on the Free plan. Upgrade to Pro for more features!</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatusDisplay;
