import { useState } from "react";
import { Link } from "react-router-dom";
import ClientEngagementFlow from "@/polymet/components/client-engagement-flow";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import SignheyLogo from "@/polymet/components/signhey-logo";

export default function ClientEngagementPage() {
  // Sample agreement pages content
  const agreementPages = [
    `<h2>Services Agreement</h2>
    <p>This Services Agreement (the "Agreement") is entered into as of the date of electronic signature by and between [Your Business Name] ("Provider") and the individual or entity identified in the client intake form ("Client").</p>
    <h3>1. Scope of Services</h3>
    <p>Provider agrees to provide services to Client in connection with the matter described in the engagement details. The scope of representation is limited to the specific matter described therein, unless otherwise agreed to in writing.</p>`,

    `<h3>2. Client Responsibilities</h3>
    <p>Client agrees to cooperate fully with Provider, to keep Provider informed of any information relevant to the representation, and to provide Provider with accurate factual information necessary to represent Client effectively.</p>
    <h3>3. Fees and Expenses</h3>
    <p>Client agrees to pay Provider for services as described in the fee arrangement. In addition to fees for services, Client shall reimburse Provider for all reasonable costs and expenses incurred in connection with the matter.</p>`,

    `<h3>4. Confidentiality</h3>
    <p>Provider shall maintain all information related to Client's representation as confidential, subject to the rules of professional conduct.</p>
    <h3>5. Termination</h3>
    <p>Either party may terminate this Agreement at any time by written notice. Client shall pay all fees and costs incurred up to the time of termination.</p>
    <h3>6. Governing Law</h3>
    <p>This Agreement shall be governed by the laws of the state where Provider's principal office is located.</p>`,
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
          >
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeftIcon className="h-4 w-4" />

              <span>Back to Dashboard</span>
            </Button>
          </Link>

          <Link
            to="/"
            className="text-lg font-medium text-orange-600 dark:text-orange-500"
          >
            <SignheyLogo />
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto">
        <ClientEngagementFlow
          professionalName="Alex Johnson"
          professionalAvatar="https://github.com/yusufhilmi.png"
          professionalEmail="alex@businessname.com"
          professionalPhone="(555) 123-4567"
          businessName="[Your Business Name]"
          clientName="Sarah Chen"
          agreementTitle="Services Agreement"
          agreementPages={agreementPages}
          paymentAmount={500}
          paymentDescription="Initial consultation and document review"
        />
      </div>

      <footer className="border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Signhey. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                to="/terms"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
              >
                Terms of Service
              </Link>
              <Link
                to="/privacy"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
              >
                Privacy Policy
              </Link>
              <Link
                to="/contact"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
