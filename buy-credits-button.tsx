import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCartIcon } from "lucide-react";

interface BuyCreditsButtonProps {
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export default function BuyCreditsButton({
  variant = "default",
  size = "default",
  className = "",
}: BuyCreditsButtonProps) {
  const buttonClasses = `${
    variant === "default"
      ? "bg-orange-500 hover:bg-orange-600 text-white"
      : variant === "outline"
        ? "border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950"
        : ""
  } ${className}`;

  return (
    <Button asChild variant={variant} size={size} className={buttonClasses}>
      <Link to="/subscription-checkout">
        <ShoppingCartIcon className="h-4 w-4 mr-2" />
        Buy Credits
      </Link>
    </Button>
  );
}
