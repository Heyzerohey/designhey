import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  FileIcon,
  FileTextIcon,
  ImageIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DocumentType = "pdf" | "doc" | "image" | "other";
type DocumentStatus = "draft" | "final" | "signed" | "pending";

interface Document {
  id: string;
  name: string;
  type: DocumentType;
  size: string;
  uploadDate: string;
  status: DocumentStatus;
}

interface DocumentListCardProps {
  documents: Document[];
}

export default function DocumentListCard({ documents }: DocumentListCardProps) {
  const getDocumentIcon = (type: DocumentType) => {
    switch (type) {
      case "pdf":
        return <FileIcon className="h-4 w-4 text-red-500" />;

      case "doc":
        return <FileTextIcon className="h-4 w-4 text-blue-500" />;

      case "image":
        return <ImageIcon className="h-4 w-4 text-green-500" />;

      default:
        return <FileIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-200">
            Draft
          </Badge>
        );

      case "final":
        return (
          <Badge variant="outline" className="text-blue-500 border-blue-200">
            Final
          </Badge>
        );

      case "signed":
        return (
          <Badge variant="outline" className="text-green-500 border-green-200">
            Signed
          </Badge>
        );

      case "pending":
        return (
          <Badge variant="outline" className="text-gray-500 border-gray-200">
            Pending
          </Badge>
        );

      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-semibold">
          Recent Documents
        </CardTitle>
        <Link to="/documents">
          <Button variant="ghost" size="sm" className="text-xs">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.length === 0 ? (
            <div className="text-center py-6">
              <FileIcon className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-600 mb-2" />

              <p className="text-sm text-gray-500 dark:text-gray-400">
                No documents found
              </p>
            </div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getDocumentIcon(doc.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>{formatDate(doc.uploadDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(doc.status)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuItem>Download</DropdownMenuItem>
                      <DropdownMenuItem>Share</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
