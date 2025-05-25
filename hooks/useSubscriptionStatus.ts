import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext'; // Adjust path as needed

export interface SubscriptionData { // Exporting for use in components
  plan_name: string | null;
  status: string | null;
  current_period_end: string | null;
  current_period_start: string | null; // Added based on backend API
  stripe_subscription_id: string | null; // Added based on backend API
  message?: string; // For 'inactive' status or errors
}

export const useSubscriptionStatus = () => {
  const { user, token } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && token) {
      setIsLoading(true);
      setError(null);
      fetch(`${API_BASE_URL}/subscriptions/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-user-id': user.id,
        },
      })
      .then(res => {
        if (!res.ok) {
          return res.json().then(errData => { throw new Error(errData.error || `API Error: ${res.status}`) });
        }
        return res.json();
      })
      .then((data: SubscriptionData) => {
        setSubscription(data);
      })
      .catch(err => {
        console.error("Failed to fetch subscription status:", err);
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
    } else if (!token && !isLoading) { // Avoid setting error during initial auth loading
        setIsLoading(false);
        setError("User not authenticated. Cannot fetch subscription status.");
    }
  }, [user, token, API_BASE_URL, isLoading]); // Added isLoading to deps

  return { subscription, isLoading, error };
};
