import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ListIcon, AlertTriangleIcon } from 'lucide-react'; // Assuming ListIcon is suitable

interface Transaction {
  date: string; // ISO date string
  type: string; // 'Credit Purchase' or 'New Subscription' or 'Subscription Renewal' etc.
  description: string;
  amount: number | null; // Amount in cents or null if not applicable (e.g. some subscription events)
  currency: string | null;
  // Add other fields as needed, like userEmail or userBusinessName if displaying for admin
}

interface BillingHistoryProps {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  // Add pagination props if pagination is handled by this component
}

const BillingHistoryDisplay: React.FC<BillingHistoryProps> = ({
  transactions,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ListIcon className="h-5 w-5 mr-2 text-gray-500" />
            Billing History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading billing history...</p>
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
            Billing History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ListIcon className="h-5 w-5 mr-2 text-gray-500" />
            Billing History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>No billing transactions found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ListIcon className="h-5 w-5 mr-2 text-gray-500" />
          Billing History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full"> {/* Adjust height as needed */}
          <div className="space-y-4">
            {transactions.map((item, index) => (
              <div key={index} className="flex justify-between items-start p-3 rounded-md border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <div>
                  <p className="font-medium text-sm">{item.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.date).toLocaleDateString()} - {item.type}
                  </p>
                </div>
                <div className="text-right">
                  {item.amount !== null && (
                    <p className="font-semibold text-sm">
                      {(item.amount / 100).toFixed(2)} {item.currency?.toUpperCase()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        {/* TODO: Add pagination controls if API supports it and this component handles it */}
      </CardContent>
    </Card>
  );
};

export default BillingHistoryDisplay;
