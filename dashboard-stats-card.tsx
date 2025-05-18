import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line } from "recharts";
import { cn } from "@/lib/utils";

interface DashboardStatsCardProps {
  title: string;
  value: string;
  change?: number;
  data?: { value: number }[];
  icon?: React.ReactNode;
  className?: string;
}

export default function DashboardStatsCard({
  title,
  value,
  change,
  data = [],
  icon,
  className,
}: DashboardStatsCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  const hasChange = typeof change !== "undefined";

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>

        {hasChange && (
          <div className="flex items-center text-xs mt-1">
            {isPositive ? (
              <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
            ) : isNegative ? (
              <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
            ) : null}
            <span
              className={cn(
                isPositive ? "text-green-500" : isNegative ? "text-red-500" : ""
              )}
            >
              {isPositive ? "+" : ""}
              {change}%
            </span>
            <span className="text-muted-foreground ml-1">from last month</span>
          </div>
        )}

        {data.length > 0 && (
          <div className="h-[50px] mt-4">
            <LineChart width={250} height={50} data={data}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={isNegative ? "#ef4444" : "#22c55e"}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
