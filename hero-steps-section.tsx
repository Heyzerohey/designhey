import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface StepProps {
  number: number;
  title: string;
  description: string;
  delay?: number;
}

const Step = ({ number, title, description, delay = 0 }: StepProps) => {
  return (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="w-16 h-16 mb-4 rounded-full bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center">
        <span className="text-2xl font-semibold text-orange-500">{number}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-xs">{description}</p>
    </motion.div>
  );
};

export default function HeroStepsSection() {
  const steps = [
    {
      number: 1,
      title: "Sign",
      description:
        "Review and sign agreements with a simple, secure e-signature.",
    },
    {
      number: 2,
      title: "Upload",
      description:
        "Securely upload required documents with drag-and-drop ease.",
    },
    {
      number: 3,
      title: "Pay",
      description: "Complete payment securely in the same seamless flow.",
    },
  ];

  return (
    <section className="py-12 md:py-16 w-full">
      <div className="container mx-auto px-4">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {steps.map((step, index) => (
            <Step
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              delay={0.2 * index}
            />
          ))}
        </motion.div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-colors"
          >
            Get Started
          </Link>
          <Link
            to="/pricing"
            className="px-6 py-3 border border-gray-300 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 text-gray-800 dark:text-gray-200 font-medium rounded-md transition-colors"
          >
            See Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
