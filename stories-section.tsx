import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

export default function StoriesSection() {
  const stories = [
    {
      id: 1,
      profession: "Design Studio Owner",
      name: "Maria",
      avatar: "https://picsum.photos/seed/maria/200/200",
      story:
        "I lost a $15,000 project because my client got frustrated with the back-and-forth paperwork. They went with someone who made signing easier. Never again.",
      emotion: "financial loss",
    },
    {
      id: 2,
      profession: "Consultant",
      name: "James",
      avatar: "https://picsum.photos/seed/james/200/200",
      story:
        "I used to spend weekends chasing signatures and payments instead of being with my family. Those were hours of my life I'll never get back.",
      emotion: "personal sacrifice",
    },
    {
      id: 3,
      profession: "Therapist",
      name: "Lila",
      avatar: "https://picsum.photos/seed/lila/200/200",
      story:
        "A client claimed they never agreed to my cancellation policy. Without a proper signature, I had no protection and lost $1,200 in disputed charges.",
      emotion: "legal risk",
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Real stories from professionals like you
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stories.map((story, index) => (
            <div
              key={story.id}
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 overflow-hidden mr-4">
                  <img
                    src={story.avatar}
                    alt={story.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{story.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {story.profession}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                "{story.story}"
              </p>
              <Button
                asChild
                variant="link"
                className="text-orange-500 p-0 h-auto flex items-center"
              >
                <Link to="/signup">
                  Get Started <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
