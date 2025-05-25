import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../AuthContext'; // Adjust path as needed

// Define types for API responses
export interface Transaction { // Exporting for use in components
  date: string; 
  type: string; 
  description: string;
  amount: number | null; 
  currency: string | null;
  userEmail?: string; // Optional, depending on backend response for admin view
  userBusinessName?: string; // Optional
}
export interface PaginationData { // Re-export or import from a shared types file
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}
interface BillingHistoryApiResponse {
  data: Transaction[];
  pagination: PaginationData;
}

export const useBillingHistory = (initialPage: number = 1, initialLimit: number = 10) => {
  const { user, token } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

  const [history, setHistory] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationData, setPaginationData] = useState<PaginationData>({
    currentPage: initialPage,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: initialLimit,
  });

  const setPage = useCallback((newPage: number) => {
    setPaginationData(prev => ({ ...prev, currentPage: newPage }));
  }, []);

  useEffect(() => {
    if (user && token) {
      setIsLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        page: paginationData.currentPage.toString(),
        limit: paginationData.itemsPerPage.toString(),
      });

      fetch(`${API_BASE_URL}/billing/history?${queryParams.toString()}`, {
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
      .then((data: BillingHistoryApiResponse) => {
        setHistory(data.data || []); // Ensure data.data is not undefined
        if (data.pagination) {
          setPaginationData(data.pagination);
        }
      })
      .catch(err => {
        console.error("Failed to fetch billing history:", err);
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
    } else if (!token && !isLoading) {
        setIsLoading(false);
        setError("User not authenticated. Cannot fetch billing history.");
    }
  }, [user, token, API_BASE_URL, paginationData.currentPage, paginationData.itemsPerPage, isLoading]); // Added isLoading

  return { history, isLoading, error, paginationData, setPage };
};
