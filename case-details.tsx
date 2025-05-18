import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarIcon,
  ClockIcon,
  FileTextIcon,
  MessageSquareIcon,
  UsersIcon,
} from "lucide-react";
import ClientActivityTimeline from "@/polymet/components/client-activity-timeline";
import DocumentListCard from "@/polymet/components/document-list-card";

// Mock data for the case details page
const CASE_STATUSES = {
  active: {
    label: "Active",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  pending: {
    label: "Pending",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  completed: {
    label: "Completed",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  "on-hold": {
    label: "On Hold",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  },
};

const CASE_TYPES = {
  Litigation: {
    icon: <FileTextIcon className="h-4 w-4" />,
  },
  Estate: {
    icon: <UsersIcon className="h-4 w-4" />,
  },
  Corporate: {
    icon: <FileTextIcon className="h-4 w-4" />,
  },
  Family: {
    icon: <UsersIcon className="h-4 w-4" />,
  },
  "Intellectual Property": {
    icon: <FileTextIcon className="h-4 w-4" />,
  },
};

const MOCK_CASES = {
  "case-001": {
    id: "case-001",
    title: "Smith v. Johnson",
    client: "John Smith",
    date: "2023-06-15",
    status: "active",
    type: "Litigation",
    description:
      "Personal injury lawsuit following a car accident on May 10, 2023. Client seeking damages for medical expenses and lost wages.",
    courtInfo: "Superior Court of California, County of Los Angeles",
    caseNumber: "CV-2023-78945",
    filingDate: "2023-06-15",
    nextHearing: "2023-10-20",
    assignedTo: [
      {
        name: "Takashi Yamada",
        role: "Lead Attorney",
        avatar: "https://github.com/kdrnp.png",
      },
      {
        name: "Michelle Wong",
        role: "Associate",
        avatar: "https://github.com/yusufhilmi.png",
      },
    ],

    notes:
      "Client has provided all medical records. Need to schedule deposition of defendant.",
  },
  "case-002": {
    id: "case-002",
    title: "Chen Estate Planning",
    client: "Sarah Chen",
    date: "2023-07-02",
    status: "pending",
    type: "Estate",
    description:
      "Comprehensive estate planning including will, trust, and power of attorney documents for client with significant assets and minor children.",
    courtInfo: "N/A - Non-litigation matter",
    caseNumber: "EP-2023-1204",
    filingDate: "2023-07-02",
    nextHearing: "N/A",
    assignedTo: [
      {
        name: "David Kim",
        role: "Lead Attorney",
        avatar: "https://github.com/furkanksl.png",
      },
    ],

    notes:
      "Client needs to provide list of assets and beneficiary designations. Schedule follow-up meeting to review draft documents.",
  },
  "case-003": {
    id: "case-003",
    title: "Acme Corp Merger",
    client: "Acme Corporation",
    date: "2023-05-20",
    status: "completed",
    type: "Corporate",
    description:
      "Merger and acquisition between Acme Corp and XYZ Inc. Transaction value: $25M. Includes due diligence, contract negotiation, and regulatory compliance.",
    courtInfo: "N/A - Corporate transaction",
    caseNumber: "M&A-2023-0058",
    filingDate: "2023-05-20",
    nextHearing: "N/A",
    assignedTo: [
      {
        name: "Takashi Yamada",
        role: "Lead Attorney",
        avatar: "https://github.com/kdrnp.png",
      },
      {
        name: "Lisa Park",
        role: "Corporate Specialist",
        avatar: "https://github.com/yahyabedirhan.png",
      },
    ],

    notes:
      "All documents finalized and signed. Transaction closed successfully on August 15, 2023.",
  },
  "case-004": {
    id: "case-004",
    title: "Rodriguez Divorce",
    client: "Maria Rodriguez",
    date: "2023-08-10",
    status: "on-hold",
    type: "Family",
    description:
      "Divorce proceedings including child custody arrangement, property division, and spousal support negotiations.",
    courtInfo: "Family Court, County of San Francisco",
    caseNumber: "FD-2023-3421",
    filingDate: "2023-08-10",
    nextHearing: "Pending - On hold at client's request",
    assignedTo: [
      {
        name: "Michelle Wong",
        role: "Family Law Attorney",
        avatar: "https://github.com/yusufhilmi.png",
      },
    ],

    notes:
      "Client requested to pause proceedings for 30 days to attempt reconciliation. Follow up on October 1.",
  },
  "case-005": {
    id: "case-005",
    title: "Tech Startup IP Filing",
    client: "NextGen Tech",
    date: "2023-07-28",
    status: "active",
    type: "Intellectual Property",
    description:
      "Patent application for new AI-driven software technology. Includes prior art search, application drafting, and USPTO filing.",
    courtInfo: "United States Patent and Trademark Office",
    caseNumber: "PT-2023-9087",
    filingDate: "2023-07-28",
    nextHearing: "N/A",
    assignedTo: [
      {
        name: "James Wilson",
        role: "IP Attorney",
        avatar: "https://github.com/buyuktas18.png",
      },
    ],

    notes:
      "Prior art search completed. First draft of patent application under review by client.",
  },
};

const mockDocuments = [
  {
    id: "doc-001",
    name: "Complaint Filing.pdf",
    type: "pdf",
    size: "2.4 MB",
    uploadDate: "2023-06-15",
    status: "final",
  },
  {
    id: "doc-002",
    name: "Medical Records.pdf",
    type: "pdf",
    size: "5.8 MB",
    uploadDate: "2023-06-20",
    status: "final",
  },
  {
    id: "doc-003",
    name: "Accident Report.pdf",
    type: "pdf",
    size: "1.2 MB",
    uploadDate: "2023-06-18",
    status: "final",
  },
  {
    id: "doc-004",
    name: "Settlement Proposal Draft.doc",
    type: "doc",
    size: "1.8 MB",
    uploadDate: "2023-08-05",
    status: "draft",
  },
  {
    id: "doc-005",
    name: "Client Statement.pdf",
    type: "pdf",
    size: "0.9 MB",
    uploadDate: "2023-06-25",
    status: "final",
  },
];

const mockActivities = [
  {
    id: "activity-001",
    type: "document",
    title: "Document Uploaded",
    description: "Settlement Proposal Draft.doc was uploaded",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    user: {
      name: "Takashi Yamada",
      avatar: "https://github.com/kdrnp.png",
    },
  },
  {
    id: "activity-002",
    type: "event",
    title: "Hearing Scheduled",
    description: "Court hearing scheduled for October 20, 2023",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    user: {
      name: "Michelle Wong",
      avatar: "https://github.com/yusufhilmi.png",
    },
  },
  {
    id: "activity-003",
    type: "message",
    title: "Client Communication",
    description: "Phone call with client regarding settlement options",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    user: {
      name: "Takashi Yamada",
      avatar: "https://github.com/kdrnp.png",
    },
  },
  {
    id: "activity-004",
    type: "status",
    title: "Case Status Updated",
    description: "Case status changed from 'Pending' to 'Active'",
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
  },
  {
    id: "activity-005",
    type: "document",
    title: "Document Uploaded",
    description: "Medical Records.pdf was uploaded",
    timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    user: {
      name: "Michelle Wong",
      avatar: "https://github.com/yusufhilmi.png",
    },
  },
];

export default function CaseDetailsPage() {
  const { id = "case-001" } = useParams();
  const caseData =
    MOCK_CASES[id as keyof typeof MOCK_CASES] || MOCK_CASES["case-001"];
  const status = CASE_STATUSES[caseData.status as keyof typeof CASE_STATUSES];
  const typeIcon = CASE_TYPES[caseData.type as keyof typeof CASE_TYPES]?.icon;

  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {caseData.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <Badge className={status.color}>{status.label}</Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                {typeIcon}
                {caseData.type}
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="h-3.5 w-3.5 mr-1" />

              <span>
                Filed: {new Date(caseData.filingDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <ClockIcon className="h-3.5 w-3.5 mr-1" />

              <span>Case #{caseData.caseNumber}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageSquareIcon className="h-4 w-4 mr-2" />
            Message Client
          </Button>
          <Button>
            <FileTextIcon className="h-4 w-4 mr-2" />
            Create Document
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Case Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Description
                  </h3>
                  <p>{caseData.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Client
                    </h3>
                    <p>{caseData.client}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Court Information
                    </h3>
                    <p>{caseData.courtInfo}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Next Hearing
                    </h3>
                    <p>{caseData.nextHearing}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Filing Date
                    </h3>
                    <p>{new Date(caseData.filingDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {caseData.assignedTo.map((person, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <img
                        src={person.avatar}
                        alt={person.name}
                        className="h-10 w-10 rounded-full"
                      />

                      <div>
                        <p className="font-medium">{person.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {person.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentListCard documents={mockDocuments.slice(0, 3)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ClientActivityTimeline activities={mockActivities.slice(0, 3)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>All Documents</CardTitle>
              <Button size="sm">
                <FileTextIcon className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </CardHeader>
            <CardContent>
              <DocumentListCard documents={mockDocuments} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Case Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ClientActivityTimeline activities={mockActivities} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Case Notes</CardTitle>
              <Button size="sm">Add Note</Button>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-md">
                <p className="whitespace-pre-line">{caseData.notes}</p>
                <div className="mt-4 text-sm text-muted-foreground">
                  Last updated:{" "}
                  {new Date(
                    Date.now() - 3 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
