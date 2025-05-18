import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";

interface BlogPostContentProps {
  title: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  tags?: string[];
}

export default function BlogPostContent({
  title,
  content,
  date,
  readTime,
  category,
  author,
  tags = [],
}: BlogPostContentProps) {
  return (
    <article className="max-w-3xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <Badge
          variant="secondary"
          className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400"
        >
          {category}
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={author.avatar} alt={author.name} />

              <AvatarFallback>
                {author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{author.name}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar strokeWidth={1.5} size={14} className="mr-1" />

                <span className="mr-3">{date}</span>
                <Clock strokeWidth={1.5} size={14} className="mr-1" />

                <span>{readTime}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Share2 size={18} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Facebook size={18} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Twitter size={18} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Linkedin size={18} />
            </Button>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="mb-8">
        <img
          src="https://picsum.photos/seed/signheyblog/1200/600"
          alt="Featured"
          className="w-full h-auto rounded-lg"
        />
      </div>

      {/* Content */}
      <div
        className="prose prose-lg dark:prose-invert max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mb-12">
          <h3 className="text-lg font-medium mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="rounded-full">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Author Bio */}
      <div className="border-t border-b py-8 mb-12">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={author.avatar} alt={author.name} />

            <AvatarFallback className="text-lg">
              {author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold mb-2">{author.name}</h3>
            <p className="text-muted-foreground">{author.bio}</p>
          </div>
        </div>
      </div>

      {/* Related Posts Placeholder */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-6">Related Articles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-2">
              {category} • {date}
            </p>
            <h4 className="font-medium mb-2">
              10 Tips for Improving Your Client Communication
            </h4>
            <Button variant="link" className="p-0 h-auto text-orange-500">
              Read More
            </Button>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-2">
              {category} • {date}
            </p>
            <h4 className="font-medium mb-2">
              How to Scale Your Professional Services Business
            </h4>
            <Button variant="link" className="p-0 h-auto text-orange-500">
              Read More
            </Button>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-orange-50 dark:bg-orange-950/20 rounded-xl p-8 text-center">
        <h3 className="text-xl font-semibold mb-3">Enjoyed this article?</h3>
        <p className="text-muted-foreground mb-6">
          Subscribe to our newsletter to get the latest insights and tips.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-grow px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          />

          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            Subscribe
          </Button>
        </div>
      </div>
    </article>
  );
}
