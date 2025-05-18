import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FaqAccordion() {
  const faqs = [
    {
      question: "How does the client onboarding process work?",
      answer:
        "When you create a client link, your client receives an email with a secure URL. They'll follow a simple three-step process: reviewing and signing your agreement, uploading any required documents, and making a payment if applicable. The entire process is designed to be completed in minutes.",
    },
    {
      question: "Is Signhey secure and compliant?",
      answer:
        "Yes, Signhey uses bank-level encryption for all data and documents. Our e-signatures are legally binding and compliant with ESIGN, UETA, and eIDAS regulations. All files are encrypted at rest and in transit, and we maintain SOC 2 compliance for security, availability, and confidentiality.",
    },
    {
      question: "Can I customize the client experience?",
      answer:
        "Absolutely. You can add your business name, logo, and brand colors to create a seamless experience for your clients. Pro and Pro Plus plans allow for complete white-labeling options, including custom domains.",
    },
    {
      question: "What payment methods can my clients use?",
      answer:
        "Clients can pay using all major credit cards, debit cards, and ACH bank transfers (US only). We support multiple currencies and automatically handle receipts and payment confirmations.",
    },
    {
      question: "Do I need technical skills to use Signhey?",
      answer:
        "Not at all. Signhey is designed to be intuitive and user-friendly. You can set up your first client link in minutes without any technical knowledge. Our step-by-step guides and support team are available if you need assistance.",
    },
    {
      question: "Can I try Signhey before committing?",
      answer:
        "Yes, we offer a 14-day free trial on all plans with no credit card required. You'll have access to all features of your selected plan during the trial period.",
    },
  ];

  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className="border-b border-gray-200 dark:border-gray-800"
        >
          <AccordionTrigger className="text-left font-medium py-4">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 dark:text-gray-300 pb-4">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
