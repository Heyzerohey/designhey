import { useState } from "react";
import { Link } from "react-router-dom";
import { SearchIcon, FilterIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BlogLayout from "@/polymet/layouts/blog-layout";
import BlogPostCard from "@/polymet/components/blog-post-card";

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const featuredPost = {
    title: "The Future of Client Engagement: AI and Automation",
    excerpt:
      "Explore how artificial intelligence and automation are reshaping client relationships and creating new opportunities for growth.",
    date: "July 12, 2023",
    category: "Technology",
    author: {
      name: "Takashi Yamada",
      avatar: "https://github.com/kdrnp.png",
    },
    slug: "future-client-engagement-ai",
    imageUrl: "https://picsum.photos/seed/signhey123/800/400",
  };

  const blogPosts = [
    {
      title: "How to Streamline Your Client Onboarding Process",
      excerpt:
        "Learn the best practices for creating a seamless client onboarding experience that saves time and improves satisfaction.",
      date: "May 15, 2023",
      category: "Guides",
      author: {
        name: "Sarah Chen",
        avatar: "https://github.com/yusufhilmi.png",
      },
      slug: "streamline-client-onboarding",
    },
    {
      title: "5 Ways E-Signatures Are Changing Professional Services",
      excerpt:
        "Discover how electronic signatures are transforming the way professionals work with clients and manage documents.",
      date: "June 3, 2023",
      category: "Trends",
      author: {
        name: "Michael Wong",
        avatar: "https://github.com/furkanksl.png",
      },
      slug: "e-signatures-professional-services",
    },
    {
      title: "Legal Compliance Guide for Digital Documents",
      excerpt:
        "Everything professionals need to know about maintaining legal compliance when using digital documents and e-signatures.",
      date: "April 22, 2023",
      category: "Compliance",
      author: {
        name: "Emma Rodriguez",
        avatar: "https://github.com/yahyabedirhan.png",
      },
      slug: "legal-compliance-digital-documents",
    },
    {
      title: "Building Client Trust in a Digital World",
      excerpt:
        "Strategies for establishing and maintaining client trust when most of your interactions happen online.",
      date: "March 10, 2023",
      category: "Client Relations",
      author: {
        name: "David Kim",
        avatar: "https://github.com/buyuktas18.png",
      },
      slug: "building-client-trust-digital-world",
    },
    {
      title: "Automating Your Client Follow-ups: A Step-by-Step Guide",
      excerpt:
        "How to set up automated follow-up sequences that keep clients engaged without requiring constant manual effort.",
      date: "February 5, 2023",
      category: "Guides",
      author: {
        name: "Sarah Chen",
        avatar: "https://github.com/yusufhilmi.png",
      },
      slug: "automating-client-followups",
    },
  ];

  const categories = [
    "all",
    "guides",
    "trends",
    "compliance",
    "client relations",
    "technology",
  ];

  const filteredPosts =
    activeCategory === "all"
      ? blogPosts
      : blogPosts.filter(
          (post) => post.category.toLowerCase() === activeCategory
        );

  const searchedPosts = filteredPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <BlogLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Signhey Blog</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Insights, guides, and trends for professionals managing client
            relationships
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />

              <Input
                placeholder="Search articles..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <FilterIcon className="h-4 w-4 text-muted-foreground" />

              <Tabs
                defaultValue="all"
                value={activeCategory}
                onValueChange={setActiveCategory}
                className="w-full sm:w-auto"
              >
                <TabsList>
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="capitalize"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Featured Article</h2>
          <BlogPostCard
            featured={true}
            title={featuredPost.title}
            excerpt={featuredPost.excerpt}
            date={featuredPost.date}
            category={featuredPost.category}
            author={featuredPost.author}
            slug={featuredPost.slug}
            imageUrl={featuredPost.imageUrl}
          />
        </div>

        {/* Blog Posts Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Latest Articles</h2>
          {searchedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {searchedPosts.map((post, index) => (
                <BlogPostCard
                  key={index}
                  title={post.title}
                  excerpt={post.excerpt}
                  date={post.date}
                  category={post.category}
                  author={post.author}
                  slug={post.slug}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No articles found matching your search criteria.
              </p>
              <Button
                variant="link"
                className="text-orange-500 hover:text-orange-600 mt-2"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-semibold mb-4">
            Subscribe to Our Newsletter
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get the latest articles, guides, and industry insights delivered
            directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Your email address"
              className="flex-grow"
            />

            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </BlogLayout>
  );
}
