import { useState, useEffect } from 'react';
// No AuthContext needed here as this is a public page accessed by signerLinkID
import { toast } from 'sonner';

// Define types for the package data expected by the signer view
// These should align with the response payload of GET /api/signerflow/:signerLinkID
export interface SignerPackageData {
  packageName: string;
  packageStatus: string;
  proBusinessName: string;
  proLogoUrl: string | null;
  proContactInfo: string; // Consider if this should always be displayed or if Pro can toggle visibility

  signatureRequired: boolean;
  boldsignDocumentId: string | null;
  agreementStatus: string | null;
  originalFileName: string | null;

  documentRequest?: { // Optional because it might not be requested
    requested: boolean;
    document_name?: string; // Name of the document to be uploaded by signer
    description?: string;   // Description or instructions for the document
  };
  
  paymentRequest?: { // Optional
    requested: boolean;
    amount?: number; // In cents
    currency?: string;
    description?: string;
  };

  packageId: string; // Internal Signhey package ID
  signerLinkID: string;
}

export const useSignerPackage = (signerLinkID?: string) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";
  const [packageData, setPackageData] = useState<SignerPackageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!signerLinkID) {
      setIsLoading(false);
      setError("No Signer Link ID provided.");
      return;
    }

    setIsLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}/signerflow/${signerLinkID}`)
      .then(res => {
        if (!res.ok) {
          return res.json().then(errData => { 
            // Attempt to parse error, default if parsing fails or no specific error message
            const apiError = errData?.error || `API Error: ${res.status}`;
            throw new Error(apiError);
          });
        }
        return res.json();
      })
      .then((data: SignerPackageData) => {
        setPackageData(data);
      })
      .catch(err => {
        console.error("Failed to fetch package details for signer:", err);
        setError(err.message);
        toast.error(`Failed to load package: ${err.message}`);
      })
      .finally(() => setIsLoading(false));
      
  }, [signerLinkID, API_BASE_URL]);

  // Function to explicitly refetch data, e.g., after an action
  const refetchPackageData = () => {
    if (!signerLinkID) return;
    setIsLoading(true);
    // Duplicates the fetch logic from useEffect. Could be further refactored.
     fetch(`${API_BASE_URL}/signerflow/${signerLinkID}`)
      .then(res => {
        if (!res.ok) {
          return res.json().then(errData => { 
            const apiError = errData?.error || `API Error: ${res.status}`;
            throw new Error(apiError);
          });
        }
        return res.json();
      })
      .then((data: SignerPackageData) => {
        setPackageData(data);
        setError(null); // Clear previous errors on successful refetch
      })
      .catch(err => {
        console.error("Failed to refetch package details for signer:", err);
        setError(err.message);
        toast.error(`Failed to reload package data: ${err.message}`);
      })
      .finally(() => setIsLoading(false));
  };

  return { packageData, isLoading, error, refetchPackageData };
};
