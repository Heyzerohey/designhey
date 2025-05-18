import React from "react";
import DashboardStatsCard from "@/polymet/components/dashboard-stats-card";
import DocumentListCard from "@/polymet/components/document-list-card";
import ClientActivityTimeline from "@/polymet/components/client-activity-timeline";
import {
  FileIcon,
  UsersIcon,
  DollarSignIcon,
  CheckCircleIcon,
} from "lucide-react";

export default function DashboardPreview() {
  // Mock data for stats cards
  const statsData = [
    { value: 10 },
    { value: 15 },
    { value: 12 },
    { value: 18 },
    { value: 22 },
    { value: 20 },
    { value: 25 },
  ];

  // Mock data for document list
  const documents = [
    {
      id: "doc-001",
      name: "Client Agreement - Smith.pdf",
      type: "pdf",
      size: "1.2 MB",
      uploadDate: "2023-09-05",
      status: "signed",
    },
    {
      id: "doc-002",
      name: "Requirements Document.docx",
      type: "doc",
      size: "0.8 MB",
      uploadDate: "2023-09-03",
      status: "draft",
    },
    {
      id: "doc-003",
      name: "Project Proposal.pdf",
      type: "pdf",
      size: "2.4 MB",
      uploadDate: "2023-09-01",
      status: "final",
    },
  ];

  // Mock data for activity timeline
  const activities = [
    {
      id: "activity-001",
      type: "signature",
      title: "Agreement Signed",
      description: "Client Services Agreement was signed by Sarah Chen",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      user: {
        name: "Sarah Chen",
        avatar: "https://github.com/yusufhilmi.png",
      },
    },
    {
      id: "activity-002",
      type: "document",
      title: "Document Uploaded",
      description: "Project requirements document was uploaded",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      user: {
        name: "Michael Wong",
        avatar: "https://github.com/furkanksl.png",
      },
    },
    {
      id: "activity-003",
      type: "payment",
      title: "Payment Received",
      description: "Initial payment of $500 was processed",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-medium mb-6">Dashboard Overview</h3>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <DashboardStatsCard
            title="Active Clients"
            value="25"
            change={15}
            data={statsData}
            icon={<UsersIcon className="h-4 w-4" />}
          />

          <DashboardStatsCard
            title="Documents"
            value="45"
            change={-8}
            data={statsData}
            icon={<FileIcon className="h-4 w-4" />}
          />

          <DashboardStatsCard
            title="Monthly Revenue"
            value="$9,500"
            change={22}
            data={statsData}
            icon={<DollarSignIcon className="h-4 w-4" />}
          />

          <DashboardStatsCard
            title="Completion Rate"
            value="92%"
            change={5}
            data={statsData}
            icon={<CheckCircleIcon className="h-4 w-4" />}
          />
        </div>

        {/* Two-column layout for documents and activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DocumentListCard documents={documents} />

          <ClientActivityTimeline activities={activities} />
        </div>
      </div>
    </div>
  );
}
