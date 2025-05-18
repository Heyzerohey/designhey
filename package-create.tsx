import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftIcon, EyeIcon, SendIcon } from "lucide-react";
import FileUploadArea from "@/polymet/components/file-upload-area";
import { ALL_CLIENTS } from "@/polymet/data/clients-data";

export default function PackageCreatePage() {
  const [searchParams] = useState(() => {
    // Create a URLSearchParams object from the current URL if in browser environment
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  });

  const clientId = searchParams.get("client");

  // Find client if clientId is provided
  const client = clientId ? ALL_CLIENTS.find((c) => c.id === clientId) : null;

  const [formData, setFormData] = useState({
    agreementName: "Basic Service Agreement",
    requestDocuments: true,
    documentName: "Proof of ID",
    requestPayment: true,
    paymentAmount: "500",
    clientEmail: client?.email || "",
    clientName: client?.name || "",
    message: `Hi${client ? ` ${client.name.split(" ")[0]}` : ""},\n\nPlease review and sign the attached agreement. ${client ? "Looking forward to working with you!" : ""}`,
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState("agreement");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFilesUploaded = (files: File[]) => {
    setUploadedFiles(files);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handlePreview = () => {
    // In a real implementation, this would show a preview
    console.log("Preview package:", formData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // In a real implementation, this would save and share the package
      console.log("Package created:", { ...formData, files: uploadedFiles });
      // Navigate to dashboard or show success message
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeftIcon className="h-4 w-4" />

                <span>Back</span>
              </Button>
            </Link>
            <h1 className="text-3xl font-semibold tracking-tight">
              Create a New Package
            </h1>
          </div>
          <p className="text-muted-foreground">
            Set Up Your Agreement, Documents, and Payment
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="agreement">Agreement</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="client">Client Details</TabsTrigger>
            </TabsList>

            <TabsContent value="agreement" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Agreement Document</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="agreementName">Agreement Name</Label>
                    <Input
                      id="agreementName"
                      name="agreementName"
                      value={formData.agreementName}
                      onChange={handleInputChange}
                      placeholder="e.g. Basic Service Agreement"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Upload Agreement</Label>
                    <FileUploadArea
                      onFilesUploaded={handleFilesUploaded}
                      businessName="Your Business"
                      acceptedFileTypes=".pdf,.doc,.docx"
                      maxFiles={1}
                      maxSizeMB={5}
                    />

                    {uploadedFiles.length === 0 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        No file uploaded. A basic template will be used.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={() => setActiveTab("requirements")}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Next: Requirements
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="requirements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Document Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="requestDocuments">
                        Request Documents
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Ask your client to upload specific documents
                      </p>
                    </div>
                    <Switch
                      id="requestDocuments"
                      checked={formData.requestDocuments}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("requestDocuments", checked)
                      }
                    />
                  </div>

                  {formData.requestDocuments && (
                    <div className="space-y-2">
                      <Label htmlFor="documentName">Document Name</Label>
                      <Input
                        id="documentName"
                        name="documentName"
                        value={formData.documentName}
                        onChange={handleInputChange}
                        placeholder="e.g. Proof of ID"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="requestPayment">Request Payment</Label>
                      <p className="text-sm text-muted-foreground">
                        Ask your client to make a payment
                      </p>
                    </div>
                    <Switch
                      id="requestPayment"
                      checked={formData.requestPayment}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("requestPayment", checked)
                      }
                    />
                  </div>

                  {formData.requestPayment && (
                    <div className="space-y-2">
                      <Label htmlFor="paymentAmount">Payment Amount ($)</Label>
                      <Input
                        id="paymentAmount"
                        name="paymentAmount"
                        value={formData.paymentAmount}
                        onChange={handleInputChange}
                        placeholder="e.g. 500"
                        type="number"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("agreement")}
                >
                  Back: Agreement
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab("client")}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Next: Client Details
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="client" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Client Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">Client Email</Label>
                    <Input
                      id="clientEmail"
                      name="clientEmail"
                      value={formData.clientEmail}
                      onChange={handleInputChange}
                      placeholder="client@example.com"
                      type="email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input
                      id="clientName"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message to Client</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Add a personal message..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("requirements")}
                >
                  Back: Requirements
                </Button>
                <div className="space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreview}
                    className="border-orange-500 text-orange-500 hover:bg-orange-50"
                  >
                    <EyeIcon className="mr-2 h-4 w-4" />
                    Preview Package
                  </Button>
                  <Button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={isSubmitting}
                  >
                    <SendIcon className="mr-2 h-4 w-4" />

                    {isSubmitting ? "Creating..." : "Save and Share"}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </form>
    </div>
  );
}
