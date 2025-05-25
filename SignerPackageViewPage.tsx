import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSignerPackage, type SignerPackageData } from '../hooks/useSignerPackage'; // Adjust path
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import FileUploadArea from '@/polymet/components/file-upload-area'; // Assuming this path is correct
import { toast } from 'sonner';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { ArrowLeftIcon, CheckCircle, DollarSign, DownloadCloud, Edit, ExternalLink, FileText, Info, Loader2, UploadCloud } from 'lucide-react';

// Initialize Stripe (outside component to avoid re-initialization on re-renders)
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
let stripePromise: Promise<Stripe | null> | null = null;
if (stripePublishableKey) {
  stripePromise = loadStripe(stripePublishableKey);
} else {
  console.error("Stripe Publishable Key is missing. Payment functionality will be disabled.");
}

export default function SignerPackageViewPage() {
  const { signerLinkID } = useParams<{ signerLinkID: string }>();
  const navigate = useNavigate();
  const { packageData, isLoading, error, refetchPackageData } = useSignerPackage(signerLinkID);

  const [isUploading, setIsUploading] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false); // Simple state for UI feedback
  const [uploadedFileForSubmit, setUploadedFileForSubmit] = useState<File | null>(null);

  const [isPaying, setIsPaying] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

  useEffect(() => {
    if (!stripePromise && packageData?.paymentRequest?.requested) {
        toast.error("Payment service is not configured correctly.");
    }
    // Check for payment status from Stripe redirect
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment_status') === 'success') {
        toast.success("Payment successful! Your package details will be updated shortly.");
        // refetchPackageData(); // Refetch data to get updated package status post-payment webhook
    } else if (urlParams.get('payment_status') === 'cancelled') {
        toast.info("Payment was cancelled. You can try again if needed.");
    }
    // Clean up URL params after processing them
    if (urlParams.has('payment_status')) {
        navigate(window.location.pathname, { replace: true });
    }

  }, [packageData, navigate, refetchPackageData]);


  const handleSignDocument = () => {
    if (packageData?.boldsignDocumentId) {
      // This is a placeholder. Actual BoldSign integration method (URL redirect or embedded SDK) depends on BoldSign's API.
      // Example: Redirect to a constructed URL (if applicable)
      // window.location.href = `https://your.boldsign.domain/document/sign/${packageData.boldsignDocumentId}`;
      toast.info("Redirecting to BoldSign for signature... (Placeholder - Full integration needed)");
      // For embedded, you would initialize the BoldSign SDK here.
      // Example: BoldSign.loadDocument(packageData.boldsignDocumentId, { ...options... });
    } else {
      toast.error("No document ID available for signing.");
    }
  };

  const handleFileSelected = (files: File[]) => {
    if (files.length > 0) {
      setUploadedFileForSubmit(files[0]);
      setIsFileUploaded(false); // Reset if new file selected
    } else {
      setUploadedFileForSubmit(null);
    }
  };

  const handleDocumentUpload = async () => {
    if (!uploadedFileForSubmit || !signerLinkID) {
      toast.error("Please select a document to upload.");
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append('requestedDocument', uploadedFileForSubmit);

    try {
      const response = await fetch(`${API_BASE_URL}/signerflow/${signerLinkID}/upload-document`, {
        method: 'POST',
        body: formData,
        // Headers for FormData are set by browser, including Content-Type: multipart/form-data
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'File upload failed.');
      }
      toast.success("Document uploaded successfully!");
      setIsFileUploaded(true); // For UI feedback
      setUploadedFileForSubmit(null); // Clear selection
      refetchPackageData(); // Refresh package data to show new status or uploaded doc info
    } catch (uploadError: any) {
      toast.error(`Upload failed: ${uploadError.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePayment = async () => {
    if (!packageData?.paymentRequest?.requested || !signerLinkID || !stripePromise) {
      toast.error("Payment cannot be processed at this time.");
      return;
    }
    setIsPaying(true);
    try {
      const response = await fetch(`${API_BASE_URL}/signerflow/${signerLinkID}/create-payment-session`, {
        method: 'POST',
        // No body needed if not sending email; headers for JSON can be omitted if no body.
      });
      const session = await response.json();
      if (!response.ok) {
        throw new Error(session.error || 'Failed to create payment session.');
      }

      const stripe = await stripePromise;
      if (stripe && session.sessionId) {
        const { error: stripeError } = await stripe.redirectToCheckout({ sessionId: session.sessionId });
        if (stripeError) {
          toast.error(`Stripe Error: ${stripeError.message}`);
        }
      } else {
        throw new Error("Stripe.js not loaded or session ID missing.");
      }
    } catch (paymentError: any) {
      toast.error(`Payment failed: ${paymentError.message}`);
    } finally {
      setIsPaying(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen"><Loader2 className="h-12 w-12 animate-spin text-orange-500" /> <p className="ml-3 text-lg">Loading Package...</p></div>;
  }
  if (error) {
    return <div className="container mx-auto p-4 text-center">
        <Alert variant="destructive" className="max-w-lg mx-auto">
            <AlertTitle className="text-xl font-semibold">Error Loading Package</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <Button onClick={() => navigate('/')} variant="link" className="mt-2">Go to Homepage</Button>
        </Alert>
    </div>;
  }
  if (!packageData) {
    return <div className="container mx-auto p-4 text-center"><p>No package data found.</p></div>;
  }

  // Determine overall package status for display
  let isCompleted = packageData.packageStatus === 'completed';
  let isDeclinedOrRevoked = packageData.packageStatus === 'declined' || packageData.packageStatus === 'revoked';
  
  // Check individual component statuses
  const signatureDone = !packageData.signatureRequired || packageData.agreementStatus === 'Completed';
  const uploadDone = !packageData.documentRequest?.requested || isFileUploaded; // Simple UI feedback. Backend status is source of truth.
  const paymentDone = !packageData.paymentRequest?.requested || packageData.packageStatus === 'payment_complete'; // Or check payments table via packageData if enriched

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <Button variant="ghost" onClick={() => navigate('/')} className="absolute top-4 left-4 text-sm">
        <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back to Signhey
      </Button>
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="bg-gray-100 dark:bg-gray-800 p-6 rounded-t-lg">
            {packageData.proLogoUrl && (
              <img src={packageData.proLogoUrl} alt={`${packageData.proBusinessName} Logo`} className="h-16 w-auto mx-auto mb-4 rounded-md" />
            )}
            <CardTitle className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white">
              {packageData.packageName}
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-400">
              Requested by: {packageData.proBusinessName}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {isCompleted && (
              <Alert variant="default" className="mb-6 bg-green-50 border-green-500 dark:bg-green-900/30 dark:border-green-700">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <AlertTitle className="font-semibold text-green-700 dark:text-green-300">Package Completed!</AlertTitle>
                <AlertDescription className="text-green-600 dark:text-green-400">
                  All steps have been successfully completed. Thank you!
                </AlertDescription>
              </Alert>
            )}
            {isDeclinedOrRevoked && (
              <Alert variant="destructive" className="mb-6">
                <Info className="h-5 w-5" />
                <AlertTitle className="font-semibold">Package {packageData.packageStatus}</AlertTitle>
                <AlertDescription>
                  This package is no longer active. Please contact {packageData.proBusinessName} for more information.
                </AlertDescription>
              </Alert>
            )}

            {/* Agreement Signing Section */}
            {packageData.signatureRequired && !isCompleted && !isDeclinedOrRevoked && (
              <section className="mb-6 p-4 border rounded-lg dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <Edit className="h-5 w-5 mr-2 text-orange-500"/> E-Signature
                </h2>
                <p className="text-sm text-muted-foreground mb-1">Document: {packageData.originalFileName || 'Agreement'}</p>
                <p className="text-sm text-muted-foreground mb-3">Status: <Badge variant={packageData.agreementStatus === 'Completed' ? 'default' : 'outline'}>{packageData.agreementStatus || 'Pending'}</Badge></p>
                {packageData.agreementStatus !== 'Completed' ? (
                  <Button onClick={handleSignDocument} className="w-full bg-orange-500 hover:bg-orange-600">
                    View & Sign Agreement <ExternalLink className="h-4 w-4 ml-2"/>
                  </Button>
                ) : (
                  <p className="text-sm text-green-600 dark:text-green-400 flex items-center"><CheckCircle className="h-4 w-4 mr-1"/> Agreement Signed</p>
                )}
              </section>
            )}

            {/* Document Upload Section */}
            {packageData.documentRequest?.requested && !isCompleted && !isDeclinedOrRevoked && (
              <section className="mb-6 p-4 border rounded-lg dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <UploadCloud className="h-5 w-5 mr-2 text-orange-500"/> Document Upload
                </h2>
                <p className="text-sm text-muted-foreground mb-1">Requested: {packageData.documentRequest.document_name}</p>
                {packageData.documentRequest.description && <p className="text-xs text-muted-foreground mb-3">{packageData.documentRequest.description}</p>}
                
                {/* Simple check: if any document exists in packageData.uploaded_documents, assume this step is done.
                    This should ideally be confirmed by `packageData.packageStatus` or a specific flag from backend. */}
                {uploadDone || packageData.packageStatus === 'documents_pending_review' ? (
                     <p className="text-sm text-green-600 dark:text-green-400 flex items-center"><CheckCircle className="h-4 w-4 mr-1"/> Document(s) Uploaded</p>
                ) : (
                    <>
                        <FileUploadArea
                            onFilesUploaded={handleFileSelected}
                            businessName={packageData.proBusinessName} // Or a generic placeholder
                            maxFiles={1} // Assuming one document for now
                        />
                        {uploadedFileForSubmit && <p className="text-xs mt-1">Selected: {uploadedFileForSubmit.name}</p>}
                        <Button onClick={handleDocumentUpload} disabled={isUploading || !uploadedFileForSubmit} className="w-full mt-3">
                            {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> : "Upload Document"}
                        </Button>
                    </>
                )}
              </section>
            )}

            {/* Payment Section */}
            {packageData.paymentRequest?.requested && !isCompleted && !isDeclinedOrRevoked && (
              <section className="p-4 border rounded-lg dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-orange-500"/> Payment
                </h2>
                <p className="text-sm text-muted-foreground mb-1">Amount: <strong>${(packageData.paymentRequest.amount! / 100).toFixed(2)} {packageData.paymentRequest.currency}</strong></p>
                {packageData.paymentRequest.description && <p className="text-xs text-muted-foreground mb-3">{packageData.paymentRequest.description}</p>}
                
                {paymentDone || packageData.packageStatus === 'payment_succeeded' ? ( // 'payment_succeeded' is a placeholder status
                     <p className="text-sm text-green-600 dark:text-green-400 flex items-center"><CheckCircle className="h-4 w-4 mr-1"/> Payment Completed</p>
                ) : (
                    <Button onClick={handlePayment} disabled={isPaying || !stripePromise} className="w-full bg-green-600 hover:bg-green-700">
                        {isPaying ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : "Proceed to Payment"}
                    </Button>
                )}
                {!stripePromise && <p className="text-xs text-red-500 mt-1">Payment service is currently unavailable.</p>}
              </section>
            )}
            
            {packageData.proContactInfo && (
                <div className="mt-8 pt-4 border-t dark:border-gray-700 text-center">
                    <p className="text-xs text-muted-foreground">If you have any questions, please contact {packageData.proBusinessName} at: {packageData.proContactInfo}</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
