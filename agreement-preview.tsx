"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon } from "lucide-react";

interface AgreementPreviewProps {
  agreementTitle: string;
  agreementPages: string[];
  onAgree: () => void;
  businessName?: string;
  className?: string;
}

export default function AgreementPreview({
  agreementTitle,
  agreementPages,
  onAgree,
  businessName = "[Your Business Name]",
  className,
}: AgreementPreviewProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [hasRead, setHasRead] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const totalPages = agreementPages.length;

  // Process agreement pages to replace placeholders with business name
  const processedPages = agreementPages.map((page) =>
    page.replace(/Sakura Legal Group|Law Firm|Attorney/g, businessName)
  );

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);

      // Mark as read when reaching the last page
      if (currentPage === totalPages - 2) {
        setHasRead(true);
      }
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAgree = () => {
    setAgreed(true);
    onAgree();
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {/* Agreement header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <h2 className="text-lg font-medium text-center">
              {agreementTitle}
            </h2>
          </div>

          {/* Agreement content */}
          <div className="relative">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <div className="transform rotate-45 text-gray-500 dark:text-gray-400 text-6xl font-light">
                PREVIEW
              </div>
            </div>

            {/* Content */}
            <div className="p-6 min-h-[400px] max-h-[400px] overflow-y-auto bg-white dark:bg-gray-900">
              {agreed ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <div className="h-16 w-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <CheckIcon className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-xl font-medium text-orange-600 dark:text-orange-400">
                    Agreement Accepted
                  </h3>
                  <p className="text-center text-gray-600 dark:text-gray-300 max-w-md">
                    Thank you for reviewing and accepting the agreement. You can
                    proceed to the next step.
                  </p>
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: processedPages[currentPage],
                    }}
                  />
                </div>
              )}
            </div>

            {/* Navigation controls */}
            {!agreed && (
              <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPrevPage}
                    disabled={currentPage === 0}
                    className="h-8 px-2"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />

                    <span className="ml-1">Previous</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages - 1}
                    className="h-8 px-2"
                  >
                    <span className="mr-1">Next</span>
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Page {currentPage + 1} of {totalPages}
                </div>
              </div>
            )}
          </div>

          {/* Agreement action */}
          {!agreed && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {hasRead
                    ? "You have reviewed all pages of this agreement."
                    : "Please review all pages before agreeing."}
                </div>

                <Button
                  onClick={handleAgree}
                  disabled={!hasRead}
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white"
                >
                  I Agree to the Terms
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
