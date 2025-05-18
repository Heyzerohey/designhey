"use client";

import { useState } from "react";
import WelcomeHeader from "@/polymet/components/welcome-header";
import ProgressIndicator from "@/polymet/components/progress-indicator";
import AgreementPreview from "@/polymet/components/agreement-preview";
import SignatureCanvas from "@/polymet/components/signature-canvas";
import FileUploadArea from "@/polymet/components/file-upload-area";
import PaymentSection from "@/polymet/components/payment-section";
import ConfirmationMessage from "@/polymet/components/confirmation-message";

interface ClientEngagementFlowProps {
  professionalName: string;
  professionalAvatar?: string;
  professionalEmail: string;
  professionalPhone?: string;
  businessName?: string;
  businessLogo?: string;
  clientName?: string;
  agreementTitle: string;
  agreementPages: string[];
  paymentAmount?: number;
  paymentDescription?: string;
}

export default function ClientEngagementFlow({
  professionalName,
  professionalAvatar,
  professionalEmail,
  professionalPhone,
  businessName,
  businessLogo,
  clientName,
  agreementTitle,
  agreementPages,
  paymentAmount,
  paymentDescription,
}: ClientEngagementFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasAgreed, setHasAgreed] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const steps = ["Agreement", "Files", "Payment"];
  const showFilesStep = true;
  const showPaymentStep = paymentAmount !== undefined && paymentAmount > 0;

  const handleAgree = () => {
    setHasAgreed(true);
    setTimeout(() => {
      setCurrentStep(1);
    }, 1000);
  };

  const handleSignatureComplete = (data: string) => {
    setSignatureData(data);
    setHasAgreed(true);
    setTimeout(() => {
      setCurrentStep(1);
    }, 1000);
  };

  const handleFilesUploaded = (files: File[]) => {
    setUploadedFiles(files);
    if (files.length > 0 && !showPaymentStep) {
      setTimeout(() => {
        setCurrentStep(3); // Skip to confirmation if no payment needed
      }, 1000);
    } else if (files.length > 0 && showPaymentStep) {
      setTimeout(() => {
        setCurrentStep(2); // Go to payment step
      }, 1000);
    }
  };

  const handlePaymentComplete = () => {
    setPaymentComplete(true);
    setTimeout(() => {
      setCurrentStep(3); // Go to confirmation step
    }, 1000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8">
            <AgreementPreview
              agreementTitle={agreementTitle}
              agreementPages={agreementPages}
              onAgree={handleAgree}
              businessName={businessName}
            />

            {hasAgreed && (
              <div className="mt-8 animate-fadeIn">
                <h3 className="text-lg font-medium mb-4">Sign to Confirm</h3>
                <SignatureCanvas
                  onSignatureComplete={handleSignatureComplete}
                />
              </div>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Upload Required Documents</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please upload any requested documents below.
            </p>
            <FileUploadArea
              onFilesUploaded={handleFilesUploaded}
              businessName={businessName}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Complete Payment</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please complete the payment to finalize your engagement.
            </p>
            <PaymentSection
              amount={paymentAmount || 0}
              description={paymentDescription || "Service fee"}
              businessName={businessName}
              onPaymentComplete={handlePaymentComplete}
            />
          </div>
        );

      case 3:
        return (
          <ConfirmationMessage
            title="Thank You"
            message="Your information has been submitted successfully. Your professional will review your documents and contact you within 24 hours."
            lawyerName={professionalName}
            lawyerEmail={professionalEmail}
            lawyerPhone={professionalPhone}
            businessName={businessName}
            actionLabel="Return to Dashboard"
            actionPath="/dashboard"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <WelcomeHeader
          professionalName={professionalName}
          professionalAvatar={professionalAvatar}
          businessName={businessName}
          businessLogo={businessLogo}
          clientName={clientName}
        />
      </div>

      {currentStep < 3 && (
        <div className="mb-8">
          <ProgressIndicator
            steps={showPaymentStep ? steps : steps.slice(0, 2)}
            currentStep={currentStep}
          />
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {renderStep()}
      </div>
    </div>
  );
}
