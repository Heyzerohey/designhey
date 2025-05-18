import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUploadArea from "@/polymet/components/file-upload-area";
import ClientDetailsForm from "@/polymet/components/client-details-form";

interface PackageSetupFormProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function PackageSetupForm({
  onComplete,
  onSkip,
}: PackageSetupFormProps) {
  const [activeTab, setActiveTab] = useState("agreement");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [clientDetails, setClientDetails] = useState({
    clientEmail: "",
    clientName: "",
    message: "",
    requestPayment: true,
    paymentAmount: "500",
    paymentDescription: "Initial consultation fee",
  });

  const handleFilesUploaded = (files: File[]) => {
    setUploadedFiles(files);
  };

  const handleClientDetailsSubmit = (data: any) => {
    setClientDetails(data);
    onComplete();
  };

  const handleNextTab = () => {
    if (activeTab === "agreement") {
      setActiveTab("client");
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="agreement">Agreement</TabsTrigger>
          <TabsTrigger value="client">Client Details</TabsTrigger>
        </TabsList>

        <TabsContent value="agreement" className="space-y-6 pt-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Upload Agreement Document</h3>
            <p className="text-sm text-muted-foreground">
              Upload your service agreement or contract that your client will
              review and sign.
            </p>
          </div>

          <FileUploadArea
            onFilesUploaded={handleFilesUploaded}
            acceptedFileTypes=".pdf,.doc,.docx"
            maxFiles={1}
          />

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              variant="outline"
              onClick={onSkip}
              className="border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950"
            >
              Skip for now
            </Button>
            <Button
              onClick={handleNextTab}
              disabled={uploadedFiles.length === 0}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Continue
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="client" className="space-y-6 pt-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Client Information</h3>
            <p className="text-sm text-muted-foreground">
              Enter your client's details and customize the payment request if
              needed.
            </p>
          </div>

          <ClientDetailsForm
            onSubmit={handleClientDetailsSubmit}
            onBack={() => setActiveTab("agreement")}
            onSkip={onSkip}
            initialData={clientDetails}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
