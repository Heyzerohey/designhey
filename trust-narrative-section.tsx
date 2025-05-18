import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ShieldCheckIcon,
  LockIcon,
  FileCheckIcon,
  HeartPulseIcon,
} from "lucide-react";

export default function TrustNarrativeSection() {
  const complianceBadges = [
    {
      id: "gdpr",
      name: "GDPR",
      icon: <ShieldCheckIcon className="h-5 w-5 text-orange-500" />,

      description: "European data protection",
    },
    {
      id: "esign",
      name: "E-SIGN",
      icon: <FileCheckIcon className="h-5 w-5 text-orange-500" />,

      description: "US electronic signatures",
    },
    {
      id: "eidas",
      name: "eIDAS",
      icon: <LockIcon className="h-5 w-5 text-orange-500" />,

      description: "EU electronic identification",
    },
    {
      id: "hipaa",
      name: "HIPAA",
      icon: <HeartPulseIcon className="h-5 w-5 text-orange-500" />,

      description: "Healthcare compliance",
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Security you can trust
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Your client data deserves the highest level of protection. Signhey
              is built with security and compliance at its core.
            </p>
          </div>

          {/* Compliance badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {complianceBadges.map((badge, index) => (
              <div
                key={badge.id}
                className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm text-center"
              >
                <div className="flex justify-center mb-2">{badge.icon}</div>
                <h3 className="font-medium mb-1">{badge.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {badge.description}
                </p>
              </div>
            ))}
          </div>

          {/* Trust story */}
          <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image column */}
              <div className="bg-orange-100 dark:bg-orange-900/20 p-8 flex items-center justify-center">
                <div className="max-w-xs">
                  <ShieldCheckIcon className="h-16 w-16 text-orange-500 mx-auto mb-4" />

                  <h3 className="text-xl font-medium text-center mb-2">
                    Protected from disputes
                  </h3>
                  <p className="text-center text-gray-600 dark:text-gray-300">
                    Signhey's legally binding signatures and secure document
                    storage protect you from disputes and liability.
                  </p>
                </div>
              </div>

              {/* Story column */}
              <div className="p-8">
                <h3 className="text-xl font-medium mb-4">
                  "Signhey saved me from a $12,000 dispute"
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  When Michael, a marketing consultant, had a client dispute the
                  scope of work, he was able to quickly reference the signed
                  agreement and uploaded documents in Signhey.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  "The client claimed they never agreed to our cancellation
                  terms. I simply pulled up the signed agreement in Signhey,
                  complete with timestamp and IP address. Dispute resolved in
                  minutes instead of months of legal headaches."
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="text-orange-500 border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950"
                >
                  <Link to="/compliance">
                    Learn about our compliance features
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
