import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  SearchIcon,
  FileTextIcon,
  UsersIcon,
  ShieldIcon,
  SettingsIcon,
  MessageSquareIcon,
  CreditCardIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  BookOpenIcon,
  PlayIcon,
} from "lucide-react";
import BlogLayout from "@/polymet/layouts/blog-layout";
import HelpCenterCard from "@/polymet/components/help-center-card";

// Mock help articles data
const HELP_ARTICLES = [
  {
    id: "1",
    title: "How to Create Your First Package",
    description: "Learn how to create and customize your first client package.",
    category: "getting-started",
    views: 1245,
    isPopular: true,
  },
  {
    id: "2",
    title: "Setting Up Two-Factor Authentication",
    description:
      "Enhance your account security with two-factor authentication.",
    category: "security-compliance",
    views: 876,
    isPopular: true,
  },
  {
    id: "3",
    title: "Managing Client Access Permissions",
    description: "Control what your clients can view and access.",
    category: "client-management",
    views: 654,
  },
  {
    id: "4",
    title: "Customizing Your Notification Settings",
    description: "Learn how to adjust your email and in-app notifications.",
    category: "account-settings",
    views: 543,
  },
  {
    id: "5",
    title: "Processing Client Payments",
    description: "How to set up and manage payment collection from clients.",
    category: "billing-payments",
    views: 987,
    isPopular: true,
  },
  {
    id: "6",
    title: "Using the Chat Interface",
    description:
      "Tips for effective communication with clients through our chat feature.",
    category: "communication-tools",
    views: 765,
  },
  {
    id: "7",
    title: "Uploading and Managing Documents",
    description: "How to upload, organize, and share documents with clients.",
    category: "getting-started",
    views: 876,
  },
  {
    id: "8",
    title: "Understanding Subscription Plans",
    description: "A guide to our different pricing tiers and features.",
    category: "billing-payments",
    views: 654,
  },
];

// Help categories data
const HELP_CATEGORIES = [
  {
    id: "getting-started",
    title: "Getting Started",
    description:
      "Learn the basics of setting up your account and creating your first package.",
    icon: <FileTextIcon className="h-6 w-6 text-orange-500" />,

    articleCount: 12,
    link: "/help/getting-started",
    isPopular: true,
  },
  {
    id: "client-management",
    title: "Client Management",
    description: "Tips and guides for managing your clients effectively.",
    icon: <UsersIcon className="h-6 w-6 text-orange-500" />,

    articleCount: 8,
    link: "/help/client-management",
  },
  {
    id: "security-compliance",
    title: "Security & Compliance",
    description:
      "Information about our security features and compliance standards.",
    icon: <ShieldIcon className="h-6 w-6 text-orange-500" />,

    articleCount: 6,
    link: "/help/security-compliance",
  },
  {
    id: "account-settings",
    title: "Account Settings",
    description: "How to customize your account preferences and settings.",
    icon: <SettingsIcon className="h-6 w-6 text-orange-500" />,

    articleCount: 10,
    link: "/help/account-settings",
  },
  {
    id: "communication-tools",
    title: "Communication Tools",
    description: "Learn how to use our messaging and notification features.",
    icon: <MessageSquareIcon className="h-6 w-6 text-orange-500" />,

    articleCount: 7,
    link: "/help/communication-tools",
  },
  {
    id: "billing-payments",
    title: "Billing & Payments",
    description: "Information about pricing, invoices, and payment processing.",
    icon: <CreditCardIcon className="h-6 w-6 text-orange-500" />,

    articleCount: 9,
    link: "/help/billing-payments",
    isPopular: true,
  },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter articles based on search query
  const filteredArticles = HELP_ARTICLES.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get popular articles
  const popularArticles = HELP_ARTICLES.filter((article) => article.isPopular);

  return (
    <BlogLayout>
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="bg-orange-50 dark:bg-orange-950/20 rounded-xl p-8 md:p-12 mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            How can we help you?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Search our knowledge base or browse categories to find the answers
            you need.
          </p>
          <div className="relative max-w-2xl mx-auto">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />

            <Input
              type="text"
              placeholder="Search for help articles..."
              className="pl-10 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Search Results</h2>
            {filteredArticles.length > 0 ? (
              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <Link
                    key={article.id}
                    to={`/help/${article.category}/${article.id}`}
                    className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                  >
                    <h3 className="text-lg font-medium mb-1">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {article.description}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-lg mb-4">
                  No results found for "{searchQuery}"
                </p>
                <p className="text-muted-foreground mb-6">
                  Try using different keywords or browse our help categories
                  below.
                </p>
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Help Categories */}
        {!searchQuery && (
          <>
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">
                Browse Help Categories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {HELP_CATEGORIES.map((category) => (
                  <HelpCenterCard
                    key={category.id}
                    title={category.title}
                    description={category.description}
                    icon={category.icon}
                    articleCount={category.articleCount}
                    link={category.link}
                    isPopular={category.isPopular}
                  />
                ))}
              </div>
            </div>

            {/* Popular Articles */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Popular Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularArticles.map((article) => (
                  <Link
                    key={article.id}
                    to={`/help/${article.category}/${article.id}`}
                    className="flex items-start p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                  >
                    <CheckCircleIcon className="h-5 w-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />

                    <div>
                      <h3 className="font-medium mb-1">{article.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {article.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-6">
                <Button variant="outline" asChild>
                  <Link to="/help/all-articles">
                    View All Articles
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Learning Resources */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Learning Resources</h2>
              <Tabs defaultValue="guides">
                <TabsList className="mb-6">
                  <TabsTrigger
                    value="guides"
                    className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                  >
                    Guides
                  </TabsTrigger>
                  <TabsTrigger
                    value="videos"
                    className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                  >
                    Video Tutorials
                  </TabsTrigger>
                  <TabsTrigger
                    value="webinars"
                    className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                  >
                    Webinars
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="guides" className="space-y-4">
                  <div className="flex items-start p-4 border rounded-lg">
                    <BookOpenIcon className="h-5 w-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />

                    <div>
                      <h3 className="font-medium mb-1">
                        Complete Onboarding Guide
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        A step-by-step guide to setting up your account and
                        onboarding your first client.
                      </p>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-orange-500"
                      >
                        Read Guide
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-start p-4 border rounded-lg">
                    <BookOpenIcon className="h-5 w-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />

                    <div>
                      <h3 className="font-medium mb-1">
                        Advanced Package Creation
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Learn how to create custom packages with advanced
                        features and requirements.
                      </p>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-orange-500"
                      >
                        Read Guide
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="videos" className="space-y-4">
                  <div className="flex items-start p-4 border rounded-lg">
                    <PlayIcon className="h-5 w-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />

                    <div>
                      <h3 className="font-medium mb-1">
                        Getting Started with Signhey
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        A quick introduction to the Signhey platform and its key
                        features.
                      </p>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-orange-500"
                      >
                        Watch Video
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-start p-4 border rounded-lg">
                    <PlayIcon className="h-5 w-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />

                    <div>
                      <h3 className="font-medium mb-1">
                        Managing Client Documents
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Learn how to organize and manage client documents
                        efficiently.
                      </p>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-orange-500"
                      >
                        Watch Video
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="webinars" className="space-y-4">
                  <div className="flex items-start p-4 border rounded-lg">
                    <UsersIcon className="h-5 w-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />

                    <div>
                      <h3 className="font-medium mb-1">
                        Maximizing Client Engagement
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Tips and strategies for improving client engagement and
                        satisfaction.
                      </p>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-orange-500"
                      >
                        Watch Webinar
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-start p-4 border rounded-lg">
                    <UsersIcon className="h-5 w-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />

                    <div>
                      <h3 className="font-medium mb-1">
                        Scaling Your Practice with Signhey
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Learn how to use Signhey to grow your professional
                        practice.
                      </p>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-orange-500"
                      >
                        Watch Webinar
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}

        {/* Contact Support */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to
            help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Contact Support
            </Button>
            <Button variant="outline">Schedule a Demo</Button>
          </div>
        </div>
      </div>
    </BlogLayout>
  );
}
