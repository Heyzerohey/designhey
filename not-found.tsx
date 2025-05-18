import SignheyLogo from "@/polymet/components/signhey-logo";
import NotFoundContent from "@/polymet/components/not-found-content";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <SignheyLogo showTagline />
          </div>
          <NotFoundContent />
        </div>
      </div>
      <footer className="py-6 border-t border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Signhey. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
