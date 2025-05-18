import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface ClientDetailsFormProps {
  onSubmit: (data: ClientDetailsFormData) => void;
  onBack: () => void;
  onSkip: () => void;
  initialData?: ClientDetailsFormData;
}

interface ClientDetailsFormData {
  clientEmail: string;
  clientName: string;
  message: string;
  requestPayment: boolean;
  paymentAmount: string;
  paymentDescription: string;
}

export default function ClientDetailsForm({
  onSubmit,
  onBack,
  onSkip,
  initialData = {
    clientEmail: "",
    clientName: "",
    message: "",
    requestPayment: true,
    paymentAmount: "",
    paymentDescription: "",
  },
}: ClientDetailsFormProps) {
  const [formData, setFormData] = useState<ClientDetailsFormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, requestPayment: checked }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = "Client email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.clientEmail)
    ) {
      newErrors.clientEmail = "Invalid email address";
    }

    if (formData.requestPayment) {
      if (!formData.paymentAmount.trim()) {
        newErrors.paymentAmount = "Payment amount is required";
      } else if (isNaN(Number(formData.paymentAmount))) {
        newErrors.paymentAmount = "Payment amount must be a number";
      } else if (Number(formData.paymentAmount) <= 0) {
        newErrors.paymentAmount = "Payment amount must be greater than zero";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit(formData);
    }, 1000);
  };

  const formatCurrency = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");

    // Format as currency without decimals
    if (numericValue) {
      return numericValue;
    }

    return "";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Request Toggle */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="payment-toggle">Request Payment</Label>
            <p className="text-sm text-muted-foreground">
              Request payment from your client
            </p>
          </div>
          <Switch
            id="payment-toggle"
            checked={formData.requestPayment}
            onCheckedChange={handleSwitchChange}
          />
        </div>

        {formData.requestPayment && (
          <div className="space-y-4 border-l-2 border-orange-200 dark:border-orange-900 pl-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="payment-amount">
                Payment Amount ($) <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="payment-amount"
                  name="paymentAmount"
                  value={formData.paymentAmount}
                  onChange={(e) => {
                    const formattedValue = formatCurrency(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      paymentAmount: formattedValue,
                    }));

                    // Clear error when user types
                    if (errors.paymentAmount) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.paymentAmount;
                        return newErrors;
                      });
                    }
                  }}
                  placeholder="500"
                  className={`pl-8 ${
                    errors.paymentAmount ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.paymentAmount && (
                <p className="text-sm text-red-500">{errors.paymentAmount}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-description">Payment Description</Label>
              <Input
                id="payment-description"
                name="paymentDescription"
                value={formData.paymentDescription}
                onChange={handleInputChange}
                placeholder="Initial consultation fee"
              />
            </div>
          </div>
        )}
      </div>

      {/* Client Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          CLIENT DETAILS
        </h3>

        <div className="space-y-2">
          <Label htmlFor="client-email">
            Client Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="client-email"
            name="clientEmail"
            type="email"
            value={formData.clientEmail}
            onChange={handleInputChange}
            placeholder="client@example.com"
            className={errors.clientEmail ? "border-red-500" : ""}
          />

          {errors.clientEmail && (
            <p className="text-sm text-red-500">{errors.clientEmail}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="client-name">Client Name</Label>
          <Input
            id="client-name"
            name="clientName"
            value={formData.clientName}
            onChange={handleInputChange}
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message (Optional)</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Add a personal message to your client..."
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950"
        >
          Back
        </Button>

        <div className="space-x-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onSkip}
            className="text-gray-500"
          >
            Skip
          </Button>
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              "Create Package"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
