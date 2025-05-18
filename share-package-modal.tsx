import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CheckIcon, CopyIcon, MailIcon, MessageSquareIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SharePackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageName: string;
}

export default function SharePackageModal({
  isOpen,
  onClose,
  packageName,
}: SharePackageModalProps) {
  const [activeTab, setActiveTab] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const packageLink = "https://signhey.com/p/abc123"; // Example link

  const handleSubmit = async () => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setIsSuccess(true);

    // Reset form after success
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      setEmail("");
      setPhone("");
      setMessage("");
    }, 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(packageLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isPhoneValid = (phone: string) => {
    return /^\+?[0-9\s\-()]{10,15}$/.test(phone);
  };

  const isEmailFormValid = email.trim() !== "" && isEmailValid(email);
  const isTextFormValid = phone.trim() !== "" && isPhoneValid(phone);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Package</DialogTitle>
          <DialogDescription>
            Share "{packageName}" with your client
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="email"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="link">Copy Link</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="client@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    email &&
                      !isEmailValid(email) &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                />

                {email && !isEmailValid(email) && (
                  <p className="text-xs text-red-500">
                    Please enter a valid email address
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message (optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Please review and sign this document..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="text" className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={cn(
                    phone &&
                      !isPhoneValid(phone) &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                />

                {phone && !isPhoneValid(phone) && (
                  <p className="text-xs text-red-500">
                    Please enter a valid phone number
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="text-message">Message (optional)</Label>
                <Textarea
                  id="text-message"
                  placeholder="Please review and sign this document..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="link" className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="link">Package link</Label>
                <div className="flex items-center space-x-2">
                  <Input id="link" readOnly value={packageLink} />

                  <Button
                    type="button"
                    size="icon"
                    onClick={handleCopyLink}
                    className={
                      isCopied ? "bg-green-500 hover:bg-green-600" : ""
                    }
                  >
                    {isCopied ? (
                      <CheckIcon className="h-4 w-4" />
                    ) : (
                      <CopyIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {isCopied && (
                  <p className="text-xs text-green-500">
                    Link copied to clipboard!
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          {activeTab === "email" && (
            <Button
              type="button"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleSubmit}
              disabled={!isEmailFormValid || isLoading}
            >
              {isLoading ? (
                "Sending..."
              ) : isSuccess ? (
                <span className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4" /> Sent!
                </span>
              ) : (
                <span className="flex items-center">
                  <MailIcon className="mr-2 h-4 w-4" /> Send Email
                </span>
              )}
            </Button>
          )}

          {activeTab === "text" && (
            <Button
              type="button"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleSubmit}
              disabled={!isTextFormValid || isLoading}
            >
              {isLoading ? (
                "Sending..."
              ) : isSuccess ? (
                <span className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4" /> Sent!
                </span>
              ) : (
                <span className="flex items-center">
                  <MessageSquareIcon className="mr-2 h-4 w-4" /> Send Text
                </span>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
