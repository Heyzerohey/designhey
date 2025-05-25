import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  LayoutDashboardIcon,
  UsersIcon,
  FileTextIcon,
  CalendarIcon,
  MessageSquareIcon,
  ActivityIcon,
  FolderIcon,
  BarChartIcon,
  SettingsIcon,
  HelpCircleIcon,
  SearchIcon,
  BellIcon,
  MenuIcon,
  PlusIcon,
  ChevronDownIcon,
  LogOutIcon,
  UserCircleIcon, // Alternative for user icon
} from "lucide-react";
import SignheyLogo from "@/polymet/components/signhey-logo";
// import DashboardHeader from "@/polymet/components/dashboard-header"; // Header is part of this layout
import DashboardSidebar from "@/polymet/components/dashboard-sidebar";
import { useAuth } from "../AuthContext"; // Adjust path as needed
import { toast } from "sonner";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout: authLogout, isLoading: authIsLoading } = useAuth();

  const handleLogout = () => {
    authLogout();
    toast.success("You have been successfully logged out.");
    navigate("/login"); // Redirect to login page after logout
  };
  
  // Handle loading state for authentication
  if (authIsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading session...</p> {/* Replace with a proper loader/spinner component */}
      </div>
    );
  }

  // Redirect to login if not authenticated and not loading
  if (!user) {
    navigate("/login", { replace: true });
    return null; // Render nothing while redirecting
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Mobile sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <div className="h-16 border-b flex items-center px-6">
            <SignheyLogo />
          </div>
          <DashboardSidebar />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-y-auto">
          <div className="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center px-6">
            <SignheyLogo />
          </div>
          <DashboardSidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 md:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <MenuIcon className="h-5 w-5" />

            <span className="sr-only">Toggle menu</span>
          </Button>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full appearance-none bg-background pl-8 md:w-2/3 lg:w-1/3 shadow-none"
                />
              </div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <PlusIcon className="h-3.5 w-3.5" />

                <span>New</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link to="/package/create" className="flex w-full">
                  Create Package
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Add Client</DropdownMenuItem>
              <DropdownMenuItem>Create Case</DropdownMenuItem>
              <DropdownMenuItem>Schedule Event</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" className="relative">
            <BellIcon className="h-5 w-5" />

            <span className="sr-only">Notifications</span>
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-orange-500" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative h-8 flex items-center gap-2 rounded-full"
              >
                {user?.email ? (
                  <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500">
                    {user.email.substring(0, 2).toUpperCase()} 
                  </div>
                ) : (
                  <UserCircleIcon className="h-8 w-8 text-gray-500" />
                )}
                <span className="hidden md:inline-flex">{user?.email || "User"}</span>
                <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.email || "My Account"}</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => navigate("/dashboard/settings/profile")}>
                  Profile & Settings
              </DropdownMenuItem>
               <DropdownMenuItem onClick={() => navigate("/dashboard/billing")}>
                  Billing & Credits
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
