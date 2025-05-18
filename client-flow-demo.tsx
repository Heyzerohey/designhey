import React, { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ClientFlowDemo() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      id: 1,
      title: "Review Agreement",
      description:
        "Clients review your professional agreement with clear terms",
      image: "https://picsum.photos/seed/agreement123/600/400",
    },
    {
      id: 2,
      title: "Sign Documents",
      description: "Legally binding e-signatures with a simple click",
      image: "https://picsum.photos/seed/signature456/600/400",
    },
    {
      id: 3,
      title: "Upload Files",
      description: "Easy document upload with drag-and-drop functionality",
      image: "https://picsum.photos/seed/upload789/600/400",
    },
    {
      id: 4,
      title: "Make Payment",
      description: "Secure payment processing in the same flow",
      image: "https://picsum.photos/seed/payment012/600/400",
    },
    {
      id: 5,
      title: "Confirmation",
      description: "Instant confirmation and next steps for your client",
      image: "https://picsum.photos/seed/confirm345/600/400",
    },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setIsAutoPlaying(false);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="aspect-[3/2] relative">
        <img
          src={slides[currentSlide].image}
          alt={slides[currentSlide].title}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-6 text-white">
            <h3 className="text-xl font-medium mb-2">
              {slides[currentSlide].title}
            </h3>
            <p className="text-sm text-white/80">
              {slides[currentSlide].description}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrevSlide}
          className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400"
        >
          <ChevronLeftIcon className="h-5 w-5" />

          <span className="sr-only">Previous</span>
        </Button>

        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === index
                  ? "bg-orange-500 w-4"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextSlide}
          className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400"
        >
          <ChevronRightIcon className="h-5 w-5" />

          <span className="sr-only">Next</span>
        </Button>
      </div>
    </div>
  );
}
