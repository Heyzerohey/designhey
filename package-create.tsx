import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftIcon, EyeIcon, SendIcon } from "lucide-react";
import FileUploadArea from "@/polymet/components/file-upload-area"; // Assuming this component handles file state well
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../AuthContext"; // Adjust path as needed
import { toast } from "sonner";
// import { ALL_CLIENTS } from "@/polymet/data/clients-data"; // Removing direct client data import

// Zod Schema for form validation
const packageCreateSchema = z.object({
  packageName: z.string().min(3, "Package name must be at least 3 characters."),
  clientName: z.string().min(2, "Client name is required."),
  clientEmail: z.string().email("Invalid email address."),
  // message: z.string().optional(), // Message to client - not sent to backend for now

  requestDocuments: z.boolean().default(false),
  documentName: z.string().optional(),

  requestPayment: z.boolean().default(false),
  paymentAmount: z.string().optional(), // Will be string from input, convert to number for cents
  // currency: z.string().default("USD"), // Defaulting to USD
});

type PackageCreateFormValues = z.infer<typeof packageCreateSchema>;

export default function PackageCreatePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

  // const clientId = searchParams.get("client");
  // const client = clientId ? ALL_CLIENTS.find((c) => c.id === clientId) : null; // Client prefill logic can be re-added if needed

  const form = useForm<PackageCreateFormValues>({
    resolver: zodResolver(packageCreateSchema),
    defaultValues: {
      packageName: "Basic Service Agreement",
      requestDocuments: true,
      documentName: "Proof of ID",
      requestPayment: true,
      paymentAmount: "500",
      clientEmail: "", // client?.email || "",
      clientName: "", // client?.name || "",
      // message: `Hi${client ? ` ${client.name.split(" ")[0]}` : ""},\n\nPlease review and sign the attached agreement. ${client ? "Looking forward to working with you!" : ""}`,
    },
  });

  const [agreementFile, setAgreementFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("agreement");
  // isSubmitting is now form.formState.isSubmitting from react-hook-form

  const handleFilesUploaded = (files: File[]) => {
    if (files.length > 0) {
      setAgreementFile(files[0]);
      form.clearErrors("agreementFile"); // Clear error if file is uploaded
    } else {
      setAgreementFile(null);
    }
  };
  
  // Watch values for conditional logic if needed (e.g., for UI changes)
  const watchRequestDocuments = form.watch("requestDocuments");
  const watchRequestPayment = form.watch("requestPayment");


  const onSubmit = async (data: PackageCreateFormValues) => {
    if (!user || !token) {
      toast.error("Authentication required. Please log in.");
      return;
    }
    if (!agreementFile) {
      toast.error("Agreement document is required.");
      form.setError("agreementFile" as any, { type: "manual", message: "Agreement document is required." }); // Set error for a virtual field
      return;
    }

    const formDataPayload = new FormData();
    formDataPayload.append("packageName", data.packageName);
    formDataPayload.append("signerName", data.clientName);
    formDataPayload.append("signerEmail", data.clientEmail);
    formDataPayload.append("agreementDocument", agreementFile);

    const documentRequestDetails = {
      requested: data.requestDocuments,
      document_name: data.requestDocuments ? data.documentName : undefined,
      description: data.requestDocuments ? `Please upload: ${data.documentName}` : undefined, // Example description
    };
    if (data.requestDocuments && !data.documentName) {
        toast.error("Document name is required if requesting documents.");
        form.setError("documentName", { type: "manual", message: "Document name is required."});
        return;
    }
    formDataPayload.append("documentRequestDetails", JSON.stringify(documentRequestDetails));

    const paymentAmountCents = data.paymentAmount ? Math.round(parseFloat(data.paymentAmount) * 100) : 0;
    const paymentRequestDetails = {
      requested: data.requestPayment,
      amount: data.requestPayment ? paymentAmountCents : undefined,
      currency: data.requestPayment ? "USD" : undefined, // Default currency
      description: data.requestPayment ? `Payment for ${data.packageName}` : undefined, // Example description
    };
     if (data.requestPayment && (!data.paymentAmount || paymentAmountCents <= 0)) {
        toast.error("Valid payment amount is required if requesting payment.");
        form.setError("paymentAmount", { type: "manual", message: "Valid payment amount required."});
        return;
    }
    formDataPayload.append("paymentRequestDetails", JSON.stringify(paymentRequestDetails));
    
    // The 'message' field is not sent to backend as per current plan

    try {
      const response = await fetch(`${API_BASE_URL}/packages`, {
        method: "POST",
        headers: {
          // 'Content-Type': 'multipart/form-data' is set automatically by browser with FormData
          'x-user-id': user.id,
          'Authorization': `Bearer ${token}`,
        },
        body: formDataPayload,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `API Error: ${response.status}`);
      }

      toast.success("Package created successfully!");
      // console.log("Package created:", result);
      // Display signer_link_id or provide copy button
      if (result.package && result.package.signer_link_id) {
        // Simple alert for now, can be a modal or dedicated UI section
        toast.info(
            <div>
                <p>Signer Link (Share with your client):</p>
                <Input type="text" readOnly value={`${window.location.origin}/signer-package/${result.package.signer_link_id}`} className="mt-1"/>
                <Button size="sm" className="mt-2" onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/signer-package/${result.package.signer_link_id}`);
                    toast.success("Link copied to clipboard!");
                }}>Copy Link</Button>
            </div>, 
            { duration: 10000 }
        );
      }
      navigate("/dashboard/packages"); // Redirect to packages list

    } catch (error: any) {
      console.error("Failed to create package:", error);
      toast.error(`Failed to create package: ${error.message}`);
    }
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                  <CardHeader><CardTitle>Agreement Document</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="packageName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Agreement Name</FormLabel>
                          <FormControl><Input placeholder="e.g. Basic Service Agreement" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="space-y-2">
                      <Label>Upload Agreement <span className="text-red-500">*</span></Label>
                      <FileUploadArea
                        onFilesUploaded={handleFilesUploaded}
                        businessName={user?.email || "Your Business"} // Use user's email or profile business name
                        acceptedFileTypes={{ 'application/pdf': ['.pdf'] }} // More specific
                        maxFiles={1}
                        maxSizeMB={5}
                      />
                      {form.formState.errors["agreementFile" as any] && (
                         <p className="text-sm text-red-500">{(form.formState.errors["agreementFile" as any] as any).message}</p>
                      )}
                      {!agreementFile && (
                        <p className="text-sm text-muted-foreground mt-2">
                          A PDF document is required.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-end">
                  <Button type="button" onClick={() => setActiveTab("requirements")} className="bg-orange-500 hover:bg-orange-600 text-white">
                    Next: Requirements
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="requirements" className="space-y-6">
                <Card>
                  <CardHeader><CardTitle>Document Requirements</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="requestDocuments"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Request Documents</FormLabel>
                            <FormDescription>Ask your client to upload specific documents.</FormDescription>
                          </div>
                          <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                      )}
                    />
                    {watchRequestDocuments && (
                      <FormField
                        control={form.control}
                        name="documentName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Document Name</FormLabel>
                            <FormControl><Input placeholder="e.g. Proof of ID, W9 Form" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Payment Requirements</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                     <FormField
                      control={form.control}
                      name="requestPayment"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                           <div className="space-y-0.5">
                            <FormLabel>Request Payment</FormLabel>
                            <FormDescription>Ask your client to make a payment.</FormDescription>
                          </div>
                          <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                      )}
                    />
                    {watchRequestPayment && (
                      <FormField
                        control={form.control}
                        name="paymentAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Amount ($ USD)</FormLabel>
                            <FormControl><Input type="number" placeholder="e.g. 500.00" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </CardContent>
                </Card>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("agreement")}>Back: Agreement</Button>
                  <Button type="button" onClick={() => setActiveTab("client")} className="bg-orange-500 hover:bg-orange-600 text-white">
                    Next: Client Details
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="client" className="space-y-6">
                <Card>
                  <CardHeader><CardTitle>Client Information</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="clientEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Email <span className="text-red-500">*</span></FormLabel>
                          <FormControl><Input type="email" placeholder="client@example.com" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Name <span className="text-red-500">*</span></FormLabel>
                          <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Message to client field removed as it's not part of the backend package structure for now
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message to Client (Optional)</FormLabel>
                          <FormControl><Textarea placeholder="Add a personal message..." rows={4} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    */}
                  </CardContent>
                </Card>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("requirements")}>Back: Requirements</Button>
                  <div className="space-x-2">
                    {/* Preview functionality can be enhanced later if needed */}
                    {/* <Button type="button" variant="outline" onClick={handlePreview} className="border-orange-500 text-orange-500 hover:bg-orange-50">
                      <EyeIcon className="mr-2 h-4 w-4" />Preview Package
                    </Button> */}
                    <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white" disabled={form.formState.isSubmitting}>
                      <SendIcon className="mr-2 h-4 w-4" />
                      {form.formState.isSubmitting ? "Creating..." : "Save and Share"}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </form>
      </Form>
    </div>
  );
}
