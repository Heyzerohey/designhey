import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Case {
  id: string;
  title: string;
  client: string;
  date: string;
  status: "active" | "pending" | "completed" | "on-hold";
  type: string;
}

interface RecentCasesTableProps {
  cases: Case[];
  className?: string;
}

export default function RecentCasesTable({
  cases,
  className,
}: RecentCasesTableProps) {
  const getStatusColor = (status: Case["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "on-hold":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className={cn("rounded-md border", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases.map((caseItem) => (
            <TableRow key={caseItem.id}>
              <TableCell className="font-medium">{caseItem.title}</TableCell>
              <TableCell>{caseItem.client}</TableCell>
              <TableCell>{formatDate(caseItem.date)}</TableCell>
              <TableCell>{caseItem.type}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={getStatusColor(caseItem.status)}
                >
                  {caseItem.status.charAt(0).toUpperCase() +
                    caseItem.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Link to={`/cases/${caseItem.id}`}>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
