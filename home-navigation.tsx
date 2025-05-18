"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon, XIcon } from "lucide-react";

export default function HomeNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-6">
        <Link
          to="/how-it-works"
          className="text-sm font-medium text-gray-700 hover:text-orange-500 dark:text-gray-200 dark:hover:text-orange-400 transition-colors"
        >
          How It Works
        </Link>
        <Link
          to="/features"
          className="text-sm font-medium text-gray-700 hover:text-orange-500 dark:text-gray-200 dark:hover:text-orange-400 transition-colors"
        >
          Features
        </Link>
        <Link
          to="/resources"
          className="text-sm font-medium text-gray-700 hover:text-orange-500 dark:text-gray-200 dark:hover:text-orange-400 transition-colors"
        >
          Resources
        </Link>
        <Link
          to="/faq"
          className="text-sm font-medium text-gray-700 hover:text-orange-500 dark:text-gray-200 dark:hover:text-orange-400 transition-colors"
        >
          FAQ
        </Link>
      </nav>

      <div className="hidden md:flex items-center space-x-2">
        <Link to="/login">
          <Button
            variant="ghost"
            className="text-sm font-medium text-gray-700 hover:text-orange-500 dark:text-gray-200 dark:hover:text-orange-400"
          >
            Sign In
          </Button>
        </Link>
        <Link to="/signup">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            Get Started
          </Button>
        </Link>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MenuIcon className="h-5 w-5" />

              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80%] sm:w-[350px]">
            <div className="flex flex-col h-full">
              <div className="flex justify-end mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <XIcon className="h-5 w-5" />

                  <span className="sr-only">Close menu</span>
                </Button>
              </div>
              <nav className="flex flex-col space-y-4">
                <Link
                  to="/how-it-works"
                  className="px-4 py-2 text-base font-medium text-gray-700 hover:text-orange-500 dark:text-gray-200 dark:hover:text-orange-400"
                  onClick={closeMenu}
                >
                  How It Works
                </Link>
                <Link
                  to="/features"
                  className="px-4 py-2 text-base font-medium text-gray-700 hover:text-orange-500 dark:text-gray-200 dark:hover:text-orange-400"
                  onClick={closeMenu}
                >
                  Features
                </Link>
                <Link
                  to="/resources"
                  className="px-4 py-2 text-base font-medium text-gray-700 hover:text-orange-500 dark:text-gray-200 dark:hover:text-orange-400"
                  onClick={closeMenu}
                >
                  Resources
                </Link>
                <Link
                  to="/faq"
                  className="px-4 py-2 text-base font-medium text-gray-700 hover:text-orange-500 dark:text-gray-200 dark:hover:text-orange-400"
                  onClick={closeMenu}
                >
                  FAQ
                </Link>
              </nav>
              <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
                <div className="flex flex-col space-y-3 px-4">
                  <Link to="/login" className="w-full" onClick={closeMenu}>
                    <Button variant="outline" className="w-full justify-center">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" className="w-full" onClick={closeMenu}>
                    <Button className="w-full justify-center bg-orange-500 hover:bg-orange-600 text-white">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
