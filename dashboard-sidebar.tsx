import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboardIcon,
  UsersIcon,
  CheckSquareIcon,
  CalendarIcon,
  MessageSquareIcon,
  ClockIcon,
  FileTextIcon,
  BarChartIcon,
  SettingsIcon,
  HelpCircleIcon,
  LogOutIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function DashboardSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const mainNavItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      name: "Clients",
      href: "/clients",
      icon: UsersIcon,
    },
    {
      name: "Cases",
      href: "/cases",
      icon: CheckSquareIcon,
    },
    {
      name: "Calendar",
      href: "/calendar",
      icon: CalendarIcon,
    },
    {
      name: "Messages",
      href: "/messages",
      icon: MessageSquareIcon,
    },
    {
      name: "Activity",
      href: "/activity",
      icon: ClockIcon,
    },
    {
      name: "Documents",
      href: "/documents",
      icon: FileTextIcon,
    },
    {
      name: "Reports",
      href: "/reports",
      icon: BarChartIcon,
    },
  ];

  const utilityNavItems = [
    {
      name: "Settings",
      href: "/settings",
      icon: SettingsIcon,
    },
    {
      name: "Help",
      href: "/help",
      icon: HelpCircleIcon,
    },
  ];

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  return (
    <div
      className={cn(
        "h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => setCollapsed(!collapsed)}
        >
          <span className={cn("mr-2", collapsed && "sr-only")}>
            {collapsed ? "Expand" : "Collapse"}
          </span>
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {mainNavItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                isActive(item.href)
                  ? "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5",
                  isActive(item.href)
                    ? "text-orange-500 dark:text-orange-400"
                    : "text-gray-400 dark:text-gray-500"
                )}
              />

              <span className={cn(collapsed && "sr-only")}>{item.name}</span>
            </Link>
          ))}
        </nav>

        <Separator className="my-4" />

        <nav className="px-2 space-y-1">
          {utilityNavItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                isActive(item.href)
                  ? "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5",
                  isActive(item.href)
                    ? "text-orange-500 dark:text-orange-400"
                    : "text-gray-400 dark:text-gray-500"
                )}
              />

              <span className={cn(collapsed && "sr-only")}>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <Link
          to="/login"
          className={cn(
            "flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          )}
        >
          <LogOutIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />

          <span className={cn(collapsed && "sr-only")}>Log out</span>
        </Link>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <h4
            className={cn("text-sm font-medium mb-2", collapsed && "sr-only")}
          >
            Need help?
          </h4>
          <p
            className={cn(
              "text-xs text-gray-500 dark:text-gray-400 mb-2",
              collapsed && "sr-only"
            )}
          >
            Check our documentation for guides and tips.
          </p>
          <Link to="/help">
            <Button
              size="sm"
              variant="outline"
              className={cn(
                "w-full text-orange-500 border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20",
                collapsed && "sr-only"
              )}
            >
              View Documentation
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
