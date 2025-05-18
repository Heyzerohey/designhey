import { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  SearchIcon,
  BookOpenIcon,
  FileTextIcon,
  PlayIcon,
  UsersIcon,
  BookIcon,
  ArrowRightIcon,
} from "lucide-react";
import BlogLayout from "@/polymet/layouts/blog-layout";
import ResourcesCard from "@/polymet/components/resources-card";

// Mock resources data
const RESOURCES = [
  {
    id: "1",
    title: "Client Onboarding Guide",
    description:
      "Learn how to create a seamless onboarding experience for your clients.",
    icon: <BookOpenIcon className="h-6 w-6 text-orange-500" />,

    resourceType: "guide",
    link: "/resources/client-onboarding-guide",
    isNew: true,
    category: "client-management",
  },
  {
    id: "2",
    title: "Service Agreement Template",
    description:
      "A customizable template for creating professional service agreements.",
    icon: <FileTextIcon className="h-6 w-6 text-orange-500" />,

    resourceType: "template",
    link: "/resources/service-agreement-template",
    isPremium: true,
    category: "legal",
  },
  {
    id: "3",
    title: "E-Signature Best Practices",
    description:
      "Video tutorial on implementing e-signatures in your workflow.",
    icon: <PlayIcon className="h-6 w-6 text-orange-500" />,

    resourceType: "video",
    link: "/resources/e-signature-best-practices",
    category: "digital-tools",
  },
  {
    id: "4",
    title: "Client Communication Masterclass",
    description: "Live webinar on effective client communication strategies.",
    icon: <UsersIcon className="h-6 w-6 text-orange-500" />,

    resourceType: "webinar",
    link: "/resources/client-communication-webinar",
    isNew: true,
    isPremium: true,
    category: "client-management",
  },
  {
    id: "5",
    title: "The Digital Professional's Handbook",
    description:
      "Comprehensive guide to digitizing your professional practice.",
    icon: <BookIcon className="h-6 w-6 text-orange-500" />,

    resourceType: "ebook",
    link: "/resources/digital-professionals-handbook",
    category: "digital-tools",
  },
  {
    id: "6",
    title: "Pricing Strategies for Professional Services",
    description:
      "Learn how to price your services to maximize value and profitability.",
    icon: <BookOpenIcon className="h-6 w-6 text-orange-500" />,

    resourceType: "guide",
    link: "/resources/pricing-strategies",
    category: "business-growth",
  },
  {
    id: "7",
    title: "Client Intake Form Template",
    description:
      "Streamline your client intake process with this comprehensive form template.",
    icon: <FileTextIcon className="h-6 w-6 text-orange-500" />,

    resourceType: "template",
    link: "/resources/client-intake-form",
    category: "client-management",
  },
  {
    id: "8",
    title: "Document Security Essentials",
    description:
      "Video guide on protecting sensitive client documents and information.",
    icon: <PlayIcon className="h-6 w-6 text-orange-500" />,

    resourceType: "video",
    link: "/resources/document-security",
    category: "legal",
  },
  {
    id: "9",
    title: "Growing Your Professional Network",
    description:
      "Webinar on building and leveraging professional relationships.",
    icon: <UsersIcon className="h-6 w-6 text-orange-500" />,

    resourceType: "webinar",
    link: "/resources/growing-professional-network",
    isPremium: true,
    category: "business-growth",
  },
];

// Categories derived from resources
const CATEGORIES = [
  "all",
  ...Array.from(new Set(RESOURCES.map((resource) => resource.category))),
];

// Resource types derived from resources
const RESOURCE_TYPES = [
  "all",
  ...Array.from(new Set(RESOURCES.map((resource) => resource.resourceType))),
];

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeType, setActiveType] = useState("all");

  // Filter resources based on search query, active category, and active type
  const filteredResources = RESOURCES.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || resource.category === activeCategory;
    const matchesType =
      activeType === "all" || resource.resourceType === activeType;
    return matchesSearch && matchesCategory && matchesType;
  });

  // Format category or type name for display
  const formatName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <BlogLayout>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Resources</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of guides, templates, videos, and more to
            help you streamline your professional practice.
          </p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />

            <Input
              type="text"
              placeholder="Search resources..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-12">
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div>
              <h2 className="text-lg font-medium mb-2">Categories</h2>
              <TabsList className="bg-transparent p-0 h-auto flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    onClick={() => setActiveCategory(category)}
                    className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-full px-4 py-1 border"
                  >
                    {formatName(category)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-2">Resource Types</h2>
              <TabsList className="bg-transparent p-0 h-auto flex flex-wrap gap-2">
                {RESOURCE_TYPES.map((type) => (
                  <TabsTrigger
                    key={type}
                    value={type}
                    onClick={() => setActiveType(type)}
                    className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-full px-4 py-1 border"
                  >
                    {type === "all" ? "All Types" : formatName(type)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          <TabsContent value={activeCategory} className="mt-0">
            {filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource) => (
                  <ResourcesCard
                    key={resource.id}
                    title={resource.title}
                    description={resource.description}
                    icon={resource.icon}
                    resourceType={resource.resourceType}
                    link={resource.link}
                    isNew={resource.isNew}
                    isPremium={resource.isPremium}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No resources found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filters to find what you're
                  looking for.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                    setActiveType("all");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Featured Resource */}
        <div className="bg-orange-50 dark:bg-orange-950/20 rounded-xl p-8 mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <Badge className="bg-orange-500 mb-4">Featured Resource</Badge>
              <h2 className="text-2xl font-bold mb-4">
                The Complete Guide to Digital Client Engagement
              </h2>
              <p className="text-muted-foreground mb-6">
                This comprehensive ebook covers everything you need to know
                about engaging clients in the digital age, from initial contact
                to ongoing relationship management.
              </p>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Download Free Ebook
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://picsum.photos/seed/signheyresource/600/400"
                alt="Ebook cover"
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>

        {/* Resource Request */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">
            Don't see what you're looking for?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We're constantly adding new resources based on user feedback. Let us
            know what topics or formats would be most helpful for your practice.
          </p>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            Request a Resource
          </Button>
        </div>
      </div>
    </BlogLayout>
  );
}
