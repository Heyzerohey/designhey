import { useState, useEffect } from "react";
import { X, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";

interface FirstLoginTipsModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function FirstLoginTipsModal({
  open: controlledOpen,
  onOpenChange,
}: FirstLoginTipsModalProps) {
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [open, setOpen] = useState(false);

  // Check if this is the first login
  useEffect(() => {
    const hasSeenTips = localStorage.getItem("hasSeenTips");
    if (!hasSeenTips) {
      setIsFirstLogin(true);
      setOpen(true);
    }
  }, []);

  // Handle controlled or uncontrolled state
  const isControlled = controlledOpen !== undefined;
  const showModal = isControlled ? controlledOpen : open;

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setOpen(newOpen);
    }

    if (onOpenChange) {
      onOpenChange(newOpen);
    }

    if (!newOpen && isFirstLogin) {
      localStorage.setItem("hasSeenTips", "true");
      setIsFirstLogin(false);
    }
  };

  const tips = [
    {
      title: "Create Packages",
      description:
        "Create packages for all your clients to save time and close deals faster!",
      action: {
        label: "Create Package",
        href: "/package/create",
      },
    },
    {
      title: "Share with Clients",
      description:
        "Share your packages with clients via email or direct link for quick signatures.",
      action: {
        label: "Learn More",
        href: "/help/sharing",
      },
    },
    {
      title: "Track Progress",
      description:
        "Monitor client engagement in real-time with our activity timeline.",
      action: {
        label: "View Dashboard",
        href: "/dashboard",
      },
    },
  ];

  return (
    <Dialog open={showModal} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-orange-500" />
            Welcome to Signhey!
          </DialogTitle>
          <DialogDescription>
            Here are some tips to help you get started.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {tips.map((tip, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                {index + 1}
              </div>
              <div className="space-y-1">
                <h4 className="font-medium">{tip.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {tip.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Maybe Later
          </Button>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white"
            asChild
          >
            <Link to="/package/create">Create Your First Package</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
