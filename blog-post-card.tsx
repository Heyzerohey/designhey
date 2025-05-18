import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "lucide-react";

interface BlogPostCardProps {
  title: string;
  excerpt: string;
  date: string;
  category?: string;
  author: {
    name: string;
    avatar: string;
  };
  slug: string;
  featured?: boolean;
  imageUrl?: string;
}

export default function BlogPostCard({
  title,
  excerpt,
  date,
  category,
  author,
  slug,
  featured = false,
  imageUrl = "/workflow/bg-sleek-violet-orange.png",
}: BlogPostCardProps) {
  return (
    <Card className={`overflow-hidden ${featured ? "col-span-2" : ""}`}>
      <div className="relative h-48 group">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {category && (
          <Badge
            className="absolute top-3 left-3 bg-orange-500 hover:bg-orange-600"
            variant="secondary"
          >
            {category}
          </Badge>
        )}
      </div>
      <CardContent className="p-5">
        <Link to={`/blog/${slug}`} className="block">
          <h3 className="text-xl font-semibold mb-2 hover:text-orange-500 transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-muted-foreground mb-4 line-clamp-2">{excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={author.avatar} alt={author.name} />

              <AvatarFallback>
                {author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{author.name}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar strokeWidth={1.5} size={16} className="mr-1" />

            <span>{date}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
