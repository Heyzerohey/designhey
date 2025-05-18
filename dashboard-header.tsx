import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BellIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  ChevronDownIcon,
  UserIcon,
  LogOutIcon,
  FileTextIcon,
  CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  userName: string;
  userAvatar?: string;
  firmName?: string;
  className?: string;
}

export default function DashboardHeader({
  userName,
  userAvatar,
  firmName,
  className,
}: DashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6",
        className
      )}
    >
      {firmName && (
        <div className="hidden md:flex">
          <Link
            to="/dashboard"
            className="mr-6 flex items-center space-x-2 text-lg font-semibold"
          >
            <span className="text-orange-500 dark:text-orange-400">
              {firmName}
            </span>
          </Link>
        </div>
      )}

      <div className="w-full flex-1 md:grow-0 md:w-80">
        <form>
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-background pl-8 md:w-[240px] lg:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>

      <div className="flex flex-1 items-center justify-end space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 text-orange-500 border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
            >
              <PlusIcon className="h-3.5 w-3.5" />

              <span className="hidden sm:inline-block">New</span>
              <ChevronDownIcon className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <FileTextIcon className="mr-2 h-4 w-4" />

              <span>New Package</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CalendarIcon className="mr-2 h-4 w-4" />

              <span>New Event</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
        >
          <BellIcon className="h-4 w-4" />

          <span className="sr-only">Notifications</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
        >
          <SettingsIcon className="h-4 w-4" />

          <span className="sr-only">Settings</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2 rounded-full px-2"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={userAvatar} alt={userName} />

                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline-block">
                {userName}
              </span>
              <ChevronDownIcon className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <UserIcon className="mr-2 h-4 w-4" />

              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SettingsIcon className="mr-2 h-4 w-4" />

              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <LogOutIcon className="mr-2 h-4 w-4" />

              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
