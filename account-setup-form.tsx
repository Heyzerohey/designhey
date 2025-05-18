import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";

interface AccountSetupFormProps {
  onComplete: () => void;
}

export default function AccountSetupForm({
  onComplete,
}: AccountSetupFormProps) {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [sendMethod, setSendMethod] = useState("email");
  const [setupPayment, setSetupPayment] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications when clients interact with your
                  documents
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="send-method">Default send method</Label>
              <Select value={sendMethod} onValueChange={setSendMethod}>
                <SelectTrigger id="send-method" className="w-full">
                  <SelectValue placeholder="Select a send method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="both">Email & SMS</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                How you want to send documents to clients by default
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="setup-payment">Set up payment method</Label>
                <p className="text-sm text-muted-foreground">
                  Add a payment method to enable premium features
                </p>
              </div>
              <Switch
                id="setup-payment"
                checked={setupPayment}
                onCheckedChange={setSetupPayment}
              />
            </div>

            {setupPayment && (
              <div className="space-y-4 pt-4 border-t">
                <p className="text-sm">
                  You'll be redirected to our secure payment processor after
                  completing the setup.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Link to="/profile-setup">
          <Button variant="outline" type="button">
            Back
          </Button>
        </Link>
        <div className="space-x-2">
          <Link to="/package-setup">
            <Button variant="outline" type="button">
              Skip
            </Button>
          </Link>
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Continue
          </Button>
        </div>
      </div>
    </form>
  );
}
