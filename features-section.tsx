import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FileSignatureIcon,
  UploadCloudIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  GlobeIcon,
  ShapesIcon as DevicesIcon,
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <FileSignatureIcon className="h-6 w-6 text-orange-500" />,

      title: "E-Signatures",
      description:
        "Legally binding electronic signatures that comply with global standards.",
    },
    {
      icon: <UploadCloudIcon className="h-6 w-6 text-orange-500" />,

      title: "Document Collection",
      description:
        "Securely collect and organize client documents in one central location.",
    },
    {
      icon: <CreditCardIcon className="h-6 w-6 text-orange-500" />,

      title: "Payment Processing",
      description:
        "Accept payments seamlessly within the same client engagement flow.",
    },
    {
      icon: <ShieldCheckIcon className="h-6 w-6 text-orange-500" />,

      title: "Secure & Compliant",
      description:
        "GDPR, E-SIGN, eIDAS, and HIPAA compliant for peace of mind.",
    },
    {
      icon: <GlobeIcon className="h-6 w-6 text-orange-500" />,

      title: "Custom Branding",
      description:
        "Personalize your client experience with your own branding and colors.",
    },
    {
      icon: <DevicesIcon className="h-6 w-6 text-orange-500" />,

      title: "Mobile Friendly",
      description:
        "Perfect experience on any device - desktop, tablet, or smartphone.",
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-950" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Everything You Need in One Place
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Signhey combines all the tools you need to onboard clients
            efficiently and professionally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            asChild
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Link to="/signup">Get Started Free</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
