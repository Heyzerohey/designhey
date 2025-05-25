import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext'; // Adjust path as needed

export interface DashboardStatsData { // Exporting for use in components
  totalPackages: number;
  pendingPackages: number;
  completedPackages: number;
  signatureCreditsAvailable: number;
  // Add other stats fields if your API returns more
}

export const useDashboardStats = () => {
  const { user, token } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && token) {
      setIsLoading(true);
      setError(null);
      fetch(`${API_BASE_URL}/dashboard/stats`, {
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
      .then((data: DashboardStatsData) => {
        setStats(data);
      })
      .catch(err => {
        console.error("Failed to fetch dashboard stats:", err);
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
    } else if (!token && !isLoading) { // Avoid setting error during initial auth loading
        setIsLoading(false);
        setError("User not authenticated. Cannot fetch dashboard stats.");
    }
  }, [user, token, API_BASE_URL, isLoading]); // Added isLoading

  return { stats, isLoading, error };
};
