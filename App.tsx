import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Marketing & Authentication Pages
import HomePage from "@/polymet/pages/home";
import UpdatedHomePage from "@/polymet/pages/updated-home";
import LoginPage from "@/polymet/pages/login";
import SignupPage from "@/polymet/pages/signup";
import ContactPage from "@/polymet/pages/contact";
import PrivacyPage from "@/polymet/pages/privacy";
import TermsPage from "@/polymet/pages/terms";
import NotFoundPage from "@/polymet/pages/not-found";
import BlogPage from "@/polymet/pages/blog";
import BlogPostPage from "@/polymet/pages/blog-post";
import ResourcesPage from "@/polymet/pages/resources";
import HelpCenterPage from "@/polymet/pages/help-center";

// Onboarding Pages
import OnboardingPage from "@/polymet/pages/onboarding";
import ProfileSetupPage from "@/polymet/pages/profile-setup";
import AccountSetupPage from "@/polymet/pages/account-setup";
import PackageSetupPage from "@/polymet/pages/package-setup";

// Client Engagement
import ClientEngagementPage from "@/polymet/pages/client-engagement";
import UploadPage from "@/polymet/pages/upload";
import PaymentPage from "@/polymet/pages/payment";

// Dashboard Pages
import DashboardLayout from "@/polymet/components/dashboard-layout";
import DashboardPage from "@/polymet/pages/dashboard";
import DashboardUpdatedPage from "@/polymet/pages/dashboard-updated";
import ClientsPage from "@/polymet/pages/clients";
import ClientDetailsPage from "@/polymet/pages/client-details";
import PackageDetailsPage from "@/polymet/pages/package-details";
import PackageCreatePage from "@/polymet/pages/package-create";
import CreditsPurchasePage from "@/polymet/pages/credits-purchase";
import ActivityLogPage from "@/polymet/pages/activity-log";
import MessagesPage from "@/polymet/pages/messages";
import CaseDetailsPage from "@/polymet/pages/case-details";

export default function SignheyFinal() {
  return (
    <Router>
      <Routes>
        {/* Marketing Pages */}
        <Route path="/" element={<UpdatedHomePage />} />

        <Route path="/home" element={<HomePage />} />

        <Route path="/updated-home" element={<UpdatedHomePage />} />

        <Route path="/contact" element={<ContactPage />} />

        <Route path="/terms" element={<TermsPage />} />

        <Route path="/privacy" element={<PrivacyPage />} />

        {/* Blog & Resources */}
        <Route path="/blog" element={<BlogPage />} />

        <Route path="/blog/:slug" element={<BlogPostPage />} />

        <Route path="/resources" element={<ResourcesPage />} />

        <Route path="/help-center" element={<HelpCenterPage />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />

        <Route path="/signup" element={<SignupPage />} />

        <Route path="/forgot-password" element={<NotFoundPage />} />

        {/* Onboarding Routes */}
        <Route path="/onboarding" element={<OnboardingPage />} />

        <Route path="/profile-setup" element={<ProfileSetupPage />} />

        <Route path="/account-setup" element={<AccountSetupPage />} />

        <Route path="/package-setup" element={<PackageSetupPage />} />

        {/* Client Engagement */}
        <Route path="/client-engagement" element={<ClientEngagementPage />} />

        <Route path="/upload" element={<UploadPage />} />

        <Route path="/payment" element={<PaymentPage />} />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <DashboardUpdatedPage />
            </DashboardLayout>
          }
        />

        <Route
          path="/dashboard/legacy"
          element={
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          }
        />

        {/* Client Management Routes */}
        <Route
          path="/clients"
          element={
            <DashboardLayout>
              <ClientsPage />
            </DashboardLayout>
          }
        />

        <Route
          path="/clients/:id"
          element={
            <DashboardLayout>
              <ClientDetailsPage />
            </DashboardLayout>
          }
        />

        {/* Case Management Routes */}
        <Route
          path="/cases"
          element={
            <DashboardLayout>
              <div className="py-10">
                <h1 className="text-3xl font-semibold tracking-tight mb-6">
                  My Cases
                </h1>
                <p className="text-muted-foreground mb-10">
                  This is a placeholder for the cases page.
                </p>
              </div>
            </DashboardLayout>
          }
        />

        <Route
          path="/cases/:id"
          element={
            <DashboardLayout>
              <CaseDetailsPage />
            </DashboardLayout>
          }
        />

        {/* Package Management Routes */}
        <Route
          path="/packages/:id"
          element={
            <DashboardLayout>
              <PackageDetailsPage />
            </DashboardLayout>
          }
        />

        <Route
          path="/package/create"
          element={
            <DashboardLayout>
              <PackageCreatePage />
            </DashboardLayout>
          }
        />

        {/* Credits Purchase Route */}
        <Route
          path="/credits/purchase"
          element={
            <DashboardLayout>
              <CreditsPurchasePage />
            </DashboardLayout>
          }
        />

        {/* Activity & Messages Routes */}
        <Route
          path="/activity"
          element={
            <DashboardLayout>
              <ActivityLogPage />
            </DashboardLayout>
          }
        />

        <Route
          path="/messages"
          element={
            <DashboardLayout>
              <MessagesPage />
            </DashboardLayout>
          }
        />

        {/* Calendar Route */}
        <Route
          path="/calendar"
          element={
            <DashboardLayout>
              <div className="py-10">
                <h1 className="text-3xl font-semibold tracking-tight mb-6">
                  Calendar
                </h1>
                <p className="text-muted-foreground mb-10">
                  This is a placeholder for the calendar page.
                </p>
              </div>
            </DashboardLayout>
          }
        />

        {/* Reports Route */}
        <Route
          path="/reports"
          element={
            <DashboardLayout>
              <div className="py-10">
                <h1 className="text-3xl font-semibold tracking-tight mb-6">
                  Reports
                </h1>
                <p className="text-muted-foreground mb-10">
                  This is a placeholder for the reports page.
                </p>
              </div>
            </DashboardLayout>
          }
        />

        {/* Documents Route */}
        <Route
          path="/documents"
          element={
            <DashboardLayout>
              <div className="py-10">
                <h1 className="text-3xl font-semibold tracking-tight mb-6">
                  My Documents
                </h1>
                <p className="text-muted-foreground mb-10">
                  This is a placeholder for the documents page.
                </p>
              </div>
            </DashboardLayout>
          }
        />

        {/* Settings & Help Routes */}
        <Route
          path="/settings"
          element={
            <DashboardLayout>
              <div className="py-10">
                <h1 className="text-3xl font-semibold tracking-tight mb-6">
                  Settings
                </h1>
                <p className="text-muted-foreground mb-10">
                  Manage your account settings and preferences.
                </p>
              </div>
            </DashboardLayout>
          }
        />

        <Route
          path="/help"
          element={
            <DashboardLayout>
              <div className="py-10">
                <h1 className="text-3xl font-semibold tracking-tight mb-6">
                  Help & Support
                </h1>
                <p className="text-muted-foreground mb-10">
                  Get help with using Signhey and managing your clients.
                </p>
              </div>
            </DashboardLayout>
          }
        />

        {/* Help Section Routes */}
        <Route
          path="/help/packages"
          element={
            <DashboardLayout>
              <div className="py-10">
                <h1 className="text-3xl font-semibold tracking-tight mb-6">
                  Package Creation Guide
                </h1>
                <p className="text-muted-foreground mb-10">
                  This is a placeholder for the package creation guide.
                </p>
              </div>
            </DashboardLayout>
          }
        />

        <Route
          path="/help/templates"
          element={
            <DashboardLayout>
              <div className="py-10">
                <h1 className="text-3xl font-semibold tracking-tight mb-6">
                  Document Templates
                </h1>
                <p className="text-muted-foreground mb-10">
                  This is a placeholder for the document templates page.
                </p>
              </div>
            </DashboardLayout>
          }
        />

        <Route
          path="/help/sharing"
          element={
            <DashboardLayout>
              <div className="py-10">
                <h1 className="text-3xl font-semibold tracking-tight mb-6">
                  Sharing Packages Guide
                </h1>
                <p className="text-muted-foreground mb-10">
                  This is a placeholder for the sharing packages guide.
                </p>
              </div>
            </DashboardLayout>
          }
        />

        {/* Fallback for undefined routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
