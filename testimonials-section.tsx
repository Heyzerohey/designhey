import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Emma Rodriguez",
      role: "Marketing Consultant",
      avatar: "https://picsum.photos/seed/emma/200/200",
      quote:
        "Signhey transformed my client onboarding. I used to spend hours chasing signatures and payments. Now I send one link and everything is done in minutes.",
      stars: 5,
    },
    {
      id: 2,
      name: "David Kim",
      role: "Freelance Designer",
      avatar: "https://github.com/furkanksl.png",
      quote:
        "My clients appreciate how professional the process feels. It's helped me win more projects and get paid faster. The seamless experience sets me apart from competitors.",
      stars: 5,
    },
    {
      id: 3,
      name: "Sophia Chen",
      role: "Photographer",
      avatar: "https://picsum.photos/seed/sophia/200/200",
      quote:
        "As a photographer, I need to focus on my craft, not paperwork. Signhey handles all the boring stuff so I can spend more time behind the camera.",
      stars: 5,
    },
    {
      id: 4,
      name: "Marcus Johnson",
      role: "Therapist",
      avatar: "https://github.com/kdrnp.png",
      quote:
        "The HIPAA compliance was what initially drew me in, but the ease of use is what made me stay. My clients love how simple it is to complete their intake forms.",
      stars: 5,
    },
    {
      id: 5,
      name: "Olivia Patel",
      role: "Small Business Owner",
      avatar: "https://picsum.photos/seed/olivia/200/200",
      quote:
        "The seamless onboarding experience has reduced my client drop-off rate by 40%. Worth every penny. I've recommended it to everyone in my network.",
      stars: 5,
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
          What our users say
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-16 max-w-2xl mx-auto">
          Join 10,000+ professionals who've streamlined their client onboarding
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={cn(
                "bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm",
                index === 0 && "lg:col-span-2 md:flex gap-6 items-start"
              )}
            >
              <div
                className={cn(
                  "flex items-center mb-4",
                  index === 0 && "md:flex-shrink-0"
                )}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                  <div className="flex mt-1">
                    {Array.from({ length: testimonial.stars }).map((_, i) => (
                      <StarIcon
                        key={i}
                        className="h-4 w-4 text-orange-500 fill-orange-500"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <blockquote
                className={cn(
                  "text-gray-600 dark:text-gray-300",
                  index === 0 ? "text-lg" : "text-sm"
                )}
              >
                "{testimonial.quote}"
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
