import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../AuthContext'; // Adjust path as needed
import { toast } from 'sonner'; // Optional: for error toasts within the hook

// Define types for API responses (can be moved to a types file if shared)
interface PackageAgreement {
  original_file_name: string | null;
  status: string | null;
  boldsign_document_id: string | null;
}
export interface DashboardPackage { // Exporting for use in components
  id: string;
  name: string;
  status: string;
  createdAt: string; 
  updatedAt: string; 
  agreementFileName: string | null; 
  agreementStatus: string | null;   
}
export interface PaginationData { // Exporting for use in components
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}
interface PackagesApiResponse {
  data: DashboardPackage[];
  pagination: PaginationData;
}

export const useDashboardPackages = (initialPage: number = 1, initialLimit: number = 10, initialStatus?: string) => {
  const { user, token } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

  const [packages, setPackages] = useState<DashboardPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationData, setPaginationData] = useState<PaginationData>({
    currentPage: initialPage,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: initialLimit,
  });
  const [statusFilter, setStatusFilter] = useState<string | undefined>(initialStatus);
  
  // setPage function to allow components to change the current page
  const setPage = useCallback((newPage: number) => {
    setPaginationData(prev => ({ ...prev, currentPage: newPage }));
  }, []);

  // setFilter function (optional, if you want to change filter dynamically)
  const setFilter = useCallback((newStatus?: string) => {
    setStatusFilter(newStatus);
    setPage(1); // Reset to first page when filter changes
  }, [setPage]);


  useEffect(() => {
    if (user && token) {
      setIsLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        page: paginationData.currentPage.toString(),
        limit: paginationData.itemsPerPage.toString(),
      });
      if (statusFilter) {
        queryParams.append('status', statusFilter);
      }

      fetch(`${API_BASE_URL}/packages?${queryParams.toString()}`, {
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
      .then((data: PackagesApiResponse) => {
        setPackages(data.data);
        if (data.pagination) {
          setPaginationData(data.pagination);
        }
      })
      .catch(err => {
        console.error("Failed to fetch packages:", err);
        setError(err.message);
        // toast.error(`Failed to load packages: ${err.message}`); // Optional toast
      })
      .finally(() => setIsLoading(false));
    } else if (!token && !isLoading) {
        // Handle case where user is not authenticated after initial auth check
        setIsLoading(false);
        setError("User not authenticated. Cannot fetch packages.");
    }
  }, [user, token, API_BASE_URL, paginationData.currentPage, paginationData.itemsPerPage, statusFilter, isLoading]); // Added isLoading to deps to avoid loop if auth fails

  return { packages, isLoading, error, paginationData, setPage, setFilter };
};
