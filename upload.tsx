import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import SignheyLogo from "@/polymet/components/signhey-logo";
import ProgressIndicator from "@/polymet/components/progress-indicator";
import WelcomeHeader from "@/polymet/components/welcome-header";
import FileUploadArea from "@/polymet/components/file-upload-area";

export default function UploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleFilesUploaded = (files: File[]) => {
    setUploadedFiles(files);
    setIsUploading(true);

    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setUploadComplete(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 py-4 px-6">
        <div className="max-w-3xl mx-auto">
          <SignheyLogo />
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="border-b border-gray-200 dark:border-gray-800 py-4 px-6">
        <div className="max-w-3xl mx-auto">
          <ProgressIndicator
            steps={["Agreement", "Files", "Payment"]}
            currentStep={1}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow py-8 px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Welcome Header */}
          <WelcomeHeader
            professionalName="Alex Johnson"
            professionalAvatar="https://github.com/yusufhilmi.png"
            clientName="Sarah Chen"
            businessName="Creative Design Studio"
          />

          {/* Upload Section */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-xl font-medium mb-2">
              Upload Required Documents
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please upload the documents requested by Creative Design Studio to
              proceed with your engagement.
            </p>

            <FileUploadArea
              onFilesUploaded={handleFilesUploaded}
              businessName="Creative Design Studio"
              acceptedFileTypes=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />

            {isUploading && (
              <div className="mt-6 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Uploading your files...
                </p>
              </div>
            )}

            {uploadComplete && (
              <div className="mt-6 text-center text-green-600 dark:text-green-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="mt-2">
                  {uploadedFiles.length} file
                  {uploadedFiles.length !== 1 ? "s" : ""} uploaded successfully!
                </p>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Link to="/client-engagement">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Agreement
              </Button>
            </Link>

            <Link to="/payment">
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
                disabled={!uploadComplete && uploadedFiles.length === 0}
              >
                Continue to Payment
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-4 px-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Powered by Signhey • Secure Document Handling</p>
      </footer>
    </div>
  );
}
