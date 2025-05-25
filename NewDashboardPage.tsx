import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FileIcon,
  UsersIcon,
  DollarSignIcon,
  FileTextIcon,
  Package as PackageIcon, // Renamed to avoid conflict with Package interface
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // For loading/error states

// Components (assuming these paths are correct relative to NewDashboardPage.tsx or aliased)
import DashboardStatsCard from "@/polymet/components/dashboard-stats-card";
import DashboardPackages from "@/polymet/components/dashboard-packages"; // This will need to be adapted
import QuickActionsCard from "@/polymet/components/quick-actions-card";
import RecentCasesTable from "@/polymet/components/recent-cases-table"; // Mock data for now
import ClientListCard from "@/polymet/components/client-list-card";     // Mock data for now
import DocumentListCard from "@/polymet/components/document-list-card"; // Mock data for now
import ClientActivityTimeline from "@/polymet/components/client-activity-timeline"; // Mock data for now
import FirstLoginTipsModal from "@/polymet/components/first-login-tips-modal"; // Static component

// Custom Hooks
import { useAuth } from "../AuthContext"; // Adjust if AuthContext is elsewhere
import { useDashboardPackages, type DashboardPackage, type PaginationData } from "../hooks/useDashboardPackages";
import { useSubscriptionStatus, type SubscriptionData } from "../hooks/useSubscriptionStatus";
import { useBillingHistory, type Transaction } from "../hooks/useBillingHistory";
import { useDashboardStats, type DashboardStatsData }  from "../hooks/useDashboardStats";

// Mock Data (to keep UI structure similar if API data is empty)
import {
  RECENT_CASES,
  RECENT_DOCUMENTS,
  RECENT_ACTIVITIES,
} from "@/polymet/data/dashboard-data";
import { RECENT_CLIENTS } from "@/polymet/data/clients-data";

export default function NewDashboardPage() {
  const { user } = useAuth(); // Token is implicitly used by hooks via AuthContext

  // Fetching data using custom hooks
  const { 
    packages, 
    isLoading: packagesLoading, 
    error: packagesError, 
    paginationData: packagesPagination, 
    setPage: setPackagesPage 
  } = useDashboardPackages(1, 5); // Initial page 1, limit 5 for dashboard

  const { 
    subscription, 
    isLoading: subscriptionLoading, 
    error: subscriptionError 
  } = useSubscriptionStatus();

  const { 
    history: billingHistory, 
    isLoading: billingHistoryLoading, 
    error: billingHistoryError, 
    paginationData: billingPagination, 
    setPage: setBillingPage 
  } = useBillingHistory(1, 5); // Initial page 1, limit 5

  const { 
    stats: dashboardApiStats, 
    isLoading: dashboardStatsLoading, 
    error: dashboardStatsError 
  } = useDashboardStats();

  // Adapt fetched dashboard stats for DashboardStatsCard
  const adaptedDashboardStats = [
    {
      title: "Available Credits",
      value: dashboardApiStats?.signatureCreditsAvailable.toLocaleString() ?? "0",
      icon: <DollarSignIcon className="h-4 w-4 text-green-500" />,
    },
    {
      title: "Total Packages",
      value: dashboardApiStats?.totalPackages.toLocaleString() ?? "0",
      icon: <PackageIcon className="h-4 w-4 text-blue-500" />,
    },
    {
      title: "Pending Packages",
      value: dashboardApiStats?.pendingPackages.toLocaleString() ?? "0",
      icon: <FileIcon className="h-4 w-4 text-orange-500" />,
    },
    {
      title: "Completed Packages",
      value: dashboardApiStats?.completedPackages.toLocaleString() ?? "0",
      icon: <FileTextIcon className="h-4 w-4 text-purple-500" />,
    },
  ];

  // Assume SubscriptionStatusDisplay and BillingHistoryDisplay components exist
  // and are imported from their respective file locations.
  // For this example, I'm assuming they are in the same directory or handled by aliases.
  // If not, adjust import paths:
  // import SubscriptionStatusDisplay from './SubscriptionStatusDisplay'; 
  // import BillingHistoryDisplay from './BillingHistoryDisplay';
  // For now, I'll use placeholder text for where these components would go if they are not auto-imported/resolved.
  // Re-creating them if they were missed in previous step:
  const SubscriptionStatusDisplay = ({ subscription, isLoading, error }: { subscription: SubscriptionData | null, isLoading: boolean, error: string | null }) => {
      if (isLoading) return <Card><CardHeader><CardTitle>Subscription Status</CardTitle></CardHeader><CardContent><p>Loading...</p></CardContent></Card>;
      if (error) return <Card className="border-destructive"><CardHeader><CardTitle className="text-destructive">Subscription Error</CardTitle></CardHeader><CardContent><p>{error}</p></CardContent></Card>;
      if (!subscription) return <Card><CardHeader><CardTitle>Subscription Status</CardTitle></CardHeader><CardContent><p>No data.</p></CardContent></Card>;
      return <Card><CardHeader><CardTitle>Subscription Status</CardTitle></CardHeader><CardContent><p>Plan: {subscription.plan_name || 'N/A'} ({subscription.status || 'N/A'})</p>{subscription.current_period_end && <p>Ends: {new Date(subscription.current_period_end).toLocaleDateString()}</p>}</CardContent></Card>;
  };

  const BillingHistoryDisplay = ({ transactions, isLoading, error }: { transactions: Transaction[], isLoading: boolean, error: string | null }) => {
      if (isLoading) return <Card><CardHeader><CardTitle>Billing History</CardTitle></CardHeader><CardContent><p>Loading...</p></CardContent></Card>;
      if (error) return <Card className="border-destructive"><CardHeader><CardTitle className="text-destructive">Billing Error</CardTitle></CardHeader><CardContent><p>{error}</p></CardContent></Card>;
      if (!transactions.length) return <Card><CardHeader><CardTitle>Billing History</CardTitle></CardHeader><CardContent><p>No transactions.</p></CardContent></Card>;
      return <Card><CardHeader><CardTitle>Billing History</CardTitle></CardHeader><CardContent><ul className="list-disc pl-5">{transactions.slice(0,3).map((t,i) => <li key={i} className="text-sm">{t.description} - {(t.amount/100).toFixed(2)} {t.currency}</li>)}</ul> {transactions.length > 3 && <p className="text-xs text-muted-foreground">Showing first 3 transactions...</p>}</CardContent></Card>;
  };


  return (
    <div className="space-y-6 p-4 md:p-6"> {/* Added padding similar to DashboardLayout */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome, {user?.email || "User"}!
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your Signhey account.
          </p>
        </div>
        <Link to="/package/create">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            New Engagement
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {adaptedDashboardStats.map((stat, index) => (
          <DashboardStatsCard
            key={index}
            title={stat.title}
            value={dashboardStatsLoading ? "Loading..." : (dashboardStatsError ? "Error" : stat.value)}
            icon={stat.icon}
            // Note: 'change' and 'data' for small charts are removed as API doesn't provide them
          />
        ))}
      </div>

      {/* Main Content Area: Packages, Quick Actions, Subscription, Billing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Packages List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Packages</CardTitle>
            </CardHeader>
            <CardContent>
              {packagesLoading && <p>Loading packages...</p>}
              {packagesError && <p className="text-red-500">Error: {packagesError}</p>}
              {!packagesLoading && !packagesError && (
                <>
                  <DashboardPackages packages={packages} /> 
                  {/* Basic Pagination for Packages */}
                  {packagesPagination.totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mt-4">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => setPackagesPage(packagesPagination.currentPage - 1)} 
                        disabled={packagesPagination.currentPage <= 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm">
                        Page {packagesPagination.currentPage} of {packagesPagination.totalPages}
                      </span>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => setPackagesPage(packagesPagination.currentPage + 1)} 
                        disabled={packagesPagination.currentPage >= packagesPagination.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <QuickActionsCard />
          <SubscriptionStatusDisplay 
            subscription={subscription}
            isLoading={subscriptionLoading}
            error={subscriptionError}
          />
        </div>
      </div>

      {/* Billing History & Other Sections (simplified for this example) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <BillingHistoryDisplay 
            transactions={billingHistory}
            isLoading={billingHistoryLoading}
            error={billingHistoryError}
          />
          {/* TODO: Implement pagination for billing history if desired */}
          {/* <RecentCasesTable cases={RECENT_CASES} /> Mock data for now */}
        </div>
        <div className="space-y-6">
          {/* <ClientListCard clients={RECENT_CLIENTS} /> Mock data for now */}
          {/* <DocumentListCard documents={RECENT_DOCUMENTS} /> Mock data for now */}
        </div>
      </div>
      
      {/* <ClientActivityTimeline activities={RECENT_ACTIVITIES} /> Mock data for now */}
      <FirstLoginTipsModal />
    </div>
  );
}
